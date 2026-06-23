import { BidStatus, TenderStatus, TenderType, Visibility, VerificationStatus } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { ModuleRepository } from './repository.js';

describe('procurement public welcome repository', () => {
  it('filters featured tenders to public open marketplace opportunities', async () => {
    const db = {
      organization: { count: vi.fn().mockResolvedValue(5) },
      tender: {
        count: vi.fn().mockResolvedValue(3),
        findMany: vi.fn().mockResolvedValue([])
      },
      user: { count: vi.fn().mockResolvedValue(4) }
    };
    const repository = new ModuleRepository(db as any);

    await repository.getWelcomeData();

    expect(db.tender.count).toHaveBeenCalledWith({
      where: {
        status: TenderStatus.OPEN,
        visibility: Visibility.PUBLIC_MARKETPLACE
      }
    });
    expect(db.tender.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: TenderStatus.OPEN,
          visibility: Visibility.PUBLIC_MARKETPLACE
        },
        take: 3
      })
    );
    expect(db.user.count).toHaveBeenCalledWith({
      where: {
        verificationStatus: VerificationStatus.APPROVED
      }
    });
  });
});

describe('procurement marketplace repository', () => {
  it('maps marketplace payloads into the authenticated frontend contract', async () => {
    const buyerOrgId = 'buyer-org-1';
    const supplierOrgId = 'supplier-org-1';
    const publicTender = {
      id: 'tender-1',
      reference: 'PX-2026-001',
      buyerOrgId,
      ownerUserId: 'user-1',
      title: 'Supply of medical equipment',
      description: 'Diagnostic equipment package',
      type: TenderType.GOODS,
      status: TenderStatus.OPEN,
      method: 'OPEN_TENDER',
      visibility: Visibility.PUBLIC_MARKETPLACE,
      budget: 250000000,
      currency: 'TZS',
      location: 'Dar es Salaam',
      contractType: null,
      closingDate: new Date('2026-08-30T00:00:00.000Z'),
      publishedAt: new Date('2026-07-01T08:00:00.000Z'),
      requirements: {},
      metadata: {},
      createdAt: new Date('2026-06-20T08:00:00.000Z'),
      updatedAt: new Date('2026-07-02T08:00:00.000Z'),
      buyerOrg: { id: buyerOrgId, name: 'Medical Stores Department' },
      categories: [{ name: 'Health' }, { name: 'Goods' }],
      bids: []
    };
    const ownDraftTender = {
      ...publicTender,
      id: 'tender-2',
      reference: 'PX-2026-002',
      buyerOrgId: supplierOrgId,
      title: 'Draft road maintenance tender',
      type: TenderType.WORKS,
      status: TenderStatus.DRAFT,
      buyerOrg: { id: supplierOrgId, name: 'Supplier Works Ltd' },
      categories: [{ name: 'Works' }],
      updatedAt: new Date('2026-07-03T08:00:00.000Z')
    };
    const submittedBid = {
      id: 'bid-1',
      tenderId: publicTender.id,
      buyerOrgId,
      supplierOrgId,
      submittedByUserId: 'user-2',
      reference: 'BID-001',
      status: BidStatus.SUBMITTED,
      submittedAt: new Date('2026-07-10T08:00:00.000Z'),
      totalAmount: 225000000,
      currency: 'TZS',
      payload: {},
      createdAt: new Date('2026-07-09T08:00:00.000Z'),
      updatedAt: new Date('2026-07-10T09:00:00.000Z'),
      tender: publicTender,
      receipt: { receiptHash: 'hash-123' }
    };
    const db = {
      tender: {
        findMany: vi.fn().mockResolvedValueOnce([publicTender]).mockResolvedValueOnce([ownDraftTender])
      },
      bid: {
        findMany: vi.fn().mockResolvedValue([submittedBid])
      }
    };
    const repository = new ModuleRepository(db as any);

    const payload = await repository.getMarketplaceData(
      { organizationId: supplierOrgId },
      { search: 'medical', type: 'Goods', budgetBand: 'hundred-million-plus', status: 'Open', sort: 'deadline', page: 1, limit: 20 }
    );

    expect(payload.tenders).toEqual([
      {
        id: 'tender-1',
        title: 'Supply of medical equipment',
        organization: 'Medical Stores Department',
        ownerOrganization: 'Medical Stores Department',
        type: 'Goods',
        category: 'Health / Goods',
        description: 'Diagnostic equipment package',
        location: 'Dar es Salaam',
        budget: 250000000,
        status: 'Open',
        reference: 'PX-2026-001',
        publishedAt: '2026-07-01T08:00:00.000Z',
        closingDate: '2026-08-30',
        createdByCurrentUser: false
      }
    ]);
    expect(payload.tenders[0]).not.toHaveProperty('hasDraftBid');
    expect(payload.tenders[0]).not.toHaveProperty('hasSubmittedBid');
    expect(payload.myTenders).toMatchObject([
      {
        id: 'tender-2',
        section: 'draft',
        title: 'Draft road maintenance tender',
        status: 'Draft',
        type: 'Works',
        nav: 'create-tender',
        actionLabel: 'Continue Draft'
      }
    ]);
    expect(payload.myBids).toMatchObject([
      {
        id: 'bid-1',
        tenderId: 'tender-1',
        section: 'submitted',
        title: 'Supply of medical equipment',
        status: 'Submitted',
        amount: 'TZS 225,000,000',
        receiptHash: 'hash-123',
        nav: 'bidding-workspace',
        actionLabel: 'Open Bid'
      }
    ]);
    expect(payload.summary).toMatchObject({
      total: 1,
      matching: 1,
      openCount: 1,
      myTenderCount: 1,
      myBidCount: 1,
      totalBudget: 250000000
    });
    expect(db.tender.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        take: 1000,
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            expect.objectContaining({ visibility: Visibility.PUBLIC_MARKETPLACE }),
            expect.objectContaining({ type: { in: [TenderType.GOODS] } }),
            expect.objectContaining({ status: { in: [TenderStatus.OPEN, TenderStatus.PUBLISHED] } }),
            expect.objectContaining({ budget: { gte: 100000000, lt: 1000000000 } })
          ])
        })
      })
    );
  });
});

describe('procurement tender write repository', () => {
  it('creates draft tenders with owner context, generated reference, and categories', async () => {
    const createdTender = tenderDetailRecord({
      id: 'tender-1',
      reference: 'PX-GDS-2026-ABC-1234',
      buyerOrgId: 'org-1',
      ownerUserId: 'user-1',
      status: TenderStatus.DRAFT,
      publishedAt: null,
      categories: [{ name: 'Health' }, { name: 'Equipment' }]
    });
    const tx = {
      tender: {
        create: vi.fn().mockResolvedValue({ id: 'tender-1' }),
        findUniqueOrThrow: vi.fn().mockResolvedValue(createdTender)
      },
      tenderCategory: {
        createMany: vi.fn().mockResolvedValue({ count: 2 })
      }
    };
    const db = {
      $transaction: vi.fn((callback) => callback(tx))
    };
    const repository = new ModuleRepository(db as any);

    const result = await repository.createTender(
      {
        title: 'Supply of laboratory equipment',
        type: TenderType.GOODS,
        description: 'Supply and delivery of diagnostic laboratory equipment.',
        budget: 250000000,
        currency: 'TZS',
        location: 'Dar es Salaam',
        closingDate: '2026-08-30',
        categories: ['Health', 'Equipment', 'health'],
        requirements: { technical: true },
        metadata: { source: 'test' }
      },
      { organizationId: 'org-1', userId: 'user-1' }
    );

    expect(tx.tender.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        reference: expect.stringMatching(/^PX-GDS-\d{4}-/),
        buyerOrgId: 'org-1',
        ownerUserId: 'user-1',
        title: 'Supply of laboratory equipment',
        type: TenderType.GOODS,
        status: TenderStatus.DRAFT,
        visibility: Visibility.PUBLIC_MARKETPLACE,
        budget: 250000000,
        currency: 'TZS',
        location: 'Dar es Salaam',
        closingDate: new Date('2026-08-30T00:00:00.000Z'),
        requirements: { technical: true },
        metadata: { source: 'test' }
      })
    });
    expect(tx.tenderCategory.createMany).toHaveBeenCalledWith({
      data: [
        { tenderId: 'tender-1', name: 'Health' },
        { tenderId: 'tender-1', name: 'Equipment' }
      ],
      skipDuplicates: true
    });
    expect(result).toMatchObject({
      id: 'tender-1',
      status: 'Draft',
      createdByCurrentUser: true,
      buyerOrgId: 'org-1',
      ownerUserId: 'user-1'
    });
  });

  it('rejects duplicate provided tender references with a conflict', async () => {
    const repository = new ModuleRepository({
      $transaction: vi.fn().mockRejectedValue({ code: 'P2002' })
    } as any);

    await expect(
      repository.createTender(
        {
          title: 'Supply of laboratory equipment',
          type: TenderType.GOODS,
          description: 'Supply and delivery of diagnostic laboratory equipment.',
          budget: 250000000,
          currency: 'TZS',
          location: 'Dar es Salaam',
          closingDate: '2026-08-30',
          categories: [],
          requirements: {},
          metadata: {},
          reference: 'PX-GDS-2026-001'
        },
        { organizationId: 'org-1', userId: 'user-1' }
      )
    ).rejects.toMatchObject({
      status: 409,
      message: 'Tender reference already exists.'
    });
  });

  it('publishes owner-scoped tenders as open marketplace records', async () => {
    const publishedTender = tenderDetailRecord({
      id: 'tender-1',
      buyerOrgId: 'org-1',
      status: TenderStatus.OPEN,
      visibility: Visibility.PUBLIC_MARKETPLACE,
      publishedAt: new Date('2026-07-01T08:00:00.000Z')
    });
    const db = {
      tender: {
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        findUnique: vi.fn().mockResolvedValue(publishedTender)
      }
    };
    const repository = new ModuleRepository(db as any);

    const result = await repository.publishTender('tender-1', 'org-1');

    expect(db.tender.updateMany).toHaveBeenCalledWith({
      where: { id: 'tender-1', buyerOrgId: 'org-1' },
      data: expect.objectContaining({
        status: TenderStatus.OPEN,
        visibility: Visibility.PUBLIC_MARKETPLACE,
        publishedAt: expect.any(Date)
      })
    });
    expect(result).toMatchObject({
      id: 'tender-1',
      status: 'Open',
      visibility: Visibility.PUBLIC_MARKETPLACE,
      publishedAt: '2026-07-01T08:00:00.000Z',
      createdByCurrentUser: true
    });
  });
});

function tenderDetailRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: 'tender-1',
    reference: 'PX-GDS-2026-001',
    buyerOrgId: 'org-1',
    ownerUserId: 'user-1',
    title: 'Supply of laboratory equipment',
    description: 'Supply and delivery of diagnostic laboratory equipment.',
    type: TenderType.GOODS,
    status: TenderStatus.DRAFT,
    method: 'OPEN_TENDER',
    visibility: Visibility.PUBLIC_MARKETPLACE,
    budget: 250000000,
    currency: 'TZS',
    location: 'Dar es Salaam',
    contractType: null,
    closingDate: new Date('2026-08-30T00:00:00.000Z'),
    publishedAt: null,
    requirements: {},
    metadata: {},
    createdAt: new Date('2026-06-20T08:00:00.000Z'),
    updatedAt: new Date('2026-06-20T08:00:00.000Z'),
    buyerOrg: { id: 'org-1', name: 'Medical Stores Department' },
    categories: [],
    bids: [],
    documents: [],
    requirementRows: [],
    milestones: [],
    commercialItems: [],
    ...overrides
  };
}
