// Create Tender Page Component (Buyer procurement design wizard)

function getCreateTenderSetup() {
    const fallbackTypes = [
        {
            id: 'works',
            label: 'Works',
            description: 'Construction and infrastructure projects.',
            categories: ['Healthcare infrastructure']
        }
    ];
    const setup = mockData.procurementSetup || {};
    const types = Array.isArray(setup.types) && setup.types.length ? setup.types : fallbackTypes;
    const methods = ['Open Tender', 'Invited Tender'];
    const defaultType = types.find(type => type.id === setup.defaultType) || types[0];

    return { types, methods, defaultType };
}

const createTenderOtherCategoryLabel = 'Other';
const createTenderOpenMethod = 'Open Tender';
const createTenderClosedMethod = 'Invited Tender';

function renderCreateTenderOptions(options, selectedValue = '') {
    const blankOption = selectedValue ? '' : '<option value="" selected></option>';
    return blankOption + options
        .map(option => `<option ${option === selectedValue ? 'selected' : ''}>${escapeCreateTenderHtml(option)}</option>`)
        .join('');
}

function isCreateTenderOtherCategory(value) {
    return String(value || '').trim().toLowerCase() === createTenderOtherCategoryLabel.toLowerCase();
}

function getCreateTenderCategoryOptions(categories = []) {
    const options = Array.isArray(categories) ? categories.filter(Boolean) : [];
    return options.some(isCreateTenderOtherCategory) ? options : [...options, createTenderOtherCategoryLabel];
}

function normalizeCreateTenderCategories(value = []) {
    const rawItems = Array.isArray(value)
        ? value
        : String(value || '').split(',').map(item => item.trim());
    const seen = new Set();

    return rawItems
        .map(item => String(item || '').trim())
        .filter(item => item && !isCreateTenderOtherCategory(item))
        .filter(item => {
            const key = item.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

function getCreateTenderSelectedCategories(mainDraft = {}) {
    const fromList = normalizeCreateTenderCategories(mainDraft.categories);
    return fromList.length ? fromList : normalizeCreateTenderCategories(mainDraft.category);
}

function renderCreateTenderSelectedCategoryRows(categories = []) {
    if (!categories.length) {
        return '<div class="scope-empty">No categories added yet.</div>';
    }

    return categories.map(category => `
        <div class="selected-category-row" data-selected-category="${escapeCreateTenderHtml(category)}">
            <span>${escapeCreateTenderHtml(category)}</span>
            <button class="boq-row-action icon-delete-btn" type="button" data-category-remove="${escapeCreateTenderHtml(category)}" aria-label="Remove ${escapeCreateTenderHtml(category)}" title="Remove category">${renderCreateTenderTrashIcon()}</button>
        </div>
    `).join('');
}

function getCreateTenderWizardCategories(wizard) {
    return normalizeCreateTenderCategories(Array.from(wizard?.querySelectorAll('[data-selected-category]') || [])
        .map(item => item.dataset.selectedCategory));
}

function getCreateTenderWizardCategoryValue(wizard, fallbackCategory = '') {
    return getCreateTenderWizardCategories(wizard).join(', ') || fallbackCategory;
}

const createTenderBoqStorageKey = 'procurex.createTender.v2.boqItems';
const createTenderCommercialTypeStorageKey = 'procurex.createTender.v2.commercialType';
const createTenderMilestoneStorageKey = 'procurex.createTender.v2.milestones';
const createTenderDeliverableStorageKey = 'procurex.createTender.v2.deliverables';
const createTenderDeliverableTypeStorageKey = 'procurex.createTender.v2.deliverableType';
const createTenderLicenseStorageKey = 'procurex.createTender.v2.regulatoryLicenses';
const createTenderLicenseTypeStorageKey = 'procurex.createTender.v2.regulatoryLicenseType';
const createTenderAttachmentStorageKey = 'procurex.createTender.v2.requiredAttachments';
const createTenderAttachmentTypeStorageKey = 'procurex.createTender.v2.attachmentType';
const createTenderContactStorageKey = 'procurex.createTender.v2.contactDetails';
const createTenderDraftStorageKey = 'procurex.createTender.v2.savedDraft';
const createTenderPublishedStorageKey = 'procurex.marketplace.publishedTenders';
const createTenderSelectedTenderStorageKey = 'procurex.marketplace.selectedTenderId';

const defaultCreateTenderBoqItems = [];

const defaultCreateTenderMilestones = [
    { id: 'milestone-publication', name: 'Publication', date: '' },
    { id: 'milestone-clarification', name: 'Clarification deadline', date: '' },
    { id: 'milestone-closing', name: 'Bid closing', date: '' },
    { id: 'milestone-opening', name: 'Bid opening', date: '' },
    { id: 'milestone-evaluation', name: 'Evaluation complete', date: '' },
    { id: 'milestone-award', name: 'Award target', date: '' }
];

const defaultCreateTenderDeliverables = [];

const defaultCreateTenderAttachments = [];

const createTenderRegulatoryLicenseCatalog = [
    { group: 'Food, Drugs & Cosmetics', license: 'Food Business Permit / Food Handling License', body: 'Tanzania Medicines and Medical Devices Authority (TMDA)' },
    { group: 'Food, Drugs & Cosmetics', license: 'Pharmaceutical Business License', body: 'Tanzania Medicines and Medical Devices Authority (TMDA)' },
    { group: 'Food, Drugs & Cosmetics', license: 'Medical Devices Registration Permit', body: 'Tanzania Medicines and Medical Devices Authority (TMDA)' },
    { group: 'Food, Drugs & Cosmetics', license: 'Cosmetics Registration Certificate', body: 'Tanzania Medicines and Medical Devices Authority (TMDA)' },
    { group: 'Energy & Water (EWURA)', license: 'Petroleum Retail Outlet License', body: 'Energy and Water Utilities Regulatory Authority (EWURA)' },
    { group: 'Energy & Water (EWURA)', license: 'Petroleum Wholesale License', body: 'Energy and Water Utilities Regulatory Authority (EWURA)' },
    { group: 'Energy & Water (EWURA)', license: 'Electricity Generation License', body: 'Energy and Water Utilities Regulatory Authority (EWURA)' },
    { group: 'Energy & Water (EWURA)', license: 'Electricity Distribution and Supply License', body: 'Energy and Water Utilities Regulatory Authority (EWURA)' },
    { group: 'Energy & Water (EWURA)', license: 'Water Supply and Sanitation Services License', body: 'Energy and Water Utilities Regulatory Authority (EWURA)' },
    { group: 'Communications & Transport', license: 'Content Services License', body: 'Tanzania Communications Regulatory Authority (TCRA)' },
    { group: 'Communications & Transport', license: 'Network Facilities License', body: 'Tanzania Communications Regulatory Authority (TCRA)' },
    { group: 'Communications & Transport', license: 'Application Services License', body: 'Tanzania Communications Regulatory Authority (TCRA)' },
    { group: 'Communications & Transport', license: 'Electronic Communications Service License', body: 'Tanzania Communications Regulatory Authority (TCRA)' },
    { group: 'Communications & Transport', license: 'Shipping Agency License', body: 'Tanzania Shipping Agencies Corporation (TASAC)' },
    { group: 'Communications & Transport', license: 'Port Services License', body: 'Tanzania Shipping Agencies Corporation (TASAC)' },
    { group: 'Mining & Natural Resources', license: 'Reconnaissance License', body: 'Ministry of Minerals' },
    { group: 'Mining & Natural Resources', license: 'Prospecting License', body: 'Ministry of Minerals' },
    { group: 'Mining & Natural Resources', license: 'Primary Mining License', body: 'Ministry of Minerals' },
    { group: 'Mining & Natural Resources', license: 'Mining License', body: 'Ministry of Minerals' },
    { group: 'Mining & Natural Resources', license: 'Special Mining License', body: 'Ministry of Minerals' },
    { group: 'Mining & Natural Resources', license: "Explosives Dealer's License", body: 'Ministry of Minerals' },
    { group: 'Construction & Real Estate', license: 'Contractor Registration Certificate', body: 'Contractors Registration Board (CRB) and Local Government Authorities' },
    { group: 'Construction & Real Estate', license: 'Building Permit', body: 'Contractors Registration Board (CRB) and Local Government Authorities' },
    { group: 'Construction & Real Estate', license: 'Environmental Building Approval', body: 'Contractors Registration Board (CRB) and Local Government Authorities' },
    { group: 'Environmental & Safety', license: 'Environmental Impact Assessment Certificate', body: 'National Environment Management Council (NEMC)' },
    { group: 'Environmental & Safety', license: 'Environmental Compliance Certificate', body: 'National Environment Management Council (NEMC)' },
    { group: 'Environmental & Safety', license: 'Occupational Safety and Health Compliance Certificate', body: 'Occupational Safety and Health Authority (OSHA)' },
    { group: 'Finance & Banking', license: 'Banking Business License', body: 'Bank of Tanzania (BOT)' },
    { group: 'Finance & Banking', license: 'Financial Institution License', body: 'Bank of Tanzania (BOT)' },
    { group: 'Finance & Banking', license: 'Microfinance Business License', body: 'Bank of Tanzania (BOT)' },
    { group: 'Finance & Banking', license: 'Foreign Exchange Bureau License', body: 'Bank of Tanzania (BOT)' },
    { group: 'Finance & Banking', license: 'Capital Markets and Securities Dealer License', body: 'Capital Markets and Securities Authority (CMSA)' },
    { group: 'Finance & Banking', license: 'Investment Adviser License', body: 'Capital Markets and Securities Authority (CMSA)' },
    { group: 'Finance & Banking', license: 'Fund Manager License', body: 'Capital Markets and Securities Authority (CMSA)' },
    { group: 'Specialized Services', license: 'Hazardous Chemicals Handling Certificate', body: 'Government Chemist Laboratory Authority (GCLA)' },
    { group: 'Specialized Services', license: 'Weights and Measures Inspection Certificate', body: 'Weights and Measures Agency (WMA)' },
    { group: 'Specialized Services', license: 'Calibration Certificate', body: 'Weights and Measures Agency (WMA)' }
];

const defaultCreateTenderRegulatoryLicenses = [];

const createTenderRequirementOptions = {
    currencies: ['TZS', 'USD', 'EUR', 'GBP'],
    procurementMethods: ['Open Tender', 'Invited Tender'],
    worksContractTypes: ['Lump Sum Contract', 'Unit Price Contract', 'Fixed Price Contract', 'Framework Contract', 'Consultancy / Time-Based Contract', 'Other'],
    worksDocumentTypes: ['Architectural drawings', 'Structural drawings', 'Electrical drawings', 'Mechanical drawings', 'Site reports', 'Material specifications', 'Geotechnical report', 'Environmental report', 'Bill of quantities template', 'Other'],
    units: ['Pcs', 'Unit', 'Set', 'Lot', 'Kg', 'Litre', 'Meter', 'Sqm', 'Day', 'Month'],
    materialQualities: ['Standard', 'Premium', 'Certified', 'Industrial grade', 'Food grade', 'Medical grade'],
    standards: ['ISO', 'TBS', 'CE', 'UL', 'Energy Star', 'Manufacturer certificate'],
    certifications: ['ISO 9001', 'ISO 14001', 'OSHA', 'Professional registration', 'Manufacturer certification'],
    frequency: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'On demand'],
    serviceLevels: ['Basic', 'Standard', 'Premium', 'Critical'],
    yesNo: ['Yes', 'No']
};

const createTenderWorksContractTypeDescriptions = {
    'Lump Sum Contract': 'A single total price is agreed for the whole work or project.',
    'Unit Price Contract': 'Payment is based on measured quantities completed.',
    'Fixed Price Contract': 'The supplier agrees to deliver goods or services at a fixed agreed price.',
    'Framework Contract': 'Used for repeated or recurring procurement over a defined period.',
    'Consultancy / Time-Based Contract': 'Payment is based on consultant time, milestones, or agreed service duration.'
};

const createTenderRequirementTemplates = {
    goods: {
        title: 'Goods Tender Requirements',
        sections: [
           {
                id: 'quantitySchedule',
                title: 'Quantity Schedule / BOQ',
                hint: 'Editable table with row numbering and calculated totals.',
                controls: [
                    {
                        id: 'quantityScheduleRows',
                        label: 'Quantity lines',
                        type: 'table',
                        addLabel: 'Add Item',
                        emptyText: 'No items added yet.',
                        columns: [
                            { id: 'itemNumber', label: 'Item', type: 'index' },
                            { id: 'itemDescription', label: 'Description', type: 'text' },
                            { id: 'unitOfMeasure', label: 'Unit', type: 'select', options: createTenderRequirementOptions.units },
                            { id: 'quantity', label: 'Qty', type: 'number' },
                            { id: 'unitPrice', label: 'Unit price', type: 'currency' },
                            { id: 'totalPrice', label: 'Total', type: 'calculated', formula: 'quantity*unitPrice' }
                        ]
                    }
                ]
            },
            {
                id: 'technicalSpecifications',
                title: 'Technical Specifications',
                hint: 'Use specification cards so each product specification is captured as a full object.',
                controls: [
                    {
                        id: 'specificationCards',
                        label: 'Product specifications',
                        type: 'cards',
                        addLabel: 'Add Specification',
                        requiresSourceOptions: true,
                        sourceEmptyText: 'Add at least one quantity item before adding specifications.',
                        cardTitleField: 'itemRowId',
                        cardTitlePrefix: 'Specification for',
                        emptyText: 'No product specifications added yet.',
                        fields: [
                            { id: 'itemRowId', label: 'Item', type: 'source-select', sourceControlId: 'quantityScheduleRows', sourceLabelField: 'itemDescription' },
                            { id: 'productDescription', label: 'Product description', type: 'textarea' },
                            { id: 'brandRequirements', label: 'Brand requirement', type: 'text' },
                            { id: 'standards', label: 'Standards', type: 'multiselect', options: createTenderRequirementOptions.standards },
                            { id: 'performanceSpecifications', label: 'Performance specs', type: 'textarea' },
                            { id: 'dimensions', label: 'Dimensions', type: 'text' },
                            { id: 'materialQuality', label: 'Material quality', type: 'select', options: createTenderRequirementOptions.materialQualities },
                            { id: 'warrantyRequirements', label: 'Warranty', type: 'text' },
                            { id: 'packagingRequirements', label: 'Packaging', type: 'text' },
                            { id: 'shelfLifeRequirements', label: 'Shelf life', type: 'text' },
                            { id: 'installationRequirements', label: 'Installation requirement', type: 'textarea' }
                        ]
                    }
                ]
            },
            {
                id: 'sampleRequirements',
                title: 'Sample Requirements',
                hint: 'Enable samples only when buyers need physical samples before evaluation or award.',
                controls: [
                    { id: 'requireSamples', label: 'Require Samples?', type: 'yesno' },
                    {
                        id: 'sampleRequirementRows',
                        label: 'Sample requirement design',
                        type: 'table',
                        addLabel: 'Add Sample Requirement',
                        emptyText: 'No sample requirements added yet.',
                        requiresSourceOptions: true,
                        sourceEmptyText: 'Add at least one quantity item before adding sample requirements.',
                        showWhen: { field: 'requireSamples', value: 'Yes' },
                        columns: [
                            { id: 'relatedBoqItem', label: 'Related BOQ Item', type: 'source-select', sourceControlId: 'quantityScheduleRows', sourceLabelField: 'itemDescription' },
                            { id: 'sampleRequired', label: 'Sample Required', type: 'toggle' },
                            { id: 'numberOfSamples', label: 'Number of Samples', type: 'number' },
                            { id: 'sampleDescription', label: 'Sample Description', type: 'textarea' },
                            { id: 'deliveryLocation', label: 'Delivery Location', type: 'text' },
                            { id: 'deliveryDeadline', label: 'Delivery Deadline', type: 'date' },
                            { id: 'mandatory', label: 'Mandatory', type: 'toggle' },
                            { id: 'returnableSample', label: 'Returnable Sample?', type: 'toggle' }
                        ]
                    }
                ]
            },
            
            {
                id: 'eligibilityRequirements',
                title: 'Other Eligibility Requirements',
                hint: 'Use add/remove requirement cards for supplier eligibility documents and notes.',
                controls: [
                    {
                        id: 'otherEligibilityRequirements',
                        label: 'Other requirements',
                        type: 'cards',
                        addLabel: 'Add Requirement',
                        emptyText: 'No other eligibility requirements added yet.',
                        fields: [
                            { id: 'requirementName', label: 'Requirement name', type: 'text' },
                            { id: 'mandatory', label: 'Mandatory', type: 'toggle' },
                            { id: 'requiresUpload', label: 'Requires upload', type: 'toggle' },
                            { id: 'notes', label: 'Notes', type: 'textarea' }
                        ],
                        presets: ['Certificate of incorporation', 'Tax clearance certificate', 'VAT registration', 'Manufacturer authorization', 'Past supply contracts', 'Audited financial statements']
                    }
                ]
            }
        ]
    },
    works: {
        title: 'Works Tender Requirements',
        sections: [
            {
                id: 'generalInformation',
                title: 'General Tender Information',
                hint: 'Capture the core project details.',
                controls: [
                    { id: 'projectName', label: 'Project name', type: 'text' },
                    { id: 'location', label: 'Location', type: 'text' },
                    {
                        id: 'contractType',
                        label: 'Contract type',
                        type: 'select-custom-prompt',
                        options: createTenderRequirementOptions.worksContractTypes,
                        required: true,
                        helperDescriptions: createTenderWorksContractTypeDescriptions,
                        helperText: 'Select Other to type a contract type that is not listed.'
                    },
                    { id: 'completionPeriod', label: 'Completion period', type: 'text' },
                    { id: 'fundingSource', label: 'Funding source', type: 'text' },
                    {
                        id: 'siteVisitRequirement',
                        label: 'Site visit requirement',
                        type: 'choice',
                        defaultValue: 'Not mandatory',
                        options: ['Mandatory', 'Not mandatory']
                    }
                ]
            },
            {
                id: 'technicalRequirements',
                title: 'Technical Requirements',
                hint: 'Upload required documents and add notes for each requirement.',
                controls: [
                    {
                        id: 'requiredDocuments',
                        label: 'Required documents',
                        type: 'table',
                        addLabel: 'Add Document',
                        emptyText: 'No document requirements added yet.',
                        columns: [
                            { id: 'documentType', label: 'Document type', type: 'select', options: createTenderRequirementOptions.worksDocumentTypes },
                            { id: 'otherDocumentName', label: 'Other document name', type: 'text', showWhen: { field: 'documentType', value: 'Other' }, hideColumnUntilMatch: true, placeholder: 'Write document name' },
                            { id: 'buyerDocumentUpload', label: 'Upload required document', type: 'file', accept: '.pdf,.doc,.docx,.xls,.xlsx,.dwg,.dxf,.jpg,.jpeg,.png' },
                            { id: 'notes', label: 'Notes', type: 'textarea' }
                        ]
                    }
                ]
            },
            {
                id: 'boqRequirements',
                title: 'Bills of Quantities (BOQ)',
                hint: 'Advanced financial table with calculated line totals.',
                controls: [
                    {
                        id: 'boqRows',
                        label: 'BOQ lines',
                        type: 'table',
                        addLabel: 'Add BOQ Line',
                        emptyText: 'No BOQ lines added yet.',
                        columns: [
                            { id: 'workItem', label: 'Work item', type: 'text' },
                            { id: 'quantity', label: 'Qty', type: 'number' },
                            { id: 'unit', label: 'Unit', type: 'select', options: createTenderRequirementOptions.units },
                            { id: 'laborCost', label: 'Labor', type: 'currency' },
                            { id: 'materialCost', label: 'Materials', type: 'currency' },
                            { id: 'equipmentCost', label: 'Equipment', type: 'currency' },
                            { id: 'totalCost', label: 'Total', type: 'calculated', formula: 'laborCost+materialCost+equipmentCost' }
                        ]
                    }
                ]
            },
            {
                id: 'contractorQualifications',
                title: 'Contractor Qualification Requirements',
                hint: 'Expandable requirement cards for qualifications and thresholds.',
                controls: [
                    {
                        id: 'contractorQualificationCards',
                        label: 'Qualification requirements',
                        type: 'cards',
                        addLabel: 'Add Qualification',
                        emptyText: 'No contractor qualifications added yet.',
                        fields: [
                            { id: 'requirementTitle', label: 'Requirement title', type: 'text' },
                            { id: 'minimumThreshold', label: 'Minimum threshold', type: 'text' },
                            { id: 'mandatory', label: 'Mandatory', type: 'toggle' },
                            { id: 'uploadRequired', label: 'Upload required', type: 'toggle' },
                            { id: 'notes', label: 'Notes', type: 'textarea' }
                        ],
                        presets: ['Construction license', 'Contractor registration class', 'Tax certificates', 'Insurance', 'OSHA compliance']
                    }
                ]
            },
            {
                id: 'technicalCapacity',
                title: 'Technical Capacity',
                hint: 'Technical capacity evidence that can grow by requirement.',
                controls: [
                    { id: 'similarCompletedProjects', label: 'Similar completed projects', type: 'list', addLabel: 'Add Similar Project', emptyText: 'No similar projects added yet.' },
                    { id: 'keyPersonnelCvs', label: 'Key personnel CVs', type: 'list', addLabel: 'Add CV Requirement', emptyText: 'No CV requirements added yet.' },
                    { id: 'equipmentOwnership', label: 'Equipment ownership', type: 'list', addLabel: 'Add Equipment Ownership Requirement', emptyText: 'No equipment ownership requirements added yet.' },
                    { id: 'bankStatements', label: 'Bank statements', type: 'text' },
                    { id: 'annualTurnover', label: 'Annual turnover', type: 'number' }
                ]
            },
            {
                id: 'keyPersonnel',
                title: 'Key Personnel Requirements',
                hint: 'Personnel cards for role-specific experience, qualifications, and document toggles.',
                controls: [
                    {
                        id: 'keyPersonnelCards',
                        label: 'Key personnel',
                        type: 'cards',
                        addLabel: 'Add Personnel Role',
                        emptyText: 'No key personnel roles added yet.',
                        fields: [
                            { id: 'position', label: 'Position', type: 'text' },
                            { id: 'minimumExperience', label: 'Minimum experience', type: 'number', suffix: 'years' },
                            { id: 'requiredQualification', label: 'Required qualification', type: 'textarea' },
                            { id: 'certifications', label: 'Certifications', type: 'multiselect', options: createTenderRequirementOptions.certifications },
                            { id: 'cvRequired', label: 'CV required', type: 'toggle' },
                            { id: 'academicCertificateRequired', label: 'Academic cert required', type: 'toggle' }
                        ]
                    }
                ]
            },
            {
                id: 'equipmentRequirements',
                title: 'Equipment Requirements',
                hint: 'Add each required equipment item and its proof.',
                controls: [
                    {
                        id: 'equipmentRows',
                        label: 'Required equipment',
                        type: 'table',
                        addLabel: 'Add Equipment',
                        emptyText: 'No equipment requirements added yet.',
                        columns: [
                            { id: 'equipment', label: 'Equipment', type: 'text' },
                            { id: 'quantity', label: 'Quantity', type: 'number' },
                            { id: 'ownershipProof', label: 'Ownership proof', type: 'toggle' },
                            { id: 'leaseAllowed', label: 'Lease allowed', type: 'toggle' }
                        ]
                    }
                ]
            }
        ]
    },
    services: {
        title: 'Service Tender Requirements',
        sections: [
            {
                id: 'serviceDefinition',
                title: 'Service Definition',
                hint: 'Define the service at a high level.',
                controls: [
                    { id: 'scopeOfServices', label: 'Scope of services', type: 'textarea' },
                    { id: 'serviceLocations', label: 'Service locations', type: 'list', addLabel: 'Add Service Location', emptyText: 'No service locations added yet.' },
                    { id: 'performanceStandardsSummary', label: 'Performance standards', type: 'textarea' },
                    { id: 'duration', label: 'Duration', type: 'text' }
                ]
            },
            {
                id: 'serviceScope',
                title: 'Service Scope',
                hint: 'Dynamic task cards for service tasks, frequency, KPI, and service level.',
                controls: [
                    {
                        id: 'serviceTaskCards',
                        label: 'Service tasks',
                        type: 'cards',
                        addLabel: 'Add Task',
                        emptyText: 'No service tasks added yet.',
                        fields: [
                            { id: 'taskName', label: 'Task name', type: 'text' },
                            { id: 'frequency', label: 'Frequency', type: 'select', options: createTenderRequirementOptions.frequency },
                            { id: 'kpi', label: 'KPI', type: 'text' },
                            { id: 'serviceLevel', label: 'Service level', type: 'select', options: createTenderRequirementOptions.serviceLevels }
                        ]
                    }
                ]
            },
            {
                id: 'serviceRequirements',
                title: 'Service Requirements',
                hint: 'Conditional forms show the right fields for security, cleaning, or other service needs.',
                controls: [
                    {
                        id: 'serviceRequirementCards',
                        label: 'Service requirements',
                        type: 'cards',
                        addLabel: 'Add Service Requirement',
                        emptyText: 'No service requirements added yet.',
                        fields: [
                            { id: 'serviceType', label: 'Service type', type: 'select', options: ['Security', 'Cleaning', 'Other'] },
                            { id: 'numberOfGuards', label: 'Number of guards', type: 'number', showWhen: { field: 'serviceType', value: 'Security' } },
                            { id: 'patrolFrequency', label: 'Patrol frequency', type: 'select', options: createTenderRequirementOptions.frequency, showWhen: { field: 'serviceType', value: 'Security' } },
                            { id: 'shiftSchedule', label: 'Shift schedule', type: 'text', showWhen: { field: 'serviceType', value: 'Security' } },
                            { id: 'cleaningAreas', label: 'Cleaning areas', type: 'textarea', showWhen: { field: 'serviceType', value: 'Cleaning' } },
                            { id: 'cleaningFrequency', label: 'Cleaning frequency', type: 'select', options: createTenderRequirementOptions.frequency, showWhen: { field: 'serviceType', value: 'Cleaning' } },
                            { id: 'cleaningMaterials', label: 'Cleaning materials', type: 'textarea', showWhen: { field: 'serviceType', value: 'Cleaning' } },
                            { id: 'otherRequirement', label: 'Other requirement', type: 'textarea', showWhen: { field: 'serviceType', value: 'Other' } }
                        ]
                    }
                ]
            },
            {
                id: 'staffingRequirements',
                title: 'Staffing Requirements',
                hint: 'Staff cards for role, qualifications, experience, certifications, and uniform rules.',
                controls: [
                    {
                        id: 'staffCards',
                        label: 'Staff requirements',
                        type: 'cards',
                        addLabel: 'Add Staff Requirement',
                        emptyText: 'No staff requirements added yet.',
                        fields: [
                            { id: 'role', label: 'Role', type: 'text' },
                            { id: 'qualification', label: 'Qualification', type: 'textarea' },
                            { id: 'experience', label: 'Experience', type: 'number', suffix: 'years' },
                            { id: 'certifications', label: 'Certification', type: 'multiselect', options: createTenderRequirementOptions.certifications },
                            { id: 'uniformRequired', label: 'Uniform required', type: 'toggle' }
                        ]
                    }
                ]
            },
            {
                id: 'equipmentRequirements',
                title: 'Equipment Requirements',
                hint: 'List required equipment, machines, systems, vehicles, or tools.',
                controls: [
                    { id: 'equipment', label: 'Equipment', type: 'list', addLabel: 'Add Equipment', emptyText: 'No equipment added yet.' }
                ]
            },
            {
                id: 'performanceStandards',
                title: 'Performance Standards',
                hint: 'KPI table for measurable standards, targets, penalties, and reporting.',
                controls: [
                    {
                        id: 'performanceKpiRows',
                        label: 'KPI table',
                        type: 'table',
                        addLabel: 'Add KPI',
                        emptyText: 'No KPIs added yet.',
                        columns: [
                            { id: 'kpi', label: 'KPI', type: 'text' },
                            { id: 'target', label: 'Target', type: 'text' },
                            { id: 'penalty', label: 'Penalty', type: 'text' },
                            { id: 'reportingFrequency', label: 'Reporting frequency', type: 'select', options: createTenderRequirementOptions.frequency }
                        ]
                    }
                ]
            },
            {
                id: 'contractRequirements',
                title: 'Service Contract Requirements',
                hint: 'Clause builder for SLA, KPI, reporting, penalty, and renewal clauses.',
                controls: [
                    {
                        id: 'contractClauseCards',
                        label: 'Contract clauses',
                        type: 'cards',
                        addLabel: 'Add Clause',
                        emptyText: 'No contract clauses added yet.',
                        fields: [
                            { id: 'clauseTitle', label: 'Clause title', type: 'text' },
                            { id: 'description', label: 'Description', type: 'textarea' },
                            { id: 'mandatory', label: 'Mandatory', type: 'toggle' }
                        ],
                        presets: ['Service level agreement (SLA)', 'KPIs', 'Reporting obligations', 'Penalty clauses', 'Renewal options']
                    }
                ]
            }
        ]
    },
    consultancy: {
        title: 'Consultancy Tender Requirements',
        sections: [
            {
                id: 'torPreparation',
                title: 'Terms of Reference (TOR) Preparation',
                hint: 'Accordion sections give a professional TOR editing experience.',
                controls: [
                    {
                        id: 'torSections',
                        label: 'TOR sections',
                        type: 'accordion',
                        panels: [
                            { id: 'background', label: 'Background' },
                            { id: 'objectives', label: 'Objectives' },
                            { id: 'scope', label: 'Scope' },
                            { id: 'deliverables', label: 'Deliverables' },
                            { id: 'timeline', label: 'Timeline' },
                            { id: 'reportingStructure', label: 'Reporting structure' }
                        ]
                    }
                ]
            },
            {
                id: 'consultancyInformation',
                title: 'Consultancy Information',
                hint: 'Capture the core consultancy setup.',
                controls: [
                    { id: 'assignmentTitle', label: 'Assignment title', type: 'text' },
                    { id: 'duration', label: 'Duration', type: 'text' },
                    { id: 'typeOfConsultancy', label: 'Type of consultancy', type: 'text' },
                    { id: 'selectionMethod', label: 'Selection method', type: 'text' }
                ]
            },
            {
                id: 'termsOfReference',
                title: 'Terms of Reference',
                hint: 'Define what consultants will do and submit.',
                controls: [
                    { id: 'tasks', label: 'Tasks', type: 'list', addLabel: 'Add Task', emptyText: 'No tasks added yet.' },
                    { id: 'expectedOutputs', label: 'Expected outputs', type: 'list', addLabel: 'Add Expected Output', emptyText: 'No expected outputs added yet.' },
                    { id: 'torDeliverables', label: 'Deliverables', type: 'list', addLabel: 'Add TOR Deliverable', emptyText: 'No TOR deliverables added yet.' },
                    { id: 'torReportingObligations', label: 'Reporting obligations', type: 'list', addLabel: 'Add Reporting Obligation', emptyText: 'No reporting obligations added yet.' }
                ]
            },
            {
                id: 'qualificationRequirements',
                title: 'Consultant Qualification Requirements',
                hint: 'Expert cards for position, experience, qualifications, certifications, and CV requirements.',
                controls: [
                    { id: 'firmRegistration', label: 'Firm registration', type: 'text' },
                    { id: 'firmExperience', label: 'Firm experience', type: 'textarea' },
                    { id: 'financialCapacity', label: 'Financial capacity', type: 'text' },
                    {
                        id: 'expertCards',
                        label: 'Expert requirements',
                        type: 'cards',
                        addLabel: 'Add Expert',
                        emptyText: 'No expert requirements added yet.',
                        fields: [
                            { id: 'position', label: 'Position', type: 'text' },
                            { id: 'yearsExperience', label: 'Years experience', type: 'number' },
                            { id: 'qualifications', label: 'Qualifications', type: 'textarea' },
                            { id: 'certifications', label: 'Certifications', type: 'multiselect', options: createTenderRequirementOptions.certifications },
                            { id: 'cvRequired', label: 'CV required', type: 'toggle' }
                        ],
                        presets: ['Team leader', 'Subject expert', 'Specialist']
                    }
                ]
            },
            {
                id: 'technicalProposalRequirements',
                title: 'Technical Proposal Requirements',
                hint: 'Checklist builder table for proposal submission requirements.',
                controls: [
                    {
                        id: 'technicalProposalChecklist',
                        label: 'Technical proposal checklist',
                        type: 'table',
                        addLabel: 'Add Requirement',
                        emptyText: 'No technical proposal requirements added yet.',
                        columns: [
                            { id: 'requirement', label: 'Requirement', type: 'select', options: ['Methodology', 'Work plan', 'Team composition', 'CVs', 'Understanding of assignment'] },
                            { id: 'mandatory', label: 'Mandatory', type: 'toggle' },
                            { id: 'uploadRequired', label: 'Upload required', type: 'toggle' }
                        ]
                    }
                ]
            },
            {
                id: 'financialProposalRequirements',
                title: 'Financial Proposal Requirements',
                hint: 'Financial table with calculated totals.',
                controls: [
                    {
                        id: 'financialProposalRows',
                        label: 'Financial proposal lines',
                        type: 'table',
                        addLabel: 'Add Financial Line',
                        emptyText: 'No financial proposal lines added yet.',
                        columns: [
                            { id: 'costItem', label: 'Cost item', type: 'text' },
                            { id: 'unit', label: 'Unit', type: 'select', options: ['Day', 'Month', 'Output', 'Trip', 'Lot'] },
                            { id: 'rate', label: 'Rate', type: 'currency' },
                            { id: 'quantity', label: 'Quantity', type: 'number' },
                            { id: 'total', label: 'Total', type: 'calculated', formula: 'rate*quantity' }
                        ]
                    }
                ]
            }
        ]
    }
};

const createTenderTypeProfiles = {
    works: {
        id: 'works',
        commercialName: 'BOQ',
        commercialTitle: 'BOQ Editor',
        commercialDescription: 'Items, units, rates, and construction totals',
        commercialItemName: 'BOQ item',
        commercialEmptyText: 'No BOQ items added yet.',
        importHint: 'Use item, description, quantity, unit, and rate columns.',
        addLabel: 'Add BOQ Item',
        importLabel: 'Import BOQ',
        reviewLabel: 'BOQ estimate',
        scopeTitle: 'Specifications / Scope',
        scopeLabel: 'Scope of work',
        deliverablesTitle: 'Key deliverables',
        deliverablesHint: 'Manage each deliverable as a separate item.',
        attachmentHint: 'Add drawings, specifications, BOQ templates, forms, or declarations suppliers must submit.',
        responseTitle: 'Technical Response',
        responseFields: ['Relevant experience', 'Methodology'],
        assuranceTitle: 'Samples',
        assuranceBadge: 'Optional',
        defaultItems: defaultCreateTenderBoqItems,
        defaultDeliverables: defaultCreateTenderDeliverables,
        defaultAttachments: defaultCreateTenderAttachments,
        documentLabels: ['Engineering designs and drawings', 'Bills of quantities', 'Site reports', 'Material specifications', 'Conditions of contract'],
        keyRequirements: ['Project location and completion period', 'Contractor registration class', 'Key personnel CVs and certificates', 'Equipment ownership or lease proof', 'Insurance, tax certificates, and OSHA compliance'],
        planningDocuments: ['Engineering designs', 'Drawings', 'Environmental studies', 'Feasibility studies', 'Bills of quantities', 'Cost estimates'],
        submissionDocuments: ['Bid security', 'Completed legal forms', 'Work methodology', 'Construction schedule', 'Key personnel CVs', 'Equipment proof', 'Priced BOQ'],
        evaluationFlow: ['Administrative evaluation', 'Technical evaluation', 'Financial evaluation', 'Post qualification'],
        contractRequirements: ['Construction agreement', 'Performance security', 'Advance payment guarantee', 'Retention money', 'Defects liability period', 'Interim payment certificates'],
        evaluationStyle: 'Administrative, technical, financial, and post-qualification review with strong emphasis on methodology, personnel, equipment, experience, and BOQ pricing.',
        bidderPreparation: ['BOQ pricing', 'Work methodology', 'Construction schedule', 'Key personnel CVs', 'Equipment availability', 'Similar project evidence'],
        evaluationCriteria: [
            ['Technical capacity', 30, 'Team, equipment, methodology'],
            ['Relevant experience', 25, 'Healthcare construction history'],
            ['Financial proposal', 25, 'Price and payment realism'],
            ['Delivery schedule', 10, 'Milestone feasibility'],
            ['Compliance and ESG', 10, 'Licenses, safety, local participation']
        ]
    },
    goods: {
        id: 'goods',
        commercialName: 'Quantity Schedule',
        commercialTitle: 'Quantity Schedule / BOQ',
        commercialDescription: 'Item schedule, quantities, unit prices, and totals',
        commercialItemName: 'goods item',
        commercialEmptyText: 'No goods BOQ items added yet.',
        importHint: 'Use item, description, quantity, unit, and unit price columns.',
        addLabel: 'Add Goods Item',
        importLabel: 'Import Quantity Schedule',
        reviewLabel: 'Goods estimate',
        scopeTitle: 'Goods Specifications',
        scopeLabel: 'Goods requirements',
        deliverablesTitle: 'Required goods',
        deliverablesHint: 'List each supply, installation, warranty, or training deliverable.',
        attachmentHint: 'Add specifications, datasheets, delivery forms, warranty templates, and compliance declarations.',
        responseTitle: 'Goods Offer',
        responseFields: ['Technical compliance', 'Delivery and warranty plan'],
        assuranceTitle: 'Samples / Catalogs',
        assuranceBadge: 'If requested',
        defaultItems: [],
        defaultDeliverables: [],
        defaultAttachments: [],
        documentLabels: ['Technical specifications', 'Quantity schedule', 'Delivery requirements', 'Warranty terms', 'Compliance certificates'],
        keyRequirements: ['Product description and standards', 'Quantity and unit of measure', 'Delivery location and timeline', 'Warranty, packaging, shelf-life, and installation requirements', 'Manufacturer authorization where required'],
        planningDocuments: ['Procurement plan', 'Technical specifications document', 'Cost estimates', 'Market survey report'],
        submissionDocuments: ['Business license', 'Certificate of incorporation', 'Tax clearance certificate', 'VAT registration', 'Manufacturer authorization', 'Past supply contracts', 'Audited financial statements'],
        evaluationFlow: ['Preliminary examination', 'Technical evaluation', 'Financial evaluation', 'Award recommendation'],
        contractRequirements: ['Purchase order', 'Supply agreement', 'Delivery schedule', 'Inspection procedures', 'Warranty terms', 'Penalty clauses', 'Payment schedule'],
        evaluationStyle: 'Preliminary compliance, technical specification review, and financial comparison leading to the lowest evaluated responsive bidder.',
        bidderPreparation: ['Technical compliance sheet', 'Quantity schedule pricing', 'Delivery schedule', 'Warranty documents', 'Manufacturer authorization', 'Past supply evidence'],
        evaluationCriteria: [
            ['Specification compliance', 35, 'Mandatory technical conformity'],
            ['Delivery capacity', 20, 'Lead time, logistics, warranty support'],
            ['Financial proposal', 30, 'Unit pricing and lifecycle cost'],
            ['After-sales support', 10, 'Maintenance and spare parts'],
            ['Compliance documents', 5, 'Licenses and certifications']
        ]
    },
    services: {
        id: 'services',
        commercialName: 'Service Schedule',
        commercialTitle: 'Service Requirements',
        commercialDescription: 'Tasks, service levels, durations, and fee estimates',
        commercialItemName: 'service line',
        commercialEmptyText: 'No service requirement lines added yet.',
        importHint: 'Use code, service task, quantity or duration, unit, and fee columns.',
        addLabel: 'Add Service Line',
        importLabel: 'Import Service Schedule',
        reviewLabel: 'Service estimate',
        scopeTitle: 'Service Requirements',
        scopeLabel: 'Service scope',
        deliverablesTitle: 'Service outputs',
        deliverablesHint: 'List each operational output, SLA, report, or handover requirement.',
        attachmentHint: 'Add terms of reference, SLA schedule, reporting templates, and compliance declarations.',
        responseTitle: 'Service Response',
        responseFields: ['Service approach', 'SLA and staffing plan'],
        assuranceTitle: 'SLA Evidence',
        assuranceBadge: 'Required',
        defaultItems: [],
        defaultDeliverables: [],
        defaultAttachments: [],
        documentLabels: ['Scope of services', 'SLA / KPI schedule', 'Staffing requirements', 'Equipment requirements', 'Reporting templates'],
        keyRequirements: ['Tasks, frequency, and service locations', 'Service levels and KPIs', 'Staffing levels and qualifications', 'Equipment and tools', 'Response times, penalties, and reporting frequency'],
        planningDocuments: ['Scope of services', 'Service locations', 'Performance standards', 'Duration and renewal assumptions', 'Budget estimate'],
        submissionDocuments: ['Service methodology', 'Staffing plan', 'Staff qualifications and certifications', 'Equipment list', 'Experience evidence', 'Monthly or service rate schedule'],
        evaluationFlow: ['Technical evaluation', 'Financial evaluation', 'Award recommendation'],
        contractRequirements: ['Service level agreement (SLA)', 'KPIs', 'Reporting obligations', 'Penalty clauses', 'Renewal options', 'Payment schedule'],
        evaluationStyle: 'Technical and financial evaluation focused on methodology, staffing quality, equipment, experience, operational cost, and price competitiveness.',
        bidderPreparation: ['Service methodology', 'Staffing plan', 'SLA response', 'Equipment list', 'Experience evidence', 'Monthly/service rates'],
        evaluationCriteria: [
            ['Service methodology', 30, 'Approach, continuity, and quality controls'],
            ['Team capability', 25, 'Skills, availability, and supervision'],
            ['SLA compliance plan', 20, 'Response times and escalation'],
            ['Financial proposal', 15, 'Fee realism and value'],
            ['Compliance', 10, 'Licenses, references, and safeguards']
        ]
    },
    consultancy: {
        id: 'consultancy',
        commercialName: 'Financial Proposal',
        commercialTitle: 'Consultancy Requirements',
        commercialDescription: 'TOR outputs, expert inputs, reimbursables, and fee estimate',
        commercialItemName: 'consultancy input',
        commercialEmptyText: 'No consultancy requirement lines added yet.',
        importHint: 'Use code, input/output, level of effort, unit, and fee columns.',
        addLabel: 'Add Consultancy Input',
        importLabel: 'Import Financial Proposal',
        reviewLabel: 'Consultancy estimate',
        scopeTitle: 'Terms of Reference',
        scopeLabel: 'TOR summary',
        deliverablesTitle: 'Consultancy deliverables',
        deliverablesHint: 'List inception, draft, final, training, and reporting outputs.',
        attachmentHint: 'Add TOR, CV templates, methodology forms, and financial proposal templates.',
        responseTitle: 'Consultancy Proposal',
        responseFields: ['Technical methodology', 'Key expert plan'],
        assuranceTitle: 'Experts & CVs',
        assuranceBadge: 'Required',
        defaultItems: [],
        defaultDeliverables: [],
        defaultAttachments: [],
        documentLabels: ['Terms of Reference', 'Methodology template', 'Key expert CV template', 'Evaluation criteria', 'Financial proposal template'],
        keyRequirements: ['Background, objectives, scope, and deliverables', 'Methodology and work plan', 'Team composition and CVs', 'Firm and expert experience', 'Professional fees, reimbursables, taxes, and daily rates'],
        planningDocuments: ['Terms of Reference', 'Background and objectives', 'Scope and deliverables', 'Timeline', 'Reporting structure', 'Selection method'],
        submissionDocuments: ['Technical proposal', 'Understanding of assignment', 'Methodology', 'Work plan', 'Team composition', 'CVs', 'Financial proposal'],
        evaluationFlow: ['Technical evaluation', 'Financial evaluation', 'Combined ranking or method-specific selection', 'Award recommendation'],
        contractRequirements: ['Terms of Reference', 'Deliverables', 'Milestones', 'Payment schedule', 'Intellectual property clauses', 'Confidentiality clauses'],
        evaluationStyle: 'Quality-focused technical evaluation followed by financial evaluation using QCBS, QBS, Least Cost, or the configured consultancy selection method.',
        bidderPreparation: ['Technical proposal', 'Understanding of TOR', 'Methodology', 'Work plan', 'Team CVs', 'Relevant experience', 'Separate financial proposal when required'],
        evaluationCriteria: [
            ['Understanding of TOR', 25, 'Problem framing and proposed approach'],
            ['Methodology and work plan', 30, 'Quality, feasibility, and stakeholder plan'],
            ['Key expert qualifications', 25, 'Relevant professional experience'],
            ['Financial proposal', 10, 'Fee realism and value'],
            ['Knowledge transfer', 10, 'Training and sustainability']
        ]
    }
};

const defaultCreateTenderContact = {
    tenderLocation: '',
    contactName: '',
    phone: '',
    email: '',
    phoneVerified: false,
    emailVerified: false
};

const defaultCreateTenderMainDraft = {
    title: '',
    scope: '',
    procurementTypeId: '',
    method: createTenderOpenMethod,
    category: '',
    categories: [],
    visibility: 'Public marketplace',
    visibilityNote: 'Visible to everyone in the public marketplace.',
    invitedUsers: [],
    requirements: {}
};

function escapeCreateTenderHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function isCreateTenderClosedMethod(method = '') {
    return String(method || '').trim().toLowerCase() === createTenderClosedMethod.toLowerCase();
}

function normalizeCreateTenderMethod(method = '') {
    return isCreateTenderClosedMethod(method) ? createTenderClosedMethod : createTenderOpenMethod;
}

function getCreateTenderVisibilityForMethod(method = '') {
    return isCreateTenderClosedMethod(normalizeCreateTenderMethod(method)) ? 'Invited suppliers only' : 'Public marketplace';
}

function getCreateTenderVisibilityNoteForMethod(method = '', invitedCount = 0) {
    if (isCreateTenderClosedMethod(normalizeCreateTenderMethod(method))) {
        return invitedCount
            ? `Invitation will be sent to ${invitedCount} selected supplier${invitedCount === 1 ? '' : 's'}.`
            : 'Select suppliers to receive the tender invitation.';
    }
    return 'Visible to everyone in the public marketplace.';
}

function normalizeCreateTenderInvitedUser(user = {}, index = 0) {
    const name = String(user.name || user.supplier || user.organization || '').trim();
    const organization = String(user.organization || name).trim();
    return {
        id: String(user.id || name || `supplier-${index}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        name,
        organization,
        email: String(user.email || '').trim(),
        trustTier: String(user.trustTier || '').trim(),
        risk: String(user.risk || '').trim()
    };
}

function getCreateTenderInvitableUsers() {
    const sources = [
        mockData.users?.supplier,
        ...(mockData.bidEvaluation?.riskSignals || []),
        ...(mockData.bidEvaluation?.bids || [])
    ];
    const seen = new Set();
    return sources
        .map(normalizeCreateTenderInvitedUser)
        .filter(user => {
            const key = user.name.toLowerCase();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

function renderCreateTenderInvitedUserRows(users = []) {
    if (!users.length) {
        return '<div class="scope-empty">No invited suppliers selected yet.</div>';
    }

    return users.map(user => `
        <div class="invited-user-row" data-invited-user="${escapeCreateTenderHtml(user.id)}">
            <div>
                <strong>${escapeCreateTenderHtml(user.name)}</strong>
                <span>${escapeCreateTenderHtml(user.organization || 'Supplier')}</span>
            </div>
            <button class="boq-row-action icon-delete-btn" type="button" data-invited-user-remove="${escapeCreateTenderHtml(user.id)}" aria-label="Remove ${escapeCreateTenderHtml(user.name)}" title="Remove supplier">${renderCreateTenderTrashIcon()}</button>
        </div>
    `).join('');
}

function getCreateTenderRequirementTemplate(profileId = 'works') {
    return createTenderRequirementTemplates[profileId] || createTenderRequirementTemplates.works;
}

function getCreateTenderRequirementDefaultFields(profileId = 'works') {
    return getCreateTenderRequirementTemplate(profileId).sections
        .flatMap(section => section.controls || [])
        .reduce((defaults, control) => {
            if (control.defaultValue !== undefined) {
                defaults[control.id] = control.defaultValue;
            }
            return defaults;
        }, {});
}

function getCreateTenderRequirementDraft(profileId = 'works') {
    const mainDraft = getCreateTenderMainDraft();
    const requirements = mainDraft.requirements && typeof mainDraft.requirements === 'object' ? mainDraft.requirements : {};
    return {
        fields: {
            ...getCreateTenderRequirementDefaultFields(profileId),
            ...(requirements[profileId]?.fields || {})
        },
        lists: { ...(requirements[profileId]?.lists || {}) }
    };
}

function saveCreateTenderRequirementDraft(profileId, requirementDraft) {
    const mainDraft = getCreateTenderMainDraft();
    saveCreateTenderMainDraft({
        requirements: {
            ...(mainDraft.requirements || {}),
            [profileId]: {
                fields: { ...(requirementDraft.fields || {}) },
                lists: { ...(requirementDraft.lists || {}) }
            }
        }
    });
}

function normalizeCreateTenderRequirementItem(item = {}, index = 0) {
    return {
        id: String(item.id || `requirement-${Date.now()}-${index}`),
        text: String(item.text || '').trim()
    };
}

function normalizeCreateTenderRequirementTextItems(items = [], controlId = 'item') {
    if (!Array.isArray(items)) return [];
    return items.map((item, index) => {
        if (typeof item === 'string') {
            return {
                id: `requirement-${controlId}-${Date.now()}-${index}`,
                text: item
            };
        }
        return {
            id: String(item.id || `requirement-${controlId}-${Date.now()}-${index}`),
            text: String(item.text || '')
        };
    });
}

function normalizeCreateTenderRequirementTableRows(rows = [], columns = [], controlId = 'table') {
    if (!Array.isArray(rows)) return [];
    return rows.map((row, index) => {
        const normalizedRow = {
            id: String(row?.id || `requirement-${controlId}-${Date.now()}-${index}`)
        };
        columns.forEach(column => {
            if (column.type === 'multiselect') {
                normalizedRow[column.id] = Array.isArray(row?.[column.id]) ? row[column.id].map(String) : [];
                return;
            }
            if (column.type === 'toggle') {
                normalizedRow[column.id] = Boolean(row?.[column.id]);
                return;
            }
            if (column.type !== 'index' && column.type !== 'calculated') {
                normalizedRow[column.id] = String(row?.[column.id] || '');
            }
        });
        return normalizedRow;
    });
}

function normalizeCreateTenderRequirementObjectRows(rows = [], fields = [], controlId = 'card') {
    if (!Array.isArray(rows)) return [];
    return rows.map((row, index) => {
        const normalizedRow = {
            id: String(row?.id || `requirement-${controlId}-${Date.now()}-${index}`)
        };
        fields.forEach(field => {
            if (field.type === 'multiselect') {
                normalizedRow[field.id] = Array.isArray(row?.[field.id]) ? row[field.id].map(String) : [];
                return;
            }
            if (field.type === 'toggle') {
                normalizedRow[field.id] = Boolean(row?.[field.id]);
                return;
            }
            normalizedRow[field.id] = String(row?.[field.id] || '');
        });
        return normalizedRow;
    });
}

function getCreateTenderRequirementControl(profileId = 'works', controlId = '') {
    const template = getCreateTenderRequirementTemplate(profileId);
    return template.sections
        .flatMap(section => section.controls || [])
        .find(control => control.id === controlId);
}

function renderCreateTenderRequirementSelectOptions(options = [], selectedValue = '') {
    return '<option value=""></option>' + options.map(option => {
        const optionValue = typeof option === 'object' && option !== null ? String(option.value || '') : String(option);
        const optionLabel = typeof option === 'object' && option !== null ? String(option.label || option.value || '') : String(option);
        return `<option value="${escapeCreateTenderHtml(optionValue)}" ${optionValue === String(selectedValue || '') ? 'selected' : ''}>${escapeCreateTenderHtml(optionLabel)}</option>`;
    }).join('');
}

function getCreateTenderRequirementSourceOptions(profileId = '', field = {}) {
    const sourceControlId = field.sourceControlId;
    if (!sourceControlId) return [];

    const sourceControl = getCreateTenderRequirementControl(profileId, sourceControlId);
    if (!sourceControl || sourceControl.type !== 'table') return [];

    const requirementDraft = getCreateTenderRequirementDraft(profileId);
    const rows = normalizeCreateTenderRequirementTableRows(
        requirementDraft.fields?.[sourceControlId],
        sourceControl.columns || [],
        sourceControlId
    );
    const labelField = field.sourceLabelField || 'label';

    return rows.map((row, index) => {
        const label = row[labelField] || `Item ${index + 1}`;
        return {
            value: row.id,
            label: `${index + 1}. ${label}`
        };
    });
}

function resolveCreateTenderRequirementFields(control, profileId = '') {
    return (control.fields || []).map(field => {
        if (field.type !== 'source-select') return field;
        return {
            ...field,
            type: 'select',
            options: getCreateTenderRequirementSourceOptions(profileId, field)
        };
    });
}

function resolveCreateTenderRequirementColumns(control, profileId = '') {
    return (control.columns || []).map(column => {
        if (column.type !== 'source-select') return column;
        return {
            ...column,
            type: 'select',
            options: getCreateTenderRequirementSourceOptions(profileId, column)
        };
    });
}

function getCreateTenderVisibleRequirementColumns(columns = [], rows = []) {
    return columns.filter(column => {
        if (!column.hideColumnUntilMatch || !column.showWhen) return true;
        return rows.some(row => String(row?.[column.showWhen.field] || '') === String(column.showWhen.value));
    });
}

function getCreateTenderRequirementCardTitle(control, card, cardIndex, fields = []) {
    const titleFieldId = control.cardTitleField;
    const titleField = fields.find(field => field.id === titleFieldId);
    const selectedValue = titleFieldId ? String(card[titleFieldId] || '') : '';
    const selectedOption = (titleField?.options || []).find(option => {
        const optionValue = typeof option === 'object' && option !== null ? String(option.value || '') : String(option);
        return optionValue === selectedValue;
    });
    const selectedLabel = selectedOption
        ? (typeof selectedOption === 'object' && selectedOption !== null ? String(selectedOption.label || selectedOption.value || '') : String(selectedOption))
        : '';

    if (selectedLabel && control.cardTitlePrefix) {
        return `${control.cardTitlePrefix} ${selectedLabel}`;
    }

    return control.cardTitle || `${control.label} ${cardIndex + 1}`;
}

function renderCreateTenderRequirementMultiSelect(options = [], selectedValues = [], attributes = '') {
    const selectedSet = new Set(Array.isArray(selectedValues) ? selectedValues.map(String) : []);
    return `
        <div class="requirement-multi-select">
            ${options.map(option => {
                const optionValue = String(option);
                return `
                    <label class="requirement-check-option">
                        <input type="checkbox" value="${escapeCreateTenderHtml(optionValue)}" ${selectedSet.has(optionValue) ? 'checked' : ''} ${attributes}>
                        <span>${escapeCreateTenderHtml(optionValue)}</span>
                    </label>
                `;
            }).join('')}
        </div>
    `;
}

function parseCreateTenderRequirementAmount(value) {
    const parsed = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
}

function calculateCreateTenderRequirementFormula(formula = '', row = {}) {
    if (formula.includes('*')) {
        return formula.split('*').map(part => parseCreateTenderRequirementAmount(row[part.trim()])).reduce((total, value) => total * value, 1);
    }
    if (formula.includes('+')) {
        return formula.split('+').map(part => parseCreateTenderRequirementAmount(row[part.trim()])).reduce((total, value) => total + value, 0);
    }
    return parseCreateTenderRequirementAmount(row[formula.trim()]);
}

function formatCreateTenderRequirementCalculatedValue(value) {
    return Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function renderCreateTenderRequirementField(field, value, attributes = '') {
    const requiredAttribute = field.required ? 'required' : '';
    if (field.type === 'select') {
        return `<select class="form-input" ${requiredAttribute} ${attributes}>${renderCreateTenderRequirementSelectOptions(field.options || [], value)}</select>`;
    }
    if (field.type === 'select-custom-prompt') {
        const optionValues = (field.options || []).map(getCreateTenderRequirementOptionValue);
        const selectedValue = String(value || '');
        const customOption = selectedValue && !optionValues.includes(selectedValue)
            ? `<option value="${escapeCreateTenderHtml(selectedValue)}" selected>${escapeCreateTenderHtml(selectedValue)}</option>`
            : '';
        return `<select class="form-input" ${requiredAttribute} ${attributes}>${customOption}${renderCreateTenderRequirementSelectOptions(field.options || [], value)}</select>`;
    }
    if (field.type === 'combobox') {
        const listId = `requirement-${field.id}-options`;
        return `
            <input class="form-input" type="text" list="${escapeCreateTenderHtml(listId)}" value="${escapeCreateTenderHtml(value || '')}" ${requiredAttribute} ${field.placeholder ? `placeholder="${escapeCreateTenderHtml(field.placeholder)}"` : ''} ${attributes}>
            <datalist id="${escapeCreateTenderHtml(listId)}">
                ${(field.options || []).map(option => `<option value="${escapeCreateTenderHtml(getCreateTenderRequirementOptionValue(option))}"></option>`).join('')}
            </datalist>
        `;
    }
    if (field.type === 'yesno') {
        const radioAttributes = attributes.replace(/\bid="[^"]*"\s*/g, '');
        const selectedValue = String(value || 'No');
        const name = `requirement-${field.id}`;
        return `
            <div class="requirement-choice-group" role="radiogroup" aria-label="${escapeCreateTenderHtml(field.label)}">
                ${['Yes', 'No'].map(option => `
                    <label class="requirement-choice-option">
                        <input type="radio" name="${escapeCreateTenderHtml(name)}" value="${option}" ${selectedValue === option ? 'checked' : ''} ${radioAttributes}>
                        <span>${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }
    if (field.type === 'choice') {
        const radioAttributes = attributes.replace(/\bid="[^"]*"\s*/g, '');
        const selectedValue = String(value || field.defaultValue || '');
        const name = `requirement-${field.id}`;
        return `
            <div class="requirement-choice-group" role="radiogroup" aria-label="${escapeCreateTenderHtml(field.label)}">
                ${(field.options || []).map(option => {
                    const optionValue = typeof option === 'object' && option !== null ? String(option.value || '') : String(option);
                    const optionLabel = typeof option === 'object' && option !== null ? String(option.label || option.value || '') : String(option);
                    return `
                        <label class="requirement-choice-option">
                            <input type="radio" name="${escapeCreateTenderHtml(name)}" value="${escapeCreateTenderHtml(optionValue)}" ${selectedValue === optionValue ? 'checked' : ''} ${radioAttributes}>
                            <span>${escapeCreateTenderHtml(optionLabel)}</span>
                        </label>
                    `;
                }).join('')}
            </div>
        `;
    }
    if (field.type === 'multiselect') {
        return renderCreateTenderRequirementMultiSelect(field.options || [], value, attributes);
    }
    if (field.type === 'toggle') {
        return `
            <label class="requirement-toggle">
                <input type="checkbox" ${value ? 'checked' : ''} ${attributes}>
                <span></span>
            </label>
        `;
    }
    if (field.type === 'textarea' || field.type === 'richtext') {
        return `<textarea class="form-input requirement-rich-input" rows="3" ${attributes}>${escapeCreateTenderHtml(value || '')}</textarea>`;
    }
    if (field.type === 'file') {
        return `
            <div class="requirement-file-field">
                <input class="form-input" type="file" ${field.accept ? `accept="${escapeCreateTenderHtml(field.accept)}"` : ''} ${attributes}>
                <span>${value ? escapeCreateTenderHtml(value) : 'No file selected'}</span>
            </div>
        `;
    }
    if (field.type === 'currency') {
        return `<input class="form-input requirement-currency-input" type="number" min="0" step="0.01" value="${escapeCreateTenderHtml(value || '')}" ${attributes}>`;
    }
    const inputMarkup = `<input class="form-input" type="${escapeCreateTenderHtml(field.type || 'text')}" value="${escapeCreateTenderHtml(value || '')}" ${requiredAttribute} ${field.placeholder ? `placeholder="${escapeCreateTenderHtml(field.placeholder)}"` : ''} ${attributes}>`;
    if (field.suffix) {
        return `<div class="requirement-input-affix">${inputMarkup}<span>${escapeCreateTenderHtml(field.suffix)}</span></div>`;
    }
    return inputMarkup;
}

function getCreateTenderRequirementHelperText(control = {}, value = '') {
    const selectedValue = String(value || '');
    if (control.helperDescriptions && selectedValue && control.helperDescriptions[selectedValue]) {
        return control.helperDescriptions[selectedValue];
    }
    return control.helperText || '';
}

function renderCreateTenderRequirementListRows(items = [], listId = '') {
    const normalizedItems = normalizeCreateTenderRequirementTextItems(items, listId);
    if (!normalizedItems.length) {
        return '<div class="scope-empty">No requirements added yet.</div>';
    }

    return normalizedItems.map(item => `
        <div class="requirement-list-row" data-requirement-row="${escapeCreateTenderHtml(item.id)}" data-requirement-list="${escapeCreateTenderHtml(listId)}">
            <input class="form-input requirement-list-input" value="${escapeCreateTenderHtml(item.text)}" data-requirement-list-input aria-label="Requirement item">
            <button class="boq-row-action icon-delete-btn" type="button" data-requirement-delete aria-label="Remove requirement" title="Remove requirement">${renderCreateTenderTrashIcon()}</button>
        </div>
    `).join('');
}

function renderCreateTenderRequirementControlList(control, value) {
    return `
        <div class="requirement-control-list" data-requirement-list-items="${escapeCreateTenderHtml(control.id)}">
            ${renderCreateTenderRequirementControlListItems(control, value)}
        </div>
        <button class="btn btn-secondary scope-add" type="button" data-requirement-control-add="${escapeCreateTenderHtml(control.id)}">${escapeCreateTenderHtml(control.addLabel || `Add ${control.label}`)}</button>
    `;
}

function renderCreateTenderRequirementControlListItems(control, value) {
    const items = normalizeCreateTenderRequirementTextItems(value, control.id);
    if (!items.length) {
        return `<div class="scope-empty">${escapeCreateTenderHtml(control.emptyText || 'No items added yet.')}</div>`;
    }

    return items.map(item => `
        <div class="requirement-control-row" data-requirement-control-row="${escapeCreateTenderHtml(item.id)}" data-requirement-control="${escapeCreateTenderHtml(control.id)}">
            <input class="form-input requirement-list-input" value="${escapeCreateTenderHtml(item.text)}" data-requirement-list-item aria-label="${escapeCreateTenderHtml(control.label)} item">
            <button class="boq-row-action icon-delete-btn" type="button" data-requirement-control-delete="${escapeCreateTenderHtml(control.id)}" aria-label="Remove ${escapeCreateTenderHtml(control.label)}" title="Remove item">${renderCreateTenderTrashIcon()}</button>
        </div>
    `).join('');
}

function renderCreateTenderRequirementTableRows(rows = [], control, profileId = '') {
    const columns = resolveCreateTenderRequirementColumns(control, profileId);
    const normalizedRows = normalizeCreateTenderRequirementTableRows(rows, columns, control.id);
    const visibleColumns = getCreateTenderVisibleRequirementColumns(columns, normalizedRows);
    if (!normalizedRows.length) {
        return `
            <tr>
                <td colspan="${visibleColumns.length + 1}">
                    <div class="scope-empty">${escapeCreateTenderHtml(control.emptyText || 'No rows added yet.')}</div>
                </td>
            </tr>
        `;
    }

    return normalizedRows.map((row, rowIndex) => `
        <tr data-requirement-table-row="${escapeCreateTenderHtml(row.id)}" data-requirement-control="${escapeCreateTenderHtml(control.id)}" data-requirement-table-row-index="${rowIndex}">
            ${visibleColumns.map(column => {
                if (column.type === 'index') {
                    return `<td><span class="requirement-auto-value">${rowIndex + 1}</span></td>`;
                }
                if (column.type === 'calculated') {
                    const calculatedValue = calculateCreateTenderRequirementFormula(column.formula, row);
                    return `<td><span class="requirement-auto-value" data-requirement-calculated-field="${escapeCreateTenderHtml(column.id)}">${formatCreateTenderRequirementCalculatedValue(calculatedValue)}</span></td>`;
                }
                const shouldShow = !column.showWhen || String(row[column.showWhen.field] || '') === String(column.showWhen.value);
                return `
                    <td ${shouldShow ? '' : 'class="requirement-conditional-cell muted"'}>
                        ${shouldShow
                            ? renderCreateTenderRequirementField(column, row[column.id], `data-requirement-table-field="${escapeCreateTenderHtml(column.id)}" aria-label="${escapeCreateTenderHtml(column.label)}"`)
                            : `<span class="requirement-auto-value">-</span>`}
                    </td>
                `;
            }).join('')}
            <td class="requirement-table-action-cell">
                <button class="boq-row-action icon-delete-btn" type="button" data-requirement-control-delete="${escapeCreateTenderHtml(control.id)}" aria-label="Remove row" title="Remove row">${renderCreateTenderTrashIcon()}</button>
            </td>
        </tr>
    `).join('');
}

function renderCreateTenderRequirementControlTable(control, value, profileId = '') {
    const columns = resolveCreateTenderRequirementColumns(control, profileId);
    const normalizedRows = normalizeCreateTenderRequirementTableRows(value, columns, control.id);
    const visibleColumns = getCreateTenderVisibleRequirementColumns(columns, normalizedRows);
    const sourceField = columns.find(column => column.sourceControlId);
    const sourceOptions = sourceField?.options || [];
    const shouldDisableAdd = Boolean(control.requiresSourceOptions && !sourceOptions.length);

    return `
        <div class="requirement-table-wrap" data-requirement-table-wrap="${escapeCreateTenderHtml(control.id)}">
            <table class="requirement-table" data-requirement-table="${escapeCreateTenderHtml(control.id)}">
                <thead>
                    <tr>
                        ${visibleColumns.map(column => `<th>${escapeCreateTenderHtml(column.label)}</th>`).join('')}
                        <th aria-label="Actions"></th>
                    </tr>
                </thead>
                <tbody data-requirement-table-body="${escapeCreateTenderHtml(control.id)}">
                    ${renderCreateTenderRequirementTableRows(value, control, profileId)}
                </tbody>
            </table>
        </div>
        ${shouldDisableAdd ? `<span class="form-hint">${escapeCreateTenderHtml(control.sourceEmptyText || 'Add a source item first.')}</span>` : ''}
        <button class="btn btn-secondary scope-add" type="button" data-requirement-control-add="${escapeCreateTenderHtml(control.id)}" ${shouldDisableAdd ? 'disabled' : ''}>${escapeCreateTenderHtml(control.addLabel || `Add ${control.label}`)}</button>
    `;
}

function renderCreateTenderRequirementCards(control, value, profileId = '') {
    const fields = resolveCreateTenderRequirementFields(control, profileId);
    const cards = normalizeCreateTenderRequirementObjectRows(value, fields, control.id);
    const sourceField = fields.find(field => field.sourceControlId);
    const sourceOptions = sourceField?.options || [];
    const shouldDisableAdd = Boolean(control.requiresSourceOptions && !sourceOptions.length);
    return `
        <div class="requirement-card-list" data-requirement-card-list="${escapeCreateTenderHtml(control.id)}">
            ${cards.length ? cards.map((card, cardIndex) => `
                <article class="requirement-repeater-card" data-requirement-card-row="${escapeCreateTenderHtml(card.id)}" data-requirement-control="${escapeCreateTenderHtml(control.id)}">
                    <div class="requirement-card-heading">
                        <strong>${escapeCreateTenderHtml(getCreateTenderRequirementCardTitle(control, card, cardIndex, fields))}</strong>
                        <button class="boq-row-action icon-delete-btn" type="button" data-requirement-control-delete="${escapeCreateTenderHtml(control.id)}" aria-label="Remove ${escapeCreateTenderHtml(control.label)}" title="Remove">${renderCreateTenderTrashIcon()}</button>
                    </div>
                    <div class="requirement-card-grid">
                        ${fields.map(field => {
                            const shouldShow = !field.showWhen || String(card[field.showWhen.field] || '') === String(field.showWhen.value);
                            return `
                                <label class="requirement-card-field ${field.type === 'textarea' || field.type === 'richtext' ? 'requirement-control-wide' : ''}" ${shouldShow ? '' : 'hidden'}>
                                    <span class="form-label">${escapeCreateTenderHtml(field.label)}</span>
                                    ${renderCreateTenderRequirementField(field, card[field.id], `data-requirement-card-field="${escapeCreateTenderHtml(field.id)}" aria-label="${escapeCreateTenderHtml(field.label)}"`)}
                                </label>
                            `;
                        }).join('')}
                    </div>
                </article>
            `).join('') : `<div class="scope-empty">${escapeCreateTenderHtml(control.emptyText || 'No items added yet.')}</div>`}
        </div>
        ${shouldDisableAdd ? `<span class="form-hint">${escapeCreateTenderHtml(control.sourceEmptyText || 'Add a source item first.')}</span>` : ''}
        <button class="btn btn-secondary scope-add" type="button" data-requirement-control-add="${escapeCreateTenderHtml(control.id)}" ${shouldDisableAdd ? 'disabled' : ''}>${escapeCreateTenderHtml(control.addLabel || `Add ${control.label}`)}</button>
    `;
}

function renderCreateTenderRequirementAccordion(control, value = {}) {
    const values = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return `
        <div class="requirement-accordion" data-requirement-accordion="${escapeCreateTenderHtml(control.id)}">
            ${(control.panels || []).map((panel, index) => `
                <details class="requirement-accordion-item" ${index === 0 ? 'open' : ''}>
                    <summary>${escapeCreateTenderHtml(panel.label)}</summary>
                    <textarea class="form-input requirement-rich-input" rows="5" data-requirement-accordion-field="${escapeCreateTenderHtml(panel.id)}" aria-label="${escapeCreateTenderHtml(panel.label)}">${escapeCreateTenderHtml(values[panel.id] || '')}</textarea>
                </details>
            `).join('')}
        </div>
    `;
}

function renderCreateTenderRequirementControl(control, value, profileId = '') {
    if (control.type === 'list') {
        return renderCreateTenderRequirementControlList(control, value);
    }

    if (control.type === 'table') {
        return renderCreateTenderRequirementControlTable(control, value, profileId);
    }

    if (control.type === 'cards') {
        return renderCreateTenderRequirementCards(control, value, profileId);
    }

    if (control.type === 'accordion') {
        return renderCreateTenderRequirementAccordion(control, value);
    }

    return renderCreateTenderRequirementField(control, value, `id="requirement-${escapeCreateTenderHtml(control.id)}" data-requirement-input="${escapeCreateTenderHtml(control.id)}"`);
}

function getCreateTenderPostLicenseRequirementSectionIds(profile = {}) {
    return profile.id === 'goods' ? ['eligibilityRequirements'] : [];
}

function renderCreateTenderRequirementSections(profile, mainDraft = getCreateTenderMainDraft(), options = {}) {
    const template = getCreateTenderRequirementTemplate(profile.id);
    const requirementDraft = getCreateTenderRequirementDraft(profile.id);
    const includeSectionIds = Array.isArray(options.includeSectionIds) ? new Set(options.includeSectionIds) : null;
    const excludeSectionIds = new Set(Array.isArray(options.excludeSectionIds) ? options.excludeSectionIds : []);
    const sections = template.sections.filter(section => {
        if (includeSectionIds && !includeSectionIds.has(section.id)) return false;
        return !excludeSectionIds.has(section.id);
    });

    if (!sections.length) return '';

    return `
        ${options.showHeader === false ? '' : `
            <div class="requirement-type-header">
                <div>
                    <span class="section-kicker">Tender requirements</span>
                    <h3>${escapeCreateTenderHtml(template.title)}</h3>
                </div>
                <span class="badge badge-info">${escapeCreateTenderHtml(profile.commercialName)}</span>
            </div>
        `}
        <div class="requirement-section-grid">
            ${sections.map(section => `
                <article class="requirement-block">
                    <div>
                        <h4>${escapeCreateTenderHtml(section.title)}</h4>
                        <span class="form-hint">${escapeCreateTenderHtml(section.hint)}</span>
                    </div>
                    <div class="requirement-control-grid">
                        ${(section.controls || []).filter(control => {
                            if (!control.showWhen) return true;
                            return String(requirementDraft.fields?.[control.showWhen.field] || '') === String(control.showWhen.value);
                        }).map(control => `
                            <div class="requirement-control ${['table', 'cards', 'accordion'].includes(control.type) ? 'requirement-control-wide' : ''}">
                                <span class="form-label">${escapeCreateTenderHtml(control.label)}</span>
                                ${renderCreateTenderRequirementControl(control, requirementDraft.fields?.[control.id], profile.id)}
                                ${getCreateTenderRequirementHelperText(control, requirementDraft.fields?.[control.id])
                                    ? `<span class="form-hint" data-requirement-helper="${escapeCreateTenderHtml(control.id)}">${escapeCreateTenderHtml(getCreateTenderRequirementHelperText(control, requirementDraft.fields?.[control.id]))}</span>`
                                    : ''}
                            </div>
                        `).join('')}
                    </div>
                </article>
            `).join('')}
        </div>
    `;
}

function isCreateTenderRequirementValueFilled(value) {
    if (Array.isArray(value)) {
        return value.some(item => {
            if (typeof item === 'string') return item.trim();
            if (!item || typeof item !== 'object') return false;
            return Object.entries(item).some(([key, entryValue]) => key !== 'id' && String(entryValue || '').trim());
        });
    }

    return String(value || '').trim().length > 0;
}

function getCreateTenderRequirementOptionValue(option) {
    return typeof option === 'object' && option !== null ? String(option.value || '') : String(option);
}

function isCreateTenderRequirementControlValid(control = {}, value = '') {
    if (!isCreateTenderRequirementValueFilled(value)) return false;
    if (control.type === 'select-custom-prompt') return String(value || '').trim() !== 'Other';
    if (control.type !== 'select') return true;
    const allowedValues = new Set((control.options || []).map(getCreateTenderRequirementOptionValue));
    return allowedValues.has(String(value || ''));
}

function getCreateTenderRequirementSummary(profile, mainDraft = getCreateTenderMainDraft()) {
    const template = getCreateTenderRequirementTemplate(profile.id);
    const fields = mainDraft.requirements?.[profile.id]?.fields || {};
    const controls = template.sections.flatMap(section => section.controls || []);
    const filledControls = controls.filter(control => isCreateTenderRequirementValueFilled(fields[control.id])).length;

    return {
        title: template.title,
        totalControls: controls.length,
        filledControls
    };
}

function getCreateTenderMissingRequiredRequirements(profile, mainDraft = getCreateTenderMainDraft()) {
    const template = getCreateTenderRequirementTemplate(profile.id);
    const fields = mainDraft.requirements?.[profile.id]?.fields || {};
    return template.sections
        .flatMap(section => section.controls || [])
        .filter(control => control.required)
        .filter(control => !control.showWhen || String(fields[control.showWhen.field] || '') === String(control.showWhen.value))
        .filter(control => !isCreateTenderRequirementControlValid(control, fields[control.id]));
}

function getCreateTenderEffectiveContractType(profileId = 'works') {
    const fields = getCreateTenderRequirementDraft(profileId).fields || {};
    return String(fields.contractType || '').trim();
}

function renderCreateTenderTrashIcon() {
    return `
        <svg class="trash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 6h18"></path>
            <path d="M8 6V4h8v2"></path>
            <path d="M19 6l-1 14H6L5 6"></path>
            <path d="M10 11v5"></path>
            <path d="M14 11v5"></path>
        </svg>
    `;
}

function getCreateTenderTypeId(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'goods' || raw === 'works' || raw === 'services' || raw === 'consultancy') return raw;
    if (raw === 'service' || raw === 'non consultancy' || raw === 'non-consultancy services' || raw === 'non consultancy services') return 'services';
    if (raw === 'consulting' || raw === 'consultant' || raw === 'consultancy services') return 'consultancy';
    return 'works';
}

function getCreateTenderTypeProfile(typeOrTender = 'works') {
    const typeId = typeof typeOrTender === 'object'
        ? getCreateTenderTypeId(typeOrTender.procurementTypeId || typeOrTender.id || typeOrTender.type || typeOrTender.label)
        : getCreateTenderTypeId(typeOrTender);
    return createTenderTypeProfiles[typeId] || createTenderTypeProfiles.works;
}

function getCreateTenderCurrentTypeProfile() {
    return getCreateTenderTypeProfile(getCreateTenderMainDraft().procurementTypeId || getCreateTenderSetup().defaultType.id);
}

function getCreateTenderCategoryFromWizard(wizard, selectedType) {
    return getCreateTenderWizardCategoryValue(wizard, '');
}

function parseCreateTenderNumber(value) {
    const parsed = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
}

function formatCreateTenderMoney(value) {
    return `TZS ${Math.round(parseCreateTenderNumber(value)).toLocaleString('en-US')}`;
}

function formatCreateTenderCompactMoney(value) {
    const amount = parseCreateTenderNumber(value);
    if (amount >= 1000000000) return `TZS ${(amount / 1000000000).toFixed(1).replace(/\.0$/, '')}B estimate`;
    if (amount >= 1000000) return `TZS ${(amount / 1000000).toFixed(1).replace(/\.0$/, '')}M estimate`;
    return `${formatCreateTenderMoney(amount)} estimate`;
}

function normalizeCreateTenderBoqItem(item, index = 0) {
    return {
        id: item.id || `boq-${Date.now()}-${index}`,
        item: String(item.item || `${index + 1}.1`),
        description: String(item.description || ''),
        qty: parseCreateTenderNumber(item.qty),
        unit: String(item.unit || ''),
        rate: parseCreateTenderNumber(item.rate)
    };
}

function normalizeCreateTenderScopeItem(item, index = 0, prefix = 'item') {
    return {
        id: item.id || `${prefix}-${Date.now()}-${index}`,
        text: String(item.text || '')
    };
}

function getCreateTenderRegulatoryLicenseByName(licenseName) {
    return createTenderRegulatoryLicenseCatalog.find(item => item.license === licenseName)
        || createTenderRegulatoryLicenseCatalog[0];
}

function normalizeCreateTenderRegulatoryLicense(item, index = 0) {
    const catalogItem = getCreateTenderRegulatoryLicenseByName(item.license);
    return {
        id: item.id || `license-${Date.now()}-${index}`,
        license: String(item.license || catalogItem.license),
        body: String(item.body || catalogItem.body),
        mandatory: item.mandatory !== undefined ? Boolean(item.mandatory) : true,
        expiryRequired: item.expiryRequired !== undefined ? Boolean(item.expiryRequired) : true
    };
}

function normalizeCreateTenderContactDetails(details = {}) {
    return {
        tenderLocation: String(details.tenderLocation || defaultCreateTenderContact.tenderLocation),
        contactName: String(details.contactName || defaultCreateTenderContact.contactName),
        phone: String(details.phone || defaultCreateTenderContact.phone),
        email: String(details.email || defaultCreateTenderContact.email),
        phoneVerified: Boolean(details.phoneVerified),
        emailVerified: Boolean(details.emailVerified)
    };
}

function coerceCreateTenderFixedMilestones(items = []) {
    return defaultCreateTenderMilestones.map((fixedItem) => {
        const savedItem = items.find(item => item.id === fixedItem.id || item.name === fixedItem.name);
        return {
            ...fixedItem,
            date: String(savedItem?.date || fixedItem.date)
        };
    });
}

function ensureCreateTenderDraft() {
    if (!mockData.createTenderDraft) {
        mockData.createTenderDraft = {};
    }
    return mockData.createTenderDraft;
}

function getCreateTenderStoredItems(storageKey, fallback = []) {
    try {
        const storedValue = localStorage.getItem(storageKey);
        if (storedValue === null) return fallback;
        const parsed = JSON.parse(storedValue);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
        localStorage.removeItem(storageKey);
        return fallback;
    }
}

function getCreateTenderStoredObject(storageKey, fallback = {}) {
    try {
        const storedValue = localStorage.getItem(storageKey);
        if (storedValue === null) return fallback;
        const parsed = JSON.parse(storedValue);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
        localStorage.removeItem(storageKey);
        return fallback;
    }
}

function getCreateTenderMainDraft() {
    const draft = ensureCreateTenderDraft();
    if (draft.mainDetails) return draft.mainDetails;

    draft.mainDetails = {
        ...defaultCreateTenderMainDraft,
        ...getCreateTenderStoredObject(createTenderDraftStorageKey, {})
    };
    draft.mainDetails.method = normalizeCreateTenderMethod(draft.mainDetails.method);
    draft.mainDetails.categories = getCreateTenderSelectedCategories(draft.mainDetails);
    draft.mainDetails.category = draft.mainDetails.categories.join(', ');
    return draft.mainDetails;
}

function saveCreateTenderMainDraft(details = {}) {
    const draft = ensureCreateTenderDraft();
    draft.mainDetails = {
        ...defaultCreateTenderMainDraft,
        ...draft.mainDetails,
        ...details
    };
    draft.mainDetails.method = normalizeCreateTenderMethod(draft.mainDetails.method);
    draft.mainDetails.categories = getCreateTenderSelectedCategories(draft.mainDetails);
    draft.mainDetails.category = draft.mainDetails.categories.join(', ');
    localStorage.setItem(createTenderDraftStorageKey, JSON.stringify(draft.mainDetails));
    return draft.mainDetails;
}

function getCreateTenderInvitedUsers() {
    const draft = ensureCreateTenderDraft();
    const mainDetails = getCreateTenderMainDraft();
    if (Array.isArray(draft.invitedUsers)) return draft.invitedUsers;
    draft.invitedUsers = Array.isArray(mainDetails.invitedUsers)
        ? mainDetails.invitedUsers.map(normalizeCreateTenderInvitedUser).filter(user => user.name)
        : [];
    return draft.invitedUsers;
}

function saveCreateTenderInvitedUsers(users = []) {
    const draft = ensureCreateTenderDraft();
    draft.invitedUsers = users.map(normalizeCreateTenderInvitedUser).filter(user => user.name);
    saveCreateTenderMainDraft({ invitedUsers: draft.invitedUsers });
    return draft.invitedUsers;
}

function getCreateTenderSavedDraft() {
    const savedDraft = getCreateTenderStoredObject(createTenderDraftStorageKey, null);
    return savedDraft?.status === 'Saved as draft' ? savedDraft : null;
}

function getCreateTenderContactDetails() {
    const draft = ensureCreateTenderDraft();
    if (draft.contactDetails) return draft.contactDetails;

    const storedDetails = getCreateTenderStoredObject(createTenderContactStorageKey, defaultCreateTenderContact);
    draft.contactDetails = normalizeCreateTenderContactDetails(storedDetails);
    return draft.contactDetails;
}

function saveCreateTenderContactDetails(details) {
    const draft = ensureCreateTenderDraft();
    draft.contactDetails = normalizeCreateTenderContactDetails(details);
    localStorage.setItem(createTenderContactStorageKey, JSON.stringify(draft.contactDetails));
}

function getCreateTenderBoqItems(profile = getCreateTenderCurrentTypeProfile()) {
    const draft = ensureCreateTenderDraft();
    const profileId = profile.id;
    if (Array.isArray(draft.boqItems) && draft.commercialType === profileId) return draft.boqItems;

    const storedItems = getCreateTenderStoredItems(createTenderBoqStorageKey);
    const storedType = localStorage.getItem(createTenderCommercialTypeStorageKey);
    draft.commercialType = profileId;
    draft.boqItems = (storedItems.length && storedType === profileId ? storedItems : profile.defaultItems).map(normalizeCreateTenderBoqItem);
    return draft.boqItems;
}

function saveCreateTenderBoqItems(items, profile = getCreateTenderCurrentTypeProfile()) {
    const draft = ensureCreateTenderDraft();
    draft.commercialType = profile.id;
    draft.boqItems = items.map(normalizeCreateTenderBoqItem);
    localStorage.setItem(createTenderCommercialTypeStorageKey, profile.id);
    localStorage.setItem(createTenderBoqStorageKey, JSON.stringify(draft.boqItems));
}

function getCreateTenderMilestones() {
    const draft = ensureCreateTenderDraft();
    if (Array.isArray(draft.milestones)) {
        draft.milestones = coerceCreateTenderFixedMilestones(draft.milestones);
        return draft.milestones;
    }

    const storedMilestones = getCreateTenderStoredItems(createTenderMilestoneStorageKey);
    draft.milestones = coerceCreateTenderFixedMilestones(storedMilestones.length ? storedMilestones : defaultCreateTenderMilestones);
    return draft.milestones;
}

function saveCreateTenderMilestones(items) {
    const draft = ensureCreateTenderDraft();
    draft.milestones = coerceCreateTenderFixedMilestones(items);
    localStorage.setItem(createTenderMilestoneStorageKey, JSON.stringify(draft.milestones));
}

function getCreateTenderScopeItems(draftKey, storageKey, defaultItems, prefix, typeKey, typeStorageKey, profile = getCreateTenderCurrentTypeProfile()) {
    const draft = ensureCreateTenderDraft();
    const profileId = profile.id;
    if (Array.isArray(draft[draftKey]) && draft[typeKey] === profileId) return draft[draftKey];

    const storedItems = getCreateTenderStoredItems(storageKey);
    const storedType = localStorage.getItem(typeStorageKey);
    draft[typeKey] = profileId;
    draft[draftKey] = (storedItems.length && storedType === profileId ? storedItems : defaultItems)
        .map((item, index) => normalizeCreateTenderScopeItem(item, index, prefix));
    return draft[draftKey];
}

function getCreateTenderDeliverables(profile = getCreateTenderCurrentTypeProfile()) {
    return getCreateTenderScopeItems('deliverables', createTenderDeliverableStorageKey, profile.defaultDeliverables, 'deliverable', 'deliverableType', createTenderDeliverableTypeStorageKey, profile);
}

function getCreateTenderRequiredAttachments(profile = getCreateTenderCurrentTypeProfile()) {
    return getCreateTenderScopeItems('requiredAttachments', createTenderAttachmentStorageKey, profile.defaultAttachments, 'attachment', 'attachmentType', createTenderAttachmentTypeStorageKey, profile);
}

function saveCreateTenderScopeItems(draftKey, storageKey, items, prefix, typeKey, typeStorageKey, profile = getCreateTenderCurrentTypeProfile()) {
    const draft = ensureCreateTenderDraft();
    draft[typeKey] = profile.id;
    draft[draftKey] = items.map((item, index) => normalizeCreateTenderScopeItem(item, index, prefix));
    localStorage.setItem(typeStorageKey, profile.id);
    localStorage.setItem(storageKey, JSON.stringify(draft[draftKey]));
}

function saveCreateTenderDeliverables(items, profile = getCreateTenderCurrentTypeProfile()) {
    saveCreateTenderScopeItems('deliverables', createTenderDeliverableStorageKey, items, 'deliverable', 'deliverableType', createTenderDeliverableTypeStorageKey, profile);
}

function saveCreateTenderRequiredAttachments(items, profile = getCreateTenderCurrentTypeProfile()) {
    saveCreateTenderScopeItems('requiredAttachments', createTenderAttachmentStorageKey, items, 'attachment', 'attachmentType', createTenderAttachmentTypeStorageKey, profile);
}

function getCreateTenderRegulatoryLicenses(profile = getCreateTenderCurrentTypeProfile()) {
    const draft = ensureCreateTenderDraft();
    const profileId = profile.id;
    if (Array.isArray(draft.regulatoryLicenses) && draft.regulatoryLicenseType === profileId) return draft.regulatoryLicenses;

    const storedItems = getCreateTenderStoredItems(createTenderLicenseStorageKey);
    const storedType = localStorage.getItem(createTenderLicenseTypeStorageKey);
    draft.regulatoryLicenseType = profileId;
    draft.regulatoryLicenses = (storedItems.length && storedType === profileId ? storedItems : defaultCreateTenderRegulatoryLicenses)
        .map(normalizeCreateTenderRegulatoryLicense);
    return draft.regulatoryLicenses;
}

function saveCreateTenderRegulatoryLicenses(items, profile = getCreateTenderCurrentTypeProfile()) {
    const draft = ensureCreateTenderDraft();
    draft.regulatoryLicenseType = profile.id;
    draft.regulatoryLicenses = items.map(normalizeCreateTenderRegulatoryLicense);
    localStorage.setItem(createTenderLicenseTypeStorageKey, profile.id);
    localStorage.setItem(createTenderLicenseStorageKey, JSON.stringify(draft.regulatoryLicenses));
}

function getCreateTenderBoqTotal(items = getCreateTenderBoqItems()) {
    return items.reduce((total, item) => total + (parseCreateTenderNumber(item.qty) * parseCreateTenderNumber(item.rate)), 0);
}

function isCreateTenderValidPhone(value) {
    return /^\+?[0-9\s().-]{7,}$/.test(String(value || '').trim());
}

function isCreateTenderValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function getCreateTenderContactSummary(contact = getCreateTenderContactDetails()) {
    const phoneValid = isCreateTenderValidPhone(contact.phone);
    const emailValid = isCreateTenderValidEmail(contact.email);
    const verifiedCount = [contact.phoneVerified && phoneValid, contact.emailVerified && emailValid].filter(Boolean).length;
    const providedCount = [contact.phone.trim(), contact.email.trim()].filter(Boolean).length;

    return {
        phoneValid,
        emailValid,
        verifiedCount,
        providedCount,
        complete: Boolean(contact.tenderLocation.trim() && contact.contactName.trim() && verifiedCount)
    };
}

function getCreateTenderDateValue(date) {
    const time = Date.parse(`${date}T00:00:00`);
    return Number.isFinite(time) ? time : null;
}

function formatCreateTenderDate(date) {
    const time = typeof date === 'number' ? date : getCreateTenderDateValue(date);
    if (!Number.isFinite(time)) return 'No date set';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(time));
}

function getCreateTenderMilestoneSummary(items = getCreateTenderMilestones()) {
    const datedItems = items
        .map(item => getCreateTenderDateValue(item.date))
        .filter(time => Number.isFinite(time))
        .sort((first, second) => first - second);
    const start = datedItems[0] || null;
    const end = datedItems[datedItems.length - 1] || null;
    const days = start && end ? Math.round((end - start) / 86400000) : 0;

    return {
        count: items.length,
        datedCount: datedItems.length,
        start,
        end,
        days
    };
}

function getProcurexStoredPublishedTenders() {
    try {
        const parsed = JSON.parse(localStorage.getItem(createTenderPublishedStorageKey) || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        localStorage.removeItem(createTenderPublishedStorageKey);
        return [];
    }
}

function saveProcurexPublishedTenders(items) {
    localStorage.setItem(createTenderPublishedStorageKey, JSON.stringify(items));
}

function mergeProcurexTenders(baseTenders = mockData.tenders || []) {
    const published = getProcurexStoredPublishedTenders();
    const publishedIds = new Set(published.map(tender => tender.id));
    return [
        ...published,
        ...baseTenders.filter(tender => !publishedIds.has(tender.id))
    ];
}

function isProcurexTenderPast(tender) {
    const closingTime = Date.parse(`${tender.closingDate}T23:59:59`);
    return Number.isFinite(closingTime) && closingTime < Date.now();
}

function isProcurexTenderVisibleToCurrentUser(tender) {
    if (tender.visibility !== 'Invited suppliers only') return true;
    if (tender.createdByCurrentUser) return true;

    const supplier = mockData.users?.supplier || {};
    const currentSupplierNames = new Set([supplier.name, supplier.organization].filter(Boolean).map(value => value.toLowerCase()));
    return (tender.invitedUsers || []).some(user => (
        currentSupplierNames.has(String(user.name || '').toLowerCase())
        || currentSupplierNames.has(String(user.organization || '').toLowerCase())
    ));
}

function getProcurexMarketplaceTenders() {
    return mergeProcurexTenders().filter(tender => (
        tender.status === 'Open'
        && !isProcurexTenderPast(tender)
        && isProcurexTenderVisibleToCurrentUser(tender)
    ));
}

function getProcurexAllTenders() {
    return mergeProcurexTenders();
}

function getProcurexBuyerActiveTenders() {
    return mergeProcurexTenders().filter(tender => tender.createdByCurrentUser && tender.status === 'Open' && !isProcurexTenderPast(tender));
}

function getProcurexTenderHistoryRecords() {
    return mergeProcurexTenders().filter(tender => tender.status !== 'Open' || isProcurexTenderPast(tender));
}

function selectProcurexTender(tenderId) {
    if (!tenderId) return;
    mockData.selectedTenderId = tenderId;
    localStorage.setItem(createTenderSelectedTenderStorageKey, tenderId);
}

function getProcurexSelectedTender() {
    const tenders = mergeProcurexTenders();
    const selectedId = mockData.selectedTenderId || localStorage.getItem(createTenderSelectedTenderStorageKey);
    return tenders.find(tender => tender.id === selectedId)
        || getProcurexBuyerActiveTenders()[0]
        || tenders[0];
}

function publishCreateTenderToMarketplace(wizard) {
    const setup = getCreateTenderSetup();
    const selectedTypeId = wizard.querySelector('input[name="procurementType"]:checked')?.value || setup.defaultType.id;
    const selectedType = setup.types.find(type => type.id === selectedTypeId) || setup.defaultType;
    const title = wizard.querySelector('[data-tender-title]')?.value.trim() || '';
    const method = normalizeCreateTenderMethod(wizard.querySelector('[data-procurement-method]')?.value);
    const categories = getCreateTenderWizardCategories(wizard);
    const category = categories.join(', ');
    const invitedUsers = getCreateTenderInvitedUsers();
    const visibility = getCreateTenderVisibilityForMethod(method);
    const visibilityNote = getCreateTenderVisibilityNoteForMethod(method, invitedUsers.length);
    const contact = getCreateTenderContactDetails();
    const milestones = getCreateTenderMilestones();
    const closingDate = milestones.find(item => item.id === 'milestone-closing')?.date || milestones[milestones.length - 1]?.date || '';
    const profile = getCreateTenderTypeProfile(selectedType);
    const requirementSummary = getCreateTenderRequirementSummary(profile, getCreateTenderMainDraft());
    const boqItems = getCreateTenderBoqItems(profile);
    const budget = getCreateTenderBoqTotal(boqItems);
    const documents = getCreateTenderRequiredAttachments(profile).map(item => item.text).filter(Boolean);
    const now = new Date();
    const tenderId = `TP-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`;
    const publishedTender = {
        id: tenderId,
        title,
        type: selectedType.label,
        procurementTypeId: profile.id,
        status: 'Open',
        budget,
        closingDate,
        organization: mockData.users?.buyer?.organization || 'Buyer organization',
        description: requirementSummary.filledControls
            ? `${requirementSummary.filledControls} structured requirement fields configured.`
            : 'Structured tender requirements pending.',
        eligibility: `${method} / ${category}`,
        documents,
        requirements: getCreateTenderRequirementDraft(profile.id),
        regulatoryLicenses: getCreateTenderRegulatoryLicenses(profile),
        category,
        categories,
        method,
        visibility,
        visibilityNote,
        invitedUsers,
        location: contact.tenderLocation,
        contactName: contact.contactName,
        contactPhone: contact.phone,
        contactEmail: contact.email,
        createdByCurrentUser: true,
        publishedAt: now.toISOString(),
        boqItems,
        commercialItems: boqItems,
        commercialModel: profile.commercialName,
        commercialLabel: profile.reviewLabel,
        contractType: getCreateTenderEffectiveContractType(profile.id),
        deliverables: getCreateTenderDeliverables(profile).map(item => item.text).filter(Boolean),
        milestones,
        amendments: [
            { title: 'No amendments published', status: 'Ready', detail: `Create an amendment if scope, ${profile.commercialName}, or timeline changes.` }
        ],
        clarifications: [],
        interestedSuppliers: []
    };
    const stored = getProcurexStoredPublishedTenders().filter(tender => tender.id !== publishedTender.id);
    saveProcurexPublishedTenders([publishedTender, ...stored]);
    mockData.tenders = mergeProcurexTenders(mockData.tenders || []);
    localStorage.removeItem(createTenderDraftStorageKey);
    delete ensureCreateTenderDraft().mainDetails;
    selectProcurexTender(publishedTender.id);
    return publishedTender;
}

function saveCreateTenderDraftFromWizard(wizard) {
    const setup = getCreateTenderSetup();
    const selectedTypeId = wizard.querySelector('input[name="procurementType"]:checked')?.value || setup.defaultType.id;
    const selectedType = setup.types.find(type => type.id === selectedTypeId) || setup.defaultType;
    const profile = getCreateTenderTypeProfile(selectedType);
    const title = wizard.querySelector('[data-tender-title]')?.value.trim() || '';
    const currentDraft = getCreateTenderMainDraft();
    const details = saveCreateTenderMainDraft({
        title,
        scope: currentDraft.scope || defaultCreateTenderMainDraft.scope,
        procurementTypeId: selectedType.id,
        method: normalizeCreateTenderMethod(wizard.querySelector('[data-procurement-method]')?.value),
        category: getCreateTenderWizardCategoryValue(wizard, ''),
        categories: getCreateTenderWizardCategories(wizard),
        visibility: getCreateTenderVisibilityForMethod(wizard.querySelector('[data-procurement-method]')?.value),
        visibilityNote: getCreateTenderVisibilityNoteForMethod(wizard.querySelector('[data-procurement-method]')?.value, getCreateTenderInvitedUsers().length),
        invitedUsers: getCreateTenderInvitedUsers(),
        status: 'Saved as draft',
        savedAt: new Date().toISOString(),
        attachmentCount: getCreateTenderRequiredAttachments(profile).length,
        deliverableCount: getCreateTenderDeliverables(profile).length,
        licenseCount: getCreateTenderRegulatoryLicenses(profile).length,
        budget: getCreateTenderBoqTotal(getCreateTenderBoqItems(profile)),
        commercialModel: profile.commercialName
    });
    return details;
}

function renderCreateTenderCommercialTableHead(profile = getCreateTenderCurrentTypeProfile()) {
    return '<tr><th>Code</th><th>Requirement</th><th>Qty / Duration</th><th>Unit</th><th>Rate / Fee</th><th>Amount</th><th></th></tr>';
}

function renderCreateTenderBoqRows(items = getCreateTenderBoqItems(), profile = getCreateTenderCurrentTypeProfile()) {
    if (!items.length) {
        return `
            <tr class="boq-empty-row">
                <td colspan="7">${profile.commercialEmptyText}</td>
            </tr>
        `;
    }

    return items.map((item) => {
        const amount = parseCreateTenderNumber(item.qty) * parseCreateTenderNumber(item.rate);
        return `
            <tr data-boq-row="${escapeCreateTenderHtml(item.id)}">
                <td><input class="form-input boq-input boq-code" value="${escapeCreateTenderHtml(item.item)}" data-boq-field="item" aria-label="${profile.commercialName} line code"></td>
                <td><input class="form-input boq-input boq-description" value="${escapeCreateTenderHtml(item.description)}" data-boq-field="description" aria-label="${profile.commercialName} requirement"></td>
                <td><input class="form-input boq-input boq-number" type="number" min="0" step="0.01" value="${escapeCreateTenderHtml(item.qty)}" data-boq-field="qty" aria-label="${profile.commercialName} quantity or duration"></td>
                <td><input class="form-input boq-input boq-unit" value="${escapeCreateTenderHtml(item.unit)}" data-boq-field="unit" aria-label="${profile.commercialName} unit"></td>
                <td><input class="form-input boq-input boq-number" type="number" min="0" step="1000" value="${escapeCreateTenderHtml(item.rate)}" data-boq-field="rate" aria-label="${profile.commercialName} rate or fee"></td>
                <td class="boq-amount" data-boq-amount>${formatCreateTenderMoney(amount)}</td>
                <td><button class="boq-row-action icon-delete-btn" type="button" data-boq-delete aria-label="Delete ${profile.commercialItemName}" title="Delete ${profile.commercialItemName}">${renderCreateTenderTrashIcon()}</button></td>
            </tr>
        `;
    }).join('');
}

function renderCreateTenderMilestoneRows(items = getCreateTenderMilestones()) {
    return items.map((item) => `
        <div class="timeline-tile milestone-tile" data-milestone-row="${escapeCreateTenderHtml(item.id)}">
            <div class="fixed-milestone-name">
                <span>Milestone</span>
                <strong>${escapeCreateTenderHtml(item.name)}</strong>
            </div>
            <label>
                <span>Date</span>
                <input class="form-input milestone-input" type="date" value="${escapeCreateTenderHtml(item.date)}" data-milestone-field="date" aria-label="Milestone date">
            </label>
        </div>
    `).join('');
}

function renderCreateTenderScopeRows(items, type, emptyText) {
    if (!items.length) {
        return `<div class="scope-empty" data-scope-empty="${type}">${emptyText}</div>`;
    }

    const label = type === 'deliverables' ? 'Deliverable item' : 'Attachment item';
    return items.map((item) => `
        <div class="scope-item-row" data-scope-row="${escapeCreateTenderHtml(item.id)}" data-scope-type="${type}">
            <input class="form-input scope-item-input" value="${escapeCreateTenderHtml(item.text)}" data-scope-item-input aria-label="${label}">
            <button class="boq-row-action icon-delete-btn scope-delete" type="button" data-scope-delete aria-label="Delete ${label.toLowerCase()}" title="Delete ${label.toLowerCase()}">${renderCreateTenderTrashIcon()}</button>
        </div>
    `).join('');
}

function renderCreateTenderRegulatoryLicenseRows(items = []) {
    if (!items.length) {
        return '<div class="scope-empty">No regulatory license requirements added yet.</div>';
    }

    return items.map(item => {
        const selectedLicense = getCreateTenderRegulatoryLicenseByName(item.license);
        const body = item.body || selectedLicense.body;
        return `
            <div class="license-requirement-row" data-license-row="${escapeCreateTenderHtml(item.id)}">
                <div class="license-summary">
                    <span>License</span>
                    <strong>${escapeCreateTenderHtml(selectedLicense.license)}</strong>
                    <small>${escapeCreateTenderHtml(body)}</small>
                    <div class="license-picker" data-license-picker hidden>
                        <input class="form-input" type="search" data-license-search autocomplete="off" placeholder="Search license" aria-label="Search regulatory license">
                        <div class="license-results" data-license-results role="listbox" aria-label="Matching licenses"></div>
                    </div>
                </div>
                <div class="license-toggle-cell">
                    <span>Mandatory</span>
                    <label class="requirement-toggle">
                        <input type="checkbox" data-license-field="mandatory" ${item.mandatory ? 'checked' : ''}>
                        <span></span>
                    </label>
                </div>
                <div class="license-toggle-cell">
                    <span>Expiry required</span>
                    <label class="requirement-toggle">
                        <input type="checkbox" data-license-field="expiryRequired" ${item.expiryRequired ? 'checked' : ''}>
                        <span></span>
                    </label>
                </div>
                <div class="license-row-actions">
                    <button class="btn btn-secondary" type="button" data-license-change>Change</button>
                    <button class="boq-row-action icon-delete-btn" type="button" data-license-delete aria-label="Remove license requirement" title="Remove license requirement">${renderCreateTenderTrashIcon()}</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderCreateTenderProfileCard(title, items = []) {
    if (!items.length) return '';
    return `
        <article class="review-card">
            <span>${escapeCreateTenderHtml(title)}</span>
            <strong>${escapeCreateTenderHtml(items[0])}</strong>
            <small>${items.slice(1).map(escapeCreateTenderHtml).join(', ')}</small>
        </article>
    `;
}

function renderCreateTenderProfileCards(profile) {
    return `
        <div class="review-summary-grid" style="margin-bottom: 20px;">
            ${renderCreateTenderProfileCard('Planning documents', profile.planningDocuments)}
            ${renderCreateTenderProfileCard('Tender documents', profile.documentLabels)}
            ${renderCreateTenderProfileCard('Key requirements', profile.keyRequirements)}
            ${renderCreateTenderProfileCard('Submission documents', profile.submissionDocuments)}
            ${renderCreateTenderProfileCard('Evaluation flow', profile.evaluationFlow)}
            ${renderCreateTenderProfileCard('Contract structure', profile.contractRequirements)}
            <article class="review-card">
                <span>Evaluation style</span>
                <strong>${escapeCreateTenderHtml(profile.evaluationStyle.split(',')[0])}</strong>
                <small>${escapeCreateTenderHtml(profile.evaluationStyle)}</small>
            </article>
        </div>
    `;
}

function renderCreateTender() {
    const procurementSetup = getCreateTenderSetup();
    const mainDraft = getCreateTenderMainDraft();
    const selectedType = procurementSetup.types.find(type => type.id === mainDraft.procurementTypeId) || procurementSetup.defaultType;
    const selectedCategories = getCreateTenderSelectedCategories(mainDraft);
    const categorySummary = selectedCategories.join(', ');
    const selectedProfile = getCreateTenderTypeProfile(selectedType);
    const contactDetails = getCreateTenderContactDetails();
    const contactSummary = getCreateTenderContactSummary(contactDetails);
    const boqItems = getCreateTenderBoqItems(selectedProfile);
    const boqTotal = getCreateTenderBoqTotal(boqItems);
    const milestones = getCreateTenderMilestones();
    const milestoneSummary = getCreateTenderMilestoneSummary(milestones);
    const deliverables = getCreateTenderDeliverables(selectedProfile);
    const requiredAttachments = getCreateTenderRequiredAttachments(selectedProfile);
    const regulatoryLicenses = getCreateTenderRegulatoryLicenses(selectedProfile);
    const requirementSummary = getCreateTenderRequirementSummary(selectedProfile, mainDraft);
    const tenderMethod = normalizeCreateTenderMethod(mainDraft.method);
    const invitedUsers = getCreateTenderInvitedUsers();
    const isClosedTender = isCreateTenderClosedMethod(tenderMethod);
    const steps = [
        ['01', 'Basic Information', 'Tender location and contact'],
        ['02', 'Tender Planning', 'Type, category, method, invitations'],
        ['03', 'Tender Requirements', `${requirementSummary.title}, licenses`],
        ['04', 'Evaluation Criteria & Weights', 'Criteria, weights, pass marks'],
        ['05', 'Publish Tender', 'Portal, invitations, vendor notifications'],
        ['06', 'Pre-Bid & Review', 'Clarifications, addenda, final review']
    ];

    return `
        <div class="main-layout">
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Create Tender</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Design and publication package</div>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="procurement-dashboard">Procurement Dashboard</a></li>
                    <li><a href="#" data-navigate="buyer-journey">Buyer Journey</a></li>
                    <li><a href="#" data-navigate="supplier-marketplace">Marketplace</a></li>
                    <li><a href="#" data-navigate="records-history">Records & History</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <div class="main-content">
                <div class="journey-page tender-wizard-page">
                    <section class="journey-hero compact">
                        <div>
                            <span class="badge badge-info">Procurement design</span>
                            <h1>Create Tender Wizard</h1>
                            <p>Build a tender package that matches the procurement nature, then publish it directly to the marketplace.</p>
                        </div>
                        <div class="hero-action-stack">
                            <button class="btn btn-secondary" type="button" data-save-tender-draft>Save Draft</button>
                        </div>
                    </section>

                    <div class="wizard-shell" data-create-tender-wizard>
                        <aside class="wizard-rail">
                            ${steps.map((step, index) => `
                                <a href="#wizard-step-${index + 1}" class="wizard-rail-step ${index === 0 ? 'active' : ''}" data-wizard-step-index="${index}">
                                    <strong>${step[0]}</strong>
                                    <span>${step[1]}</span>
                                </a>
                            `).join('')}
                        </aside>

                        <div class="wizard-workspace">
                            <section class="journey-panel active" id="wizard-step-1">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 1</span>
                                        <h2>Basic Information</h2>
                                    </div>
                                    <span class="badge ${contactSummary.complete ? 'badge-success' : 'badge-warning'}" data-contact-status-badge>${contactSummary.complete ? 'Contact verified' : 'Verify contact'}</span>
                                </div>
                                <div class="contact-detail-grid">
                                    <div class="form-group">
                                        <label class="form-label">Location of tender</label>
                                        <input class="form-input" value="${escapeCreateTenderHtml(contactDetails.tenderLocation)}" data-contact-field="tenderLocation" aria-label="Location of tender">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Contact person or department</label>
                                        <input class="form-input" value="${escapeCreateTenderHtml(contactDetails.contactName)}" data-contact-field="contactName" aria-label="Contact person or department">
                                    </div>
                                    <div class="form-group contact-verify-field">
                                        <label class="form-label">Department number</label>
                                        <div class="contact-verify-row">
                                            <input class="form-input" value="${escapeCreateTenderHtml(contactDetails.phone)}" data-contact-field="phone" aria-label="Department number">
                                            <button class="btn btn-secondary" type="button" data-contact-verify="phone">Verify</button>
                                        </div>
                                        <span class="form-hint" data-contact-status="phone">${contactDetails.phoneVerified && contactSummary.phoneValid ? 'Phone verified' : contactSummary.phoneValid ? 'Phone ready to verify' : 'Enter a valid phone number'}</span>
                                    </div>
                                    <div class="form-group contact-verify-field">
                                        <label class="form-label">Department email</label>
                                        <div class="contact-verify-row">
                                            <input class="form-input" type="email" value="${escapeCreateTenderHtml(contactDetails.email)}" data-contact-field="email" aria-label="Department email">
                                            <button class="btn btn-secondary" type="button" data-contact-verify="email">Verify</button>
                                        </div>
                                        <span class="form-hint" data-contact-status="email">${contactDetails.emailVerified && contactSummary.emailValid ? 'Email verified' : contactSummary.emailValid ? 'Email ready to verify' : 'Enter a valid email address'}</span>
                                    </div>
                                </div>
                                           <div class="planning-section">
                                    <div class="scope-list-heading">
                                        <div>
                                            <h3>Tender details</h3>
                                            <span class="form-hint">Enter the tender title and key dates before preparing documents.</span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="form-group">
                                            <label class="form-label">Tender title</label>
                                            <input class="form-input" value="${escapeCreateTenderHtml(mainDraft.title)}" aria-label="Tender title" data-tender-title>
                                        </div>
                                        <div class="form-grid two">
                                        <div class="form-group">
                                            <label class="form-label">Submission deadline</label>
                                            <input class="form-input" type="date" value="${escapeCreateTenderHtml(milestones.find(item => item.id === 'milestone-closing')?.date || '')}" data-milestone-field="date" data-milestone-row-proxy="milestone-closing" aria-label="Submission deadline">
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Opening date</label>
                                            <input class="form-input" type="date" value="${escapeCreateTenderHtml(milestones.find(item => item.id === 'milestone-opening')?.date || '')}" data-milestone-field="date" data-milestone-row-proxy="milestone-opening" aria-label="Opening date">
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-2">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 2</span>
                                        <h2>Tender Planning</h2>
                                    </div>
                                    <span class="badge badge-success">Method valid</span>
                                </div>
                                <div class="planning-section">
                                    <div class="scope-list-heading">
                                        <div>
                                            <h3>Procurement classification</h3>
                                            <span class="form-hint">Choose the procurement type, then search and select the matching category.</span>
                                        </div>
                                    </div>
                                    <div class="option-grid four" data-procurement-type-grid>
                                        ${procurementSetup.types.map(type => `
                                            <label class="option-card ${type.id === selectedType.id ? 'selected' : ''}" data-procurement-type-card>
                                                <input type="radio" name="procurementType" value="${type.id}" ${type.id === selectedType.id ? 'checked' : ''}>
                                                <strong>${type.label}</strong>
                                                <span>${type.description}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                    <div class="form-group category-selector-panel">
                                        <label class="form-label">Category</label>
                                        <div class="category-picker" data-category-picker>
                                            <input class="form-input" data-procurement-category-search aria-label="Search procurement categories" placeholder="Search categories">
                                            <div class="category-results" data-category-results role="listbox"></div>
                                        </div>
                                        <div class="custom-category-field" data-custom-category-group hidden>
                                            <label class="form-label">Custom category</label>
                                            <div class="custom-category-add-row">
                                                <input class="form-input" data-custom-category aria-label="Custom category" placeholder="Write custom category" disabled>
                                                <button class="btn btn-secondary" type="button" data-custom-category-add>Add</button>
                                            </div>
                                        </div>
                                        <div class="selected-category-list single-category-mode" data-selected-category-list>
                                            ${renderCreateTenderSelectedCategoryRows(selectedCategories)}
                                        </div>
                                    </div>
                                </div>
                                <div class="planning-section tender-method-section">
                                    <div class="scope-list-heading">
                                        <div>
                                            <h3>Procurement method</h3>
                                            <span class="form-hint">Open tenders go to the public marketplace. Invited tenders are sent only to selected suppliers.</span>
                                        </div>
                                    </div>
                                    <div class="method-inner-panel">
                                        <div class="form-group">
                                            <label class="form-label">Method</label>
                                            <select class="form-input" name="procurementMethod" data-procurement-method>
                                                ${renderCreateTenderOptions(procurementSetup.methods, tenderMethod)}
                                            </select>
                                            <span class="form-hint" data-method-visibility-note>${escapeCreateTenderHtml(getCreateTenderVisibilityNoteForMethod(tenderMethod, invitedUsers.length))}</span>
                                        </div>
                                        <div class="closed-tender-invitations" data-closed-tender-panel ${isClosedTender ? '' : 'hidden'}>
                                            <div class="scope-list-heading">
                                                <div>
                                                    <h3>Invited suppliers</h3>
                                                    <span class="form-hint">Search users, add preferred suppliers to the invite list, and remove them anytime.</span>
                                                </div>
                                                <span class="badge badge-info" data-invited-user-count>${invitedUsers.length}</span>
                                            </div>
                                            <div class="invite-picker">
                                                <input class="form-input" data-invite-search aria-label="Search suppliers to invite" placeholder="Search supplier users">
                                                <div class="invite-results" data-invite-results role="listbox"></div>
                                            </div>
                                            <div class="invited-user-list" data-invited-user-list>
                                                ${renderCreateTenderInvitedUserRows(invitedUsers)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-3">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 3</span>
                                        <h2 data-profile-requirement-title>Tender Requirements</h2>
                                    </div>
                                    <span class="badge badge-warning" data-requirement-type-badge>${escapeCreateTenderHtml(requirementSummary.title)}</span>
                                </div>
                                <div data-requirement-sections>
                                    ${renderCreateTenderRequirementSections(selectedProfile, mainDraft, {
                                        excludeSectionIds: getCreateTenderPostLicenseRequirementSectionIds(selectedProfile)
                                    })}
                                </div>
                                <div class="scope-list-panel license-requirements-panel">
                                    <div class="scope-list-heading">
                                        <div>
                                            <h3>Regulatory license requirements</h3>
                                            <span class="form-hint">Search and select the licenses suppliers must hold for this tender. The issuing body is filled automatically.</span>
                                        </div>
                                        <span class="badge badge-info" data-license-count>${regulatoryLicenses.length}</span>
                                    </div>
                                    <div class="license-requirement-list" data-license-list>
                                        ${renderCreateTenderRegulatoryLicenseRows(regulatoryLicenses)}
                                    </div>
                                    <button class="btn btn-secondary scope-add" type="button" data-license-add>Add License Requirement</button>
                                    <div class="license-add-picker" data-license-add-picker hidden>
                                        <input class="form-input" type="search" data-license-add-search autocomplete="off" placeholder="Search all licenses" aria-label="Search all regulatory licenses">
                                        <div class="license-results" data-license-add-results role="listbox" aria-label="Available regulatory licenses"></div>
                                    </div>
                                </div>
                                <div data-post-license-requirement-sections>
                                    ${renderCreateTenderRequirementSections(selectedProfile, mainDraft, {
                                        includeSectionIds: getCreateTenderPostLicenseRequirementSectionIds(selectedProfile),
                                        showHeader: false
                                    })}
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-4">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 4</span>
                                        <h2>Evaluation Criteria & Weights</h2>
                                    </div>
                                    <span class="badge badge-success">100% balanced</span>
                                </div>
                                <div class="criteria-grid">
                                    ${selectedProfile.evaluationCriteria.map(item => `
                                        <div class="criterion-row">
                                            <div><strong>${item[0]}</strong><span>${item[2]}</span></div>
                                            <input type="number" class="form-input" value="${item[1]}" min="0" max="100">
                                            <span>%</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-5">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 5</span>
                                        <h2>Publish Tender</h2>
                                    </div>
                                    <span class="badge badge-success" data-milestone-badge>${milestoneSummary.count} milestones</span>
                                </div>
                                <div class="review-summary-grid" style="margin-bottom: 20px;">
                                    <article class="review-card">
                                        <span>Publish channel</span>
                                        <strong data-publish-visibility>${escapeCreateTenderHtml(getCreateTenderVisibilityForMethod(tenderMethod))}</strong>
                                        <small data-publish-visibility-note>${escapeCreateTenderHtml(getCreateTenderVisibilityNoteForMethod(tenderMethod, invitedUsers.length))}</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Vendor notification</span>
                                        <strong>Notify eligible vendors</strong>
                                        <small>Public portal listing and invited supplier alerts are prepared.</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Deadline enforcement</span>
                                        <strong>Auto-lock at closing</strong>
                                        <small>Bid submissions lock after the configured deadline.</small>
                                    </article>
                                </div>
                                <div class="timeline-summary-strip">
                                    <div><span>Milestones</span><strong data-milestone-count>${milestoneSummary.count}</strong></div>
                                    <div><span>Start</span><strong data-milestone-start>${formatCreateTenderDate(milestoneSummary.start)}</strong></div>
                                    <div><span>End</span><strong data-milestone-end>${formatCreateTenderDate(milestoneSummary.end)}</strong></div>
                                    <div><span>Window</span><strong data-milestone-window>${milestoneSummary.days ? `${milestoneSummary.days} days` : 'Set dates'}</strong></div>
                                </div>
                                <div class="timeline-grid timeline-editor" data-milestone-list>
                                    ${renderCreateTenderMilestoneRows(milestones)}
                                </div>
                            </section>

                            <section class="journey-panel review-panel" id="wizard-step-6">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 6</span>
                                        <h2>Pre-Bid Phase & Buyer Review</h2>
                                    </div>
                                    <span class="badge badge-info" data-review-readiness>Review required</span>
                                </div>
                                <div class="review-summary-grid" style="margin-bottom: 20px;">
                                    <article class="review-card">
                                        <span>Clarifications</span>
                                        <strong>Enabled before deadline</strong>
                                        <small>Suppliers can ask questions and buyer answers stay in the tender record.</small>
                                    </article>
                                    <article class="review-card">
                                        <span>${selectedProfile.id === 'works' ? 'Site visits' : 'Pre-bid session'}</span>
                                        <strong>${selectedProfile.id === 'works' ? 'Site visit allowed' : 'Optional briefing'}</strong>
                                        <small>${selectedProfile.id === 'works' ? 'Works tenders can include site conditions and visit schedules.' : 'Buyer can issue briefing notes or responses as addenda.'}</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Addenda</span>
                                        <strong>Versioned updates</strong>
                                        <small>Changes to documents, dates, or requirements are published as addenda.</small>
                                    </article>
                                </div>
                                <div class="review-summary-grid">
                                    <article class="review-card">
                                        <span>Tender</span>
                                        <strong data-review-title>Tender not set</strong>
                                        <small data-review-scope>${requirementSummary.filledControls ? `${requirementSummary.filledControls} of ${requirementSummary.totalControls} requirement fields started` : 'Requirements not started'}</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Location & contact</span>
                                        <strong data-review-contact>${escapeCreateTenderHtml(contactDetails.tenderLocation)}</strong>
                                        <small data-review-contact-status>${contactSummary.complete ? 'Contact verified' : 'Verification pending'}</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Procurement</span>
                                        <strong data-review-procurement>${selectedType.label}</strong>
                                        <small data-review-category>${escapeCreateTenderHtml(categorySummary)}</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Visibility</span>
                                        <strong data-review-visibility>${escapeCreateTenderHtml(getCreateTenderVisibilityForMethod(tenderMethod))}</strong>
                                        <small data-review-visibility-note>${escapeCreateTenderHtml(getCreateTenderVisibilityNoteForMethod(tenderMethod, invitedUsers.length))}</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Requirements</span>
                                        <strong data-review-scope-count>${requirementSummary.filledControls + regulatoryLicenses.length} items</strong>
                                        <small data-review-scope-breakdown>${requirementSummary.filledControls} requirement fields, ${regulatoryLicenses.length} licenses</small>
                                    </article>
                                    <article class="review-card">
                                        <span data-review-commercial-label>${selectedProfile.reviewLabel}</span>
                                        <strong data-review-boq-total>${formatCreateTenderMoney(boqTotal)}</strong>
                                        <small data-review-boq-count>${boqItems.length} line items</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Timeline</span>
                                        <strong data-review-timeline>${formatCreateTenderDate(milestoneSummary.start)} to ${formatCreateTenderDate(milestoneSummary.end)}</strong>
                                        <small data-review-window>${milestoneSummary.days ? `${milestoneSummary.days} days` : 'Milestone dates pending'}</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Evaluation</span>
                                        <strong data-review-evaluation>100% balanced</strong>
                                        <small>5 weighted criteria</small>
                                    </article>
                                </div>
                                <div class="review-checklist">
                                    <div><strong>Buyer confirmation</strong><span data-review-confirmation>Review scope, licenses, ${selectedProfile.commercialName}, timeline, evaluation, and visibility before publishing.</span></div>
                                    <div><strong>Publication result</strong><span>Submission publishes the tender to the marketplace and opens buyer management controls.</span></div>
                                </div>
                                <div class="submit-strip buyer-review-submit">
                                    <div>
                                        <strong>Submit and publish reviewed tender</strong>
                                        <span>The tender becomes active in the marketplace and appears in your dashboard.</span>
                                    </div>
                                    <button class="btn btn-primary" type="button" data-publish-tender>Submit and Publish</button>
                                </div>
                            </section>

                            <div class="wizard-flow-controls" data-wizard-flow-controls>
                                <button class="btn btn-secondary" type="button" data-wizard-prev>Back</button>
                                <div class="wizard-flow-progress">
                                    <strong data-wizard-progress>Step 1 of ${steps.length}</strong>
                                    <span data-wizard-step-title>${steps[0][1]}</span>
                                </div>
                                <button class="btn btn-primary" type="button" data-wizard-next>Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initializeCreateTenderWizard() {
    const wizard = document.querySelector('[data-create-tender-wizard]');
    if (!wizard || wizard.dataset.ready === 'true') return;

    const setup = getCreateTenderSetup();
    const methodSelect = wizard.querySelector('[data-procurement-method]');
    const customCategoryGroup = wizard.querySelector('[data-custom-category-group]');
    const customCategoryInput = wizard.querySelector('[data-custom-category]');
    const customCategoryAddButton = wizard.querySelector('[data-custom-category-add]');
    const categorySearchInput = wizard.querySelector('[data-procurement-category-search]');
    const categoryResults = wizard.querySelector('[data-category-results]');
    const categoryPicker = wizard.querySelector('[data-category-picker]');
    const customCategoryWrap = customCategoryGroup;
    const selectedCategoryList = wizard.querySelector('[data-selected-category-list]');
    const closedTenderPanel = wizard.querySelector('[data-closed-tender-panel]');
    const inviteSearchInput = wizard.querySelector('[data-invite-search]');
    const inviteResults = wizard.querySelector('[data-invite-results]');
    const invitedUserList = wizard.querySelector('[data-invited-user-list]');
    const invitedUserCount = wizard.querySelector('[data-invited-user-count]');
    const methodVisibilityNote = wizard.querySelector('[data-method-visibility-note]');
    const panels = Array.from(wizard.querySelectorAll('.wizard-workspace > .journey-panel'));
    const railSteps = Array.from(wizard.querySelectorAll('[data-wizard-step-index]'));
    const previousButton = wizard.querySelector('[data-wizard-prev]');
    const nextButton = wizard.querySelector('[data-wizard-next]');
    const progressOutput = wizard.querySelector('[data-wizard-progress]');
    const stepTitleOutput = wizard.querySelector('[data-wizard-step-title]');
    let activeStepIndex = 0;

    const renderOptions = (select, options, selectedValue = '') => {
        if (!select) return;
        select.innerHTML = renderCreateTenderOptions(options, selectedValue);
    };

    const syncCustomCategoryField = () => {
        if (!customCategoryGroup || !customCategoryInput) return;

        const showCustomCategory = customCategoryGroup?.dataset.visible === 'true';
        customCategoryGroup.hidden = !showCustomCategory;
        customCategoryGroup.setAttribute('aria-hidden', showCustomCategory ? 'false' : 'true');
        customCategoryGroup.classList.toggle('visible', showCustomCategory);
        customCategoryInput.disabled = !showCustomCategory;
    };

    const getSelectedProfile = () => {
        const selectedTypeId = wizard.querySelector('input[name="procurementType"]:checked')?.value || setup.defaultType.id;
        return getCreateTenderTypeProfile(selectedTypeId);
    };

    const getSelectedProcurementType = () => {
        const selectedTypeId = wizard.querySelector('input[name="procurementType"]:checked')?.value || setup.defaultType.id;
        return setup.types.find(type => type.id === selectedTypeId) || setup.defaultType;
    };

    const setCategoryResultsOpen = (isOpen) => {
        if (!categoryResults) return;
        categoryResults.classList.toggle('open', Boolean(isOpen));
    };

    const getSelectedCategories = () => getCreateTenderWizardCategories(wizard);

    const saveSelectedCategories = (categories = getSelectedCategories()) => {
        const normalizedCategories = normalizeCreateTenderCategories(categories);
        saveCreateTenderMainDraft({
            categories: normalizedCategories,
            category: normalizedCategories.join(', ')
        });
        return normalizedCategories;
    };

    const renderSelectedCategories = (categories = getSelectedCategories()) => {
        const normalizedCategories = normalizeCreateTenderCategories(categories);
        if (selectedCategoryList) {
            selectedCategoryList.innerHTML = renderCreateTenderSelectedCategoryRows(normalizedCategories);
        }
        const summary = normalizedCategories.join(', ');
        const summaryInput = wizard.querySelector('[data-tender-category-summary]');
        if (summaryInput) summaryInput.value = summary;
        return normalizedCategories;
    };

    const setCustomCategoryVisible = (isVisible) => {
        if (!customCategoryGroup || !customCategoryInput) return;
        customCategoryGroup.dataset.visible = isVisible ? 'true' : 'false';
        syncCustomCategoryField();
        if (isVisible) {
            if (customCategoryAddButton) customCategoryAddButton.disabled = !customCategoryInput.value.trim();
            customCategoryInput.focus();
        } else {
            customCategoryInput.value = '';
            if (customCategoryAddButton) customCategoryAddButton.disabled = true;
        }
    };

    const addSelectedCategory = (category) => {
        const normalizedCategory = String(category || '').trim();
        if (!normalizedCategory || isCreateTenderOtherCategory(normalizedCategory)) return;
        const categories = saveSelectedCategories([normalizedCategory]);
        renderSelectedCategories(categories);
        if (categorySearchInput) categorySearchInput.value = '';
        setCategoryResultsOpen(false);
        setCustomCategoryVisible(false);
        refreshTenderReview();
    };

    const removeSelectedCategory = (category) => {
        const categories = saveSelectedCategories(getSelectedCategories().filter(item => item !== category));
        renderSelectedCategories(categories);
        renderCategoryResults(categorySearchInput?.value || '');
        refreshTenderReview();
    };

    const renderCategoryResults = (query = '') => {
        if (!categoryResults) return;
        const selectedType = getSelectedProcurementType();
        const selectedCategoryKeys = new Set(getSelectedCategories().map(category => category.toLowerCase()));
        const terms = String(query || '')
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);
        const matches = selectedType.categories
            .filter(category => !selectedCategoryKeys.has(category.toLowerCase()))
            .filter(category => terms.every(term => category.toLowerCase().includes(term)))
            .slice(0, 12);
        const matchText = matches.length
            ? matches.map(category => `
                <button type="button" class="category-result-option" data-category-option="${escapeCreateTenderHtml(category)}" role="option">
                    ${escapeCreateTenderHtml(category)}
                </button>
            `).join('')
            : '<div class="category-result-empty">No matching listed category</div>';

        categoryResults.innerHTML = `
            ${matchText}
            <button type="button" class="category-result-option other" data-category-other role="option">Other</button>
        `;
        setCategoryResultsOpen(true);
    };

    const selectCategoryOption = (value) => {
        if (isCreateTenderOtherCategory(value)) {
            setCustomCategoryVisible(true);
            setCategoryResultsOpen(false);
            return;
        }
        addSelectedCategory(value);
    };

    const selectOtherCategory = () => {
        setCustomCategoryVisible(true);
        setCategoryResultsOpen(false);
    };

    const getCurrentMethod = () => normalizeCreateTenderMethod(methodSelect?.value);

    const renderInvitedUsers = () => {
        const invitedUsers = getCreateTenderInvitedUsers();
        if (invitedUserList) invitedUserList.innerHTML = renderCreateTenderInvitedUserRows(invitedUsers);
        if (invitedUserCount) invitedUserCount.textContent = String(invitedUsers.length);
        if (methodVisibilityNote) {
            methodVisibilityNote.textContent = getCreateTenderVisibilityNoteForMethod(getCurrentMethod(), invitedUsers.length);
        }
    };

    const renderInviteResults = (query = '') => {
        if (!inviteResults) return;
        const terms = String(query || '')
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);
        const invitedIds = new Set(getCreateTenderInvitedUsers().map(user => user.id));
        const matches = getCreateTenderInvitableUsers()
            .filter(user => !invitedIds.has(user.id))
            .filter(user => {
                const searchable = `${user.name} ${user.organization} ${user.email} ${user.trustTier} ${user.risk}`.toLowerCase();
                return terms.every(term => searchable.includes(term));
            })
            .slice(0, 8);

        inviteResults.innerHTML = matches.length
            ? matches.map(user => `
                <button type="button" class="invite-result-option" data-invite-user="${escapeCreateTenderHtml(user.id)}" role="option">
                    <strong>${escapeCreateTenderHtml(user.name)}</strong>
                    <span>${escapeCreateTenderHtml(user.organization || 'Supplier')}</span>
                </button>
            `).join('')
            : '<div class="invite-result-empty">No matching supplier users</div>';
        inviteResults.classList.toggle('open', true);
    };

    const setInviteResultsOpen = (isOpen) => {
        inviteResults?.classList.toggle('open', Boolean(isOpen));
    };

    const addInvitedUser = (userId) => {
        const user = getCreateTenderInvitableUsers().find(item => item.id === userId);
        if (!user) return;
        const invitedUsers = getCreateTenderInvitedUsers();
        if (!invitedUsers.some(item => item.id === user.id)) {
            saveCreateTenderInvitedUsers([...invitedUsers, user]);
        }
        if (inviteSearchInput) inviteSearchInput.value = '';
        renderInvitedUsers();
        renderInviteResults('');
        saveMainDetailsFromInputs();
        refreshTenderReview();
    };

    const removeInvitedUser = (userId) => {
        saveCreateTenderInvitedUsers(getCreateTenderInvitedUsers().filter(user => user.id !== userId));
        renderInvitedUsers();
        renderInviteResults(inviteSearchInput?.value || '');
        saveMainDetailsFromInputs();
        refreshTenderReview();
    };

    const syncTenderMethod = () => {
        const method = getCurrentMethod();
        const invitedCount = getCreateTenderInvitedUsers().length;
        const closed = isCreateTenderClosedMethod(method);
        if (closedTenderPanel) {
            closedTenderPanel.hidden = !closed;
            closedTenderPanel.setAttribute('aria-hidden', closed ? 'false' : 'true');
        }
        if (methodVisibilityNote) {
            methodVisibilityNote.textContent = getCreateTenderVisibilityNoteForMethod(method, invitedCount);
        }
        renderInvitedUsers();
    };

    const refreshProfileText = () => {
        const profile = getSelectedProfile();
        const requirementSummary = getCreateTenderRequirementSummary(profile, getCreateTenderMainDraft());
        const updateText = (selector, value) => {
            const node = wizard.querySelector(selector);
            if (node) node.textContent = value;
        };
        updateText('[data-profile-requirement-title]', 'Tender Requirements');
        updateText('[data-requirement-type-badge]', requirementSummary.title);
        updateText('[data-profile-attachment-hint]', profile.attachmentHint);
        updateText('[data-commercial-title]', profile.commercialTitle);
        updateText('[data-commercial-count-label]', `${profile.commercialItemName}s`);
        updateText('[data-review-commercial-label]', profile.reviewLabel);
        updateText('[data-review-confirmation]', `Review requirements, licenses, ${profile.commercialName}, timeline, evaluation, and visibility before publishing.`);
        const requirementSections = wizard.querySelector('[data-requirement-sections]');
        const postLicenseSectionIds = getCreateTenderPostLicenseRequirementSectionIds(profile);
        if (requirementSections) {
            requirementSections.innerHTML = renderCreateTenderRequirementSections(profile, getCreateTenderMainDraft(), {
                excludeSectionIds: postLicenseSectionIds
            });
        }
        const postLicenseRequirementSections = wizard.querySelector('[data-post-license-requirement-sections]');
        if (postLicenseRequirementSections) {
            postLicenseRequirementSections.innerHTML = renderCreateTenderRequirementSections(profile, getCreateTenderMainDraft(), {
                includeSectionIds: postLicenseSectionIds,
                showHeader: false
            });
        }

        const evaluationRail = railSteps[3]?.querySelector('span');
        if (evaluationRail) evaluationRail.textContent = 'Evaluation Criteria & Weights';
        const commercialHead = wizard.querySelector('[data-boq-editor] thead');
        if (commercialHead) commercialHead.innerHTML = renderCreateTenderCommercialTableHead(profile);
        const importButton = wizard.querySelector('[data-boq-import]');
        if (importButton) importButton.textContent = profile.importLabel;
        const addButton = wizard.querySelector('[data-boq-add]');
        if (addButton) addButton.textContent = profile.addLabel;
        if (stepTitleOutput) stepTitleOutput.textContent = railSteps[activeStepIndex]?.querySelector('span')?.textContent || '';
    };

    const syncProcurementType = (typeId) => {
        const selectedType = setup.types.find(type => type.id === typeId) || setup.defaultType;
        wizard.querySelectorAll('[data-procurement-type-card]').forEach(card => {
            const input = card.querySelector('input[name="procurementType"]');
            card.classList.toggle('selected', input?.value === selectedType.id);
        });
        renderOptions(methodSelect, setup.methods, getCurrentMethod());
        renderSelectedCategories([]);
        if (customCategoryInput) customCategoryInput.value = '';
        setCustomCategoryVisible(false);
        syncCustomCategoryField();
        saveCreateTenderMainDraft({
            procurementTypeId: selectedType.id,
            category: '',
            categories: []
        });
        renderBoqTable();
        renderScopeList('deliverables');
        renderLicenseList();
        renderScopeList('attachments');
        refreshProfileText();
    };

    const saveMainDetailsFromInputs = () => {
        const selectedTypeId = wizard.querySelector('input[name="procurementType"]:checked')?.value || setup.defaultType.id;
        const selectedType = setup.types.find(type => type.id === selectedTypeId) || setup.defaultType;
        const currentDraft = getCreateTenderMainDraft();
        saveCreateTenderMainDraft({
            title: wizard.querySelector('[data-tender-title]')?.value.trim() || defaultCreateTenderMainDraft.title,
            scope: currentDraft.scope || defaultCreateTenderMainDraft.scope,
            procurementTypeId: selectedType.id,
            method: normalizeCreateTenderMethod(methodSelect?.value),
            category: getCreateTenderWizardCategoryValue(wizard, ''),
            categories: getSelectedCategories(),
            visibility: getCreateTenderVisibilityForMethod(methodSelect?.value),
            visibilityNote: getCreateTenderVisibilityNoteForMethod(methodSelect?.value, getCreateTenderInvitedUsers().length),
            invitedUsers: getCreateTenderInvitedUsers()
        });
    };

    const refreshContactSummary = () => {
        const contact = getCreateTenderContactDetails();
        const summary = getCreateTenderContactSummary(contact);
        const badge = wizard.querySelector('[data-contact-status-badge]');
        const phoneStatus = wizard.querySelector('[data-contact-status="phone"]');
        const emailStatus = wizard.querySelector('[data-contact-status="email"]');
        const verifiedCount = wizard.querySelector('[data-contact-verified-count]');

        if (badge) {
            badge.textContent = summary.complete ? 'Contact verified' : 'Verify contact';
            badge.classList.toggle('badge-success', summary.complete);
            badge.classList.toggle('badge-warning', !summary.complete);
        }
        if (phoneStatus) {
            phoneStatus.textContent = contact.phoneVerified && summary.phoneValid
                ? 'Phone verified'
                : summary.phoneValid
                    ? 'Phone ready to verify'
                    : 'Enter a valid phone number';
        }
        if (emailStatus) {
            emailStatus.textContent = contact.emailVerified && summary.emailValid
                ? 'Email verified'
                : summary.emailValid
                    ? 'Email ready to verify'
                    : 'Enter a valid email address';
        }
        if (verifiedCount) verifiedCount.textContent = String(summary.verifiedCount);
    };

    const updateContactField = (input) => {
        const field = input.dataset.contactField;
        if (!field) return;

        const contact = getCreateTenderContactDetails();
        contact[field] = input.value;
        if (field === 'phone') contact.phoneVerified = false;
        if (field === 'email') contact.emailVerified = false;
        saveCreateTenderContactDetails(contact);
        refreshContactSummary();
    };

    const verifyContactChannel = (channel) => {
        const contact = getCreateTenderContactDetails();
        if (channel === 'phone') {
            contact.phoneVerified = isCreateTenderValidPhone(contact.phone);
        }
        if (channel === 'email') {
            contact.emailVerified = isCreateTenderValidEmail(contact.email);
        }
        saveCreateTenderContactDetails(contact);
        refreshContactSummary();
    };

    const refreshBoqSummary = () => {
        const profile = getSelectedProfile();
        const items = getCreateTenderBoqItems(profile);
        const total = getCreateTenderBoqTotal(items);
        const average = items.length ? total / items.length : 0;
        const itemCount = wizard.querySelector('[data-boq-item-count]');
        const totalOutput = wizard.querySelector('[data-boq-total]');
        const averageOutput = wizard.querySelector('[data-boq-average]');
        const estimateBadge = wizard.querySelector('[data-boq-estimate-badge]');

        if (itemCount) itemCount.textContent = String(items.length);
        if (totalOutput) totalOutput.textContent = formatCreateTenderMoney(total);
        if (averageOutput) averageOutput.textContent = formatCreateTenderMoney(average);
        if (estimateBadge) estimateBadge.textContent = formatCreateTenderCompactMoney(total);
    };

    const renderBoqTable = () => {
        const body = wizard.querySelector('[data-boq-table-body]');
        if (!body) return;
        const profile = getSelectedProfile();
        body.innerHTML = renderCreateTenderBoqRows(getCreateTenderBoqItems(profile), profile);
        refreshProfileText();
        refreshBoqSummary();
    };

    const refreshMilestoneSummary = () => {
        const milestones = getCreateTenderMilestones();
        const summary = getCreateTenderMilestoneSummary(milestones);
        const badge = wizard.querySelector('[data-milestone-badge]');
        const count = wizard.querySelector('[data-milestone-count]');
        const start = wizard.querySelector('[data-milestone-start]');
        const end = wizard.querySelector('[data-milestone-end]');
        const windowOutput = wizard.querySelector('[data-milestone-window]');

        if (badge) badge.textContent = summary.datedCount < summary.count ? 'Dates pending' : `${summary.count} milestones`;
        if (count) count.textContent = String(summary.count);
        if (start) start.textContent = formatCreateTenderDate(summary.start);
        if (end) end.textContent = formatCreateTenderDate(summary.end);
        if (windowOutput) windowOutput.textContent = summary.days ? `${summary.days} days` : 'Set dates';
    };

    const getScopeItemsByType = (type) => (
        type === 'attachments' ? getCreateTenderRequiredAttachments(getSelectedProfile()) : getCreateTenderDeliverables(getSelectedProfile())
    );

    const saveScopeItemsByType = (type, items) => {
        if (type === 'attachments') {
            saveCreateTenderRequiredAttachments(items, getSelectedProfile());
            return;
        }
        saveCreateTenderDeliverables(items, getSelectedProfile());
    };

    const refreshLicenseSummary = () => {
        const count = wizard.querySelector('[data-license-count]');
        if (count) count.textContent = String(getCreateTenderRegulatoryLicenses(getSelectedProfile()).length);
    };

    const renderLicenseList = () => {
        const list = wizard.querySelector('[data-license-list]');
        if (!list) return;
        list.innerHTML = renderCreateTenderRegulatoryLicenseRows(getCreateTenderRegulatoryLicenses(getSelectedProfile()));
        refreshLicenseSummary();
    };

    const setLicenseResultsOpen = (row, isOpen) => {
        row?.querySelector('[data-license-results]')?.classList.toggle('open', Boolean(isOpen));
    };

    const setLicensePickerOpen = (row, isOpen) => {
        const picker = row?.querySelector('[data-license-picker]');
        if (!picker) return;
        picker.hidden = !isOpen;
        picker.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        setLicenseResultsOpen(row, isOpen);
    };

    const setLicenseAddPickerOpen = (isOpen) => {
        const picker = wizard.querySelector('[data-license-add-picker]');
        if (!picker) return;
        picker.hidden = !isOpen;
        picker.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        picker.querySelector('[data-license-add-results]')?.classList.toggle('open', Boolean(isOpen));
    };

    const renderLicenseResultsInto = (results, query = '', optionAttribute = 'data-license-option') => {
        if (!results) return;

        const terms = String(query || '')
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);
        const matches = createTenderRegulatoryLicenseCatalog
            .filter(item => {
                const searchable = `${item.group} ${item.license} ${item.body}`.toLowerCase();
                return terms.every(term => searchable.includes(term));
            });

        results.innerHTML = matches.length
            ? matches.map(item => `
                <button type="button" class="license-result-option" ${optionAttribute}="${escapeCreateTenderHtml(item.license)}" role="option">
                    <strong>${escapeCreateTenderHtml(item.license)}</strong>
                    <span>${escapeCreateTenderHtml(item.body)}</span>
                </button>
            `).join('')
            : '<div class="license-result-empty">No matching license</div>';
        results.classList.toggle('open', true);
    };

    const renderLicenseResults = (row, query = '') => {
        const results = row?.querySelector('[data-license-results]');
        renderLicenseResultsInto(results, query);
        setLicenseResultsOpen(row, true);
    };

    const renderLicenseAddResults = (query = '') => {
        renderLicenseResultsInto(wizard.querySelector('[data-license-add-results]'), query, 'data-license-add-option');
    };

    const selectLicenseRequirement = (row, licenseName) => {
        if (!row) return;
        const catalogItem = getCreateTenderRegulatoryLicenseByName(licenseName);
        const profile = getSelectedProfile();
        const items = getCreateTenderRegulatoryLicenses(profile);
        const item = items.find(entry => entry.id === row.dataset.licenseRow);
        if (!item) return;

        item.license = catalogItem.license;
        item.body = catalogItem.body;

        saveCreateTenderRegulatoryLicenses(items, profile);
        renderLicenseList();
        setLicensePickerOpen(row, false);
        refreshLicenseSummary();
        refreshTenderReview();
    };

    const addLicenseRequirement = (licenseName) => {
        const catalogItem = getCreateTenderRegulatoryLicenseByName(licenseName);
        const profile = getSelectedProfile();
        const items = getCreateTenderRegulatoryLicenses(profile);
        if (items.some(item => item.license === catalogItem.license)) {
            setLicenseAddPickerOpen(false);
            return;
        }

        items.push(normalizeCreateTenderRegulatoryLicense({
            id: `license-${Date.now()}`,
            license: catalogItem.license,
            body: catalogItem.body,
            mandatory: true,
            expiryRequired: true
        }, items.length));
        saveCreateTenderRegulatoryLicenses(items, profile);
        renderLicenseList();
        refreshScopeSummary();
        refreshTenderReview();
        setLicenseAddPickerOpen(false);
    };

    const refreshScopeSummary = () => {
        const deliverableCount = wizard.querySelector('[data-scope-count="deliverables"]');
        const attachmentCount = wizard.querySelector('[data-scope-count="attachments"]');

        if (deliverableCount) deliverableCount.textContent = String(getCreateTenderDeliverables(getSelectedProfile()).length);
        if (attachmentCount) attachmentCount.textContent = String(getCreateTenderRequiredAttachments(getSelectedProfile()).length);
        refreshLicenseSummary();
    };

    const renderScopeList = (type) => {
        const list = wizard.querySelector(`[data-scope-list="${type}"]`);
        if (!list) return;
        const items = getScopeItemsByType(type);
        const emptyText = type === 'attachments' ? 'No required attachments added yet.' : 'No deliverables added yet.';
        list.innerHTML = renderCreateTenderScopeRows(items, type, emptyText);
        refreshScopeSummary();
    };

    const setReviewText = (selector, value) => {
        const output = wizard.querySelector(selector);
        if (!output) return;
        if ('value' in output) {
            output.value = value;
            return;
        }
        output.textContent = value;
    };

    const refreshTenderReview = () => {
        const title = wizard.querySelector('[data-tender-title]')?.value.trim() || 'Untitled tender';
        const contact = getCreateTenderContactDetails();
        const contactSummary = getCreateTenderContactSummary(contact);
        const selectedTypeId = wizard.querySelector('input[name="procurementType"]:checked')?.value || setup.defaultType.id;
        const selectedType = setup.types.find(type => type.id === selectedTypeId) || setup.defaultType;
        const selectedCategory = getCreateTenderWizardCategoryValue(wizard, '');
        const profile = getCreateTenderTypeProfile(selectedType);
        const licenses = getCreateTenderRegulatoryLicenses(profile);
        const requirementSummary = getCreateTenderRequirementSummary(profile, getCreateTenderMainDraft());
        const requirementPreview = requirementSummary.filledControls
            ? `${requirementSummary.filledControls} of ${requirementSummary.totalControls} requirement fields started`
            : 'Requirements not started';
        const boqItems = getCreateTenderBoqItems(profile);
        const boqTotal = getCreateTenderBoqTotal(boqItems);
        const method = normalizeCreateTenderMethod(methodSelect?.value);
        const invitedUsers = getCreateTenderInvitedUsers();
        const milestoneSummary = getCreateTenderMilestoneSummary(getCreateTenderMilestones());
        const evaluationWeights = Array.from(wizard.querySelectorAll('.criterion-row input'))
            .map(input => parseCreateTenderNumber(input.value));
        const evaluationTotal = evaluationWeights.reduce((total, weight) => total + weight, 0);
        const readiness = title !== 'Untitled tender'
            && contactSummary.complete
            && boqItems.length
            && milestoneSummary.datedCount === milestoneSummary.count
            && (!isCreateTenderClosedMethod(method) || invitedUsers.length);
        const reviewBadge = wizard.querySelector('[data-review-readiness]');

        setReviewText('[data-review-title]', title);
        setReviewText('[data-review-scope]', requirementPreview);
        setReviewText('[data-review-contact]', contact.tenderLocation || 'Location not set');
        setReviewText('[data-review-contact-status]', contact.contactName || 'Contact not set');
        setReviewText('[data-review-procurement]', `${selectedType.label} - ${method || 'Method not set'}`);
        setReviewText('[data-review-category]', selectedCategory || 'Category not set');
        setReviewText('[data-tender-category-summary]', selectedCategory || 'Category not set');
        setReviewText('[data-review-visibility]', getCreateTenderVisibilityForMethod(method));
        setReviewText('[data-review-visibility-note]', getCreateTenderVisibilityNoteForMethod(method, invitedUsers.length));
        setReviewText('[data-publish-visibility]', getCreateTenderVisibilityForMethod(method));
        setReviewText('[data-publish-visibility-note]', getCreateTenderVisibilityNoteForMethod(method, invitedUsers.length));
        setReviewText('[data-review-scope-count]', `${requirementSummary.filledControls + licenses.length} items`);
        setReviewText('[data-review-scope-breakdown]', `${requirementSummary.filledControls} requirement fields, ${licenses.length} licenses`);
        setReviewText('[data-review-commercial-label]', profile.reviewLabel);
        setReviewText('[data-review-boq-total]', formatCreateTenderMoney(boqTotal));
        setReviewText('[data-review-boq-count]', `${boqItems.length} ${profile.commercialItemName}${boqItems.length === 1 ? '' : 's'}`);
        setReviewText(
            '[data-review-timeline]',
            milestoneSummary.start && milestoneSummary.end
                ? `${formatCreateTenderDate(milestoneSummary.start)} to ${formatCreateTenderDate(milestoneSummary.end)}`
                : 'Milestone dates pending'
        );
        setReviewText('[data-review-window]', milestoneSummary.days ? `${milestoneSummary.days} days` : 'Set milestone dates');
        setReviewText('[data-review-evaluation]', `${evaluationTotal}% ${evaluationTotal === 100 ? 'balanced' : 'configured'}`);

        if (reviewBadge) {
            reviewBadge.textContent = readiness ? 'Ready to publish' : 'Review gaps';
            reviewBadge.classList.toggle('badge-success', Boolean(readiness));
            reviewBadge.classList.toggle('badge-info', !readiness);
        }
    };

    const refreshRequirementHelper = (controlId) => {
        const profile = getSelectedProfile();
        const control = getCreateTenderRequirementControl(profile.id, controlId);
        const helper = wizard.querySelector(`[data-requirement-helper="${CSS.escape(controlId)}"]`);
        if (!control || !helper) return;
        helper.textContent = getCreateTenderRequirementHelperText(control, getRequirementControlValue(controlId));
    };

    const validateActiveStep = () => {
        const activePanel = panels[activeStepIndex];
        if (!activePanel) return true;

        const requiredFields = Array.from(activePanel.querySelectorAll('[required]'))
            .filter(field => !field.disabled && field.offsetParent !== null);
        const firstInvalidField = requiredFields.find(field => !field.checkValidity());

        requiredFields.forEach(field => field.classList.toggle('error', !field.checkValidity()));
        if (!firstInvalidField) return true;

        firstInvalidField.reportValidity();
        firstInvalidField.focus();
        return false;
    };

    const validateRequirementsBeforeLeavingStep = () => {
        const missingRequiredControls = getCreateTenderMissingRequiredRequirements(getSelectedProfile(), getCreateTenderMainDraft());
        if (!missingRequiredControls.length) return true;

        const firstMissingControl = missingRequiredControls[0];
        if (activeStepIndex !== 2) {
            setActiveStep(2);
        }

        const field = wizard.querySelector(`[data-requirement-input="${CSS.escape(firstMissingControl.id)}"]`);
        field?.classList.add('error');
        field?.reportValidity();
        field?.focus();
        return false;
    };

    const setActiveStep = (index) => {
        const boundedIndex = Math.min(Math.max(index, 0), panels.length - 1);
        activeStepIndex = boundedIndex;

        panels.forEach((panel, panelIndex) => {
            const isActive = panelIndex === activeStepIndex;
            panel.classList.toggle('active', isActive);
            panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        railSteps.forEach((step, stepIndex) => {
            const isActive = stepIndex === activeStepIndex;
            step.classList.toggle('active', isActive);
            step.setAttribute('aria-current', isActive ? 'step' : 'false');
        });

        if (previousButton) previousButton.disabled = activeStepIndex === 0;
        if (nextButton) nextButton.hidden = activeStepIndex === panels.length - 1;
        if (progressOutput) progressOutput.textContent = `Step ${activeStepIndex + 1} of ${panels.length}`;
        if (stepTitleOutput) stepTitleOutput.textContent = railSteps[activeStepIndex]?.querySelector('span')?.textContent || '';

        if (activeStepIndex === panels.length - 1) refreshTenderReview();
    };

    const nextBoqItemCode = (items) => {
        const lastMajor = items.reduce((largest, item) => {
            const major = Number(String(item.item || '').split('.')[0]);
            return Number.isFinite(major) ? Math.max(largest, major) : largest;
        }, 0);
        return `${lastMajor + 1}.1`;
    };

    const updateBoqRow = (input) => {
        const row = input.closest('[data-boq-row]');
        const field = input.dataset.boqField;
        if (!row || !field) return;

        const profile = getSelectedProfile();
        const items = getCreateTenderBoqItems(profile);
        const item = items.find(entry => entry.id === row.dataset.boqRow);
        if (!item) return;

        item[field] = ['qty', 'rate'].includes(field) ? parseCreateTenderNumber(input.value) : input.value;
        saveCreateTenderBoqItems(items, profile);

        const rowAmount = parseCreateTenderNumber(item.qty) * parseCreateTenderNumber(item.rate);
        const amountCell = row.querySelector('[data-boq-amount]');
        if (amountCell) amountCell.textContent = formatCreateTenderMoney(rowAmount);
        refreshBoqSummary();
    };

    const updateMilestoneRow = (input) => {
        const row = input.closest('[data-milestone-row]');
        const proxyId = input.dataset.milestoneRowProxy;
        const field = input.dataset.milestoneField;
        if ((!row && !proxyId) || field !== 'date') return;

        const milestones = getCreateTenderMilestones();
        const milestone = milestones.find(entry => entry.id === (row?.dataset.milestoneRow || proxyId));
        if (!milestone) return;

        milestone.date = input.value;
        saveCreateTenderMilestones(milestones);
        refreshMilestoneSummary();
    };

    const updateScopeItem = (input) => {
        const row = input.closest('[data-scope-row]');
        const type = row?.dataset.scopeType;
        if (!row || !type) return;

        const items = getScopeItemsByType(type);
        const item = items.find(entry => entry.id === row.dataset.scopeRow);
        if (!item) return;

        item.text = input.value;
        saveScopeItemsByType(type, items);
        refreshScopeSummary();
    };

    const getRequirementListItems = (listId) => {
        const profile = getSelectedProfile();
        const requirementDraft = getCreateTenderRequirementDraft(profile.id);
        return Array.isArray(requirementDraft.lists?.[listId])
            ? requirementDraft.lists[listId].map(normalizeCreateTenderRequirementItem)
            : [];
    };

    const saveRequirementListItems = (listId, items) => {
        const profile = getSelectedProfile();
        const requirementDraft = getCreateTenderRequirementDraft(profile.id);
        requirementDraft.lists = {
            ...(requirementDraft.lists || {}),
            [listId]: items.map(normalizeCreateTenderRequirementItem)
        };
        saveCreateTenderRequirementDraft(profile.id, requirementDraft);
        return requirementDraft.lists[listId];
    };

    const renderRequirementList = (listId) => {
        const profile = getSelectedProfile();
        const template = getCreateTenderRequirementTemplate(profile.id);
        const listTemplate = (template.lists || []).find(item => item.id === listId);
        const items = getRequirementListItems(listId);
        const listNode = wizard.querySelector(`[data-requirement-list-items="${CSS.escape(listId)}"]`);
        const countNode = wizard.querySelector(`[data-requirement-list-count="${CSS.escape(listId)}"]`);
        if (listNode) {
            listNode.innerHTML = renderCreateTenderRequirementListRows(items, listId)
                .replace('No requirements added yet.', escapeCreateTenderHtml(listTemplate?.emptyText || 'No requirements added yet.'));
        }
        if (countNode) countNode.textContent = String(items.length);
    };

    const updateRequirementField = (input) => {
        const field = input.dataset.requirementField;
        if (!field) return;
        const profile = getSelectedProfile();
        const requirementDraft = getCreateTenderRequirementDraft(profile.id);
        requirementDraft.fields = {
            ...(requirementDraft.fields || {}),
            [field]: input.value
        };
        saveCreateTenderRequirementDraft(profile.id, requirementDraft);
    };

    const updateRequirementListItem = (input) => {
        const row = input.closest('[data-requirement-row]');
        const listId = row?.dataset.requirementList;
        if (!row || !listId) return;
        const items = getRequirementListItems(listId);
        const item = items.find(entry => entry.id === row.dataset.requirementRow);
        if (!item) return;
        item.text = input.value;
        saveRequirementListItems(listId, items);
        renderRequirementList(listId);
    };

    const getRequirementControlValue = (controlId) => {
        const profile = getSelectedProfile();
        const requirementDraft = getCreateTenderRequirementDraft(profile.id);
        return requirementDraft.fields?.[controlId];
    };

    const saveRequirementControlValue = (controlId, value) => {
        const profile = getSelectedProfile();
        const requirementDraft = getCreateTenderRequirementDraft(profile.id);
        requirementDraft.fields = {
            ...(requirementDraft.fields || {}),
            [controlId]: value
        };
        saveCreateTenderRequirementDraft(profile.id, requirementDraft);
    };

    const renderRequirementControl = (controlId) => {
        const profile = getSelectedProfile();
        const control = getCreateTenderRequirementControl(profile.id, controlId);
        if (!control) return;

        if (control.type === 'list') {
            const listNode = wizard.querySelector(`[data-requirement-list-items="${CSS.escape(controlId)}"]`);
            if (listNode) listNode.innerHTML = renderCreateTenderRequirementControlListItems(control, getRequirementControlValue(controlId));
            return;
        }

        if (control.type === 'table') {
            const tableBody = wizard.querySelector(`[data-requirement-table-body="${CSS.escape(controlId)}"]`);
            if (tableBody) {
                const controlNode = tableBody.closest('.requirement-control');
                if (controlNode) {
                    controlNode.innerHTML = `
                        <span class="form-label">${escapeCreateTenderHtml(control.label)}</span>
                        ${renderCreateTenderRequirementControlTable(control, getRequirementControlValue(controlId), profile.id)}
                    `;
                } else {
                    tableBody.innerHTML = renderCreateTenderRequirementTableRows(getRequirementControlValue(controlId), control, profile.id);
                }
            }
            return;
        }

        if (control.type === 'cards') {
            const cardList = wizard.querySelector(`[data-requirement-card-list="${CSS.escape(controlId)}"]`);
            if (cardList) {
                const controlNode = cardList.closest('.requirement-control');
                if (controlNode) {
                    controlNode.innerHTML = `
                        <span class="form-label">${escapeCreateTenderHtml(control.label)}</span>
                        ${renderCreateTenderRequirementCards(control, getRequirementControlValue(controlId), profile.id)}
                    `;
                }
            }
        }
    };

    const updateRequirementInput = (input) => {
        const controlId = input.dataset.requirementInput;
        if (!controlId) return;
        const profile = getSelectedProfile();
        const control = getCreateTenderRequirementControl(profile.id, controlId);
        let nextValue = input.type === 'checkbox' ? input.checked : input.value;
        if (control?.type === 'select-custom-prompt' && nextValue === 'Other') {
            const typedValue = window.prompt(`Enter ${control.label.toLowerCase()}`, '');
            nextValue = String(typedValue || '').trim();
            if (!nextValue) {
                nextValue = '';
            }
            input.value = nextValue;
        }
        input.classList.toggle('error', input.required && !input.checkValidity());
        saveRequirementControlValue(controlId, nextValue);
        refreshRequirementHelper(controlId);
        if (controlId === 'contractType' || controlId === 'requireSamples') {
            refreshProfileText();
            wizard.querySelector(`[data-requirement-input="${CSS.escape(controlId)}"]`)?.focus();
        }
    };

    const updateRequirementControlListItem = (input) => {
        const row = input.closest('[data-requirement-control-row]');
        const controlId = row?.dataset.requirementControl;
        if (!row || !controlId) return;

        const items = normalizeCreateTenderRequirementTextItems(getRequirementControlValue(controlId), controlId);
        const item = items.find(entry => entry.id === row.dataset.requirementControlRow);
        if (!item) return;

        item.text = input.value;
        saveRequirementControlValue(controlId, items);
    };

    const updateRequirementTableField = (input) => {
        const row = input.closest('[data-requirement-table-row]');
        const controlId = row?.dataset.requirementControl;
        const field = input.dataset.requirementTableField;
        if (!row || !controlId || !field) return;

        const profile = getSelectedProfile();
        const control = getCreateTenderRequirementControl(profile.id, controlId);
        if (!control) return;

        const columns = resolveCreateTenderRequirementColumns(control, profile.id);
        const rows = normalizeCreateTenderRequirementTableRows(getRequirementControlValue(controlId), columns, controlId);
        const tableRow = rows.find(entry => entry.id === row.dataset.requirementTableRow);
        const column = columns.find(item => item.id === field);
        if (!tableRow) return;

        if (column?.type === 'multiselect') {
            tableRow[field] = Array.from(row.querySelectorAll(`[data-requirement-table-field="${CSS.escape(field)}"]:checked`)).map(item => item.value);
        } else if (column?.type === 'file') {
            tableRow[field] = input.files?.[0]?.name || tableRow[field] || '';
        } else if (input.type === 'checkbox') {
            tableRow[field] = input.checked;
        } else {
            tableRow[field] = input.value;
        }
        saveRequirementControlValue(controlId, rows);

        const rowIndex = Number(row.dataset.requirementTableRowIndex || 0);
        columns
            .filter(column => column.type === 'calculated')
            .forEach(column => {
                const output = row.querySelector(`[data-requirement-calculated-field="${CSS.escape(column.id)}"]`);
                if (output) output.textContent = formatCreateTenderRequirementCalculatedValue(calculateCreateTenderRequirementFormula(column.formula, tableRow));
            });
        if (columns.some(column => column.showWhen?.field === field)) {
            renderRequirementControl(controlId);
        }
        if (controlId === 'quantityScheduleRows') {
            renderRequirementControl('specificationCards');
            renderRequirementControl('sampleRequirementRows');
        }
    };

    const updateRequirementCardField = (input) => {
        const row = input.closest('[data-requirement-card-row]');
        const controlId = row?.dataset.requirementControl;
        const fieldId = input.dataset.requirementCardField;
        if (!row || !controlId || !fieldId) return;

        const profile = getSelectedProfile();
        const control = getCreateTenderRequirementControl(profile.id, controlId);
        if (!control) return;

        const fields = resolveCreateTenderRequirementFields(control, profile.id);
        const cards = normalizeCreateTenderRequirementObjectRows(getRequirementControlValue(controlId), fields, controlId);
        const card = cards.find(entry => entry.id === row.dataset.requirementCardRow);
        const field = fields.find(item => item.id === fieldId);
        if (!card || !field) return;

        if (field.type === 'multiselect') {
            card[fieldId] = Array.from(row.querySelectorAll(`[data-requirement-card-field="${CSS.escape(fieldId)}"]:checked`)).map(item => item.value);
        } else if (input.type === 'checkbox') {
            card[fieldId] = input.checked;
        } else {
            card[fieldId] = input.value;
        }

        saveRequirementControlValue(controlId, cards);
        if (fields.some(item => item.showWhen?.field === fieldId) || field.sourceControlId) {
            renderRequirementControl(controlId);
        }
    };

    const updateRequirementAccordionField = (input) => {
        const wrapper = input.closest('[data-requirement-accordion]');
        const controlId = wrapper?.dataset.requirementAccordion;
        const fieldId = input.dataset.requirementAccordionField;
        if (!controlId || !fieldId) return;

        const value = getRequirementControlValue(controlId);
        saveRequirementControlValue(controlId, {
            ...(value && typeof value === 'object' && !Array.isArray(value) ? value : {}),
            [fieldId]: input.value
        });
    };

    const updateLicenseRequirement = (input) => {
        const row = input.closest('[data-license-row]');
        const field = input.dataset.licenseField;
        if (!row || !field) return;

        const profile = getSelectedProfile();
        const items = getCreateTenderRegulatoryLicenses(profile);
        const item = items.find(entry => entry.id === row.dataset.licenseRow);
        if (!item) return;

        if (field === 'license') {
            const catalogItem = getCreateTenderRegulatoryLicenseByName(input.value);
            item.license = catalogItem.license;
            item.body = catalogItem.body;
            const bodyInput = row.querySelector('[data-license-body]');
            if (bodyInput) bodyInput.value = catalogItem.body;
        }
        if (field === 'mandatory' || field === 'expiryRequired') {
            item[field] = input.checked;
        }

        saveCreateTenderRegulatoryLicenses(items, profile);
        refreshLicenseSummary();
        refreshTenderReview();
    };

    const parseBoqDelimitedText = (text) => {
        const splitLine = (line) => {
            if (line.includes('\t')) {
                return line.split('\t').map(cell => cell.trim().replace(/^"|"$/g, ''));
            }

            const cells = [];
            let current = '';
            let quoted = false;

            for (let index = 0; index < line.length; index += 1) {
                const char = line[index];
                const nextChar = line[index + 1];

                if (char === '"' && quoted && nextChar === '"') {
                    current += '"';
                    index += 1;
                    continue;
                }

                if (char === '"') {
                    quoted = !quoted;
                    continue;
                }

                if (char === ',' && !quoted) {
                    cells.push(current.trim());
                    current = '';
                    continue;
                }

                current += char;
            }

            cells.push(current.trim());
            return cells;
        };

        return text
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean)
            .map(splitLine)
            .filter(cells => cells.length >= 5)
            .filter((cells, index) => index !== 0 || !/item|description|qty|quantity/i.test(cells.join(' ')))
            .map((cells, index) => normalizeCreateTenderBoqItem({
                id: `boq-import-${Date.now()}-${index}`,
                item: cells[0],
                description: cells[1],
                qty: cells[2],
                unit: cells[3],
                rate: cells[4]
            }, index));
    };

    wizard.addEventListener('change', (event) => {
        if (event.target?.matches('input[name="procurementType"]')) {
            syncProcurementType(event.target.value);
            refreshTenderReview();
        }
        if (event.target?.matches('[data-contact-field]')) {
            updateContactField(event.target);
        }
        if (event.target?.matches('[data-milestone-field]')) {
            updateMilestoneRow(event.target);
        }
        if (event.target?.matches('[data-scope-item-input]')) {
            updateScopeItem(event.target);
        }
        if (event.target?.matches('[data-requirement-field]')) {
            updateRequirementField(event.target);
        }
        if (event.target?.matches('[data-requirement-input]')) {
            updateRequirementInput(event.target);
        }
        if (event.target?.matches('[data-requirement-list-input]')) {
            updateRequirementListItem(event.target);
        }
        if (event.target?.matches('[data-requirement-list-item]')) {
            updateRequirementControlListItem(event.target);
        }
        if (event.target?.matches('[data-requirement-table-field]')) {
            updateRequirementTableField(event.target);
        }
        if (event.target?.matches('[data-requirement-card-field]')) {
            updateRequirementCardField(event.target);
        }
        if (event.target?.matches('[data-requirement-accordion-field]')) {
            updateRequirementAccordionField(event.target);
        }
        if (event.target?.matches('[data-license-field]')) {
            updateLicenseRequirement(event.target);
        }
        if (event.target?.matches('[data-procurement-method]')) {
            syncTenderMethod();
        }
        if (event.target?.matches('[data-tender-title], [data-procurement-method], .criterion-row input')) {
            saveMainDetailsFromInputs();
            refreshTenderReview();
        }
    });

    wizard.addEventListener('input', (event) => {
        if (event.target?.matches('[data-procurement-category-search]')) {
            const typedCategory = event.target.value.trim();
            renderCategoryResults(typedCategory);

            if (typedCategory.toLowerCase() === 'other') {
                selectOtherCategory();
            }
        }
        if (event.target?.matches('[data-custom-category]')) {
            if (customCategoryAddButton) customCategoryAddButton.disabled = !event.target.value.trim();
        }
        if (event.target?.matches('[data-invite-search]')) {
            renderInviteResults(event.target.value);
        }
        if (event.target?.matches('[data-license-add-search]')) {
            renderLicenseAddResults(event.target.value);
        }
        if (event.target?.matches('[data-license-search]')) {
            const row = event.target.closest('[data-license-row]');
            renderLicenseResults(row, event.target.value);
        }
        if (event.target?.matches('[data-contact-field]')) {
            updateContactField(event.target);
        }
        if (event.target?.matches('[data-boq-field]')) {
            updateBoqRow(event.target);
        }
        if (event.target?.matches('[data-milestone-field]')) {
            updateMilestoneRow(event.target);
        }
        if (event.target?.matches('[data-scope-item-input]')) {
            updateScopeItem(event.target);
        }
        if (event.target?.matches('[data-requirement-field]')) {
            updateRequirementField(event.target);
        }
        if (event.target?.matches('[data-requirement-input]')) {
            updateRequirementInput(event.target);
        }
        if (event.target?.matches('[data-requirement-list-input]')) {
            updateRequirementListItem(event.target);
        }
        if (event.target?.matches('[data-requirement-list-item]')) {
            updateRequirementControlListItem(event.target);
        }
        if (event.target?.matches('[data-requirement-table-field]')) {
            updateRequirementTableField(event.target);
        }
        if (event.target?.matches('[data-requirement-card-field]')) {
            updateRequirementCardField(event.target);
        }
        if (event.target?.matches('[data-requirement-accordion-field]')) {
            updateRequirementAccordionField(event.target);
        }
        if (event.target?.matches('[data-license-field]')) {
            updateLicenseRequirement(event.target);
        }
        if (event.target?.matches('[data-tender-title], .criterion-row input')) {
            saveMainDetailsFromInputs();
            refreshTenderReview();
        }
    });

    wizard.addEventListener('click', (event) => {
        const railStep = event.target?.closest('[data-wizard-step-index]');
        if (railStep) {
            event.preventDefault();
            const requestedStepIndex = Number(railStep.dataset.wizardStepIndex);
            if (requestedStepIndex > activeStepIndex && !validateActiveStep()) return;
            if (requestedStepIndex > 2 && !validateRequirementsBeforeLeavingStep()) return;
            setActiveStep(requestedStepIndex);
            return;
        }

        const target = event.target?.closest('button');
        if (!target) return;

        if (target.matches('[data-category-option]')) {
            selectCategoryOption(target.dataset.categoryOption);
            return;
        }

        if (target.matches('[data-category-other]')) {
            selectOtherCategory();
            return;
        }

        if (target.matches('[data-custom-category-add]')) {
            addSelectedCategory(customCategoryInput?.value);
            return;
        }

        if (target.matches('[data-category-remove]')) {
            removeSelectedCategory(target.dataset.categoryRemove);
            return;
        }

        if (target.matches('[data-license-option]')) {
            selectLicenseRequirement(target.closest('[data-license-row]'), target.dataset.licenseOption);
            return;
        }

        if (target.matches('[data-license-add-option]')) {
            addLicenseRequirement(target.dataset.licenseAddOption);
            return;
        }

        if (target.matches('[data-license-change]')) {
            const row = target.closest('[data-license-row]');
            const searchInput = row?.querySelector('[data-license-search]');
            setLicensePickerOpen(row, true);
            if (searchInput) {
                searchInput.value = '';
                renderLicenseResults(row, '');
                searchInput.focus();
            }
            return;
        }

        if (target.matches('[data-invite-user]')) {
            addInvitedUser(target.dataset.inviteUser);
            return;
        }

        if (target.matches('[data-invited-user-remove]')) {
            removeInvitedUser(target.dataset.invitedUserRemove);
            return;
        }

        if (target.matches('[data-wizard-prev]')) {
            setActiveStep(activeStepIndex - 1);
            return;
        }

        if (target.matches('[data-wizard-next]')) {
            if (!validateActiveStep()) return;
            if (activeStepIndex === 2 && !validateRequirementsBeforeLeavingStep()) return;
            setActiveStep(activeStepIndex + 1);
            return;
        }

        if (target.matches('[data-publish-tender]')) {
            saveMainDetailsFromInputs();
            publishCreateTenderToMarketplace(wizard);
            window.app?.navigateTo('supplier-marketplace');
            return;
        }

        if (target.matches('[data-boq-import]')) {
            wizard.querySelector('[data-boq-file]')?.click();
            return;
        }

        if (target.matches('[data-contact-verify]')) {
            verifyContactChannel(target.dataset.contactVerify);
            return;
        }

        if (target.matches('[data-boq-add]')) {
            const profile = getSelectedProfile();
            const items = getCreateTenderBoqItems(profile);
            items.push(normalizeCreateTenderBoqItem({
                id: `boq-${Date.now()}`,
                item: nextBoqItemCode(items),
                description: '',
                qty: 1,
                unit: 'Unit',
                rate: 0
            }, items.length));
            saveCreateTenderBoqItems(items, profile);
            renderBoqTable();
            wizard.querySelector('[data-boq-table-body] tr:last-child [data-boq-field="description"]')?.focus();
            return;
        }

        if (target.matches('[data-boq-recalculate]')) {
            renderBoqTable();
            return;
        }

        if (target.matches('[data-boq-delete]')) {
            const row = target.closest('[data-boq-row]');
            const profile = getSelectedProfile();
            const items = getCreateTenderBoqItems(profile).filter(item => item.id !== row?.dataset.boqRow);
            saveCreateTenderBoqItems(items, profile);
            renderBoqTable();
            return;
        }

        if (target.matches('[data-scope-add]')) {
            const type = target.dataset.scopeAdd;
            const items = getScopeItemsByType(type);
            const prefix = type === 'attachments' ? 'attachment' : 'deliverable';
            const label = type === 'attachments' ? 'Required attachment' : 'Deliverable';
            items.push(normalizeCreateTenderScopeItem({
                id: `${prefix}-${Date.now()}`,
                text: `${label} ${items.length + 1}`
            }, items.length, prefix));
            saveScopeItemsByType(type, items);
            renderScopeList(type);
            refreshTenderReview();
            wizard.querySelector(`[data-scope-list="${type}"] [data-scope-row]:last-child [data-scope-item-input]`)?.focus();
            return;
        }

        if (target.matches('[data-scope-delete]')) {
            const row = target.closest('[data-scope-row]');
            const type = row?.dataset.scopeType;
            if (!type) return;

            const items = getScopeItemsByType(type).filter(item => item.id !== row?.dataset.scopeRow);
            saveScopeItemsByType(type, items);
            renderScopeList(type);
            refreshTenderReview();
            return;
        }

        if (target.matches('[data-requirement-control-add]')) {
            const controlId = target.dataset.requirementControlAdd;
            const profile = getSelectedProfile();
            const control = getCreateTenderRequirementControl(profile.id, controlId);
            if (!control) return;

            if (control.type === 'list') {
                const items = normalizeCreateTenderRequirementTextItems(getRequirementControlValue(controlId), controlId);
                items.push({ id: `requirement-${controlId}-${Date.now()}`, text: '' });
                saveRequirementControlValue(controlId, items);
                renderRequirementControl(controlId);
                wizard.querySelector(`[data-requirement-list-items="${CSS.escape(controlId)}"] [data-requirement-control-row]:last-child [data-requirement-list-item]`)?.focus();
                return;
            }

            if (control.type === 'table') {
                const columns = resolveCreateTenderRequirementColumns(control, profile.id);
                const sourceField = columns.find(column => column.sourceControlId);
                const sourceOptions = sourceField?.options || [];
                if (control.requiresSourceOptions && !sourceOptions.length) return;

                const rows = normalizeCreateTenderRequirementTableRows(getRequirementControlValue(controlId), columns, controlId);
                const nextRow = { id: `requirement-${controlId}-${Date.now()}` };
                columns.forEach(column => {
                    if (column.type === 'index' || column.type === 'calculated') return;
                    if (column.type === 'multiselect') {
                        nextRow[column.id] = [];
                        return;
                    }
                    if (column.type === 'toggle') {
                        nextRow[column.id] = false;
                        return;
                    }
                    if (column.sourceControlId) {
                        nextRow[column.id] = column.options?.[0]?.value || '';
                        return;
                    }
                    nextRow[column.id] = '';
                });
                rows.push(nextRow);
                saveRequirementControlValue(controlId, rows);
                renderRequirementControl(controlId);
                if (controlId === 'quantityScheduleRows') {
                    renderRequirementControl('specificationCards');
                    renderRequirementControl('sampleRequirementRows');
                }
                wizard.querySelector(`[data-requirement-table-body="${CSS.escape(controlId)}"] [data-requirement-table-row]:last-child input`)?.focus();
                return;
            }

            if (control.type === 'cards') {
                const fields = resolveCreateTenderRequirementFields(control, profile.id);
                const sourceField = fields.find(field => field.sourceControlId);
                const sourceOptions = sourceField?.options || [];
                if (control.requiresSourceOptions && !sourceOptions.length) return;

                const cards = normalizeCreateTenderRequirementObjectRows(getRequirementControlValue(controlId), fields, controlId);
                const nextCard = { id: `requirement-${controlId}-${Date.now()}` };
                fields.forEach(field => {
                    if (field.type === 'multiselect') nextCard[field.id] = [];
                    else if (field.type === 'toggle') nextCard[field.id] = false;
                    else if (field.sourceControlId) nextCard[field.id] = sourceOptions[0]?.value || '';
                    else nextCard[field.id] = '';
                });
                if (control.presets?.length && !cards.length) nextCard[(fields || [])[0]?.id] = control.presets[0] || '';
                cards.push(nextCard);
                saveRequirementControlValue(controlId, cards);
                renderRequirementControl(controlId);
                wizard.querySelector(`[data-requirement-card-list="${CSS.escape(controlId)}"] [data-requirement-card-row]:last-child input, [data-requirement-card-list="${CSS.escape(controlId)}"] [data-requirement-card-row]:last-child textarea, [data-requirement-card-list="${CSS.escape(controlId)}"] [data-requirement-card-row]:last-child select`)?.focus();
            }
            return;
        }

        if (target.matches('[data-requirement-control-delete]')) {
            const controlId = target.dataset.requirementControlDelete;
            const profile = getSelectedProfile();
            const control = getCreateTenderRequirementControl(profile.id, controlId);
            if (!control) return;

            if (control.type === 'list') {
                const row = target.closest('[data-requirement-control-row]');
                const items = normalizeCreateTenderRequirementTextItems(getRequirementControlValue(controlId), controlId)
                    .filter(item => item.id !== row?.dataset.requirementControlRow);
                saveRequirementControlValue(controlId, items);
                renderRequirementControl(controlId);
                return;
            }

            if (control.type === 'table') {
                const row = target.closest('[data-requirement-table-row]');
                const columns = resolveCreateTenderRequirementColumns(control, profile.id);
                const rows = normalizeCreateTenderRequirementTableRows(getRequirementControlValue(controlId), columns, controlId)
                    .filter(item => item.id !== row?.dataset.requirementTableRow);
                saveRequirementControlValue(controlId, rows);
                renderRequirementControl(controlId);
                if (controlId === 'quantityScheduleRows') {
                    renderRequirementControl('specificationCards');
                    renderRequirementControl('sampleRequirementRows');
                }
                return;
            }

            if (control.type === 'cards') {
                const row = target.closest('[data-requirement-card-row]');
                const cards = normalizeCreateTenderRequirementObjectRows(getRequirementControlValue(controlId), control.fields || [], controlId)
                    .filter(item => item.id !== row?.dataset.requirementCardRow);
                saveRequirementControlValue(controlId, cards);
                renderRequirementControl(controlId);
            }
            return;
        }

        if (target.matches('[data-requirement-add]')) {
            const listId = target.dataset.requirementAdd;
            const items = getRequirementListItems(listId);
            const profile = getSelectedProfile();
            const requirementDraft = getCreateTenderRequirementDraft(profile.id);
            requirementDraft.lists = {
                ...(requirementDraft.lists || {}),
                [listId]: [
                    ...items,
                    normalizeCreateTenderRequirementItem({ id: `requirement-${listId}-${Date.now()}`, text: '' }, items.length)
                ]
            };
            saveCreateTenderRequirementDraft(profile.id, requirementDraft);
            renderRequirementList(listId);
            wizard.querySelector(`[data-requirement-list-items="${CSS.escape(listId)}"] [data-requirement-row]:last-child [data-requirement-list-input]`)?.focus();
            return;
        }

        if (target.matches('[data-requirement-delete]')) {
            const row = target.closest('[data-requirement-row]');
            const listId = row?.dataset.requirementList;
            if (!listId) return;
            saveRequirementListItems(listId, getRequirementListItems(listId).filter(item => item.id !== row.dataset.requirementRow));
            renderRequirementList(listId);
            return;
        }

        if (target.matches('[data-license-add]')) {
            setLicenseAddPickerOpen(true);
            renderLicenseAddResults('');
            const addSearch = wizard.querySelector('[data-license-add-search]');
            if (addSearch) {
                addSearch.value = '';
                addSearch.focus();
            }
            return;
        }

        if (target.matches('[data-license-delete]')) {
            const row = target.closest('[data-license-row]');
            const profile = getSelectedProfile();
            const items = getCreateTenderRegulatoryLicenses(profile).filter(item => item.id !== row?.dataset.licenseRow);
            saveCreateTenderRegulatoryLicenses(items, profile);
            renderLicenseList();
            refreshScopeSummary();
            refreshTenderReview();
        }
    });

    wizard.querySelector('[data-boq-file]')?.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const importedItems = parseBoqDelimitedText(String(reader.result || ''));
            const profile = getSelectedProfile();
            if (!importedItems.length) {
                alert(`No valid rows found. ${profile.importHint}`);
                event.target.value = '';
                return;
            }

            saveCreateTenderBoqItems(importedItems, profile);
            renderBoqTable();
            event.target.value = '';
        };
        reader.readAsText(file);
    });

    categorySearchInput?.addEventListener('focus', () => {
        renderCategoryResults(categorySearchInput.value);
    });

    categorySearchInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setCategoryResultsOpen(false);
        }
    });

    customCategoryInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSelectedCategory(customCategoryInput.value);
        }
    });

    categoryPicker?.addEventListener('focusout', (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setCategoryResultsOpen(false);
        }
    });

    inviteSearchInput?.addEventListener('focus', () => {
        renderInviteResults(inviteSearchInput.value);
    });

    inviteSearchInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setInviteResultsOpen(false);
        }
    });

    wizard.querySelector('.invite-picker')?.addEventListener('focusout', (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setInviteResultsOpen(false);
        }
    });

    wizard.querySelector('[data-license-add-picker]')?.addEventListener('focusout', (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setLicenseAddPickerOpen(false);
        }
    });

    wizard.querySelector('[data-license-add-search]')?.addEventListener('focus', (event) => {
        renderLicenseAddResults(event.target.value);
    });

    wizard.querySelector('[data-license-add-search]')?.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setLicenseAddPickerOpen(false);
        }
    });

    wizard.addEventListener('focusin', (event) => {
        if (event.target?.matches('[data-license-search]')) {
            const row = event.target.closest('[data-license-row]');
            renderLicenseResults(row, event.target.value);
        }
    });

    wizard.addEventListener('focusout', (event) => {
        const row = event.target?.closest?.('[data-license-row]');
        if (row && !row.contains(event.relatedTarget)) {
            setLicensePickerOpen(row, false);
        }
    });

    renderSelectedCategories(getCreateTenderSelectedCategories(getCreateTenderMainDraft()));
    refreshContactSummary();
    refreshBoqSummary();
    refreshMilestoneSummary();
    refreshScopeSummary();
    refreshProfileText();
    syncTenderMethod();
    syncCustomCategoryField();
    refreshTenderReview();
    setActiveStep(0);
    wizard.dataset.ready = 'true';

    document.querySelector('[data-save-tender-draft]')?.addEventListener('click', () => {
        saveCreateTenderDraftFromWizard(wizard);
        alert('Tender saved as draft.');
        window.app?.navigateTo('procurement-dashboard');
    });
}

if (window.app) {
    window.app.renderCreateTender = renderCreateTender;
}

window.initializeCreateTenderWizard = initializeCreateTenderWizard;
window.getCreateTenderTypeProfile = getCreateTenderTypeProfile;
