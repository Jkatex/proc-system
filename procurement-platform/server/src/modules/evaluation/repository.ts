import {
  BidStatus,
  EvaluationStatus,
  TenderStatus,
  type Prisma,
  type PrismaClient
} from '@prisma/client';
import { prisma } from '../../db/prisma.js';
import type { EvaluationRecordsQuery } from './types.js';

const publishedTenderStatuses = [
  TenderStatus.PUBLISHED,
  TenderStatus.OPEN,
  TenderStatus.CLOSED,
  TenderStatus.EVALUATION
] as const;

const lockableTenderStatuses = [TenderStatus.PUBLISHED, TenderStatus.OPEN] as const;

const draftEvaluationStatuses = [EvaluationStatus.IN_PROGRESS, EvaluationStatus.RETURNED] as const;

function readyTenderWhere(now: Date): Prisma.TenderWhereInput {
  return {
    status: { in: [...publishedTenderStatuses] },
    closingDate: { lte: now },
    bids: {
      some: {
        status: BidStatus.SUBMITTED
      }
    },
    OR: [
      {
        evaluation: {
          is: null
        }
      },
      {
        evaluation: {
          is: {
            status: {
              not: EvaluationStatus.COMPLETED
            }
          }
        }
      }
    ]
  };
}

function lockedTenderWhere(now: Date): Prisma.TenderWhereInput {
  return {
    status: { in: [...lockableTenderStatuses] },
    closingDate: { gt: now }
  };
}

function draftEvaluationWhere(): Prisma.EvaluationWorkspaceWhereInput {
  return {
    status: { in: [...draftEvaluationStatuses] },
    scores: {
      some: {}
    }
  };
}

function recordsWhere(query: EvaluationRecordsQuery): Prisma.EvaluationWorkspaceWhereInput {
  const tenderWhere: Prisma.TenderWhereInput = {};

  if (query.search) {
    tenderWhere.OR = [
      { reference: { contains: query.search, mode: 'insensitive' } },
      { title: { contains: query.search, mode: 'insensitive' } },
      { buyerOrg: { name: { contains: query.search, mode: 'insensitive' } } }
    ];
  }

  if (query.type !== 'all') {
    tenderWhere.type = query.type;
  }

  const where: Prisma.EvaluationWorkspaceWhereInput = {};

  if (query.status !== 'all') {
    where.status = query.status;
  }

  if (Object.keys(tenderWhere).length > 0) {
    where.tender = {
      is: tenderWhere
    };
  }

  return where;
}

export class ModuleRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  async health() {
    return { ready: true };
  }

  async getDashboardData(now = new Date()) {
    return Promise.all([
      this.db.tender.count({
        where: {
          status: {
            in: [...publishedTenderStatuses]
          }
        }
      }),
      this.db.tender.count({
        where: readyTenderWhere(now)
      }),
      this.db.evaluationWorkspace.count({
        where: draftEvaluationWhere()
      }),
      this.db.tender.count({
        where: lockedTenderWhere(now)
      }),
      this.db.evaluationWorkspace.count()
    ]);
  }

  async listRecords(query: EvaluationRecordsQuery) {
    const where = recordsWhere(query);
    const [records, totalRecords] = await Promise.all([
      this.db.evaluationWorkspace.findMany({
        where,
        orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
        take: 50,
        include: {
          tender: {
            select: {
              id: true,
              reference: true,
              title: true,
              type: true,
              closingDate: true,
              buyerOrg: {
                select: {
                  name: true
                }
              },
              bids: {
                where: {
                  status: BidStatus.SUBMITTED
                },
                select: {
                  id: true
                }
              }
            }
          },
          recommendations: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1,
            select: {
              status: true
            }
          }
        }
      }),
      this.db.evaluationWorkspace.count({ where })
    ]);

    return { records, totalRecords };
  }

  async listDrafts() {
    return this.db.evaluationWorkspace.findMany({
      where: draftEvaluationWhere(),
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      take: 50,
      include: {
        tender: {
          select: {
            id: true,
            reference: true,
            title: true,
            type: true,
            bids: {
              where: {
                status: BidStatus.SUBMITTED
              },
              select: {
                id: true
              }
            }
          }
        }
      }
    });
  }

  async listReadyTenders(now = new Date()) {
    return this.db.tender.findMany({
      where: readyTenderWhere(now),
      orderBy: [{ closingDate: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 50,
      select: {
        id: true,
        reference: true,
        title: true,
        type: true,
        closingDate: true,
        buyerOrg: {
          select: {
            name: true
          }
        },
        bids: {
          where: {
            status: BidStatus.SUBMITTED
          },
          select: {
            id: true
          }
        }
      }
    });
  }
}
