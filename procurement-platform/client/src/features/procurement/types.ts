import type { Tender } from '@/shared/types/domain';

export type ProcurementTender = Tender;

export type CreateTenderProcurementTypeId = 'goods' | 'works' | 'services' | 'consultancy';

export type CreateTenderDraftStatus = 'DRAFT' | 'SUBMITTED' | 'PUBLISHED';

export type CreateTenderRequirementControl = {
  id: string;
  label: string;
  help?: string;
  kind: 'text' | 'textarea' | 'select' | 'number' | 'date';
  options?: string[];
};

export type CreateTenderRequirementTemplate = {
  id: string;
  typeId: CreateTenderProcurementTypeId;
  title: string;
  description: string;
  controls: CreateTenderRequirementControl[];
};

export type CreateTenderEvaluationCriterion = {
  id: string;
  label: string;
  weight: number;
  notes: string;
  suggestedFor: CreateTenderProcurementTypeId[];
};

export type CreateTenderSetup = {
  procurementTypes: Array<{ id: CreateTenderProcurementTypeId; label: string; description: string }>;
  categories: Record<CreateTenderProcurementTypeId, string[]>;
  fundingSources: string[];
  currencies: string[];
  procurementMethods: string[];
  regulatoryLicenses: Record<CreateTenderProcurementTypeId, string[]>;
  requirementTemplates: CreateTenderRequirementTemplate[];
  evaluationCatalog: CreateTenderEvaluationCriterion[];
  milestoneDefaults: string[];
};

export type CreateTenderContact = {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
};

export type CreateTenderLineItem = {
  id: string;
  description: string;
  quantity: string;
  unit: string;
  unitPrice?: string;
};

export type CreateTenderMilestone = {
  id: string;
  label: string;
  dueDate: string;
};

export type CreateTenderConfirmationId = 'accuracy' | 'compliance' | 'evaluation' | 'publication';

export type CreateTenderDraft = {
  id: string;
  status: CreateTenderDraftStatus;
  title: string;
  reference: string;
  description: string;
  procuringEntity: string;
  fundingSource: string;
  customFundingSource: string;
  currency: string;
  estimatedBudget: string;
  contact: CreateTenderContact;
  submissionDate: string;
  openingDate: string;
  clarificationDeadline: string;
  publicationDate: string;
  location: string;
  procurementTypeId: CreateTenderProcurementTypeId;
  categories: string[];
  method: string;
  invitedSuppliers: string[];
  requirements: Record<string, string>;
  selectedLicenses: string[];
  commercialItems: CreateTenderLineItem[];
  deliverables: string[];
  attachments: string[];
  milestones: CreateTenderMilestone[];
  evaluationCriteria: CreateTenderEvaluationCriterion[];
  confirmations: Record<CreateTenderConfirmationId, boolean>;
  planFilledFields: string[];
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  publishedAt?: string;
};

export type CreateTenderSubmissionResult = {
  tenderId: string;
  reference: string;
  status: 'PASSED';
  submittedAt: string;
};

export type MarketplaceTenderRow = Tender & {
  saved?: boolean;
  hasDraftBid?: boolean;
  hasSubmittedBid?: boolean;
};

export type MyTenderRow = {
  id: string;
  title: string;
  section: 'draft' | 'posted' | 'completed';
  status: string;
  type: Tender['type'];
  tender?: Tender;
  lastActivity: string;
  actionLabel: string;
  nav: string;
};

export type MyBidRow = {
  id: string;
  title: string;
  section: 'draft' | 'submitted';
  status: string;
  tender: Tender;
  tenderReference: string;
  amount?: string;
  receiptHash?: string;
  lastActivity: string;
  actionLabel: string;
  nav: string;
};

export type MarketplacePayload = {
  tenders: MarketplaceTenderRow[];
  myTenders: MyTenderRow[];
  myBids: MyBidRow[];
};
