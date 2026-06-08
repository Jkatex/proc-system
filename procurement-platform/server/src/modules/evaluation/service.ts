import { ModuleRepository } from './repository.js';
import {
  moduleDefinition,
  type EvaluationDashboardDto,
  type EvaluationDraftsResponseDto,
  type EvaluationRecordsQuery,
  type EvaluationRecordsResponseDto,
  type ModuleStatus,
  type ReadyEvaluationResponseDto
} from './types.js';

export class ModuleService {
  constructor(private readonly repository = new ModuleRepository()) {}

  async status(): Promise<ModuleStatus> {
    await this.repository.health();

    return {
      ...moduleDefinition,
      status: 'ready'
    };
  }

  async dashboard(): Promise<EvaluationDashboardDto> {
    try {
      const [publishedTenders, readyToEvaluate, draftedEvaluations, lockedUntilClosing, totalRecords] = await this.repository.getDashboardData();

      return {
        publishedTenders,
        readyToEvaluate,
        draftedEvaluations,
        lockedUntilClosing,
        totalRecords
      };
    } catch (error) {
      if (isDatabaseUnavailable(error)) return emptyDashboard;
      throw error;
    }
  }

  async records(query: EvaluationRecordsQuery): Promise<EvaluationRecordsResponseDto> {
    try {
      const data = await this.repository.listRecords(query);

      return {
        totalRecords: data.totalRecords,
        records: data.records.map((record) => ({
          id: record.id,
          tenderId: record.tender.id,
          reference: record.tender.reference,
          title: record.tender.title,
          buyerName: record.tender.buyerOrg.name,
          procurementType: record.tender.type,
          status: record.status,
          currentStage: record.currentStage,
          progressPercentage: record.progress,
          recommendationStatus: record.recommendations[0]?.status ?? null,
          submittedBidCount: record.tender.bids.length,
          closingDate: record.tender.closingDate?.toISOString() ?? null,
          createdAt: record.createdAt.toISOString(),
          updatedAt: record.updatedAt.toISOString()
        }))
      };
    } catch (error) {
      if (isDatabaseUnavailable(error)) return { records: [], totalRecords: 0 };
      throw error;
    }
  }

  async drafts(): Promise<EvaluationDraftsResponseDto> {
    try {
      const drafts = await this.repository.listDrafts();

      return {
        drafts: drafts.map((draft) => ({
          id: draft.id,
          tenderId: draft.tender.id,
          reference: draft.tender.reference,
          title: draft.tender.title,
          procurementType: draft.tender.type,
          currentStage: draft.currentStage,
          progressPercentage: draft.progress,
          submittedBidCount: draft.tender.bids.length,
          updatedAt: draft.updatedAt.toISOString()
        }))
      };
    } catch (error) {
      if (isDatabaseUnavailable(error)) return { drafts: [] };
      throw error;
    }
  }

  async ready(): Promise<ReadyEvaluationResponseDto> {
    try {
      const tenders = await this.repository.listReadyTenders();

      return {
        tenders: tenders.map((tender) => ({
          tenderId: tender.id,
          reference: tender.reference,
          title: tender.title,
          buyerName: tender.buyerOrg.name,
          procurementType: tender.type,
          closingDate: tender.closingDate?.toISOString() ?? '',
          submittedBidCount: tender.bids.length
        }))
      };
    } catch (error) {
      if (isDatabaseUnavailable(error)) return { tenders: [] };
      throw error;
    }
  }
}

const emptyDashboard: EvaluationDashboardDto = {
  publishedTenders: 0,
  readyToEvaluate: 0,
  draftedEvaluations: 0,
  lockedUntilClosing: 0,
  totalRecords: 0
};

function isDatabaseUnavailable(error: unknown) {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code)
      : '';
  const message = error instanceof Error ? error.message.toLowerCase() : '';

  return code === 'P1001' || code === 'P2024' || message.includes("can't reach database") || message.includes('database_url');
}
