export type ProcurementPlanningColumnType = 'text' | 'select' | 'date' | 'number';

export type ProcurementPlanningColumn = {
  id: string;
  label: string;
  type: ProcurementPlanningColumnType;
  options?: string[];
  custom?: boolean;
};

export type ProcurementPlanningRecord = {
  id: string;
  financialYear: string;
  tenderTitle: string;
  openingDate: string;
  closingDate: string;
  category: string;
  budget: number;
  procurementMethod: string;
  sourceOfFunds: string;
  expectedCompletionDate: string;
  status: string;
  planState: string;
  notes: string;
  customValues?: Record<string, string>;
};

export type ProcurementPlanningStatusTone = 'info' | 'success' | 'warning';

export type ProcurementPlanningStatus = {
  value: string;
  label: string;
  description: string;
  page: string;
  tone: ProcurementPlanningStatusTone;
};

export type PlanningRouteView = 'front' | 'create' | 'full' | 'detail';

export type PlanningEditorRow = {
  id: string;
  values: Record<string, string>;
};
