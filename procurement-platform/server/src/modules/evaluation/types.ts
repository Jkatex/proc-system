import type { EvaluationStatus, TenderType } from '@prisma/client';

export const moduleDefinition = {
  key: 'evaluation',
  name: 'Evaluation',
  description: 'Evaluation workspaces, criteria, workflow assignments, scores, recommendations, and approvals.'
} as const;

export type ModuleStatus = {
  key: string;
  name: string;
  status: 'ready';
  description: string;
};

export type EvaluationDashboardDto = {
  publishedTenders: number;
  readyToEvaluate: number;
  draftedEvaluations: number;
  lockedUntilClosing: number;
  totalRecords: number;
};

export type EvaluationRecordDto = {
  id: string;
  tenderId: string;
  reference: string;
  title: string;
  buyerName: string;
  procurementType: string;
  status: string;
  currentStage: string | null;
  progressPercentage: number;
  recommendationStatus: string | null;
  submittedBidCount: number;
  closingDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EvaluationRecordsResponseDto = {
  records: EvaluationRecordDto[];
  totalRecords: number;
};

export type EvaluationDraftDto = {
  id: string;
  tenderId: string;
  reference: string;
  title: string;
  procurementType: string;
  currentStage: string | null;
  progressPercentage: number;
  submittedBidCount: number;
  updatedAt: string;
};

export type EvaluationDraftsResponseDto = {
  drafts: EvaluationDraftDto[];
};

export type ReadyEvaluationTenderDto = {
  tenderId: string;
  reference: string;
  title: string;
  buyerName: string;
  procurementType: string;
  closingDate: string;
  submittedBidCount: number;
};

export type ReadyEvaluationResponseDto = {
  tenders: ReadyEvaluationTenderDto[];
};

export type EvaluationRecordsQuery = {
  search: string;
  status: EvaluationStatus | 'all';
  type: TenderType | 'all';
};
