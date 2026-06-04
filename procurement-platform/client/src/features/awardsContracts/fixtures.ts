import type {
  ActiveContract,
  AwardQueueId,
  AwardWorkflowStep,
  ClosedContract,
  ContractAction,
  ContractTab,
  PostAwardTab,
  SupplierAward,
  SummaryCard,
  UrgentAction,
  PendingAward
} from './types';

export const awardQueueLabels: Record<AwardQueueId, string> = {
  'my-urgent-actions': 'My Urgent Actions',
  'awarding-in-progress': 'Awarding in Progress',
  'awards-received': 'Awards Received',
  'contracts-in-progress': 'Contracts in Progress',
  'active-contracts': 'Active Contracts',
  'closed-contracts': 'Closed Contracts'
};

export const pendingAwards: PendingAward[] = [
  {
    id: 'PX-WRK-2026-001',
    title: 'Construction of District Maternal Health Wing',
    reference: 'PX-WRK-2026-001',
    role: 'Buyer',
    procurementType: 'Works',
    evaluationStatus: 'Ready',
    recommendedSupplier: 'ABC Construction Ltd',
    awardStatus: 'Pending Award Decision',
    contractStatus: 'Draft Contract',
    progressStatus: 'Not saved',
    progressStep: 'Evaluation Results',
    progressDate: 'Jun 3, 2026',
    action: 'Continue Award'
  },
  {
    id: 'PX-WRK-2026-002',
    title: 'Rehabilitation of Rural Water Supply Network',
    reference: 'PX-WRK-2026-002',
    role: 'Buyer',
    procurementType: 'Works',
    evaluationStatus: 'Ready',
    recommendedSupplier: 'ABC Construction Ltd',
    awardStatus: 'Pending Award Decision',
    contractStatus: 'Draft Contract',
    progressStatus: 'Not saved',
    progressStep: 'Evaluation Results',
    progressDate: 'Jun 3, 2026',
    action: 'Continue Award'
  }
];

export const supplierAwards: SupplierAward[] = [
  {
    id: 'supplier-award-1',
    title: 'Supply of Laptops',
    buyer: 'ABC University',
    procurementType: 'Non Consultancy',
    awardValue: 25000000,
    currency: 'TZS',
    awardStatus: 'Awaiting Acceptance',
    contractStatus: 'Draft Contract',
    requiredAction: 'Accept Award',
    responseStatus: 'Current supplier response: Awaiting Response',
    documents: [
      { name: 'Performance Security', owner: 'Supplier', status: 'Pending Upload', action: 'Upload' },
      { name: 'Insurance Certificate', owner: 'Supplier', status: 'Pending Upload', action: 'Upload' },
      { name: 'Tax Clearance', owner: 'Supplier', status: 'Pending Upload', action: 'Upload' }
    ],
    activity: [
      { time: '2026-07-01 09:00', actor: 'ABC University', event: 'Award notice issued', status: 'Awaiting Acceptance' },
      { time: '2026-07-01 09:05', actor: 'ProcureX', event: 'Supplier response task created', status: 'Draft Contract' }
    ]
  },
  {
    id: 'supplier-award-2',
    title: 'Maintenance Services',
    buyer: 'City Council',
    procurementType: 'Non Consultancy',
    awardValue: 8000000,
    currency: 'TZS',
    awardStatus: 'Award Accepted',
    contractStatus: 'Draft Contract',
    requiredAction: 'Accept Award',
    responseStatus: 'Current supplier response: Award Accepted',
    documents: [
      { name: 'Bank Details', owner: 'Supplier', status: 'Pending Review', action: 'View' },
      { name: 'Insurance Certificate', owner: 'Supplier', status: 'Pending Upload', action: 'Upload' },
      { name: 'Authorized Signatory Details', owner: 'Supplier', status: 'Pending Upload', action: 'Upload' }
    ],
    activity: [
      { time: '2026-07-01 09:00', actor: 'City Council', event: 'Award notice issued', status: 'Award Accepted' },
      { time: '2026-07-01 09:10', actor: 'Supplier', event: 'Award accepted for contract preparation', status: 'Draft Contract' }
    ]
  },
  {
    id: 'supplier-award-3',
    title: 'Consultancy Assignment',
    buyer: 'Health Project',
    procurementType: 'Non Consultancy',
    awardValue: 15000000,
    currency: 'TZS',
    awardStatus: 'Terms Agreed',
    contractStatus: 'Draft Contract',
    requiredAction: 'Accept Award',
    responseStatus: 'Current supplier response: Terms Agreed',
    documents: [
      { name: 'Professional Indemnity Cover', owner: 'Supplier', status: 'Pending Review', action: 'View' },
      { name: 'Tax Clearance', owner: 'Supplier', status: 'Pending Upload', action: 'Upload' },
      { name: 'Authorized Signatory Details', owner: 'Supplier', status: 'Pending Upload', action: 'Upload' }
    ],
    activity: [
      { time: '2026-07-01 09:00', actor: 'Health Project', event: 'Award notice issued', status: 'Terms Agreed' },
      { time: '2026-07-01 09:05', actor: 'ProcureX', event: 'Supplier response task created', status: 'Sign Contract' }
    ]
  }
];

export const contractActions: ContractAction[] = [
  {
    id: 'contract-action-1',
    contract: 'Clinic Renovation Works',
    role: 'Buyer',
    otherParty: 'ABC Construction Ltd',
    status: 'Supplier Signed',
    requiredAction: 'Buyer Signature Required',
    dueDate: '2026-07-05',
    routeSearch: 'tab=signatures'
  },
  {
    id: 'contract-action-2',
    contract: 'Laptop Supply',
    role: 'Supplier',
    otherParty: 'ABC University',
    status: 'Contract Received',
    requiredAction: 'Review and Sign',
    dueDate: '2026-07-04',
    routeSearch: 'tab=signatures'
  },
  {
    id: 'contract-action-3',
    contract: 'Cleaning Services',
    role: 'Buyer',
    otherParty: 'Usafi Pro Services',
    status: 'Award Accepted',
    requiredAction: 'Generate Contract',
    dueDate: '2026-07-06',
    routeSearch: 'tab=overview'
  },
  {
    id: 'contract-action-4',
    contract: 'Rural Health Centers',
    role: 'Buyer',
    otherParty: 'ABC Construction Ltd',
    status: 'Change Requested',
    requiredAction: 'Review Supplier Request',
    dueDate: '2026-07-03',
    routeSearch: 'tab=negotiation'
  }
];

export const activeContracts: ActiveContract[] = [
  {
    id: 'active-contract-1',
    title: 'Rural Health Centers',
    role: 'Buyer',
    otherParty: 'ABC Construction Ltd',
    progress: 65,
    progressLabel: '65% In Progress',
    nextMilestone: 'MEP installations inspection',
    paymentStatus: 'Invoice Review'
  },
  {
    id: 'active-contract-2',
    title: 'ICT Equipment Supply',
    role: 'Supplier',
    otherParty: 'XYZ College',
    progress: 20,
    progressLabel: '20% Delivery Pending',
    nextMilestone: 'First batch delivery',
    paymentStatus: 'Not Invoiced'
  }
];

export const closedContracts: ClosedContract[] = [
  {
    id: 'closed-contract-1',
    title: 'Office Stationery Supply',
    role: 'Buyer',
    otherParty: 'Tanzania Stationers',
    finalValue: 12300000,
    currency: 'TZS',
    completionDate: '2026-03-15',
    performanceRating: '4.5/5',
    status: 'Completed'
  },
  {
    id: 'closed-contract-2',
    title: 'Network Cabling Works',
    role: 'Supplier',
    otherParty: 'North District Hospital',
    finalValue: 9100000,
    currency: 'TZS',
    completionDate: '2026-02-28',
    performanceRating: '4.2/5',
    status: 'Closed'
  }
];

export const urgentActions: UrgentAction[] = [
  ...pendingAwards.map((row) => ({
    id: `urgent-${row.id}`,
    priority: 'Medium',
    action: 'Continue Award',
    item: row.title,
    party: row.recommendedSupplier,
    dueDate: '2026-07-15',
    role: row.role,
    status: row.awardStatus,
    buttonLabel: 'Review',
    nav: 'award-recommendation',
    tenderId: row.id
  })),
  ...supplierAwards.map((row) => ({
    id: `urgent-${row.id}`,
    priority: 'Low',
    action: 'Accept Award',
    item: row.title,
    party: row.buyer,
    dueDate: '2026-07-04',
    role: 'Supplier' as const,
    status: row.contractStatus,
    buttonLabel: 'Respond',
    nav: 'award-response',
    routeSearch: `award=${row.id}`,
    tenderId: row.id
  })),
  ...contractActions.map((row) => ({
    id: `urgent-${row.id}`,
    priority: row.requiredAction.includes('Signature') ? 'High' : 'Medium',
    action: row.requiredAction,
    item: row.contract,
    party: row.otherParty,
    dueDate: row.dueDate,
    role: row.role,
    status: row.status,
    buttonLabel: 'Review',
    nav: 'contract-negotiation',
    routeSearch: row.routeSearch
  })),
  {
    id: 'urgent-invoice',
    priority: 'High',
    action: 'Payment certificate pending approval',
    item: 'MEP Installations Invoice',
    party: 'Supplier',
    dueDate: '3 days',
    role: 'Buyer',
    status: 'Blocked',
    buttonLabel: 'Review',
    nav: 'post-award-tracking',
    routeSearch: 'mode=active&tab=payments'
  },
  {
    id: 'urgent-milestone-overdue',
    priority: 'Medium',
    action: 'Active contract milestone overdue',
    item: 'MEP installations inspection',
    party: 'ABC Construction Ltd',
    dueDate: 'Overdue',
    role: 'Buyer',
    status: 'Action Required',
    buttonLabel: 'Track',
    nav: 'post-award-tracking',
    routeSearch: 'mode=active&tab=milestones'
  },
  {
    id: 'urgent-variation-buyer',
    priority: 'High',
    action: 'Buyer decision required',
    item: 'Extension of Time for Imported Equipment',
    party: 'Supplier',
    dueDate: '4 days',
    role: 'Buyer',
    status: 'Under Review',
    buttonLabel: 'Review',
    nav: 'post-award-tracking',
    routeSearch: 'mode=active&tab=variations'
  },
  {
    id: 'urgent-variation-supplier',
    priority: 'High',
    action: 'Supplier review required',
    item: 'Additional Drainage Works',
    party: 'Buyer',
    dueDate: '6 days',
    role: 'Supplier',
    status: 'Draft Variation',
    buttonLabel: 'Review',
    nav: 'post-award-tracking',
    routeSearch: 'mode=active&tab=variations'
  }
];

export const summaryCards: SummaryCard[] = [
  {
    queue: 'my-urgent-actions',
    label: 'My Urgent Actions',
    value: urgentActions.length,
    detail: 'All buyer and supplier actions needing attention',
    trend: '!'
  },
  {
    queue: 'awarding-in-progress',
    label: 'Awarding in Progress',
    value: pendingAwards.length,
    detail: 'Buyer-side tenders moving from evaluation results to draft contract',
    trend: 'Up'
  },
  {
    queue: 'awards-received',
    label: 'Awards Received',
    value: supplierAwards.length,
    detail: 'Supplier-side awards awaiting response, review, or signature',
    trend: 'Next'
  },
  {
    queue: 'contracts-in-progress',
    label: 'Contracts in Progress',
    value: contractActions.length,
    detail: 'Drafting, review, negotiation, approval, and signing actions',
    trend: 'Due'
  },
  {
    queue: 'active-contracts',
    label: 'Active Contracts',
    value: activeContracts.length,
    detail: 'Signed contracts under delivery and payment tracking',
    trend: 'Live'
  },
  {
    queue: 'closed-contracts',
    label: 'Closed Contracts',
    value: closedContracts.length,
    detail: 'Completed, terminated, or archived contract records',
    trend: 'Done'
  }
];

export const awardWorkflowSteps: AwardWorkflowStep[] = [
  { id: 'evaluation-result', title: 'Evaluation Results', shortTitle: 'Evaluation Results', status: 'Evaluation completed' },
  { id: 'award-decision', title: 'Award Decision', shortTitle: 'Award Decision', status: 'Award Decision Pending' },
  { id: 'approval', title: 'Approval', shortTitle: 'Approval', status: 'Approval pending' },
  { id: 'award-notification', title: 'Notice Preparation', shortTitle: 'Notices', status: 'Required notices pending' },
  { id: 'standstill-period', title: 'Standstill & Complaints', shortTitle: 'Standstill', status: 'Contract blocked' },
  { id: 'supplier-acceptance', title: 'Supplier Acceptance', shortTitle: 'Acceptance', status: 'Awaiting supplier response' },
  { id: 'pre-contract-documents', title: 'Pre-Contract Documents', shortTitle: 'Documents', status: 'Documents pending' },
  { id: 'draft-contract', title: 'Draft Contract', shortTitle: 'Draft Contract', status: 'Blocked' }
];

export const contractTabs: ContractTab[] = [
  { id: 'overview', label: 'Draft Contract' },
  { id: 'buyer-review', label: 'Buyer Review' },
  { id: 'supplier-review', label: 'Supplier Review' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'legal-review', label: 'Legal Review' },
  { id: 'final-approval', label: 'Final Approval' },
  { id: 'signatures', label: 'Signatures' },
  { id: 'activity', label: 'Activity' }
];

export const postAwardTabs: PostAwardTab[] = [
  { id: 'milestones', label: 'Delivery / Milestones' },
  { id: 'payments', label: 'Invoices & Payments' },
  { id: 'issues', label: 'Issues' },
  { id: 'variations', label: 'Variations' },
  { id: 'closure', label: 'Closure' },
  { id: 'performance', label: 'Performance' }
];

export const awardContractSteps = awardWorkflowSteps.map((step) => step.id);
