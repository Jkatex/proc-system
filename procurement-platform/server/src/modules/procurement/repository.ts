import { BidStatus, OrganizationKind, TenderStatus, TenderType, Visibility, VerificationStatus, type Prisma, type PrismaClient } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import { prisma } from '../../db/prisma.js';
import type {
  CreateTenderInput,
  MarketplaceQuery,
  MarketplaceTenderRow,
  MyBidRow,
  MyTenderRow,
  ProcurementPlanLineInput,
  ProcurementPlanLinePatchInput,
  ProcurementPlanningQuery,
  ProcurementMarketplacePayload,
  SaveAnnualPlanInput,
  UpdateProcurementPlanInput
} from './types.js';

const planInclude = {
  ownerOrg: { select: { id: true, name: true } },
  lines: {
    orderBy: [{ openingDate: 'asc' }, { createdAt: 'asc' }],
    include: {
      tender: { select: { id: true } }
    }
  }
} satisfies Prisma.ProcurementPlanInclude;

type ProcurementPlanRecord = Prisma.ProcurementPlanGetPayload<{ include: typeof planInclude }>;

const marketplaceTenderInclude = {
  buyerOrg: { select: { id: true, name: true } },
  categories: { select: { name: true }, orderBy: { name: 'asc' } },
  bids: {
    select: {
      id: true,
      supplierOrgId: true,
      status: true,
      submittedAt: true,
      totalAmount: true,
      updatedAt: true,
      supplierOrg: { select: { name: true } },
      receipt: { select: { receiptHash: true } }
    },
    orderBy: { updatedAt: 'desc' }
  }
} satisfies Prisma.TenderInclude;

const tenderDetailInclude = {
  ...marketplaceTenderInclude,
  documents: {
    include: {
      document: {
        select: { id: true, name: true, documentType: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  },
  requirementRows: { orderBy: { createdAt: 'asc' } },
  milestones: { orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }] },
  commercialItems: { orderBy: { description: 'asc' } }
} satisfies Prisma.TenderInclude;

type MarketplaceTenderRecord = Prisma.TenderGetPayload<{ include: typeof marketplaceTenderInclude }>;
type TenderDetailRecord = Prisma.TenderGetPayload<{ include: typeof tenderDetailInclude }>;
type MarketplaceBidRecord = Prisma.BidGetPayload<{ include: { tender: { include: typeof marketplaceTenderInclude }; receipt: { select: { receiptHash: true } } } }>;

function requestError(message: string, status = 400) {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
}

export class ModuleRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  async health() {
    return { ready: true };
  }

  async getWelcomeData() {
    if (this.db === prisma && !process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not configured.');
    }

    const [participantCount, openTenderCount, verifiedUserCount, featuredTenders] = await Promise.all([
      this.db.organization.count(),
      this.db.tender.count({
        where: {
          status: TenderStatus.OPEN,
          visibility: Visibility.PUBLIC_MARKETPLACE
        }
      }),
      this.db.user.count({
        where: {
          verificationStatus: VerificationStatus.APPROVED
        }
      }),
      this.db.tender.findMany({
        where: {
          status: TenderStatus.OPEN,
          visibility: Visibility.PUBLIC_MARKETPLACE
        },
        orderBy: [{ closingDate: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: 3,
        include: {
          buyerOrg: {
            select: {
              name: true
            }
          },
          categories: {
            select: {
              name: true
            },
            orderBy: {
              name: 'asc'
            }
          }
        }
      })
    ]);

    return {
      participantCount,
      openTenderCount,
      verifiedUserCount,
      featuredTenders
    };
  }

  async getMarketplaceData(context: { organizationId?: string }, query: MarketplaceQuery): Promise<ProcurementMarketplacePayload> {
    const publicWhere = marketplaceWhere(query);
    const [matchingTenders, myTenderRecords, myBidRecords] = await Promise.all([
      this.db.tender.findMany({
        where: publicWhere,
        include: marketplaceTenderInclude,
        orderBy: marketplaceOrderBy(query.sort),
        take: 1000
      }),
      context.organizationId
        ? this.db.tender.findMany({
            where: {
              buyerOrgId: context.organizationId,
              status: {
                in: [
                  TenderStatus.DRAFT,
                  TenderStatus.REVIEW,
                  TenderStatus.PUBLISHED,
                  TenderStatus.OPEN,
                  TenderStatus.CLOSED,
                  TenderStatus.EVALUATION,
                  TenderStatus.AWARDED,
                  TenderStatus.CANCELLED
                ]
              }
            },
            include: marketplaceTenderInclude,
            orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
            take: 500
          })
        : Promise.resolve([]),
      context.organizationId
        ? this.db.bid.findMany({
            where: {
              supplierOrgId: context.organizationId,
              status: { not: BidStatus.WITHDRAWN }
            },
            include: {
              tender: { include: marketplaceTenderInclude },
              receipt: { select: { receiptHash: true } }
            },
            orderBy: [{ updatedAt: 'desc' }],
            take: 500
          })
        : Promise.resolve([])
    ]);

    const sortedTenders = sortMarketplaceTenders(matchingTenders, query.sort);
    const pagedTenders = sortedTenders.slice((query.page - 1) * query.limit, query.page * query.limit);
    const rows = pagedTenders.map((tender) => toMarketplaceTenderRow(tender, context.organizationId));
    const myTenders = myTenderRecords.map((tender) => toMyTenderRow(tender, context.organizationId));
    const myBids = myBidRecords.map((bid) => toMyBidRow(bid, context.organizationId));

    return {
      tenders: rows,
      myTenders,
      myBids,
      summary: marketplaceSummary(sortedTenders, myTenders, myBids, query)
    };
  }

  async getTenderDetail(tenderId: string, context: { organizationId?: string }) {
    const tender = await this.db.tender.findUnique({
      where: { id: tenderId },
      include: tenderDetailInclude
    });
    return tender ? toTenderDetailDto(tender, context.organizationId) : null;
  }

  async getTenderForPublication(tenderId: string) {
    return this.db.tender.findUnique({
      where: { id: tenderId },
      select: {
        id: true,
        buyerOrgId: true,
        title: true,
        type: true,
        description: true,
        budget: true,
        status: true,
        location: true,
        closingDate: true
      }
    });
  }

  async createTender(input: CreateTenderInput, context: { organizationId: string; userId: string }) {
    const categories = normalizeCategoryInputs(input.categories);
    const providedReference = input.reference?.trim();
    let attempt = 0;

    while (attempt < 4) {
      const reference = providedReference || generateTenderReference(input.type);
      try {
        const tender = await this.db.$transaction(async (tx) => {
          const savedTender = await tx.tender.create({
            data: {
              reference,
              buyerOrgId: context.organizationId,
              ownerUserId: context.userId,
              title: input.title,
              description: input.description,
              type: input.type,
              status: TenderStatus.DRAFT,
              visibility: Visibility.PUBLIC_MARKETPLACE,
              budget: input.budget,
              currency: input.currency,
              location: input.location,
              closingDate: tenderDateInput(input.closingDate),
              requirements: input.requirements as Prisma.InputJsonObject,
              metadata: input.metadata as Prisma.InputJsonObject
            }
          });

          if (categories.length > 0) {
            await tx.tenderCategory.createMany({
              data: categories.map((name) => ({ tenderId: savedTender.id, name })),
              skipDuplicates: true
            });
          }

          return tx.tender.findUniqueOrThrow({
            where: { id: savedTender.id },
            include: tenderDetailInclude
          });
        });

        return toTenderDetailDto(tender, context.organizationId);
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          if (!providedReference && attempt < 3) {
            attempt += 1;
            continue;
          }
          throw requestError('Tender reference already exists.', 409);
        }
        throw error;
      }
    }

    throw requestError('Tender reference could not be generated.', 500);
  }

  async publishTender(tenderId: string, organizationId: string) {
    const update = await this.db.tender.updateMany({
      where: { id: tenderId, buyerOrgId: organizationId },
      data: {
        status: TenderStatus.OPEN,
        visibility: Visibility.PUBLIC_MARKETPLACE,
        publishedAt: new Date()
      }
    });
    if (update.count === 0) return null;

    const tender = await this.db.tender.findUnique({
      where: { id: tenderId },
      include: tenderDetailInclude
    });
    return tender ? toTenderDetailDto(tender, organizationId) : null;
  }

  async listPlans(query: ProcurementPlanningQuery) {
    const where = planWhere(query);
    const [plans, totalPlans, allMatchingPlans, years] = await Promise.all([
      this.db.procurementPlan.findMany({
        where,
        include: planInclude,
        orderBy: planOrderBy(query),
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize
      }),
      this.db.procurementPlan.count({ where }),
      this.db.procurementPlan.findMany({
        where,
        include: planInclude,
        orderBy: planOrderBy(query),
        take: 2000
      }),
      this.db.procurementPlan.findMany({
        where: query.organizationId ? { ownerOrgId: query.organizationId } : {},
        select: { financialYear: true },
        distinct: ['financialYear'],
        orderBy: { financialYear: 'desc' }
      })
    ]);

    return {
      plans: plans.map(toPlanDto),
      records: sortPlanLines(plans.flatMap((plan) => toFilteredLineDtos(plan, query)), query),
      summary: buildSummary(allMatchingPlans, query, years.map((item) => item.financialYear)),
      totalPlans,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.max(1, Math.ceil(totalPlans / query.pageSize))
    };
  }

  async getPlan(planId: string) {
    const plan = await this.db.procurementPlan.findUnique({
      where: { id: planId },
      include: planInclude
    });

    return plan ? toPlanDto(plan) : null;
  }

  async saveAnnualPlan(input: SaveAnnualPlanInput) {
    const ownerOrgId = await this.resolveOwnerOrgId(input.ownerOrgId);
    const name = input.name || `${input.financialYear} annual procurement plan`;

    const plan = await this.db.$transaction(async (tx) => {
      const savedPlan = await tx.procurementPlan.upsert({
        where: {
          ownerOrgId_financialYear_name: {
            ownerOrgId,
            financialYear: input.financialYear,
            name
          }
        },
        update: {
          status: input.status,
          source: input.source,
          currency: input.currency,
          metadata: input.metadata as Prisma.InputJsonObject
        },
        create: {
          ownerOrgId,
          financialYear: input.financialYear,
          name,
          status: input.status,
          source: input.source,
          currency: input.currency,
          metadata: input.metadata as Prisma.InputJsonObject
        }
      });

      await tx.procurementPlanLine.deleteMany({ where: { planId: savedPlan.id } });

      if (input.lines.length > 0) {
        await tx.procurementPlanLine.createMany({
          data: input.lines.map((line) => lineCreateInput(savedPlan.id, line))
        });
      }

      return tx.procurementPlan.findUniqueOrThrow({
        where: { id: savedPlan.id },
        include: planInclude
      });
    });

    return toPlanDto(plan);
  }

  async updatePlan(planId: string, input: UpdateProcurementPlanInput) {
    const existing = await this.db.procurementPlan.findUnique({ where: { id: planId } });
    if (!existing) return null;

    const plan = await this.db.$transaction(async (tx) => {
      await tx.procurementPlan.update({
        where: { id: planId },
        data: {
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.status !== undefined ? { status: input.status } : {}),
          ...(input.source !== undefined ? { source: input.source } : {}),
          ...(input.currency !== undefined ? { currency: input.currency } : {}),
          ...(input.metadata !== undefined ? { metadata: input.metadata as Prisma.InputJsonObject } : {})
        }
      });

      if (input.lines) {
        await tx.procurementPlanLine.deleteMany({ where: { planId } });
        await tx.procurementPlanLine.createMany({
          data: input.lines.map((line) => lineCreateInput(planId, line))
        });
      }

      return tx.procurementPlan.findUniqueOrThrow({
        where: { id: planId },
        include: planInclude
      });
    });

    return toPlanDto(plan);
  }

  async createPlanLine(planId: string, input: ProcurementPlanLineInput) {
    const plan = await this.db.procurementPlan.findUnique({ where: { id: planId }, select: { id: true } });
    if (!plan) return null;

    const line = await this.db.procurementPlanLine.create({
      data: lineCreateInput(planId, input),
      include: { plan: true }
    });

    return toLineDto({
      ...line,
      tender: null
    });
  }

  async updatePlanLine(lineId: string, input: ProcurementPlanLinePatchInput) {
    const existing = await this.db.procurementPlanLine.findUnique({ where: { id: lineId } });
    if (!existing) return null;

    const line = await this.db.procurementPlanLine.update({
      where: { id: lineId },
      data: lineUpdateInput(input),
      include: { plan: true, tender: { select: { id: true } } }
    });

    return toLineDto(line);
  }

  async deletePlanLine(lineId: string) {
    const existing = await this.db.procurementPlanLine.findUnique({
      where: { id: lineId },
      include: { plan: true, tender: { select: { id: true } } }
    });
    if (!existing) return null;

    await this.db.procurementPlanLine.delete({ where: { id: lineId } });
    return toLineDto(existing);
  }

  private async resolveOwnerOrgId(ownerOrgId?: string) {
    if (ownerOrgId) {
      const organization = await this.db.organization.findUnique({ where: { id: ownerOrgId }, select: { id: true } });
      if (!organization) throw new Error('Procurement planning owner organization was not found.');
      return organization.id;
    }

    const organization =
      (await this.db.organization.findFirst({
        where: { kind: OrganizationKind.COMPANY },
        select: { id: true },
        orderBy: { createdAt: 'asc' }
      })) ??
      (await this.db.organization.findFirst({
        select: { id: true },
        orderBy: { createdAt: 'asc' }
      }));

    if (!organization) throw new Error('Create an organization before saving procurement plans.');
    return organization.id;
  }
}

function planWhere(query: ProcurementPlanningQuery): Prisma.ProcurementPlanWhereInput {
  return andPlanWhere([
    query.organizationId ? { ownerOrgId: query.organizationId } : {},
    query.financialYear ? { financialYear: query.financialYear } : {},
    query.status ? { lines: { some: { status: { contains: query.status, mode: 'insensitive' } } } } : {},
    query.category ? { lines: { some: { category: { contains: query.category, mode: 'insensitive' } } } } : {},
    query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { financialYear: { contains: query.search, mode: 'insensitive' } },
            { ownerOrg: { name: { contains: query.search, mode: 'insensitive' } } },
            { lines: { some: { tenderTitle: { contains: query.search, mode: 'insensitive' } } } },
            { lines: { some: { category: { contains: query.search, mode: 'insensitive' } } } },
            { lines: { some: { procurementMethod: { contains: query.search, mode: 'insensitive' } } } }
          ]
        }
      : {}
  ]);
}

function planOrderBy(query: ProcurementPlanningQuery): Prisma.ProcurementPlanOrderByWithRelationInput[] {
  const direction = query.sortDirection;
  if (query.sortBy === 'title') return [{ name: direction }, { updatedAt: 'desc' }];
  if (query.sortBy === 'status') return [{ status: direction }, { updatedAt: 'desc' }];
  return [{ updatedAt: direction }];
}

function andPlanWhere(filters: Prisma.ProcurementPlanWhereInput[]): Prisma.ProcurementPlanWhereInput {
  const active = filters.filter((filter) => Object.keys(filter).length > 0);
  if (active.length === 0) return {};
  if (active.length === 1) return active[0];
  return { AND: active };
}

function toPlanDto(plan: ProcurementPlanRecord) {
  const lines = plan.lines.map((line) => toLineDto({ ...line, plan }));

  return {
    id: plan.id,
    ownerOrgId: plan.ownerOrgId,
    ownerName: plan.ownerOrg.name,
    financialYear: plan.financialYear,
    name: plan.name,
    status: plan.status,
    source: plan.source,
    currency: plan.currency,
    lineCount: plan.lines.length,
    totalBudget: lines.reduce((sum, line) => sum + line.budget, 0),
    metadata: objectPayload(plan.metadata),
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
    lines
  };
}

function toFilteredLineDtos(plan: ProcurementPlanRecord, query: ProcurementPlanningQuery) {
  return plan.lines
    .filter((line) => {
      if (query.status && !line.status.toLowerCase().includes(query.status.toLowerCase())) return false;
      if (query.category && !line.category.toLowerCase().includes(query.category.toLowerCase())) return false;
      if (!query.search) return true;
      const haystack = [
        line.tenderTitle,
        line.category,
        line.procurementMethod,
        line.sourceOfFunds,
        line.status,
        line.planState,
        line.notes,
        plan.name,
        plan.ownerOrg.name
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query.search.toLowerCase());
    })
    .map((line) => toLineDto({ ...line, plan }));
}

type LineWithPlan = Prisma.ProcurementPlanLineGetPayload<{
  include: { plan: true; tender: { select: { id: true } } };
}>;

function toLineDto(line: LineWithPlan) {
  return {
    id: line.id,
    planId: line.planId,
    tenderId: line.tenderId,
    financialYear: line.plan.financialYear,
    tenderTitle: line.tenderTitle,
    openingDate: dateOnly(line.openingDate),
    closingDate: dateOnly(line.closingDate),
    category: line.category,
    budget: decimalToNumber(line.budget),
    procurementMethod: line.procurementMethod,
    sourceOfFunds: line.sourceOfFunds,
    expectedCompletionDate: dateOnly(line.expectedCompletionDate),
    status: line.status,
    planState: line.planState,
    notes: line.notes ?? '',
    customValues: stringRecord(line.customValues),
    metadata: objectPayload(line.metadata),
    createdAt: line.createdAt.toISOString(),
    updatedAt: line.updatedAt.toISOString()
  };
}

function marketplaceWhere(query: MarketplaceQuery): Prisma.TenderWhereInput {
  const statusFilter = statusFilterValues(query.status);
  const typeFilter = typeFilterValues(query.type);
  const activeFilters: Prisma.TenderWhereInput[] = [
    {
      visibility: Visibility.PUBLIC_MARKETPLACE,
      status: {
        in: [TenderStatus.PUBLISHED, TenderStatus.OPEN, TenderStatus.CLOSED, TenderStatus.EVALUATION, TenderStatus.AWARDED]
      }
    }
  ];

  if (query.search) {
    activeFilters.push({
      OR: [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { reference: { contains: query.search, mode: 'insensitive' } },
        { location: { contains: query.search, mode: 'insensitive' } },
        { buyerOrg: { name: { contains: query.search, mode: 'insensitive' } } },
        { categories: { some: { name: { contains: query.search, mode: 'insensitive' } } } }
      ]
    });
  }

  if (typeFilter.length > 0) activeFilters.push({ type: { in: typeFilter } });
  if (statusFilter.length > 0) activeFilters.push({ status: { in: statusFilter } });

  if (query.budgetBand === 'under-hundred-million') {
    activeFilters.push({ budget: { lt: 100000000 } });
  } else if (query.budgetBand === 'hundred-million-plus') {
    activeFilters.push({ budget: { gte: 100000000, lt: 1000000000 } });
  } else if (query.budgetBand === 'billion-plus') {
    activeFilters.push({ budget: { gte: 1000000000 } });
  }

  return activeFilters.length === 1 ? activeFilters[0] : { AND: activeFilters };
}

function marketplaceOrderBy(sort: MarketplaceQuery['sort']): Prisma.TenderOrderByWithRelationInput[] {
  if (sort === 'budget-desc') return [{ budget: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }];
  if (sort === 'budget-asc') return [{ budget: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }];
  if (sort === 'newest') return [{ publishedAt: 'desc' }, { createdAt: 'desc' }];
  return [{ closingDate: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }];
}

function sortMarketplaceTenders(tenders: MarketplaceTenderRecord[], sort: MarketplaceQuery['sort']) {
  return [...tenders].sort((left, right) => {
    if (sort === 'budget-desc') return decimalToNumber(right.budget) - decimalToNumber(left.budget) || newestTime(right) - newestTime(left);
    if (sort === 'budget-asc') return decimalToNumber(left.budget) - decimalToNumber(right.budget) || newestTime(right) - newestTime(left);
    if (sort === 'newest') return newestTime(right) - newestTime(left);
    return deadlineTime(left) - deadlineTime(right) || newestTime(right) - newestTime(left);
  });
}

function toMarketplaceTenderRow(tender: MarketplaceTenderRecord, organizationId?: string): MarketplaceTenderRow {
  const category = marketplaceCategory(tender);
  return {
    id: tender.id,
    title: tender.title,
    organization: tender.buyerOrg.name,
    ownerOrganization: tender.buyerOrg.name,
    type: frontendTenderType(tender.type),
    category,
    description: tender.description || '',
    location: tender.location || 'Tanzania',
    budget: decimalToNumber(tender.budget),
    status: frontendTenderStatus(tender.status),
    reference: tender.reference,
    publishedAt: tender.publishedAt?.toISOString() ?? '',
    closingDate: dateOnly(tender.closingDate),
    createdByCurrentUser: Boolean(organizationId && tender.buyerOrgId === organizationId)
  };
}

function toMyTenderRow(tender: MarketplaceTenderRecord, organizationId?: string): MyTenderRow {
  const section = myTenderSection(tender.status);
  return {
    id: tender.id,
    section,
    title: tender.title,
    status: frontendTenderStatus(tender.status),
    type: frontendTenderType(tender.type),
    lastActivity: tender.updatedAt.toISOString(),
    nav: section === 'draft' ? 'create-tender' : 'tender-details',
    actionLabel: section === 'draft' ? 'Continue Draft' : section === 'completed' ? 'View Record' : 'View My Tender',
    tender: toMarketplaceTenderRow(tender, organizationId)
  };
}

function toMyBidRow(bid: MarketplaceBidRecord, organizationId?: string): MyBidRow {
  const section = myBidSection(bid.status);
  return {
    id: bid.id,
    tenderId: bid.tenderId,
    section,
    title: bid.tender.title,
    status: frontendBidStatus(bid.status),
    amount: bid.totalAmount ? `${bid.currency} ${decimalToNumber(bid.totalAmount).toLocaleString('en-US')}` : undefined,
    receiptHash: bid.receipt?.receiptHash,
    lastActivity: bid.updatedAt.toISOString(),
    nav: 'bidding-workspace',
    actionLabel: section === 'draft' ? 'Continue Bid' : 'Open Bid',
    tender: toMarketplaceTenderRow(bid.tender, organizationId)
  };
}

function marketplaceSummary(tenders: MarketplaceTenderRecord[], myTenders: MyTenderRow[], myBids: MyBidRow[], query: MarketplaceQuery) {
  const rows = tenders.map((tender) => toMarketplaceTenderRow(tender));
  return {
    total: rows.length,
    matching: rows.length,
    page: query.page,
    limit: query.limit,
    totalPages: Math.max(1, Math.ceil(rows.length / query.limit)),
    openCount: rows.filter((row) => row.status === 'Open').length,
    myTenderCount: myTenders.length,
    myBidCount: myBids.length,
    totalBudget: rows.reduce((sum, row) => sum + row.budget, 0),
    byStatus: groupCount(rows, (row) => row.status),
    byType: groupCount(rows, (row) => row.type),
    byCategory: groupCount(rows, (row) => row.category)
  };
}

function toTenderDetailDto(tender: TenderDetailRecord, organizationId?: string) {
  const base = toMarketplaceTenderRow(tender, organizationId);
  const currentBid = tender.bids.find((bid) => bid.supplierOrgId === organizationId) ?? null;

  return {
    ...base,
    buyerOrgId: tender.buyerOrgId,
    ownerUserId: tender.ownerUserId,
    method: tender.method,
    visibility: tender.visibility,
    publishedAt: tender.publishedAt?.toISOString() ?? '',
    requirements: objectPayload(tender.requirements),
    requirementRows: tender.requirementRows.map((row) => ({
      id: row.id,
      section: row.section,
      payload: objectPayload(row.payload)
    })),
    milestones: tender.milestones.map((milestone) => ({
      id: milestone.id,
      name: milestone.name,
      dueDate: milestone.dueDate?.toISOString() ?? null,
      payload: objectPayload(milestone.payload)
    })),
    commercialItems: tender.commercialItems.map((item) => ({
      id: item.id,
      itemNo: item.itemNo,
      description: item.description,
      quantity: decimalToNumber(item.quantity),
      unit: item.unit,
      rate: decimalToNumber(item.rate),
      total: decimalToNumber(item.total),
      payload: objectPayload(item.payload)
    })),
    documents: tender.documents.map((document) => ({
      id: document.document.id,
      name: document.document.name,
      documentType: document.document.documentType,
      label: document.label
    })),
    bidSummary: {
      total: tender.bids.length,
      draft: tender.bids.filter((bid) => bid.status === BidStatus.DRAFT).length,
      submitted: tender.bids.filter((bid) => bid.status === BidStatus.SUBMITTED).length,
      withdrawn: tender.bids.filter((bid) => bid.status === BidStatus.WITHDRAWN).length
    },
    currentBid: currentBid
      ? {
          id: currentBid.id,
          status: currentBid.status,
          submittedAt: currentBid.submittedAt?.toISOString() ?? null,
          receiptHash: currentBid.receipt?.receiptHash ?? null
        }
      : null
  };
}

function marketplaceCategory(tender: MarketplaceTenderRecord) {
  const categoryNames = tender.categories.map((category) => category.name).filter(Boolean);
  if (categoryNames.length > 0) return categoryNames.join(' / ');
  return frontendTenderType(tender.type);
}

function frontendTenderStatus(status: unknown) {
  const value = normalizeLabel(status);
  if (value === 'OPEN' || value === 'PUBLISHED') return 'Open';
  if (value === 'EVALUATION' || value === 'UNDER_EVALUATION') return 'Evaluation';
  if (value === 'AWARDED') return 'Awarded';
  if (value === 'CLOSED') return 'Closed';
  if (value === 'DRAFT') return 'Draft';
  if (value === 'CANCELLED') return 'Cancelled';
  if (value === 'REVIEW' || value === 'PENDING' || value === 'UNDER_REVIEW') return 'Draft';
  if (value === 'COMPLETED') return 'Completed';
  return titleCaseLabel(value);
}

function frontendBidStatus(status: unknown) {
  const value = normalizeLabel(status);
  if (value === 'DRAFT') return 'Draft';
  if (value === 'SUBMITTED') return 'Submitted';
  if (value === 'AWARDED') return 'Awarded';
  if (value === 'DISQUALIFIED' || value === 'REJECTED' || value === 'LOST') return 'Rejected';
  if (value === 'UNDER_EVALUATION' || value === 'OPENED' || value === 'EVALUATED') return 'Evaluated';
  if (value === 'WITHDRAWN') return 'Withdrawn';
  return titleCaseLabel(value);
}

function frontendTenderType(type: unknown) {
  const value = normalizeLabel(type);
  if (value === 'GOODS') return 'Goods';
  if (value === 'WORKS') return 'Works';
  if (value === 'SERVICE' || value === 'SERVICES' || value === 'NON_CONSULTANCY' || value === 'NON_CONSULTANCY_SERVICES') return 'Non Consultancy';
  if (value === 'CONSULTANCY') return 'Consultancy';
  return titleCaseLabel(value);
}

function myTenderSection(status: unknown): MyTenderRow['section'] {
  const value = normalizeLabel(status);
  if (value === 'DRAFT' || value === 'PENDING' || value === 'REVIEW' || value === 'UNDER_REVIEW') return 'draft';
  if (value === 'OPEN' || value === 'PUBLISHED') return 'posted';
  if (value === 'CLOSED' || value === 'COMPLETED' || value === 'AWARDED' || value === 'CANCELLED') return 'completed';
  return 'posted';
}

function myBidSection(status: unknown): MyBidRow['section'] {
  const value = normalizeLabel(status);
  if (value === 'DRAFT') return 'draft';
  if (value === 'SUBMITTED' || value === 'EVALUATED' || value === 'AWARDED' || value === 'REJECTED') return 'submitted';
  return 'submitted';
}

function typeFilterValues(type: string): TenderType[] {
  const value = normalizeLabel(type);
  if (!value) return [];
  if (value === 'GOODS') return [TenderType.GOODS];
  if (value === 'WORKS') return [TenderType.WORKS];
  if (value === 'NON_CONSULTANCY' || value === 'NON_CONSULTANCY_SERVICES' || value === 'SERVICE' || value === 'SERVICES') return [TenderType.SERVICE];
  if (value === 'CONSULTANCY') return [TenderType.CONSULTANCY];
  return [];
}

function statusFilterValues(status: string): TenderStatus[] {
  const value = normalizeLabel(status);
  if (!value) return [];
  if (value === 'OPEN' || value === 'PUBLISHED') return [TenderStatus.OPEN, TenderStatus.PUBLISHED];
  if (value === 'EVALUATION' || value === 'UNDER_EVALUATION') return [TenderStatus.EVALUATION];
  if (value === 'AWARDED') return [TenderStatus.AWARDED];
  if (value === 'CLOSED') return [TenderStatus.CLOSED];
  if (value === 'DRAFT') return [TenderStatus.DRAFT];
  if (value === 'CANCELLED') return [TenderStatus.CANCELLED];
  return [];
}

function normalizeLabel(value: unknown) {
  return String(value ?? '')
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .toUpperCase();
}

function titleCaseLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function newestTime(tender: MarketplaceTenderRecord) {
  return (tender.publishedAt ?? tender.createdAt).getTime();
}

function deadlineTime(tender: MarketplaceTenderRecord) {
  return tender.closingDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
}

function buildSummary(plans: ProcurementPlanRecord[], query: ProcurementPlanningQuery, years: string[]) {
  const records = plans.flatMap((plan) => toFilteredLineDtos(plan, query));

  return {
    financialYear: query.financialYear || null,
    years,
    totalPlans: plans.length,
    totalLines: records.length,
    totalBudget: records.reduce((sum, record) => sum + record.budget, 0),
    byStatus: groupCount(records, (record) => record.status),
    byCategory: groupCount(records, (record) => record.category)
  };
}

function groupCount<T extends { budget?: number }>(items: T[], getLabel: (item: T) => string) {
  const groups = new Map<string, { value: number; amount: number }>();
  for (const item of items) {
    const label = getLabel(item) || 'Unspecified';
    const current = groups.get(label) ?? { value: 0, amount: 0 };
    current.value += 1;
    current.amount += item.budget ?? 0;
    groups.set(label, current);
  }
  return Array.from(groups, ([label, value]) => ({ label, ...value })).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

function sortPlanLines<T extends { createdAt: string; tenderTitle: string; budget: number; status: string; category: string }>(
  lines: T[],
  query: ProcurementPlanningQuery
) {
  const direction = query.sortDirection === 'asc' ? 1 : -1;
  return [...lines].sort((left, right) => {
    const leftValue = lineSortValue(left, query.sortBy);
    const rightValue = lineSortValue(right, query.sortBy);
    if (leftValue < rightValue) return -1 * direction;
    if (leftValue > rightValue) return 1 * direction;
    return right.createdAt.localeCompare(left.createdAt);
  });
}

function lineSortValue(line: { createdAt: string; tenderTitle: string; budget: number; status: string; category: string }, sortBy: ProcurementPlanningQuery['sortBy']) {
  if (sortBy === 'title') return line.tenderTitle.toLowerCase();
  if (sortBy === 'budget') return line.budget;
  if (sortBy === 'status') return line.status.toLowerCase();
  if (sortBy === 'category') return line.category.toLowerCase();
  return line.createdAt;
}

function lineCreateInput(planId: string, line: ProcurementPlanLineInput): Prisma.ProcurementPlanLineCreateManyInput {
  return {
    planId,
    tenderId: line.tenderId,
    tenderTitle: line.tenderTitle,
    openingDate: dateInput(line.openingDate),
    closingDate: dateInput(line.closingDate),
    category: line.category,
    budget: line.budget,
    procurementMethod: line.procurementMethod,
    sourceOfFunds: line.sourceOfFunds,
    expectedCompletionDate: dateInput(line.expectedCompletionDate),
    status: line.status,
    planState: line.planState,
    notes: line.notes || null,
    customValues: line.customValues as Prisma.InputJsonObject,
    metadata: line.metadata as Prisma.InputJsonObject
  };
}

function lineUpdateInput(line: ProcurementPlanLinePatchInput): Prisma.ProcurementPlanLineUpdateInput {
  return {
    ...(line.tenderId !== undefined ? { tender: { connect: { id: line.tenderId } } } : {}),
    ...(line.tenderTitle !== undefined ? { tenderTitle: line.tenderTitle } : {}),
    ...(line.openingDate !== undefined ? { openingDate: dateInput(line.openingDate) } : {}),
    ...(line.closingDate !== undefined ? { closingDate: dateInput(line.closingDate) } : {}),
    ...(line.category !== undefined ? { category: line.category } : {}),
    ...(line.budget !== undefined ? { budget: line.budget } : {}),
    ...(line.procurementMethod !== undefined ? { procurementMethod: line.procurementMethod } : {}),
    ...(line.sourceOfFunds !== undefined ? { sourceOfFunds: line.sourceOfFunds } : {}),
    ...(line.expectedCompletionDate !== undefined ? { expectedCompletionDate: dateInput(line.expectedCompletionDate) } : {}),
    ...(line.status !== undefined ? { status: line.status } : {}),
    ...(line.planState !== undefined ? { planState: line.planState } : {}),
    ...(line.notes !== undefined ? { notes: line.notes || null } : {}),
    ...(line.customValues !== undefined ? { customValues: line.customValues as Prisma.InputJsonObject } : {}),
    ...(line.metadata !== undefined ? { metadata: line.metadata as Prisma.InputJsonObject } : {})
  };
}

function normalizeCategoryInputs(categories: string[]) {
  const seen = new Set<string>();
  return categories
    .map((category) => category.trim())
    .filter(Boolean)
    .filter((category) => {
      const key = category.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function generateTenderReference(type: TenderType) {
  const prefix = type === TenderType.WORKS ? 'WRK' : type === TenderType.SERVICE ? 'SVC' : type === TenderType.CONSULTANCY ? 'CNS' : 'GDS';
  const year = new Date().getUTCFullYear();
  const stamp = Date.now().toString(36).toUpperCase();
  const suffix = randomBytes(2).toString('hex').toUpperCase();
  return `PX-${prefix}-${year}-${stamp}-${suffix}`;
}

function tenderDateInput(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T00:00:00.000Z`);
  return new Date(value);
}

function isUniqueConstraintError(error: unknown) {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: unknown }).code === 'P2002');
}

function dateInput(value: string | undefined) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

function dateOnly(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : '';
}

function decimalToNumber(value: unknown) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function objectPayload(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function stringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, typeof item === 'string' ? item : String(item ?? '')])
  );
}
