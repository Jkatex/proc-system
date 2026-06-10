import type { CreateTenderDraft, CreateTenderEvaluationCriterion, CreateTenderProcurementTypeId, CreateTenderSetup } from './types';

export const createTenderSetup: CreateTenderSetup = {
  procurementTypes: [
    { id: 'goods', label: 'Goods', description: 'Physical items, equipment, stock, and supplies.' },
    { id: 'works', label: 'Works', description: 'Construction, rehabilitation, infrastructure, and civil works.' },
    { id: 'services', label: 'Non Consultancy', description: 'Operational services where advisory expertise is not the main component.' },
    { id: 'consultancy', label: 'Consultancy', description: 'Professional advisory, research, design, audit, and expert assignments.' }
  ],
  categories: {
    goods: [
      'Medical equipment',
      'Computer equipment and accessories',
      'Motor vehicles',
      'Water meters and spare parts',
      'Construction materials',
      'Classroom furniture',
      'Telecommunication equipment',
      'Cleaning equipment and supplies'
    ],
    works: [
      'Healthcare infrastructure',
      'Roads and bridges',
      'Water supply works',
      'Building construction',
      'Electrical works',
      'Civil works',
      'Mechanical installations',
      'Renovation and finishing'
    ],
    services: [
      'Facilities maintenance',
      'Security services',
      'Cleaning services',
      'Transport and logistics',
      'Catering services',
      'ICT support',
      'Waste management',
      'Training services'
    ],
    consultancy: [
      'Feasibility study',
      'Engineering design',
      'Audit services',
      'Legal advisory',
      'Environmental assessment',
      'Project management',
      'Research services',
      'Training consultancy'
    ]
  },
  fundingSources: ['Government budget', 'Development partner grant', 'Internally generated funds', 'Project loan', 'Corporate operating budget', 'Other'],
  currencies: ['TZS', 'USD', 'EUR', 'GBP'],
  procurementMethods: ['Open Tender', 'Invited Tender', 'Restricted Tender', 'Framework Call-Off'],
  regulatoryLicenses: {
    goods: ['Manufacturer authorization', 'Product certification', 'Tax clearance', 'Business license'],
    works: ['Contractor registration', 'Site safety plan', 'Environmental compliance', 'Tax clearance'],
    services: ['Service provider license', 'Labour compliance', 'Insurance certificate', 'Tax clearance'],
    consultancy: ['Professional registration', 'Firm registration', 'Conflict of interest declaration', 'Tax clearance']
  },
  milestoneDefaults: ['Tender publication', 'Clarification deadline', 'Bid submission deadline', 'Opening session', 'Evaluation completion'],
  requirementTemplates: [
    {
      id: 'goods-specification',
      typeId: 'goods',
      title: 'Quantity Schedule and Product Specifications',
      description: 'Capture the bill of quantities, delivery expectations, warranty, and technical standards.',
      controls: [
        { id: 'goods_specifications', label: 'Technical specifications', kind: 'textarea' },
        { id: 'goods_delivery', label: 'Delivery location and schedule', kind: 'textarea' },
        { id: 'goods_warranty', label: 'Warranty and after-sales support', kind: 'textarea' },
        { id: 'goods_standard', label: 'Applicable product standard', kind: 'text' }
      ]
    },
    {
      id: 'works-scope',
      typeId: 'works',
      title: 'Works Scope, Site, and BOQ',
      description: 'Define the work package, site obligations, drawings, method statements, and construction schedule.',
      controls: [
        { id: 'works_scope', label: 'Scope of works', kind: 'textarea' },
        { id: 'works_site', label: 'Site location and access notes', kind: 'textarea' },
        { id: 'works_boq', label: 'BOQ and pricing instructions', kind: 'textarea' },
        { id: 'works_completion', label: 'Expected completion period', kind: 'text' }
      ]
    },
    {
      id: 'services-levels',
      typeId: 'services',
      title: 'Service Scope and Service Levels',
      description: 'Describe recurring services, resources, response standards, reporting, and governance.',
      controls: [
        { id: 'services_scope', label: 'Service scope', kind: 'textarea' },
        { id: 'services_sla', label: 'Service levels and response time', kind: 'textarea' },
        { id: 'services_staffing', label: 'Staffing and supervision requirements', kind: 'textarea' },
        { id: 'services_reporting', label: 'Reporting frequency', kind: 'select', options: ['Weekly', 'Monthly', 'Quarterly', 'On completion'] }
      ]
    },
    {
      id: 'consultancy-tor',
      typeId: 'consultancy',
      title: 'Terms of Reference and Deliverables',
      description: 'Set the assignment objective, methodology, team qualifications, deliverables, and reporting structure.',
      controls: [
        { id: 'consultancy_objective', label: 'Assignment objective', kind: 'textarea' },
        { id: 'consultancy_methodology', label: 'Methodology expectations', kind: 'textarea' },
        { id: 'consultancy_team', label: 'Key expert qualifications', kind: 'textarea' },
        { id: 'consultancy_reports', label: 'Reports and deliverables', kind: 'textarea' }
      ]
    }
  ],
  evaluationCatalog: [
    { id: 'technical-compliance', label: 'Technical compliance', weight: 35, notes: 'Meets mandatory specifications and response format.', suggestedFor: ['goods', 'works', 'services', 'consultancy'] },
    { id: 'experience', label: 'Relevant experience', weight: 20, notes: 'Comparable contracts, references, and sector familiarity.', suggestedFor: ['goods', 'works', 'services', 'consultancy'] },
    { id: 'delivery-capacity', label: 'Delivery capacity', weight: 20, notes: 'Resources, schedule, staffing, and implementation plan.', suggestedFor: ['goods', 'works', 'services'] },
    { id: 'price', label: 'Financial offer', weight: 25, notes: 'Evaluated price and commercial completeness.', suggestedFor: ['goods', 'works', 'services', 'consultancy'] },
    { id: 'methodology', label: 'Methodology and work plan', weight: 30, notes: 'Approach, quality assurance, and deliverable management.', suggestedFor: ['consultancy', 'services', 'works'] },
    { id: 'key-experts', label: 'Key expert qualifications', weight: 25, notes: 'Professional qualifications and role-specific experience.', suggestedFor: ['consultancy'] }
  ]
};

export function createEmptyTenderDraft(now = new Date()): CreateTenderDraft {
  const timestamp = now.toISOString();
  return {
    id: `draft-${now.getTime()}`,
    status: 'DRAFT',
    title: '',
    reference: `PX-DRAFT-${now.getFullYear()}-${String(now.getTime()).slice(-5)}`,
    description: '',
    procuringEntity: '',
    fundingSource: '',
    customFundingSource: '',
    currency: 'TZS',
    estimatedBudget: '',
    contact: { name: '', role: '', department: '', email: '', phone: '', verifiedEmail: false, verifiedPhone: false },
    submissionDate: '',
    openingDate: '',
    clarificationDeadline: '',
    publicationDate: '',
    location: '',
    procurementTypeId: 'goods',
    categories: [],
    method: 'Open Tender',
    invitedSuppliers: [],
    requirements: {},
    selectedLicenses: [],
    commercialItems: [],
    deliverables: [],
    attachments: [],
    milestones: createTenderSetup.milestoneDefaults.map((label, index) => ({ id: `milestone-${index + 1}`, label, dueDate: '' })),
    evaluationCriteria: getSuggestedCriteria('goods'),
    confirmations: { accuracy: false, compliance: false, evaluation: false, publication: false },
    planFilledFields: [],
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function getSuggestedCriteria(typeId: CreateTenderProcurementTypeId): CreateTenderEvaluationCriterion[] {
  const suggested = createTenderSetup.evaluationCatalog.filter((criterion) => criterion.suggestedFor.includes(typeId)).slice(0, 4);
  const total = suggested.reduce((sum, criterion) => sum + criterion.weight, 0);
  return suggested.map((criterion) => ({ ...criterion, weight: Math.round((criterion.weight / total) * 100) }));
}

export function toTenderType(typeId: CreateTenderProcurementTypeId) {
  if (typeId === 'services') return 'SERVICE' as const;
  return typeId.toUpperCase() as 'GOODS' | 'WORKS' | 'CONSULTANCY';
}
