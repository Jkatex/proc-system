export type EvaluationStatusFilter = 'all' | 'NOT_STARTED' | 'IN_PROGRESS' | 'LOCKED' | 'COMPLETED' | 'RETURNED';

export type ProcurementTypeFilter = 'all' | 'GOODS' | 'WORKS' | 'SERVICE' | 'CONSULTANCY';

export type EvaluationDashboard = {
  publishedTenders: number;
  readyToEvaluate: number;
  draftedEvaluations: number;
  lockedUntilClosing: number;
  totalRecords: number;
};

export type EvaluationRecord = {
  id: string;
  tenderId: string;
  reference: string;
  title: string;
  buyerName: string;
  procurementType: Exclude<ProcurementTypeFilter, 'all'>;
  status: Exclude<EvaluationStatusFilter, 'all'>;
  currentStage: string | null;
  progressPercentage: number;
  recommendationStatus: string | null;
  submittedBidCount: number;
  closingDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EvaluationRecordsResponse = {
  records: EvaluationRecord[];
  totalRecords: number;
};

export type EvaluationDraft = {
  id: string;
  tenderId: string;
  reference: string;
  title: string;
  procurementType: Exclude<ProcurementTypeFilter, 'all'>;
  currentStage: string | null;
  progressPercentage: number;
  submittedBidCount: number;
  updatedAt: string;
};

export type EvaluationDraftsResponse = {
  drafts: EvaluationDraft[];
};

export type ReadyEvaluationTender = {
  tenderId: string;
  reference: string;
  title: string;
  buyerName: string;
  procurementType: Exclude<ProcurementTypeFilter, 'all'>;
  closingDate: string;
  submittedBidCount: number;
};

export type ReadyEvaluationResponse = {
  tenders: ReadyEvaluationTender[];
};

export type EvaluationRecordsQuery = {
  search: string;
  status: EvaluationStatusFilter;
  type: ProcurementTypeFilter;
};
