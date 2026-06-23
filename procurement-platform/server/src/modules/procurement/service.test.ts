import { TenderStatus, TenderType } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { ModuleService } from './service.js';
import { createTenderBodySchema, marketplaceQuerySchema, planLineBodySchema, planningQuerySchema, saveAnnualPlanBodySchema } from './validators.js';
import type { CreateTenderInput, ProcurementPlanningQuery } from './types.js';

function createServiceWithRepository(repositoryData: any) {
  return new ModuleService({
    health: async () => ({ ready: true }),
    getWelcomeData: async () => repositoryData
  } as any);
}

describe('procurement public welcome service', () => {
  it('maps repository data into the public welcome contract', async () => {
    const service = createServiceWithRepository({
      participantCount: 2450,
      openTenderCount: 18,
      verifiedUserCount: 2440,
      featuredTenders: [
        {
          id: 'tender-1',
          reference: 'PX-WRK-2026-001',
          title: 'Construction of community water wells',
          type: 'WORKS',
          status: 'OPEN',
          budget: { toString: () => '480000000' },
          currency: 'TZS',
          location: 'Dodoma',
          closingDate: new Date('2026-08-30T00:00:00.000Z'),
          buyerOrg: { name: 'Medical Stores Department' },
          categories: [{ name: 'Works' }, { name: 'Water' }]
        }
      ]
    });

    const payload = await service.publicWelcome();

    expect(payload.stats.participantCount).toBe(2450);
    expect(payload.stats.participantLabel).toBe('Used by 2,000+ participants');
    expect(payload.stats.openTenderCount).toBe(18);
    expect(payload.stats.verifiedProfileCompletionRate).toBeGreaterThanOrEqual(98.4);
    expect(payload.stats.activeWorkspaceLabel).toBe('Active workspace');
    expect(payload.featuredTenders).toEqual([
      {
        id: 'tender-1',
        reference: 'PX-WRK-2026-001',
        title: 'Construction of community water wells',
        buyerName: 'Medical Stores Department',
        type: 'WORKS',
        status: 'OPEN',
        budget: '480000000',
        currency: 'TZS',
        location: 'Dodoma',
        closingDate: '2026-08-30T00:00:00.000Z',
        categories: ['Works', 'Water']
      }
    ]);
  });

  it('returns stable defaults when repository access fails or no tenders are available', async () => {
    const failingService = new ModuleService({
      health: async () => ({ ready: true }),
      getWelcomeData: async () => {
        throw new Error('database unavailable');
      }
    } as any);
    const emptyService = createServiceWithRepository({
      participantCount: 0,
      openTenderCount: 0,
      verifiedUserCount: 0,
      featuredTenders: []
    });

    await expect(failingService.publicWelcome()).resolves.toMatchObject({
      stats: {
        participantLabel: 'Used by 2,000+ participants',
        verifiedProfileCompletionRate: 98.4
      },
      featuredTenders: [{ reference: 'PX-OPEN-2026' }]
    });
    await expect(emptyService.publicWelcome()).resolves.toMatchObject({
      stats: {
        participantCount: 2000,
        openTenderCount: 12
      },
      featuredTenders: [{ reference: 'PX-OPEN-2026' }]
    });
  });
});

describe('procurement planning service', () => {
  it('normalizes marketplace query defaults and filters', () => {
    expect(marketplaceQuerySchema.parse({})).toEqual({
      search: '',
      type: '',
      budgetBand: '',
      status: '',
      sort: 'deadline',
      page: 1,
      limit: 50
    });

    expect(
      marketplaceQuerySchema.parse({
        search: 'water',
        type: 'Works',
        budgetBand: 'hundred-million-plus',
        status: 'Open',
        sort: 'budget-desc',
        page: '2',
        limit: '25'
      })
    ).toMatchObject({
      search: 'water',
      type: 'Works',
      budgetBand: 'hundred-million-plus',
      status: 'Open',
      sort: 'budget-desc',
      page: 2,
      limit: 25
    });

    expect(() => marketplaceQuerySchema.parse({ budgetBand: 'large' })).toThrow();
    expect(() => marketplaceQuerySchema.parse({ sort: 'random' })).toThrow();
  });

  it('normalizes planning query defaults', () => {
    expect(planningQuerySchema.parse({})).toEqual({
      organizationId: '',
      financialYear: '',
      search: '',
      status: '',
      category: '',
      page: 1,
      pageSize: 20,
      sortBy: 'date',
      sortDirection: 'desc'
    });
  });

  it('validates annual procurement plan payloads', () => {
    expect(
      saveAnnualPlanBodySchema.parse({
        financialYear: '2026/2027',
        lines: [
          {
            tenderTitle: 'Fleet maintenance framework agreement',
            category: 'Services',
            procurementMethod: 'Open Tender',
            openingDate: '2026-07-01',
            closingDate: '2026-07-30',
            sourceOfFunds: 'Operational budget',
            budget: '125000000',
            expectedCompletionDate: '2026-10-30',
            notes: 'High priority'
          }
        ]
      })
    ).toMatchObject({
      financialYear: '2026/2027',
      status: 'DRAFT',
      source: 'manual',
      currency: 'TZS',
      lines: [
        {
          tenderTitle: 'Fleet maintenance framework agreement',
          budget: 125000000,
          status: 'Draft planning',
          planState: 'Planning begun'
        }
      ]
    });

    expect(() => saveAnnualPlanBodySchema.parse({ financialYear: '2026/2027', lines: [] })).toThrow();
  });

  it('rejects impossible procurement planning dates', () => {
    const validLine = {
      tenderTitle: 'Diagnostic equipment service contract',
      openingDate: '2026-07-01',
      closingDate: '2026-07-30',
      expectedCompletionDate: '2026-10-30'
    };

    expect(() =>
      planLineBodySchema.parse({
        ...validLine,
        openingDate: '2026-08-01',
        closingDate: '2026-07-30'
      })
    ).toThrow();

    expect(() =>
      planLineBodySchema.parse({
        ...validLine,
        closingDate: '2026-11-01',
        expectedCompletionDate: '2026-10-30'
      })
    ).toThrow();

    expect(() =>
      planLineBodySchema.parse({
        ...validLine,
        openingDate: '2026-02-31'
      })
    ).toThrow();
  });

  it('returns an empty planning contract when the database is unavailable', async () => {
    const query: ProcurementPlanningQuery = {
      organizationId: '',
      financialYear: '2026/2027',
      search: '',
      status: '',
      category: '',
      page: 1,
      pageSize: 20,
      sortBy: 'date',
      sortDirection: 'desc'
    };
    const service = new ModuleService({
      health: async () => ({ ready: true }),
      listPlans: async () => {
        throw new Error("Can't reach database server");
      }
    } as any);

    await expect(service.planning(query)).resolves.toEqual({
      plans: [],
      records: [],
      summary: {
        financialYear: '2026/2027',
        years: ['2026/2027'],
        totalPlans: 0,
        totalLines: 0,
        totalBudget: 0,
        byStatus: [],
        byCategory: []
      },
      totalPlans: 0,
      page: 1,
      pageSize: 20,
      totalPages: 1
    });
  });
});

describe('procurement tender write service', () => {
  const createInput: CreateTenderInput = {
    title: 'Supply of laboratory equipment',
    type: TenderType.GOODS,
    description: 'Supply and delivery of diagnostic laboratory equipment.',
    budget: 250000000,
    currency: 'TZS',
    location: 'Dar es Salaam',
    closingDate: '2026-08-30',
    categories: ['Health', 'Equipment'],
    requirements: {},
    metadata: {}
  };

  it('normalizes create tender payloads for frontend labels', () => {
    expect(
      createTenderBodySchema.parse({
        title: 'Road maintenance',
        type: 'Non Consultancy',
        description: 'Routine maintenance services',
        budget: '120000000',
        currency: 'tzs',
        location: 'Dodoma',
        closingDate: '2026-08-30',
        categories: [' Services ']
      })
    ).toMatchObject({
      type: TenderType.SERVICE,
      budget: 120000000,
      currency: 'TZS',
      categories: ['Services']
    });

    expect(() =>
      createTenderBodySchema.parse({
        ...createInput,
        type: 'Lease'
      })
    ).toThrow();
  });

  it('creates draft tenders for the authenticated organization', async () => {
    const createdTender = { id: 'tender-1' };
    const repository = {
      createTender: vi.fn().mockResolvedValue(createdTender)
    };
    const identity = {
      requirePermission: vi.fn().mockResolvedValue({
        user: { id: 'user-1', organizationId: 'org-1' }
      })
    };
    const service = new ModuleService(repository as any, identity as any);

    await expect(service.createTender('token-1', createInput)).resolves.toBe(createdTender);
    expect(identity.requirePermission).toHaveBeenCalledWith('token-1', 'procurement.create');
    expect(repository.createTender).toHaveBeenCalledWith(createInput, { organizationId: 'org-1', userId: 'user-1' });
  });

  it('requires organization context before tender creation', async () => {
    const service = new ModuleService({} as any, {
      requirePermission: vi.fn().mockResolvedValue({ user: { id: 'user-1' } })
    } as any);

    await expect(service.createTender('token-1', createInput)).rejects.toMatchObject({
      status: 409,
      message: 'An organization profile is required.'
    });
  });

  it('publishes owner organization tenders only when the draft is complete', async () => {
    const tender = {
      id: 'tender-1',
      buyerOrgId: 'org-1',
      title: 'Supply of laboratory equipment',
      type: TenderType.GOODS,
      description: 'Supply and delivery of diagnostic laboratory equipment.',
      budget: 250000000,
      status: TenderStatus.DRAFT,
      location: 'Dar es Salaam',
      closingDate: new Date(Date.now() + 86400000)
    };
    const publishedTender = { id: 'tender-1', status: 'Open' };
    const repository = {
      getTenderForPublication: vi.fn().mockResolvedValue(tender),
      publishTender: vi.fn().mockResolvedValue(publishedTender)
    };
    const identity = {
      requirePermission: vi.fn().mockResolvedValue({
        user: { id: 'user-1', organizationId: 'org-1' }
      })
    };
    const service = new ModuleService(repository as any, identity as any);

    await expect(service.publishTender('tender-1', 'token-1')).resolves.toBe(publishedTender);
    expect(identity.requirePermission).toHaveBeenCalledWith('token-1', 'procurement.publish');
    expect(repository.publishTender).toHaveBeenCalledWith('tender-1', 'org-1');
  });

  it('rejects publish attempts from another organization', async () => {
    const repository = {
      getTenderForPublication: vi.fn().mockResolvedValue({
        buyerOrgId: 'org-2',
        title: 'Tender',
        type: TenderType.GOODS,
        description: 'Details',
        budget: 1,
        status: TenderStatus.DRAFT,
        location: 'Dar es Salaam',
        closingDate: new Date(Date.now() + 86400000)
      }),
      publishTender: vi.fn()
    };
    const service = new ModuleService(repository as any, {
      requirePermission: vi.fn().mockResolvedValue({ user: { id: 'user-1', organizationId: 'org-1' } })
    } as any);

    await expect(service.publishTender('tender-1', 'token-1')).rejects.toMatchObject({ status: 403 });
    expect(repository.publishTender).not.toHaveBeenCalled();
  });

  it('rejects publish attempts for invalid status or incomplete tender fields', async () => {
    const baseTender = {
      buyerOrgId: 'org-1',
      title: 'Tender',
      type: TenderType.GOODS,
      description: 'Details',
      budget: 1,
      status: TenderStatus.DRAFT,
      location: 'Dar es Salaam',
      closingDate: new Date(Date.now() + 86400000)
    };
    const identity = {
      requirePermission: vi.fn().mockResolvedValue({ user: { id: 'user-1', organizationId: 'org-1' } })
    };

    for (const tender of [
      { ...baseTender, status: TenderStatus.OPEN },
      { ...baseTender, description: '' },
      { ...baseTender, budget: 0 },
      { ...baseTender, location: '' },
      { ...baseTender, closingDate: new Date(Date.now() - 86400000) }
    ]) {
      const service = new ModuleService(
        {
          getTenderForPublication: vi.fn().mockResolvedValue(tender),
          publishTender: vi.fn()
        } as any,
        identity as any
      );

      await expect(service.publishTender('tender-1', 'token-1')).rejects.toMatchObject({ status: expect.any(Number) });
    }
  });
});
