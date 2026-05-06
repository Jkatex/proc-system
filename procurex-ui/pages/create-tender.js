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
    const methods = Array.isArray(setup.methods) && setup.methods.length
        ? setup.methods
        : ['Open / public tender', 'Restricted tender', 'Closed / invited tender'];
    const normalizedMethods = methods.includes('Direct procurement') ? methods : [...methods, 'Direct procurement'];
    const defaultType = types.find(type => type.id === setup.defaultType) || types[0];

    return { types, methods: normalizedMethods, defaultType };
}

function renderCreateTenderOptions(options, selectedValue = '') {
    return options.map(option => `<option ${option === selectedValue ? 'selected' : ''}>${option}</option>`).join('');
}

const createTenderBoqStorageKey = 'procurex.createTender.boqItems';
const createTenderCommercialTypeStorageKey = 'procurex.createTender.commercialType';
const createTenderMilestoneStorageKey = 'procurex.createTender.milestones';
const createTenderDeliverableStorageKey = 'procurex.createTender.deliverables';
const createTenderDeliverableTypeStorageKey = 'procurex.createTender.deliverableType';
const createTenderAttachmentStorageKey = 'procurex.createTender.requiredAttachments';
const createTenderAttachmentTypeStorageKey = 'procurex.createTender.attachmentType';
const createTenderContactStorageKey = 'procurex.createTender.contactDetails';
const createTenderDraftStorageKey = 'procurex.createTender.savedDraft';
const createTenderPublishedStorageKey = 'procurex.marketplace.publishedTenders';
const createTenderSelectedTenderStorageKey = 'procurex.marketplace.selectedTenderId';

const defaultCreateTenderBoqItems = [
    { id: 'boq-1', item: '1.1', description: 'Site clearing and preparation', qty: 5, unit: 'Sites', rate: 32000000 },
    { id: 'boq-2', item: '2.1', description: 'Foundation and structural frame', qty: 5, unit: 'Centers', rate: 380000000 },
    { id: 'boq-3', item: '3.1', description: 'MEP installations', qty: 5, unit: 'Centers', rate: 210000000 },
    { id: 'boq-4', item: '4.1', description: 'Finishes, fixtures, handover', qty: 5, unit: 'Centers', rate: 338000000 }
];

const defaultCreateTenderMilestones = [
    { id: 'milestone-publication', name: 'Publication', date: '2026-05-12' },
    { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-05-28' },
    { id: 'milestone-closing', name: 'Bid closing', date: '2026-06-12' },
    { id: 'milestone-opening', name: 'Bid opening', date: '2026-06-12' },
    { id: 'milestone-evaluation', name: 'Evaluation complete', date: '2026-06-24' },
    { id: 'milestone-award', name: 'Award target', date: '2026-06-30' }
];

const defaultCreateTenderDeliverables = [
    { id: 'deliverable-1', text: 'Site readiness and foundation certification' },
    { id: 'deliverable-2', text: 'Structural, electrical, plumbing, and finishing works' },
    { id: 'deliverable-3', text: 'Final inspection pack and as-built drawings' }
];

const defaultCreateTenderAttachments = [
    { id: 'attachment-1', text: 'Technical specifications' },
    { id: 'attachment-2', text: 'Drawings and BOQ template' },
    { id: 'attachment-3', text: 'Draft contract conditions' }
];

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
        documentLabels: ['Drawings', 'BOQ', 'Technical specifications', 'Site conditions', 'Conditions of contract'],
        keyRequirements: ['Drawings and BOQ', 'Project timelines', 'Site conditions', 'Contractor qualifications, equipment, and experience'],
        evaluationStyle: 'Technical and financial evaluation, often weighted or pass/fail plus price, with strong delivery risk review.',
        bidderPreparation: ['BOQ pricing', 'Work plan', 'Equipment and staff schedule', 'Contractor experience evidence'],
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
        commercialName: 'BOQ',
        commercialTitle: 'Goods BOQ',
        commercialDescription: 'Item schedule, quantities, unit prices, and totals',
        commercialItemName: 'goods item',
        commercialEmptyText: 'No goods BOQ items added yet.',
        importHint: 'Use item, description, quantity, unit, and unit price columns.',
        addLabel: 'Add Goods Item',
        importLabel: 'Import Goods BOQ',
        reviewLabel: 'Goods BOQ estimate',
        scopeTitle: 'Goods Specifications',
        scopeLabel: 'Goods requirements',
        deliverablesTitle: 'Required goods',
        deliverablesHint: 'List each supply, installation, warranty, or training deliverable.',
        attachmentHint: 'Add specifications, datasheets, delivery forms, warranty templates, and compliance declarations.',
        responseTitle: 'Goods Offer',
        responseFields: ['Technical compliance', 'Delivery and warranty plan'],
        assuranceTitle: 'Samples / Catalogs',
        assuranceBadge: 'If requested',
        defaultItems: [
            { id: 'goods-1', item: '1.1', description: 'Digital X-ray machine', qty: 3, unit: 'Units', rate: 145000000 },
            { id: 'goods-2', item: '1.2', description: 'Patient monitor with accessories', qty: 20, unit: 'Units', rate: 18000000 },
            { id: 'goods-3', item: '1.3', description: 'Installation, calibration, and training', qty: 1, unit: 'Lot', rate: 120000000 }
        ],
        defaultDeliverables: [
            { id: 'deliverable-goods-1', text: 'Supply all listed goods with manufacturer warranty' },
            { id: 'deliverable-goods-2', text: 'Install, calibrate, and test equipment on site' },
            { id: 'deliverable-goods-3', text: 'Train users and hand over manuals and service contacts' }
        ],
        defaultAttachments: [
            { id: 'attachment-goods-1', text: 'Technical specification sheet' },
            { id: 'attachment-goods-2', text: 'Goods BOQ template' },
            { id: 'attachment-goods-3', text: 'Warranty and after-sales service form' }
        ],
        documentLabels: ['Technical specifications', 'Delivery terms', 'Warranty terms', 'Compliance certificates', 'Conditions of contract'],
        keyRequirements: ['Clear measurable specifications', 'Quantity and delivery schedule', 'Warranty and after-sales service', 'Compliance certificates, standards, and origin'],
        evaluationStyle: 'Mostly compliance plus price, usually lowest evaluated bidder once mandatory specifications are met.',
        bidderPreparation: ['Technical compliance sheet', 'Price quotation', 'Delivery schedule', 'Warranty and after-sales documents'],
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
        defaultItems: [
            { id: 'service-1', item: 'S1', description: 'Service mobilization and onboarding', qty: 1, unit: 'Lot', rate: 45000000 },
            { id: 'service-2', item: 'S2', description: 'Monthly managed service delivery', qty: 12, unit: 'Months', rate: 32000000 },
            { id: 'service-3', item: 'S3', description: 'Reporting, review, and knowledge transfer', qty: 4, unit: 'Quarters', rate: 12000000 }
        ],
        defaultDeliverables: [
            { id: 'deliverable-service-1', text: 'Mobilization plan and assigned service team' },
            { id: 'deliverable-service-2', text: 'Monthly service delivery against agreed SLA' },
            { id: 'deliverable-service-3', text: 'Performance reports and handover pack' }
        ],
        defaultAttachments: [
            { id: 'attachment-service-1', text: 'Terms of reference' },
            { id: 'attachment-service-2', text: 'Service level agreement schedule' },
            { id: 'attachment-service-3', text: 'Reporting template' }
        ],
        documentLabels: ['Scope of work', 'SLA / KPI schedule', 'Staffing plan template', 'Reporting templates', 'Conditions of contract'],
        keyRequirements: ['Scope of work', 'Service levels, SLAs, and KPIs', 'Staffing plan', 'Relevant service experience'],
        evaluationStyle: 'Mixed technical and price evaluation, with emphasis on capacity, SLA fit, and value.',
        bidderPreparation: ['Staffing plan', 'Methodology', 'SLA response', 'Price schedule'],
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
        defaultItems: [
            { id: 'consult-1', item: 'C1', description: 'Lead consultant professional fees', qty: 45, unit: 'Days', rate: 1200000 },
            { id: 'consult-2', item: 'C2', description: 'Subject matter expert inputs', qty: 30, unit: 'Days', rate: 900000 },
            { id: 'consult-3', item: 'C3', description: 'Workshops, travel, and reimbursables', qty: 1, unit: 'Lot', rate: 18000000 }
        ],
        defaultDeliverables: [
            { id: 'deliverable-consult-1', text: 'Inception report and approved work plan' },
            { id: 'deliverable-consult-2', text: 'Draft technical report and stakeholder validation' },
            { id: 'deliverable-consult-3', text: 'Final report, training materials, and knowledge transfer' }
        ],
        defaultAttachments: [
            { id: 'attachment-consult-1', text: 'Terms of reference' },
            { id: 'attachment-consult-2', text: 'Key expert CV template' },
            { id: 'attachment-consult-3', text: 'Technical and financial proposal templates' }
        ],
        documentLabels: ['Terms of Reference', 'Methodology template', 'Key expert CV template', 'Evaluation criteria', 'Financial proposal template'],
        keyRequirements: ['Terms of Reference', 'Methodology proposal', 'Team CVs', 'Relevant consulting experience'],
        evaluationStyle: 'Quality-focused evaluation using QCBS or QBS, with technical score carrying the main decision weight.',
        bidderPreparation: ['Technical proposal', 'Methodology', 'Team CVs', 'Relevant experience', 'Separate financial proposal when required'],
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
    tenderLocation: 'Dodoma region, Tanzania',
    contactName: 'Procurement Management Unit',
    phone: '+255 26 232 0000',
    email: 'procurement@moh.go.tz',
    phoneVerified: false,
    emailVerified: false
};

const defaultCreateTenderMainDraft = {
    title: 'Construction of Rural Health Centers',
    scope: 'Construction of five rural health centers in Dodoma region, including civil works, MEP installation, site preparation, finishing, equipment rooms, and handover documentation.',
    procurementTypeId: '',
    method: '',
    category: '',
    visibility: 'Public marketplace',
    visibilityNote: 'Visible to all verified suppliers after publication.'
};

function escapeCreateTenderHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
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
    if (raw === 'service') return 'services';
    if (raw === 'consulting' || raw === 'consultant') return 'consultancy';
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
    return draft.mainDetails;
}

function saveCreateTenderMainDraft(details = {}) {
    const draft = ensureCreateTenderDraft();
    draft.mainDetails = {
        ...defaultCreateTenderMainDraft,
        ...draft.mainDetails,
        ...details
    };
    localStorage.setItem(createTenderDraftStorageKey, JSON.stringify(draft.mainDetails));
    return draft.mainDetails;
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

function getProcurexMarketplaceTenders() {
    return mergeProcurexTenders().filter(tender => tender.status === 'Open' && !isProcurexTenderPast(tender));
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
    const title = wizard.querySelector('[data-tender-title]')?.value.trim() || 'Untitled tender';
    const scope = wizard.querySelector('[data-tender-scope]')?.value.trim() || 'Tender scope pending final description.';
    const method = wizard.querySelector('[data-procurement-method]')?.value || setup.methods[0];
    const category = wizard.querySelector('[data-procurement-category]')?.value || selectedType.categories[0];
    const visibility = wizard.querySelector('[data-tender-visibility]')?.value || 'Public marketplace';
    const visibilityNote = wizard.querySelector('[data-tender-visibility-note]')?.value.trim() || '';
    const contact = getCreateTenderContactDetails();
    const milestones = getCreateTenderMilestones();
    const closingDate = milestones.find(item => item.id === 'milestone-closing')?.date || milestones[milestones.length - 1]?.date || '';
    const profile = getCreateTenderTypeProfile(selectedType);
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
        description: scope,
        eligibility: `${method} / ${category}`,
        documents,
        category,
        method,
        visibility,
        visibilityNote,
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
        deliverables: getCreateTenderDeliverables(profile).map(item => item.text).filter(Boolean),
        milestones,
        amendments: [
            { title: 'No amendments published', status: 'Ready', detail: `Create an amendment if scope, ${profile.commercialName}, timeline, or attachments change.` }
        ],
        clarifications: [
            { title: 'Solar backup scope', question: 'Does each health center include solar backup wiring?', status: 'Open' },
            { title: 'Site visit schedule', question: 'Can suppliers attend one consolidated site visit?', status: 'Open' },
            { title: `${profile.commercialName} clarification`, question: 'A pricing or requirement line needs buyer confirmation.', status: 'Amendment candidate' }
        ],
        interestedSuppliers: [
            { name: 'ABC Construction Ltd', status: 'Downloaded documents', lastActivity: 'Today' },
            { name: 'BuildRight Ltd', status: 'Watching tender', lastActivity: 'Today' },
            { name: 'Prime Contractors', status: 'Asked clarification', lastActivity: '1 day ago' }
        ]
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
    const title = wizard.querySelector('[data-tender-title]')?.value.trim() || 'Untitled tender';
    const scope = wizard.querySelector('[data-tender-scope]')?.value.trim() || '';
    const details = saveCreateTenderMainDraft({
        title,
        scope,
        procurementTypeId: selectedType.id,
        method: wizard.querySelector('[data-procurement-method]')?.value || setup.methods[0],
        category: wizard.querySelector('[data-procurement-category]')?.value || selectedType.categories[0],
        visibility: wizard.querySelector('[data-tender-visibility]')?.value || defaultCreateTenderMainDraft.visibility,
        visibilityNote: wizard.querySelector('[data-tender-visibility-note]')?.value.trim() || defaultCreateTenderMainDraft.visibilityNote,
        status: 'Saved as draft',
        savedAt: new Date().toISOString(),
        attachmentCount: getCreateTenderRequiredAttachments(profile).length,
        deliverableCount: getCreateTenderDeliverables(profile).length,
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

function renderCreateTenderProfileCards(profile) {
    return `
        <div class="review-summary-grid" style="margin-bottom: 20px;">
            <article class="review-card">
                <span>Documents</span>
                <strong>${escapeCreateTenderHtml(profile.documentLabels[0])}</strong>
                <small>${profile.documentLabels.slice(1).map(escapeCreateTenderHtml).join(', ')}</small>
            </article>
            <article class="review-card">
                <span>Key requirements</span>
                <strong>${escapeCreateTenderHtml(profile.keyRequirements[0])}</strong>
                <small>${profile.keyRequirements.slice(1).map(escapeCreateTenderHtml).join(', ')}</small>
            </article>
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
    const selectedProfile = getCreateTenderTypeProfile(selectedType);
    const contactDetails = getCreateTenderContactDetails();
    const contactSummary = getCreateTenderContactSummary(contactDetails);
    const boqItems = getCreateTenderBoqItems(selectedProfile);
    const boqTotal = getCreateTenderBoqTotal(boqItems);
    const milestones = getCreateTenderMilestones();
    const milestoneSummary = getCreateTenderMilestoneSummary(milestones);
    const deliverables = getCreateTenderDeliverables(selectedProfile);
    const requiredAttachments = getCreateTenderRequiredAttachments(selectedProfile);
    const steps = [
        ['01', 'Need Identification', 'Department request, budget, contact'],
        ['02', 'Tender Planning', 'Type, category, method, visibility'],
        ['03', 'Prepare Documents', `${selectedProfile.scopeTitle}, requirements, attachments`],
        ['04', 'Tender Creation', 'Title, description, deadline, opening date'],
        ['05', selectedProfile.commercialName, selectedProfile.commercialDescription],
        ['06', 'Evaluation', 'Criteria, weights, pass marks'],
        ['07', 'Publish Tender', 'Portal, invitations, vendor notifications'],
        ['08', 'Pre-Bid & Review', 'Clarifications, addenda, final review']
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
                                        <h2>Need Identification</h2>
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
                                <div class="contact-verification-summary">
                                    <div><span>Verified channels</span><strong data-contact-verified-count>${contactSummary.verifiedCount}</strong></div>
                                    <div><span>Requirement</span><strong>Phone and/or email</strong></div>
                                </div>
                                <div class="form-grid two">
                                    <div class="form-group">
                                        <label class="form-label">Requesting department</label>
                                        <input class="form-input" value="Health Infrastructure Department" aria-label="Requesting department">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Budget approval status</label>
                                        <select class="form-input" aria-label="Budget approval status">
                                            <option>Approved</option>
                                            <option>Pending approval</option>
                                            <option>Not required yet</option>
                                        </select>
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
                                <div class="option-grid four" data-procurement-type-grid>
                                    ${procurementSetup.types.map(type => `
                                        <label class="option-card ${type.id === selectedType.id ? 'selected' : ''}" data-procurement-type-card>
                                            <input type="radio" name="procurementType" value="${type.id}" ${type.id === selectedType.id ? 'checked' : ''}>
                                            <strong>${type.label}</strong>
                                            <span>${type.description}</span>
                                        </label>
                                    `).join('')}
                                </div>
                                <div class="form-grid two">
                                    <div class="form-group">
                                        <label class="form-label">Procurement method</label>
                                        <select class="form-input" name="procurementMethod" data-procurement-method>
                                            ${renderCreateTenderOptions(procurementSetup.methods, mainDraft.method || procurementSetup.methods[0])}
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Category</label>
                                        <select class="form-input" name="procurementCategory" data-procurement-category>
                                            ${renderCreateTenderOptions(selectedType.categories, mainDraft.category || selectedType.categories[0])}
                                        </select>
                                    </div>
                                </div>
                                <div class="form-grid two">
                                    <div class="form-group">
                                        <label class="form-label">Tender visibility</label>
                                        <select class="form-input" data-tender-visibility>
                                            ${renderCreateTenderOptions(['Public marketplace', 'Restricted invited suppliers', 'Internal draft only'], mainDraft.visibility)}
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Visibility note</label>
                                        <input class="form-input" value="${escapeCreateTenderHtml(mainDraft.visibilityNote)}" data-tender-visibility-note aria-label="Visibility note">
                                    </div>
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-3">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 3</span>
                                        <h2 data-profile-scope-title>Prepare Documents</h2>
                                    </div>
                                    <span class="badge badge-warning" data-scope-total-badge>${deliverables.length} deliverables</span>
                                </div>
                                ${renderCreateTenderProfileCards(selectedProfile)}
                                <div class="form-group">
                                    <label class="form-label" data-profile-scope-label>${selectedProfile.scopeLabel}</label>
                                    <textarea class="form-input" rows="5" data-tender-scope>${escapeCreateTenderHtml(mainDraft.scope)}</textarea>
                                </div>
                                <div class="scope-list-panel">
                                    <div class="scope-list-heading">
                                        <div>
                                            <h3 data-profile-deliverables-title>${selectedProfile.deliverablesTitle}</h3>
                                            <span class="form-hint" data-profile-deliverables-hint>${selectedProfile.deliverablesHint}</span>
                                        </div>
                                        <span class="badge badge-info" data-scope-count="deliverables">${deliverables.length}</span>
                                    </div>
                                    <div class="scope-item-list" data-scope-list="deliverables">
                                        ${renderCreateTenderScopeRows(deliverables, 'deliverables', 'No deliverables added yet.')}
                                    </div>
                                    <button class="btn btn-secondary scope-add" type="button" data-scope-add="deliverables">Add Deliverable</button>
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-4">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 4</span>
                                        <h2>Tender Creation in System</h2>
                                    </div>
                                    <span class="badge badge-info" data-scope-count="attachments">${requiredAttachments.length}</span>
                                </div>
                                <div class="form-grid two">
                                    <div class="form-group">
                                        <label class="form-label">Tender title</label>
                                        <input class="form-input" value="${escapeCreateTenderHtml(mainDraft.title)}" aria-label="Tender title" data-tender-title>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Submission deadline</label>
                                        <input class="form-input" type="date" value="${escapeCreateTenderHtml(milestones.find(item => item.id === 'milestone-closing')?.date || '')}" data-milestone-field="date" data-milestone-row-proxy="milestone-closing" aria-label="Submission deadline">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Opening date</label>
                                        <input class="form-input" type="date" value="${escapeCreateTenderHtml(milestones.find(item => item.id === 'milestone-opening')?.date || '')}" data-milestone-field="date" data-milestone-row-proxy="milestone-opening" aria-label="Opening date">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Category</label>
                                        <input class="form-input" value="${escapeCreateTenderHtml(mainDraft.category || selectedType.categories[0])}" readonly aria-label="Tender category">
                                    </div>
                                </div>
                                <div class="scope-list-panel attachment-manager">
                                    <div class="scope-list-heading">
                                        <div>
                                            <h3>Required attachments</h3>
                                            <span class="form-hint" data-profile-attachment-hint>${selectedProfile.attachmentHint}</span>
                                        </div>
                                        <button class="btn btn-secondary scope-add" type="button" data-scope-add="attachments">Add Attachment</button>
                                    </div>
                                    <div class="scope-item-list" data-scope-list="attachments">
                                        ${renderCreateTenderScopeRows(requiredAttachments, 'attachments', 'No required attachments added yet.')}
                                    </div>
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-5">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 5</span>
                                        <h2 data-commercial-title>${selectedProfile.commercialTitle}</h2>
                                    </div>
                                    <span class="badge badge-info" data-boq-estimate-badge>${formatCreateTenderCompactMoney(boqTotal)}</span>
                                </div>
                                <div class="boq-summary-strip" data-boq-summary>
                                    <div><span data-commercial-count-label>${selectedProfile.commercialItemName}s</span><strong data-boq-item-count>${boqItems.length}</strong></div>
                                    <div><span>Total estimate</span><strong data-boq-total>${formatCreateTenderMoney(boqTotal)}</strong></div>
                                    <div><span>Average line</span><strong data-boq-average>${formatCreateTenderMoney(boqItems.length ? boqTotal / boqItems.length : 0)}</strong></div>
                                </div>
                                <div class="data-table boq-editor" data-boq-editor>
                                    <table>
                                        <thead>
                                            ${renderCreateTenderCommercialTableHead(selectedProfile)}
                                        </thead>
                                        <tbody data-boq-table-body>
                                            ${renderCreateTenderBoqRows(boqItems, selectedProfile)}
                                        </tbody>
                                    </table>
                                </div>
                                <div class="inline-actions">
                                    <input class="boq-file-input" type="file" accept=".csv,.txt" data-boq-file aria-label="${selectedProfile.importLabel}">
                                    <button class="btn btn-secondary" type="button" data-boq-import>${selectedProfile.importLabel}</button>
                                    <button class="btn btn-secondary" type="button" data-boq-add>${selectedProfile.addLabel}</button>
                                    <button class="btn btn-secondary" type="button" data-boq-recalculate>Recalculate</button>
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-6">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 6</span>
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

                            <section class="journey-panel" id="wizard-step-7">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 7</span>
                                        <h2>Publish Tender</h2>
                                    </div>
                                    <span class="badge badge-success" data-milestone-badge>${milestoneSummary.count} milestones</span>
                                </div>
                                <div class="review-summary-grid" style="margin-bottom: 20px;">
                                    <article class="review-card">
                                        <span>Publish channel</span>
                                        <strong>${escapeCreateTenderHtml(mainDraft.visibility)}</strong>
                                        <small>${escapeCreateTenderHtml(mainDraft.visibilityNote)}</small>
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

                            <section class="journey-panel review-panel" id="wizard-step-8">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 8</span>
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
                                        <strong data-review-title>Construction of Rural Health Centers</strong>
                                        <small data-review-scope>Scope summary ready</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Location & contact</span>
                                        <strong data-review-contact>${escapeCreateTenderHtml(contactDetails.tenderLocation)}</strong>
                                        <small data-review-contact-status>${contactSummary.complete ? 'Contact verified' : 'Verification pending'}</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Procurement</span>
                                        <strong data-review-procurement>${selectedType.label}</strong>
                                        <small data-review-category>${selectedType.categories[0]}</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Visibility</span>
                                        <strong data-review-visibility>${escapeCreateTenderHtml(mainDraft.visibility)}</strong>
                                        <small data-review-visibility-note>${escapeCreateTenderHtml(mainDraft.visibilityNote)}</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Scope package</span>
                                        <strong data-review-scope-count>${deliverables.length + requiredAttachments.length} items</strong>
                                        <small data-review-scope-breakdown>${deliverables.length} deliverables, ${requiredAttachments.length} attachments</small>
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
                                    <div><strong>Buyer confirmation</strong><span data-review-confirmation>Review scope, attachments, ${selectedProfile.commercialName}, timeline, evaluation, and visibility before publishing.</span></div>
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
    const categorySelect = wizard.querySelector('[data-procurement-category]');
    const panels = Array.from(wizard.querySelectorAll('.wizard-workspace > .journey-panel'));
    const railSteps = Array.from(wizard.querySelectorAll('[data-wizard-step-index]'));
    const previousButton = wizard.querySelector('[data-wizard-prev]');
    const nextButton = wizard.querySelector('[data-wizard-next]');
    const progressOutput = wizard.querySelector('[data-wizard-progress]');
    const stepTitleOutput = wizard.querySelector('[data-wizard-step-title]');
    let activeStepIndex = 0;

    const renderOptions = (select, options, selectedValue = '') => {
        if (!select) return;
        select.innerHTML = options.map(option => `<option ${option === selectedValue ? 'selected' : ''}>${option}</option>`).join('');
    };

    const getSelectedProfile = () => {
        const selectedTypeId = wizard.querySelector('input[name="procurementType"]:checked')?.value || setup.defaultType.id;
        return getCreateTenderTypeProfile(selectedTypeId);
    };

    const refreshProfileText = () => {
        const profile = getSelectedProfile();
        const updateText = (selector, value) => {
            const node = wizard.querySelector(selector);
            if (node) node.textContent = value;
        };
        updateText('[data-profile-scope-title]', 'Prepare Documents');
        updateText('[data-profile-scope-label]', profile.scopeLabel);
        updateText('[data-profile-deliverables-title]', profile.deliverablesTitle);
        updateText('[data-profile-deliverables-hint]', profile.deliverablesHint);
        updateText('[data-profile-attachment-hint]', profile.attachmentHint);
        updateText('[data-commercial-title]', profile.commercialTitle);
        updateText('[data-commercial-count-label]', `${profile.commercialItemName}s`);
        updateText('[data-review-commercial-label]', profile.reviewLabel);
        updateText('[data-review-confirmation]', `Review scope, attachments, ${profile.commercialName}, timeline, evaluation, and visibility before publishing.`);

        const commercialRail = railSteps[4]?.querySelector('span');
        if (commercialRail) commercialRail.textContent = profile.commercialName;
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
        renderOptions(methodSelect, setup.methods);
        renderOptions(categorySelect, selectedType.categories);
        saveCreateTenderMainDraft({
            procurementTypeId: selectedType.id,
            category: categorySelect?.value || selectedType.categories[0]
        });
        renderBoqTable();
        renderScopeList('deliverables');
        renderScopeList('attachments');
        refreshProfileText();
    };

    const saveMainDetailsFromInputs = () => {
        const selectedTypeId = wizard.querySelector('input[name="procurementType"]:checked')?.value || setup.defaultType.id;
        const selectedType = setup.types.find(type => type.id === selectedTypeId) || setup.defaultType;
        saveCreateTenderMainDraft({
            title: wizard.querySelector('[data-tender-title]')?.value.trim() || defaultCreateTenderMainDraft.title,
            scope: wizard.querySelector('[data-tender-scope]')?.value.trim() || defaultCreateTenderMainDraft.scope,
            procurementTypeId: selectedType.id,
            method: methodSelect?.value || setup.methods[0],
            category: categorySelect?.value || selectedType.categories[0],
            visibility: wizard.querySelector('[data-tender-visibility]')?.value || defaultCreateTenderMainDraft.visibility,
            visibilityNote: wizard.querySelector('[data-tender-visibility-note]')?.value.trim() || defaultCreateTenderMainDraft.visibilityNote
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

    const refreshScopeSummary = () => {
        const profile = getSelectedProfile();
        const deliverables = getCreateTenderDeliverables(profile);
        const attachments = getCreateTenderRequiredAttachments(profile);
        const totalBadge = wizard.querySelector('[data-scope-total-badge]');
        const deliverableCount = wizard.querySelector('[data-scope-count="deliverables"]');
        const attachmentCount = wizard.querySelector('[data-scope-count="attachments"]');

        if (totalBadge) totalBadge.textContent = deliverables.length ? `${deliverables.length} deliverables` : 'Scope empty';
        if (deliverableCount) deliverableCount.textContent = String(deliverables.length);
        if (attachmentCount) attachmentCount.textContent = String(attachments.length);
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
        if (output) output.textContent = value;
    };

    const refreshTenderReview = () => {
        const title = wizard.querySelector('[data-tender-title]')?.value.trim() || 'Untitled tender';
        const scope = wizard.querySelector('[data-tender-scope]')?.value.trim() || '';
        const scopePreview = scope.length > 112 ? `${scope.slice(0, 109)}...` : scope || 'Scope not written';
        const contact = getCreateTenderContactDetails();
        const contactSummary = getCreateTenderContactSummary(contact);
        const selectedTypeId = wizard.querySelector('input[name="procurementType"]:checked')?.value || setup.defaultType.id;
        const selectedType = setup.types.find(type => type.id === selectedTypeId) || setup.defaultType;
        const profile = getCreateTenderTypeProfile(selectedType);
        const deliverables = getCreateTenderDeliverables(profile);
        const attachments = getCreateTenderRequiredAttachments(profile);
        const boqItems = getCreateTenderBoqItems(profile);
        const boqTotal = getCreateTenderBoqTotal(boqItems);
        const milestoneSummary = getCreateTenderMilestoneSummary(getCreateTenderMilestones());
        const evaluationWeights = Array.from(wizard.querySelectorAll('.criterion-row input'))
            .map(input => parseCreateTenderNumber(input.value));
        const evaluationTotal = evaluationWeights.reduce((total, weight) => total + weight, 0);
        const readiness = title !== 'Untitled tender' && contactSummary.complete && boqItems.length && milestoneSummary.datedCount === milestoneSummary.count;
        const reviewBadge = wizard.querySelector('[data-review-readiness]');

        setReviewText('[data-review-title]', title);
        setReviewText('[data-review-scope]', scopePreview);
        setReviewText('[data-review-contact]', contact.tenderLocation || 'Location not set');
        setReviewText('[data-review-contact-status]', `${contact.contactName || 'Contact not set'} - ${contactSummary.verifiedCount} verified channel${contactSummary.verifiedCount === 1 ? '' : 's'}`);
        setReviewText('[data-review-procurement]', `${selectedType.label} - ${methodSelect?.value || 'Method not set'}`);
        setReviewText('[data-review-category]', categorySelect?.value || 'Category not set');
        setReviewText('[data-review-visibility]', wizard.querySelector('[data-tender-visibility]')?.value || defaultCreateTenderMainDraft.visibility);
        setReviewText('[data-review-visibility-note]', wizard.querySelector('[data-tender-visibility-note]')?.value.trim() || defaultCreateTenderMainDraft.visibilityNote);
        setReviewText('[data-review-scope-count]', `${deliverables.length + attachments.length} items`);
        setReviewText('[data-review-scope-breakdown]', `${deliverables.length} deliverables, ${attachments.length} attachments`);
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
        if (event.target?.matches('[data-tender-title], [data-tender-scope], [data-procurement-method], [data-procurement-category], [data-tender-visibility], [data-tender-visibility-note], .criterion-row input')) {
            saveMainDetailsFromInputs();
            refreshTenderReview();
        }
    });

    wizard.addEventListener('input', (event) => {
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
        if (event.target?.matches('[data-tender-title], [data-tender-scope], [data-tender-visibility-note], .criterion-row input')) {
            saveMainDetailsFromInputs();
            refreshTenderReview();
        }
    });

    wizard.addEventListener('click', (event) => {
        const railStep = event.target?.closest('[data-wizard-step-index]');
        if (railStep) {
            event.preventDefault();
            setActiveStep(Number(railStep.dataset.wizardStepIndex));
            return;
        }

        const target = event.target?.closest('button');
        if (!target) return;

        if (target.matches('[data-wizard-prev]')) {
            setActiveStep(activeStepIndex - 1);
            return;
        }

        if (target.matches('[data-wizard-next]')) {
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

    refreshContactSummary();
    refreshBoqSummary();
    refreshMilestoneSummary();
    refreshScopeSummary();
    refreshProfileText();
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
