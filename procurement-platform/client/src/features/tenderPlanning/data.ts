import type { ProcurementPlanningColumn, ProcurementPlanningRecord, ProcurementPlanningStatus } from './types';

export const procurementPlanningStorageKey = 'procurex.procurementPlans.v4';
export const procurementPlanningSelectedTenderKey = 'procurex.planning.selectedTenderPlan';
export const procurementPlanningCreateTenderDraftKey = 'procurex.createTender.v2.savedDraft';
export const procurementPlanningMilestoneKey = 'procurex.createTender.v2.milestones';

export const procurementPlanningDefaultColumns: ProcurementPlanningColumn[] = [
  { id: 'tenderTitle', label: 'Tender Title', type: 'text' },
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: ['Goods', 'Works', 'Non Consultancy', 'Consultancy']
  },
  {
    id: 'procurementMethod',
    label: 'Procurement Method',
    type: 'select',
    options: ['Open Tender', 'Invited Tender', 'RFQ', 'Framework', 'Single Source']
  },
  { id: 'openingDate', label: 'Opening Date', type: 'date' },
  { id: 'closingDate', label: 'Closing Date', type: 'date' },
  {
    id: 'sourceOfFunds',
    label: 'Source of Funds',
    type: 'select',
    options: ['Government of Tanzania', 'Own Source', 'Donor Funded', 'Development Partner', 'Loan', 'Grant', 'Other']
  },
  { id: 'budget', label: 'Budget', type: 'number' },
  { id: 'expectedCompletionDate', label: 'Expected Completion Date', type: 'date' }
];

export const procurementPlanningCreateColumns = procurementPlanningDefaultColumns.filter((column) =>
  ['tenderTitle', 'category', 'procurementMethod', 'openingDate', 'closingDate'].includes(column.id)
);

export const procurementPlanningStatuses: ProcurementPlanningStatus[] = [
  { value: 'Inactive', label: 'Not Open', description: 'This tender has not opened yet.', page: '', tone: 'info' },
  {
    value: 'Draft planning',
    label: 'Not Open',
    description: 'Tender details are still being prepared from the plan.',
    page: 'create-tender',
    tone: 'warning'
  },
  {
    value: 'Opened',
    label: 'Marketplace',
    description: 'This tender is open in the marketplace.',
    page: 'marketplace',
    tone: 'success'
  },
  {
    value: 'In evaluation',
    label: 'Evaluation',
    description: 'This tender is in bid evaluation.',
    page: 'bid-evaluation',
    tone: 'warning'
  },
  {
    value: 'Contract management',
    label: 'Contract',
    description: 'This tender is in contract negotiation.',
    page: 'contract-negotiation',
    tone: 'info'
  },
  {
    value: 'Awarded',
    label: 'Awarding',
    description: 'This tender is in award and contract processing.',
    page: 'awarding-contracts',
    tone: 'success'
  },
  {
    value: 'Finished',
    label: 'Records',
    description: 'This tender is closed and archived in records.',
    page: 'records-history',
    tone: 'success'
  }
];

export const procurementPlanningSeedRecords: ProcurementPlanningRecord[] = [
  {
    id: 'plan-2026-well',
    financialYear: '2026/2027',
    tenderTitle: 'Construction of community water wells',
    openingDate: '2026-08-01',
    closingDate: '2026-08-30',
    category: 'Works',
    budget: 480000000,
    procurementMethod: 'Open Tender',
    sourceOfFunds: 'Development budget',
    expectedCompletionDate: '2026-12-15',
    status: 'Draft planning',
    planState: 'Planning begun',
    notes: 'Specifications cleared for tender creation'
  },
  {
    id: 'plan-2026-fleet',
    financialYear: '2026/2027',
    tenderTitle: 'Fleet maintenance framework agreement',
    openingDate: '2026-07-20',
    closingDate: '2026-08-12',
    category: 'Non Consultancy',
    budget: 125000000,
    procurementMethod: 'Framework',
    sourceOfFunds: 'Operational budget',
    expectedCompletionDate: '2026-09-18',
    status: 'Inactive',
    planState: 'Not started',
    notes: 'Funding shortfall under finance review'
  },
  {
    id: 'plan-2026-renovation',
    financialYear: '2026/2027',
    tenderTitle: 'Ward renovation works',
    openingDate: '2026-09-04',
    closingDate: '2026-10-03',
    category: 'Works',
    budget: 760000000,
    procurementMethod: 'Open Tender',
    sourceOfFunds: 'Capital projects',
    expectedCompletionDate: '2027-01-20',
    status: 'In evaluation',
    planState: 'Planning ended',
    notes: 'Board minutes pending'
  },
  {
    id: 'plan-2025-helpdesk',
    financialYear: '2025/2026',
    tenderTitle: 'ICT helpdesk support services',
    openingDate: '2025-08-10',
    closingDate: '2025-08-24',
    category: 'Non Consultancy',
    budget: 94000000,
    procurementMethod: 'RFQ',
    sourceOfFunds: 'Operational budget',
    expectedCompletionDate: '2025-09-21',
    status: 'Finished',
    planState: 'Done',
    notes: 'Contract issued and archived'
  }
];

export const pageToRoute: Record<string, string> = {
  'account-profile': '/identity/profile',
  'tender-planning': '/tender-planning',
  marketplace: '/procurement/marketplace',
  'communication-center': '/communication',
  'bid-evaluation': '/evaluation',
  'awarding-contracts': '/awards-contracts',
  'contract-negotiation': '/awards-contracts/negotiation',
  'records-history': '/records',
  'create-tender': '/procurement/create-tender',
  'workspace-dashboard': '/dashboard',
  'sign-in': '/sign-in'
};
