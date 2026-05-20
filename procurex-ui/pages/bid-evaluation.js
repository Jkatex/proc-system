// Guided Bid Evaluation Workspace

function escapeEvaluationHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatEvaluationMoney(value, currency = 'TZS') {
    if (typeof value !== 'number') return escapeEvaluationHtml(value || '-');
    return `${currency} ${value.toLocaleString()}`;
}

function getEvaluationAllTenders() {
    if (typeof getProcurexAllTenders === 'function') return getProcurexAllTenders();
    return mockData.tenders || [];
}

function getEvaluationSourceTender(reference) {
    const tenders = getEvaluationAllTenders();
    return tenders.find(tender => tender.id === reference || tender.reference === reference)
        || tenders.find(tender => tender.title === reference)
        || null;
}

function slugEvaluationId(value = 'criterion') {
    return String(value || 'criterion')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        || 'criterion';
}

function normalizeEvaluationCriterion(criterion = {}, index = 0) {
    const name = criterion.name || criterion.label || `Criterion ${index + 1}`;
    const maxScore = Number(criterion.maxScore || criterion.weight || 0) || 0;
    return {
        id: criterion.id || slugEvaluationId(name),
        name,
        weight: Number(criterion.weight || maxScore || 0),
        maxScore: maxScore || Number(criterion.weight || 0) || 10,
        subcriteria: Array.isArray(criterion.subcriteria) ? criterion.subcriteria : [],
        type: String(name).toLowerCase().includes('financial') || String(name).toLowerCase().includes('price') ? 'financial' : 'technical'
    };
}

function getEvaluationCriteriaForTender(tender, fallbackCriteria = []) {
    const tenderCriteria = tender?.evaluation?.criteria;
    const source = Array.isArray(tenderCriteria) && tenderCriteria.length ? tenderCriteria : fallbackCriteria;
    return source.map((criterion, index) => normalizeEvaluationCriterion(criterion, index));
}

function getEvaluationScoringCriteriaForTender(tender, fallbackCriteria = []) {
    const allCriteria = getEvaluationCriteriaForTender(tender, fallbackCriteria);
    const technicalCriteria = allCriteria.filter(criterion => criterion.type !== 'financial');
    return technicalCriteria.length ? technicalCriteria : allCriteria;
}

function getEvaluationBadgeClass(value = '') {
    const status = String(value).toLowerCase();
    if (status.includes('fail') || status.includes('rejected') || status.includes('overdue') || status.includes('not eligible') || status.includes('escalate')) return 'badge-error';
    if (status.includes('pending') || status.includes('clarification') || status.includes('review') || status.includes('managed') || status.includes('watch') || status.includes('moderate')) return 'badge-warning';
    if (status.includes('complete') || status.includes('pass') || status.includes('eligible') || status.includes('recommended') || status.includes('cleared') || status.includes('active') || status.includes('submitted') || status.includes('clear') || status.includes('low')) return 'badge-success';
    return 'badge-info';
}

function getEvaluationTechnicalTotal(bid, criteria) {
    return criteria.reduce((sum, criterion) => {
        const raw = bid.technicalScores?.[criterion.id] ?? bid.technicalScores?.[slugEvaluationId(criterion.name)];
        return sum + Number(raw || 0);
    }, 0);
}

function renderEvaluationStatusBadge(value) {
    return `<span class="badge ${getEvaluationBadgeClass(value)}">${escapeEvaluationHtml(value)}</span>`;
}

function getEvaluationSubmittedBidForSupplier(tender = {}, bid = {}, bidderIndex = 0) {
    if (typeof getProcurexSubmittedBidsForTender !== 'function') return null;
    const submitted = getProcurexSubmittedBidsForTender(tender);
    if (!submitted.length) return null;
    const supplierName = String(bid.supplier || '').toLowerCase();
    return submitted.find(item => String(item.supplier || item.draft?.supplier || item.draft?.supplierName || '').toLowerCase() === supplierName)
        || submitted[bidderIndex]
        || (bidderIndex === 0 ? submitted[0] : null);
}

function renderEvaluationSupplierBidDocument(tender = {}, bid = {}, bidderIndex = 0, criteria = []) {
    if (typeof renderProcurexBidPackageDocument !== 'function') {
        return '<div class="scope-empty">Bid document renderer is unavailable.</div>';
    }
    const sourceTender = tender.sourceTender || tender;
    const submittedBid = getEvaluationSubmittedBidForSupplier(sourceTender, bid, bidderIndex);
    const sections = submittedBid && typeof createProcurexBidPackageSectionsFromDraft === 'function'
        ? createProcurexBidPackageSectionsFromDraft(submittedBid.draft || {})
        : (typeof createProcurexBidPackageSectionsFromEvaluationBid === 'function'
            ? createProcurexBidPackageSectionsFromEvaluationBid(bid, criteria)
            : []);
    const supplier = submittedBid
        ? {
            name: bid.supplier || submittedBid.supplier || mockData.users?.supplier?.organization || 'Supplier organization',
            registrationNumber: bid.registrationNumber,
            contactPerson: bid.contactPerson,
            submittedAt: submittedBid.submittedAt ? new Date(submittedBid.submittedAt).toLocaleString() : '',
            receiptHash: submittedBid.receiptHash,
            total: submittedBid.draft?.total || bid.price,
            status: 'Submitted bid'
        }
        : {
            name: bid.supplier || 'Supplier',
            registrationNumber: bid.registrationNumber,
            contactPerson: bid.contactPerson,
            submittedAt: bid.submissionTime,
            receiptHash: bid.integrityHash,
            total: bid.financial?.correctedPrice ? formatEvaluationMoney(bid.financial.correctedPrice, bid.financial?.currency || 'TZS') : formatEvaluationMoney(bid.price, bid.financial?.currency || 'TZS'),
            status: bid.finalResult || bid.preliminaryResult || 'Under Evaluation'
        };

    return renderProcurexBidPackageDocument({
        tender: sourceTender,
        sections,
        supplier,
        editable: false,
        includeActions: false,
        documentLabel: submittedBid ? 'Optional Same-Browser Bid Evidence' : 'Evaluation Mock Data',
        offerLabel: tender.category || sourceTender.type || 'Bid Offer',
        description: submittedBid
            ? 'Optional evidence read from this browser only. The evaluation app remains separate and studies this copy only when available.'
            : 'Mock or reconstructed evaluation evidence. No tenderer bid package was found in this browser session.'
    });
}

function renderEvaluationChecklist(items = []) {
    return `
        <div class="evaluation-checklist">
            ${items.map(item => `
                <div class="evaluation-check-row">
                    <div>
                        <strong>${escapeEvaluationHtml(item.requirement)}</strong>
                        <span>${escapeEvaluationHtml(item.comment || item.source || '')}</span>
                    </div>
                    <div class="evaluation-check-actions">
                        ${renderEvaluationStatusBadge(item.result)}
                        ${item.document ? `<button class="btn btn-secondary" type="button" data-tab-jump="technical">View Document</button>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function getEvaluationTenderProfileId(tender = {}) {
    const raw = String(tender.procurementTypeId || tender.type || tender.category || '').toLowerCase();
    if (raw.includes('consult')) return 'consultancy';
    if (raw.includes('service')) return 'services';
    if (raw.includes('good') || raw.includes('supply')) return 'goods';
    return raw.includes('work') || raw.includes('construction') ? 'works' : raw || 'works';
}

function getEvaluationDefaultFlowForTender(tender = {}) {
    const profile = getEvaluationTenderProfileId(tender);
    const fields = (tender.sourceTender || tender).requirements?.fields || {};
    const postQualificationRequired = profile === 'works'
        || ['postQualificationRequired', 'requirePostQualification', 'stockVerificationRequired', 'sampleVerificationRequired', 'staffVerificationRequired', 'equipmentVerificationRequired']
            .some(key => /yes|required|true/i.test(String(fields[key] || '')));
    return [
        'Preliminary examination',
        'Eligibility evaluation',
        'Technical evaluation',
        'Technical pass/fail approval',
        'Financial evaluation',
        profile === 'consultancy' ? 'Combined ranking or method-specific selection' : 'Comparison matrix',
        ...(postQualificationRequired ? ['Post qualification'] : []),
        'Award recommendation',
        'Evaluation report'
    ];
}

function getEvaluationStagesForTender(tender = {}, defaultStages = []) {
    const flow = tender.evaluationFlow || tender.sourceTender?.evaluationFlow || getEvaluationDefaultFlowForTender(tender.sourceTender || tender);
    const stageMap = {
        'administrative evaluation': { id: 'preliminary', label: 'Administrative', status: 'done' },
        'preliminary examination': { id: 'preliminary', label: 'Preliminary', status: 'done' },
        'eligibility evaluation': { id: 'eligibility', label: 'Eligibility', status: 'done' },
        'technical evaluation': { id: 'technical', label: 'Technical', status: 'current' },
        'technical pass/fail approval': { id: 'technical-gate', label: 'Technical Gate', status: 'pending' },
        'financial evaluation': { id: 'financial', label: 'Financial', status: 'pending' },
        'post qualification': { id: 'postqual', label: 'Post-Qualification', status: 'pending' },
        'combined ranking or method-specific selection': { id: 'comparison', label: 'Combined Ranking', status: 'pending' },
        'comparison matrix': { id: 'comparison', label: 'Comparison', status: 'pending' },
        'evaluation report': { id: 'report', label: 'Report', status: 'pending' },
        'award recommendation': { id: 'recommendation', label: 'Recommendation', status: 'pending' }
    };
    const base = Array.isArray(flow) && flow.length ? flow : [];
    const dynamic = base.map(step => {
        const mapped = stageMap[String(step || '').toLowerCase()];
        return mapped || { id: slugEvaluationId(step), label: step, status: 'pending' };
    });
    const profile = getEvaluationTenderProfileId(tender.sourceTender || tender);
    const stageIds = new Set(dynamic.map(stage => stage.id));
    const technicalIndex = Math.max(0, dynamic.findIndex(stage => stage.id === 'technical'));
    const dynamicWithEligibility = !stageIds.has('eligibility')
        ? [
            ...dynamic.slice(0, technicalIndex),
            { id: 'eligibility', label: 'Eligibility', status: 'done' },
            ...dynamic.slice(technicalIndex)
        ]
        : dynamic;
    const dynamicIds = new Set(dynamicWithEligibility.map(stage => stage.id));
    const extras = (defaultStages || []).filter(stage => ['clarifications', 'report', 'audit'].includes(stage.id));
    return [
        { id: 'overview', label: 'Overview', status: 'current' },
        { id: 'opening', label: 'Bid Opening', status: 'done' },
        { id: 'conflict', label: 'Conflict Declarations', status: 'done' },
        ...dynamicWithEligibility,
        ...extras.filter(stage => !dynamicIds.has(stage.id))
    ].filter((stage, index, stages) => stages.findIndex(item => item.id === stage.id) === index);
}

function getEvaluationSelectionMethod(tender = {}, recommendation = {}) {
    const candidates = [
        tender.evaluation?.method,
        tender.selectionMethod,
        tender.awardMethod,
        tender.evaluationMethod,
        tender.method,
        recommendation.method
    ].filter(Boolean);
    const method = candidates.find(item => !/^(open|invited)\s+tender$/i.test(String(item))) || candidates[0] || '';
    if (/consult/i.test(`${tender.type || ''} ${tender.category || ''}`) && /^(open|invited)\s+tender$/i.test(String(method))) {
        return 'QCBS (Quality-Cost Based)';
    }
    if (/^(open|invited)\s+tender$/i.test(String(method))) return 'Lowest evaluated substantially responsive bid';
    return method || 'Lowest evaluated substantially responsive bid';
}

function getEvaluationSubmittedBidSections(tender = {}, bid = {}, bidderIndex = 0) {
    const submittedBid = getEvaluationSubmittedBidForSupplier(tender.sourceTender || tender, bid, bidderIndex);
    if (submittedBid?.draft && typeof createProcurexBidPackageSectionsFromDraft === 'function') {
        return createProcurexBidPackageSectionsFromDraft(submittedBid.draft || {});
    }
    if (typeof createProcurexBidPackageSectionsFromEvaluationBid === 'function') {
        return createProcurexBidPackageSectionsFromEvaluationBid(bid, getEvaluationCriteriaForTender(tender.sourceTender || tender, []));
    }
    return [];
}

function getEvaluationSubmittedBidEvidenceText(tender = {}, bid = {}, bidderIndex = 0) {
    const submittedBid = getEvaluationSubmittedBidForSupplier(tender.sourceTender || tender, bid, bidderIndex);
    const sections = getEvaluationSubmittedBidSections(tender, bid, bidderIndex);
    const parts = [
        bid.supplier,
        bid.registrationNumber,
        bid.contactPerson,
        ...(bid.documents || []),
        ...(bid.preliminaryChecks || []).flatMap(item => [item.requirement, item.result, item.comment]),
        ...(bid.eligibilityChecks || []).flatMap(item => [item.requirement, item.result, item.comment])
    ];
    if (submittedBid?.draft) {
        parts.push(...Object.keys(submittedBid.draft.responses || {}), ...Object.values(submittedBid.draft.responses || {}));
        parts.push(...Object.keys(submittedBid.draft.freeResponses || {}), ...Object.values(submittedBid.draft.freeResponses || {}));
        parts.push(...Object.values(submittedBid.draft.uploadedFiles || {}).map(file => file?.name || file));
    }
    sections.forEach(section => {
        parts.push(section.title);
        (section.rows || []).forEach(row => parts.push(row.label, row.value, row.requirement, row.file?.name));
    });
    return parts.filter(Boolean).join(' ').toLowerCase();
}

function hasEvaluationBidEvidence(tender, bid, bidderIndex, labels = []) {
    const haystack = getEvaluationSubmittedBidEvidenceText(tender, bid, bidderIndex);
    return labels.some(label => {
        const tokens = String(label || '').toLowerCase().split(/[^a-z0-9]+/).filter(token => token.length > 2);
        return tokens.length && tokens.some(token => haystack.includes(token));
    });
}

function getEvaluationRequiredSubmissionDocuments(tender = {}) {
    const source = tender.sourceTender || tender;
    const fields = source.requirements?.fields || {};
    const docs = [
        ...(source.requiredSubmissionDocuments || []),
        ...(source.documents || []),
        ...(fields.supportingDocumentRows || []).map(item => item.documentName || item.name),
        ...(fields.technicalSpecificationDocuments || []).map(item => item.documentType || item.title || item.name),
        ...(fields.serviceSupportingDocuments || []).map(item => item.documentName || item.name),
        ...(fields.consultancySupportingDocuments || []).map(item => item.documentName || item.name)
    ].filter(Boolean);
    return Array.from(new Set(docs.map(doc => typeof doc === 'string' ? doc : doc.text || doc.name || doc.documentName).filter(Boolean)));
}

function getEvaluationTenderConfiguredRequirementCount(tender = {}) {
    const source = tender.sourceTender || tender;
    const fields = source.requirements?.fields || {};
    const fieldCount = Object.values(fields).filter(value => {
        if (Array.isArray(value)) return value.length > 0;
        if (value && typeof value === 'object') return Object.keys(value).length > 0;
        return value === true || String(value || '').trim().length > 0;
    }).length;
    return fieldCount + getEvaluationRequiredSubmissionDocuments(source).length + (source.regulatoryLicenses || []).length + (source.evaluation?.criteria || []).length;
}

function renderEvaluationEmptyStudyState(message) {
    return `<div class="scope-empty evaluation-empty-study-state">${escapeEvaluationHtml(message)}</div>`;
}

function getEvaluationRequirementFlag(tender = {}, keys = []) {
    const fields = (tender.sourceTender || tender).requirements?.fields || {};
    return keys.some(key => fields[key] === true || fields[key] === 'Yes' || fields[key] === 'Required');
}

function getEvaluationOpeningSubmissionForBid(tender = {}, bid = {}, bidderIndex = 0) {
    const opening = mockData.bidEvaluation?.openingReport || {};
    const supplier = String(bid.supplier || '').toLowerCase();
    return (opening.submissions || []).find(item => String(item.supplier || '').toLowerCase() === supplier)
        || opening.submissions?.[bidderIndex]
        || null;
}

function generateEvaluationPreliminaryChecklist(tender = {}, bid = {}, bidderIndex = 0) {
    const source = tender.sourceTender || tender;
    const openingRow = getEvaluationOpeningSubmissionForBid(tender, bid, bidderIndex);
    const hasTenderDocuments = getEvaluationRequiredSubmissionDocuments(source).length > 0;
    const hasTenderFlags = getEvaluationRequirementFlag(source, ['bidSecurityRequired', 'requiresBidSecurity', 'bidSecurity']);
    const checklist = [
        { requirement: 'Bid submitted before deadline', source: 'system', labels: ['before deadline', bid.submissionTime], document: false, mandatory: true, openingField: 'deadline' },
        { requirement: 'Technical offer submitted', source: 'opening record', labels: ['technical proposal', 'technical offer', 'technical response'], document: true, mandatory: true, openingField: 'technicalOffer' },
        { requirement: 'Financial offer submitted', source: 'opening record', labels: ['financial offer', 'priced', 'boq', 'pricing schedule'], document: true, mandatory: true, openingField: 'financialOffer' }
    ];
    if (!hasTenderDocuments && !hasTenderFlags) {
        checklist.push({
            requirement: 'No tender-specific preliminary documents configured',
            source: 'tender design',
            labels: [],
            document: false,
            informational: true
        });
    }
    if (hasTenderFlags) {
        checklist.push({ requirement: 'Bid security submitted', source: 'tender.requirements', labels: ['bid security', 'security'], document: true, mandatory: true, openingField: 'bidSecurity' });
    }
    getEvaluationRequiredSubmissionDocuments(source).forEach(doc => {
        checklist.push({ requirement: `${doc} submitted`, source: 'tender.requiredSubmissionDocuments', labels: [doc], document: true, mandatory: true });
    });
    const fallbackByRequirement = new Map((bid.preliminaryChecks || []).map(item => [String(item.requirement || '').toLowerCase(), item]));
    return checklist.map(item => {
        const fallback = fallbackByRequirement.get(item.requirement.toLowerCase());
        const hasEvidence = hasEvaluationBidEvidence(tender, bid, bidderIndex, item.labels || [item.requirement]);
        if (item.informational) {
            return {
                requirement: item.requirement,
                source: item.source,
                document: false,
                result: 'Not Configured',
                comment: 'The tender design does not define additional preliminary document checks.'
            };
        }
        const openingValue = item.openingField ? String(openingRow?.[item.openingField] || '') : '';
        const openingPass = item.openingField === 'deadline'
            ? /before|on time|submitted/i.test(openingValue) && !/late|after/i.test(openingValue)
            : /yes|submitted|present|included|available/i.test(openingValue);
        const openingFail = item.openingField === 'deadline'
            ? /late|after deadline|missed/i.test(openingValue)
            : /no|missing|absent|not submitted/i.test(openingValue);
        const fallbackResult = fallback?.result || '';
        const normalizedFallback = /fail|rejected/i.test(fallbackResult)
            ? 'Failed'
            : /not applicable|n\/a/i.test(fallbackResult)
                ? 'Not Applicable'
                : /pass/i.test(fallbackResult)
                    ? 'Passed'
                    : fallbackResult;
        const result = openingFail || /failed/i.test(normalizedFallback)
            ? 'Failed'
            : openingPass || hasEvidence || /passed/i.test(normalizedFallback)
                ? 'Passed'
                : /not applicable/i.test(normalizedFallback)
                    ? 'Not Applicable'
                    : 'Requires Clarification';
        return {
            requirement: item.requirement,
            source: item.source,
            document: item.document,
            result,
            comment: openingFail
                ? `Opening record shows ${openingValue || 'non-compliance'}; this may fail preliminary review.`
                : hasEvidence || openingPass
                    ? `Evidence studied from ${item.source}.`
                    : fallback?.comment || `Derived from ${item.source}; evidence needs buyer confirmation.`
        };
    });
}

function generateEvaluationEligibilityChecklist(tender = {}, bid = {}, bidderIndex = 0) {
    const source = tender.sourceTender || tender;
    const licenses = source.regulatoryLicenses || [];
    const checklist = [
        { requirement: 'Company registration', source: 'standard', labels: ['registration', 'company', 'incorporation'], mandatory: true },
        { requirement: 'Tax clearance', source: 'standard', labels: ['tax clearance', 'tax'], mandatory: true },
        ...(!licenses.length ? [{
            requirement: 'No tender-specific regulatory license configured',
            source: 'tender design',
            labels: [],
            mandatory: false,
            informational: true
        }] : []),
        ...licenses.map(license => ({
            requirement: license.license || license.registrationType || license.regulatoryBody || 'Regulatory license',
            source: 'tender.regulatoryLicenses',
            labels: [license.license, license.body, license.group].filter(Boolean),
            mandatory: license.mandatory !== false,
            expiryRequired: Boolean(license.expiryRequired)
        }))
    ];
    const fallbackByRequirement = new Map((bid.eligibilityChecks || []).map(item => [String(item.requirement || '').toLowerCase(), item]));
    return checklist.map(item => {
        const fallback = fallbackByRequirement.get(item.requirement.toLowerCase());
        const hasEvidence = hasEvaluationBidEvidence(tender, bid, bidderIndex, item.labels || [item.requirement]);
        const missingMandatory = item.mandatory && !hasEvidence && !fallback;
        if (item.informational) {
            return {
                requirement: item.requirement,
                source: item.source,
                document: false,
                result: 'Not Configured',
                comment: 'The tender design does not define additional regulatory license checks.'
            };
        }
        return {
            requirement: item.requirement,
            source: item.expiryRequired ? `${item.source}; expiry required` : item.source,
            document: true,
            result: hasEvidence || /eligible|pass/i.test(fallback?.result || '') ? 'Eligible' : missingMandatory ? 'Not Eligible' : fallback?.result || 'Requires Clarification',
            comment: hasEvidence ? `Evidence studied from ${item.source}.` : fallback?.comment || `${item.mandatory ? 'Mandatory' : 'Optional'} requirement derived from ${item.source}.`
        };
    });
}

function getSelectedEvaluationTenderReference(evaluation) {
    const readyTenders = evaluation.readyTenders || [];
    if (readyTenders.length <= 1) return readyTenders[0]?.reference || evaluation.activeTender?.reference || '';
    try {
        return localStorage.getItem('procurex.selectedEvaluationTender') || '';
    } catch (error) {
        return window.procurexSelectedEvaluationTender || '';
    }
}

function getSelectedEvaluationReportReference() {
    try {
        return localStorage.getItem('procurex.selectedEvaluationReport') || '';
    } catch (error) {
        return window.procurexSelectedEvaluationReport || '';
    }
}

function getEvaluationTenderModel(evaluation, selectedReference) {
    const activeTender = evaluation.activeTender || {};
    const selectedTender = (evaluation.readyTenders || []).find(item => item.reference === selectedReference);
    const sourceTender = getEvaluationSourceTender(selectedReference);
    if (!selectedTender && !sourceTender) return activeTender;

    return {
        ...activeTender,
        sourceTender,
        title: sourceTender?.title || selectedTender?.title || activeTender.title,
        reference: sourceTender?.id || selectedTender?.reference || activeTender.reference,
        category: sourceTender?.type || selectedTender?.category || activeTender.category,
        closingDate: selectedTender?.closingDate || sourceTender?.closingDate || activeTender.closingDate,
        evaluationDeadline: selectedTender?.deadline || sourceTender?.milestones?.find(item => item.id === 'milestone-evaluation')?.date || activeTender.evaluationDeadline,
        status: selectedTender?.status || activeTender.status,
        stage: activeTender.stage,
        bidders: selectedTender?.bidsReceived || activeTender.bidders,
        conflictStatus: selectedTender?.conflictStatus === 'Complete' ? activeTender.conflictStatus : (selectedTender?.conflictStatus || activeTender.conflictStatus),
        draftStatus: selectedTender?.draftStatus || 'Draft',
        progress: selectedTender?.progress || 0,
        method: getEvaluationSelectionMethod(sourceTender || activeTender, { method: activeTender.method })
    };
}

function getEvaluationDraft(reference) {
    if (!reference) return null;
    try {
        const saved = JSON.parse(localStorage.getItem(`procurex.evaluationDraft.${reference}`) || 'null');
        return saved && typeof saved === 'object' ? saved : null;
    } catch (error) {
        return window.procurexEvaluationDrafts?.[reference] || null;
    }
}

function saveEvaluationDraft(reference, payload) {
    if (!reference) return;
    try {
        localStorage.setItem(`procurex.evaluationDraft.${reference}`, JSON.stringify(payload));
    } catch (error) {
        window.procurexEvaluationDrafts = {
            ...(window.procurexEvaluationDrafts || {}),
            [reference]: payload
        };
    }
}

function getEvaluationDraftScore(draft, bidderName, criterionId, field, fallback = '') {
    return draft?.scores?.[bidderName]?.[criterionId]?.[field] ?? fallback;
}

function isEvaluationScoreCommentRequired(row = {}, criterion = {}) {
    const result = String(row.result || '').toLowerCase();
    const maxScore = Number(criterion.maxScore || row.maxScore || 0);
    const score = Number(row.score);
    return /fail|clarification/.test(result)
        || (Number.isFinite(score) && maxScore > 0 && score < (maxScore / 2));
}

function isEvaluationScoreComplete(row = {}, criterion = {}) {
    if (!row?.result) return false;
    if (row.score === undefined || row.score === null || String(row.score).trim() === '') return false;
    return !isEvaluationScoreCommentRequired(row, criterion) || String(row.comment || '').trim().length > 0;
}

function getDefaultEvaluationScore(bid, criterion) {
    if (criterion.type === 'financial') {
        return bid.financialScore || Math.max(0, Math.min(criterion.maxScore, Math.round((criterion.maxScore || 10) * 0.85)));
    }
    const proportional = bid.technicalScore ? Math.round((Number(bid.technicalScore) / 100) * criterion.maxScore) : Math.round((criterion.maxScore || 10) * 0.8);
    return Math.max(0, Math.min(criterion.maxScore || 10, proportional));
}

function getEvaluationDraftProgress(draft, criteria = [], bids = []) {
    if (draft?.status === 'Completed') return 100;
    const total = Math.max(1, criteria.length * bids.length);
    const completed = criteria.reduce((sum, criterion) => (
        sum + bids.filter(bid => {
            const row = draft?.scores?.[bid.supplier]?.[criterion.id];
            return isEvaluationScoreComplete(row, criterion);
        }).length
    ), 0);
    return Math.max(draft?.progress || 0, Math.round((completed / total) * 100));
}

function getEvaluationCriterionTotalForBid(bid, criteria, draft) {
    return criteria.reduce((sum, criterion) => {
        const savedScore = Number(getEvaluationDraftScore(draft, bid.supplier, criterion.id, 'score', NaN));
        const score = Number.isFinite(savedScore) ? savedScore : getDefaultEvaluationScore(bid, criterion);
        return sum + score;
    }, 0);
}

function getEvaluationTechnicalCriteria(criteria = []) {
    return criteria.filter(criterion => criterion.type !== 'financial');
}

function getEvaluationTechnicalMax(criteria = []) {
    const technicalCriteria = getEvaluationTechnicalCriteria(criteria);
    const source = technicalCriteria.length ? technicalCriteria : criteria;
    return source.reduce((sum, criterion) => sum + Number(criterion.maxScore || criterion.weight || 0), 0) || 100;
}

function getEvaluationTechnicalTotalForBid(bid, criteria, draft) {
    const technicalCriteria = getEvaluationTechnicalCriteria(criteria);
    const source = technicalCriteria.length ? technicalCriteria : criteria;
    return getEvaluationCriterionTotalForBid(bid, source, draft);
}

function getEvaluationTechnicalPercentForBid(bid, criteria, draft) {
    return Math.round((getEvaluationTechnicalTotalForBid(bid, criteria, draft) / getEvaluationTechnicalMax(criteria)) * 100);
}

function getEvaluationBidPrice(bid = {}) {
    const price = Number(bid.financial?.correctedPrice || bid.price);
    return Number.isFinite(price) && price > 0 ? price : Number.MAX_SAFE_INTEGER;
}

function getEvaluationQualifiedBids(bids = [], criteria = [], draft, passMark = 70) {
    return bids.filter(bid => getEvaluationTechnicalPercentForBid(bid, criteria, draft) >= passMark);
}

function getEvaluationFinancialScoreForBid(bid, bids = []) {
    const qualifiedPrices = bids.map(getEvaluationBidPrice).filter(price => Number.isFinite(price) && price > 0);
    const lowest = Math.min(...qualifiedPrices);
    const bidPrice = getEvaluationBidPrice(bid);
    if (!Number.isFinite(lowest) || !Number.isFinite(bidPrice) || bidPrice <= 0) return 0;
    return Math.round((lowest / bidPrice) * 1000) / 10;
}

function getEvaluationMethodKey(method = '') {
    const raw = String(method || '').toLowerCase();
    if (raw.includes('qcbs') || raw.includes('quality-cost') || raw.includes('quality cost')) return 'qcbs';
    if (raw.includes('qbs') || raw.includes('quality based')) return 'qbs';
    if (raw.includes('least cost')) return 'least-cost';
    if (raw.includes('fixed budget')) return 'fixed-budget';
    return 'lowest-responsive';
}

function getEvaluationBudgetCeiling(tender = {}, benchmark = {}) {
    const source = tender.sourceTender || tender;
    return Number(source.budget || source.estimatedBudget || benchmark.buyerEstimate || 0) || 0;
}

function getEvaluationRankedBids(tender = {}, bids = [], criteria = [], draft, options = {}) {
    const passMark = options.passMark || 70;
    const method = getEvaluationSelectionMethod(tender, options.recommendation || {});
    const methodKey = getEvaluationMethodKey(method);
    const qualified = getEvaluationQualifiedBids(bids, criteria, draft, passMark);
    const pool = qualified.length ? qualified : bids;
    const budgetCeiling = getEvaluationBudgetCeiling(tender, options.benchmark || {});
    const technicalWeight = Number(tender.evaluation?.technicalWeight || options.technicalWeight || 80);
    const financialWeight = Number(tender.evaluation?.financialWeight || options.financialWeight || (100 - technicalWeight));
    const scored = pool.map(bid => {
        const technicalPercent = getEvaluationTechnicalPercentForBid(bid, criteria, draft);
        const financialScore = getEvaluationFinancialScoreForBid(bid, pool);
        const price = getEvaluationBidPrice(bid);
        const withinBudget = !budgetCeiling || price <= budgetCeiling;
        const combinedScore = ((technicalPercent * technicalWeight) + (financialScore * financialWeight)) / Math.max(1, technicalWeight + financialWeight);
        return { bid, technicalPercent, financialScore, combinedScore, price, withinBudget };
    });

    const sorted = scored.sort((a, b) => {
        if (methodKey === 'qbs') return b.technicalPercent - a.technicalPercent || a.price - b.price;
        if (methodKey === 'least-cost' || methodKey === 'lowest-responsive') return a.price - b.price || b.technicalPercent - a.technicalPercent;
        if (methodKey === 'fixed-budget') {
            if (a.withinBudget !== b.withinBudget) return a.withinBudget ? -1 : 1;
            return b.technicalPercent - a.technicalPercent || a.price - b.price;
        }
        return b.combinedScore - a.combinedScore || a.price - b.price;
    });
    return sorted.map((item, index) => ({ ...item, rank: index + 1, method }));
}

function getEvaluationTenderBoqItems(tender = {}) {
    const source = tender.sourceTender || tender;
    const fields = source.requirements?.fields || {};
    const candidates = [
        source.boqItems,
        source.commercialItems,
        fields.boqRows,
        fields.quantityScheduleRows,
        fields.lumpSumPricingRows,
        fields.servicePricingRows
    ].find(items => Array.isArray(items) && items.length) || [];
    return candidates.map((item, index) => ({
        item: item.item || item.itemCode || item.lineNo || `${index + 1}`,
        description: item.description || item.itemDescription || item.deliverable || item.name || `Commercial item ${index + 1}`,
        qty: Number(item.qty || item.quantity || 1) || 1,
        unit: item.unit || item.uom || 'Lot',
        rate: Number(item.rate || item.unitRate || item.estimatedRate || item.amount || 0) || 0
    }));
}

function getEvaluationTenderBoqTotal(items = []) {
    return items.reduce((sum, item) => sum + ((Number(item.qty) || 1) * (Number(item.rate) || 0)), 0);
}

function getEvaluationBidBoqLineAmount(tender, bid, bidderIndex, boqItem, tenderTotal) {
    const evidenceText = getEvaluationSubmittedBidEvidenceText(tender, bid, bidderIndex);
    const codeTokens = String(boqItem.item || '').toLowerCase().split(/[^a-z0-9.]+/).filter(Boolean);
    const descriptionTokens = String(boqItem.description || '').toLowerCase().split(/[^a-z0-9]+/).filter(token => token.length > 4);
    const matchTokens = [...codeTokens, ...descriptionTokens.slice(0, 3)];
    const hasSpecificEvidence = matchTokens.some(token => evidenceText.includes(token));
    const estimated = (Number(boqItem.qty) || 1) * (Number(boqItem.rate) || 0);
    const price = getEvaluationBidPrice(bid);
    if (hasSpecificEvidence && Number.isFinite(price) && tenderTotal > 0) return Math.round((estimated / tenderTotal) * price);
    if (Number.isFinite(price) && tenderTotal > 0) return Math.round((estimated / tenderTotal) * price);
    return Number(bid.financial?.lineItems?.[boqItem.item] || 0) || 0;
}

function getEvaluationBoqComparisonRows(tender = {}, bids = []) {
    const items = getEvaluationTenderBoqItems(tender);
    const tenderTotal = getEvaluationTenderBoqTotal(items);
    return items.map((item, index) => {
        const estimate = (Number(item.qty) || 1) * (Number(item.rate) || 0);
        const bidderAmounts = bids.map((bid, bidderIndex) => getEvaluationBidBoqLineAmount(tender, bid, bidderIndex, item, tenderTotal));
        return { ...item, index, estimate, bidderAmounts };
    });
}

function getEvaluationCriterionEvidence(tender = {}, bid = {}, bidderIndex = 0, criterion = {}) {
    const sections = getEvaluationSubmittedBidSections(tender, bid, bidderIndex);
    const keywords = [criterion.name, ...(criterion.subcriteria || [])]
        .join(' ')
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(token => token.length > 3);
    const matchedRows = sections.flatMap(section => (section.rows || []).map(row => ({ section: section.title, row })))
        .filter(({ row }) => {
            const text = `${row.label || ''} ${row.value || ''} ${row.requirement || ''}`.toLowerCase();
            return keywords.some(keyword => text.includes(keyword));
        })
        .slice(0, 4);
    if (matchedRows.length) {
        return matchedRows.map(({ section, row }) => ({
            label: row.label || section,
            value: row.value || 'Provided',
            source: section,
            document: row.file?.name || ''
        }));
    }
    return [
        {
            label: 'Technical comment',
            value: bid.technicalComment || `${bid.supplier || 'Bidder'} response should be reviewed against this criterion.`,
            source: 'Evaluation mock data',
            document: (bid.documents || []).find(doc => /technical|method|work|proposal|boq/i.test(doc)) || ''
        }
    ];
}

function getEvaluationDocumentCompleteness(tender = {}, bid = {}, bidderIndex = 0) {
    const required = [
        ...getEvaluationRequiredSubmissionDocuments(tender),
        ...(tender.sourceTender?.regulatoryLicenses || tender.regulatoryLicenses || []).filter(item => item.mandatory !== false).map(item => item.license)
    ].filter(Boolean);
    if (!required.length) return 100;
    const complete = required.filter(item => hasEvaluationBidEvidence(tender, bid, bidderIndex, [item])).length;
    return Math.round((complete / required.length) * 100);
}

function getEvaluationRiskSummary(tender = {}, bid = {}, bidderIndex = 0, criteria = [], draft) {
    const technicalPercent = getEvaluationTechnicalPercentForBid(bid, criteria, draft);
    const completeness = getEvaluationDocumentCompleteness(tender, bid, bidderIndex);
    const price = getEvaluationBidPrice(bid);
    const items = getEvaluationTenderBoqItems(tender);
    const estimate = getEvaluationTenderBoqTotal(items);
    if (technicalPercent < 70 || completeness < 80) return 'High';
    if (estimate && Math.abs(((price - estimate) / estimate) * 100) > 10) return 'Moderate';
    if (/clarification|pending/i.test(`${bid.finalResult || ''} ${bid.eligibilityResult || ''}`)) return 'Moderate';
    return 'Low';
}

function getEvaluationTimelineStatus(tender = {}) {
    const raw = tender.evaluationDeadline || tender.deadline || tender.closingDate || '';
    const timestamp = Date.parse(raw);
    if (!Number.isFinite(timestamp)) return { label: raw || 'No deadline set', status: 'Pending', days: null };
    const today = new Date();
    const days = Math.ceil((timestamp - today.getTime()) / 86400000);
    if (days < 0) return { label: `${Math.abs(days)} days overdue`, status: 'Overdue', days };
    if (days <= 3) return { label: `${days} days remaining`, status: 'Due soon', days };
    return { label: `${days} days remaining`, status: 'On track', days };
}

function getEvaluationRecommendedBid(tenderOrBids, maybeBids, maybeCriteria, maybeDraft, maybeOptions = {}) {
    if (Array.isArray(tenderOrBids)) {
        const bids = tenderOrBids;
        const criteria = maybeBids || [];
        const draft = maybeCriteria;
        return getEvaluationRankedBids({}, bids, criteria, draft, maybeOptions)[0]?.bid || bids[0] || {};
    }
    const tender = tenderOrBids || {};
    const bids = maybeBids || [];
    const criteria = maybeCriteria || [];
    const draft = maybeDraft;
    return getEvaluationRankedBids(tender, bids, criteria, draft, maybeOptions)[0]?.bid || bids[0] || {};
}

function renderEvaluationReportDocument(tender, criteria, bids, draft, auditTrail = []) {
    const recommendedBid = getEvaluationRecommendedBid(tender, bids, criteria, draft);
    return `
        <section class="evaluation-report-document" data-evaluation-report-document>
            <header>
                <span>ProcureX Evaluation Report</span>
                <h1>${escapeEvaluationHtml(tender.title || 'Tender Evaluation')}</h1>
                <p>${escapeEvaluationHtml(tender.reference || '')} / ${escapeEvaluationHtml(tender.category || '')}</p>
            </header>
            <div class="evaluation-report-summary">
                <div><span>Status</span><strong>${escapeEvaluationHtml(draft?.status || 'Draft')}</strong></div>
                <div><span>Completed</span><strong>${escapeEvaluationHtml(draft?.completedAt ? new Date(draft.completedAt).toLocaleString() : 'Not completed')}</strong></div>
                <div><span>Recommended bidder</span><strong>${escapeEvaluationHtml(draft?.recommendation?.supplier || recommendedBid.supplier || '-')}</strong></div>
                <div><span>Evaluated amount</span><strong>${formatEvaluationMoney(recommendedBid.financial?.correctedPrice || recommendedBid.price)}</strong></div>
            </div>
            <h2>Criteria Used</h2>
            <table>
                <thead><tr><th>Criterion</th><th>Weight</th><th>Subcriteria</th></tr></thead>
                <tbody>
                    ${criteria.map(item => `
                        <tr>
                            <td>${escapeEvaluationHtml(item.name)}</td>
                            <td>${escapeEvaluationHtml(item.weight || item.maxScore)}%</td>
                            <td>${escapeEvaluationHtml((item.subcriteria || []).join(', ') || 'None')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <h2>Bidder Evaluation Results</h2>
            <table>
                <thead>
                    <tr>
                        <th>Bidder</th>
                        ${criteria.map(item => `<th>${escapeEvaluationHtml(item.name)}</th>`).join('')}
                        <th>Total</th>
                        <th>Corrected price</th>
                    </tr>
                </thead>
                <tbody>
                    ${bids.map(bid => `
                        <tr>
                            <td>${escapeEvaluationHtml(bid.supplier)}</td>
                            ${criteria.map(item => {
                                const row = draft?.scores?.[bid.supplier]?.[item.id] || {};
                                const score = row.score ?? getDefaultEvaluationScore(bid, item);
                                return `<td>${escapeEvaluationHtml(row.result || 'Pending')} / ${escapeEvaluationHtml(score)}<br>${escapeEvaluationHtml(row.comment || '')}</td>`;
                            }).join('')}
                            <td>${getEvaluationCriterionTotalForBid(bid, criteria, draft)}</td>
                            <td>${formatEvaluationMoney(bid.financial?.correctedPrice || bid.price)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <h2>Recommendation</h2>
            <p>${escapeEvaluationHtml(draft?.recommendation?.reason || `${recommendedBid.supplier || 'Recommended bidder'} has the highest evaluated result based on the buyer-defined criteria.`)}</p>
            <h2>Audit Trail</h2>
            <ul>
                ${auditTrail.map(item => `<li>${escapeEvaluationHtml(item.time)} - ${escapeEvaluationHtml(item.event)} (${escapeEvaluationHtml(item.ref)})</li>`).join('')}
            </ul>
        </section>
    `;
}

function collectEvaluationDraftFromDom(reference, status = 'Saved as draft') {
    const existing = getEvaluationDraft(reference) || {};
    const panel = document.querySelector('[data-evaluation-step-panel]');
    const scores = { ...(existing.scores || {}) };

    document.querySelectorAll('[data-eval-result], [data-eval-score], [data-eval-comment], [data-eval-evidence]').forEach(field => {
        const bidder = field.getAttribute('data-bidder');
        const criterion = field.getAttribute('data-criterion');
        if (!bidder || !criterion) return;

        scores[bidder] = scores[bidder] || {};
        scores[bidder][criterion] = scores[bidder][criterion] || {};

        if (field.matches('[data-eval-result]')) scores[bidder][criterion].result = field.value;
        if (field.matches('[data-eval-score]')) {
            scores[bidder][criterion].score = field.value === '' ? '' : Number(field.value || 0);
            scores[bidder][criterion].maxScore = Number(field.getAttribute('max') || field.dataset.maxScore || 0);
        }
        if (field.matches('[data-eval-comment]')) scores[bidder][criterion].comment = field.value;
        if (field.matches('[data-eval-evidence]')) scores[bidder][criterion].evidence = field.value;
    });

    const currentCriterionIndex = Number(panel?.getAttribute('data-current-criterion-index') || existing.currentCriterionIndex || 0);
    const currentBidderIndex = Number(panel?.getAttribute('data-current-bidder-index') || existing.currentBidderIndex || 0);
    const totalItems = Number(panel?.getAttribute('data-total-items') || 1);
    const completedItems = Object.values(scores).reduce((sum, bidderScores) => (
        sum + Object.values(bidderScores || {}).filter(row => isEvaluationScoreComplete(row)).length
    ), 0);
    const progress = status === 'Completed' ? 100 : Math.min(99, Math.max(existing.progress || 0, Math.round((completedItems / Math.max(1, totalItems)) * 100)));

    return {
        ...existing,
        reference,
        status,
        currentStage: status === 'Completed' ? 'report' : 'technical',
        currentCriterionIndex,
        currentBidderIndex,
        scores,
        recommendation: existing.recommendation || {},
        progress,
        savedAt: new Date().toISOString(),
        completedAt: status === 'Completed' ? new Date().toISOString() : existing.completedAt
    };
}

function getEvaluationProgress(stages, currentStage) {
    const actionableStages = stages.filter(stage => stage.id !== 'overview' && stage.id !== 'audit');
    const currentIndex = actionableStages.findIndex(stage => stage.id === currentStage);
    if (currentIndex < 0) return 0;
    return Math.round(((currentIndex + 1) / Math.max(1, actionableStages.length)) * 100);
}

function getEvaluationTenderRuntime(item) {
    const saved = getEvaluationDraft(item.reference);
    const progress = saved?.progress ?? item.progress ?? 0;
    const status = saved?.status || item.draftStatus || 'Not started';
    const savedDate = saved?.savedAt || saved?.completedAt || '';
    const savedLabel = savedDate
        ? new Date(savedDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'No browser draft';

    return {
        status,
        progress,
        savedLabel,
        action: status === 'Completed' ? 'Review Evaluation' : status === 'Saved as draft' ? 'Continue Evaluation' : 'Open Evaluation'
    };
}

function renderEvaluationTenderSelection(evaluation) {
    const readyTenders = evaluation.readyTenders || [];

    return `
        <div class="main-layout procurement-layout evaluation-app-layout">
            <aside class="sidebar evaluation-sidebar">
                <div class="evaluation-sidebar-head">
                    <h3>Bid Evaluation</h3>
                    <span>Select tender</span>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="workspace-dashboard">Workspace Dashboard</a></li>
                    <li><a href="#" data-navigate="bid-evaluation" class="active">Evaluation</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </aside>

            <main class="main-content procurement-content evaluation-workspace">
                <section class="procurement-hero evaluation-hero-panel evaluation-selection-hero">
                    <div>
                        <span class="section-kicker">Evaluation app</span>
                        <h1>Select Tender for Evaluation</h1>
                        <p>Choose the tender you posted and want to evaluate. Each tender has its own locked submissions, buyer-defined criteria, draft progress, generated report, recommendation, and audit trail.</p>
                    </div>
                    <div class="evaluation-hero-stats">
                        <div><strong>${readyTenders.length}</strong><span>Ready tenders</span></div>
                        <div><strong>${readyTenders.reduce((sum, item) => sum + Number(item.bidsReceived || 0), 0)}</strong><span>Total bids</span></div>
                    </div>
                </section>

                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Tenders ready for evaluation</span>
                            <h2>Start by opening the correct bid evaluation</h2>
                        </div>
                    </div>
                    <div class="evaluation-ready-grid">
                        ${readyTenders.map(item => {
                            const runtime = getEvaluationTenderRuntime(item);
                            return `
                                <article class="evaluation-ready-card evaluation-select-card">
                                    <div>
                                        <span class="section-kicker">${escapeEvaluationHtml(item.category)}</span>
                                        <h3>${escapeEvaluationHtml(item.title)}</h3>
                                        <p>${escapeEvaluationHtml(item.reference)}</p>
                                    </div>
                                    <div class="evaluation-ready-meta">
                                        <span><strong>${escapeEvaluationHtml(item.closingDate)}</strong> closing date</span>
                                        <span><strong>${item.bidsReceived}</strong> bids received</span>
                                        <span><strong>${escapeEvaluationHtml(item.deadline)}</strong> evaluation deadline</span>
                                        <span><strong>${runtime.progress}%</strong> progress</span>
                                        <span><strong>${escapeEvaluationHtml(runtime.savedLabel)}</strong> last save</span>
                                    </div>
                                    <div class="evaluation-progress-track">
                                        <span style="width: ${Math.min(100, Math.max(0, runtime.progress))}%"></span>
                                    </div>
                                    <div class="evaluation-card-footer">
                                        ${renderEvaluationStatusBadge(item.status)}
                                        ${renderEvaluationStatusBadge(runtime.status)}
                                        ${renderEvaluationStatusBadge(`COI ${item.conflictStatus}`)}
                                    </div>
                                    <div class="evaluation-card-footer">
                                        <button class="btn btn-primary" type="button" data-evaluation-select="${escapeEvaluationHtml(item.reference)}">${escapeEvaluationHtml(runtime.action)}</button>
                                        ${runtime.status === 'Completed' ? `
                                            <button class="btn btn-secondary" type="button" data-evaluation-view-report="${escapeEvaluationHtml(item.reference)}">View Report</button>
                                            <button class="btn btn-secondary" type="button" data-evaluation-download-report="${escapeEvaluationHtml(item.reference)}">Download Report</button>
                                        ` : ''}
                                    </div>
                                </article>
                            `;
                        }).join('')}
                    </div>
                </section>
            </main>
        </div>
    `;
}

function renderBidEvaluation() {
    const evaluation = mockData.bidEvaluation || {};
    const reportReference = getSelectedEvaluationReportReference();
    const selectedReference = reportReference || getSelectedEvaluationTenderReference(evaluation);
    const hasMultipleTenders = (evaluation.readyTenders || []).length > 1;

    if (hasMultipleTenders && !selectedReference) {
        return renderEvaluationTenderSelection(evaluation);
    }

    const tender = getEvaluationTenderModel(evaluation, selectedReference);
    const bids = evaluation.bids || [];
    const stages = getEvaluationStagesForTender(tender, evaluation.stages || []);
    const allCriteria = getEvaluationCriteriaForTender(tender.sourceTender, evaluation.technicalCriteria || []);
    const criteria = getEvaluationScoringCriteriaForTender(tender.sourceTender, evaluation.technicalCriteria || []);
    const opening = evaluation.openingReport || {};
    const benchmark = evaluation.benchmark || {};
    const recommended = evaluation.recommendation || {};
    const stageIndex = Math.max(0, stages.findIndex(stage => stage.id === (evaluation.currentStage || 'technical')));
    const savedDraft = getEvaluationDraft(tender.reference);
    const draftStatus = savedDraft?.status || tender.draftStatus || 'Draft';
    const progress = getEvaluationDraftProgress(savedDraft, criteria, bids) || tender.progress || getEvaluationProgress(stages, evaluation.currentStage || 'technical');
    const lastSaved = savedDraft?.savedAt ? new Date(savedDraft.savedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not saved in this browser';
    const technicalMax = getEvaluationTechnicalMax(criteria);
    const passMark = evaluation.minimumTechnicalPassMark || 70;
    const passedTechnical = getEvaluationQualifiedBids(bids, criteria, savedDraft, passMark);
    const ranking = getEvaluationRankedBids(tender, bids, criteria, savedDraft, { passMark, recommendation: recommended, benchmark });
    const rankingBySupplier = new Map(ranking.map(item => [item.bid.supplier, item]));
    const topBidRecord = getEvaluationRecommendedBid(tender, bids, criteria, savedDraft, { passMark, recommendation: recommended, benchmark });
    const topBid = savedDraft?.recommendation?.supplier || topBidRecord.supplier || recommended.supplier || '-';
    const selectionMethod = getEvaluationSelectionMethod(tender, recommended);
    const boqComparisonRows = getEvaluationBoqComparisonRows(tender, bids);
    const tenderBoqTotal = getEvaluationTenderBoqTotal(boqComparisonRows);
    const timelineStatus = getEvaluationTimelineStatus(tender);
    const tenderRequiredDocuments = getEvaluationRequiredSubmissionDocuments(tender);
    const tenderLicenses = tender.sourceTender?.regulatoryLicenses || tender.regulatoryLicenses || [];
    const tenderRequirementCount = getEvaluationTenderConfiguredRequirementCount(tender);
    const currentCriterionIndex = criteria.length ? Math.min(criteria.length - 1, Math.max(0, Number(savedDraft?.currentCriterionIndex || 0))) : 0;
    const currentBidderIndex = bids.length ? Math.min(bids.length - 1, Math.max(0, Number(savedDraft?.currentBidderIndex || 0))) : 0;
    const requiredEvaluationItems = criteria.length * bids.length;
    const completedEvaluationItems = criteria.reduce((sum, criterion) => (
        sum + bids.filter(bid => {
            const row = savedDraft?.scores?.[bid.supplier]?.[criterion.id];
            return isEvaluationScoreComplete(row, criterion);
        }).length
    ), 0);
    const canCompleteEvaluation = requiredEvaluationItems > 0 && completedEvaluationItems >= requiredEvaluationItems;
    const conflictCleared = /complete|cleared|submitted|approved/i.test(String(tender.conflictStatus || ''));

    const renderReportPage = () => `
        <div class="main-layout procurement-layout evaluation-app-layout">
            <aside class="sidebar evaluation-sidebar">
                <div class="evaluation-sidebar-head">
                    <h3>Evaluation Report</h3>
                    <span>${escapeEvaluationHtml(tender.reference || '')}</span>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-evaluation-close-report>Select Tender</a></li>
                    <li><a href="#" data-evaluation-download-report="${escapeEvaluationHtml(tender.reference)}">Download Report</a></li>
                    <li><a href="#" data-navigate="workspace-dashboard">Workspace Dashboard</a></li>
                </ul>
            </aside>
            <main class="main-content procurement-content evaluation-workspace">
                <section class="procurement-hero evaluation-hero-panel">
                    <div>
                        <span class="section-kicker">Generated evaluation report</span>
                        <h1>${escapeEvaluationHtml(tender.title)}</h1>
                        <p>This report was generated from the buyer evaluation draft saved for this tender.</p>
                    </div>
                    <div class="evaluation-hero-stats">
                        <div><strong>${escapeEvaluationHtml(savedDraft?.status || 'Draft')}</strong><span>Status</span></div>
                        <div><strong>${progress}%</strong><span>Progress</span></div>
                    </div>
                </section>
                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Report preview</span>
                            <h2>View and download evaluation report</h2>
                        </div>
                        <button class="btn btn-primary" type="button" data-evaluation-download-report="${escapeEvaluationHtml(tender.reference)}">Download Report</button>
                    </div>
                    ${renderEvaluationReportDocument(tender, criteria, bids, savedDraft, evaluation.auditTrail || [])}
                </section>
            </main>
        </div>
    `;

    if (reportReference) {
        return renderReportPage();
    }

    const renderTenderReadiness = () => `
        <div class="evaluation-ready-grid evaluation-single-tender-grid">
            <article class="evaluation-ready-card">
                <div>
                    <span class="section-kicker">${escapeEvaluationHtml(tender.category)}</span>
                    <h3>${escapeEvaluationHtml(tender.title)}</h3>
                    <p>${escapeEvaluationHtml(tender.reference)}</p>
                </div>
                <div class="evaluation-ready-meta">
                    <span><strong>${escapeEvaluationHtml(tender.closingDate)}</strong> closing date</span>
                    <span><strong>${escapeEvaluationHtml(tender.bidders || bids.length)}</strong> bids received</span>
                    <span><strong>${escapeEvaluationHtml(tender.evaluationDeadline)}</strong> evaluation deadline</span>
                    <span><strong>${escapeEvaluationHtml(timelineStatus.label)}</strong> timeline</span>
                </div>
                <div class="evaluation-card-footer">
                    ${renderEvaluationStatusBadge(tender.status)}
                    ${renderEvaluationStatusBadge(`Draft: ${draftStatus}`)}
                    ${renderEvaluationStatusBadge(`COI ${tender.conflictStatus}`)}
                    ${renderEvaluationStatusBadge(timelineStatus.status)}
                </div>
                <p class="evaluation-small-note">This evaluation record belongs only to this tender. Scores, comments, clarifications, draft saves, recommendation, and audit trail are not shared with other tenders.</p>
            </article>
            <article class="evaluation-ready-card evaluation-draft-card">
                <div>
                    <span class="section-kicker">Evaluation draft</span>
                    <h3>${progress}% complete</h3>
                    <p>Last saved: ${escapeEvaluationHtml(lastSaved)}</p>
                </div>
                <div class="evaluation-progress-track">
                    <span style="width: ${Math.min(100, Math.max(0, progress))}%"></span>
                </div>
                <div class="evaluation-card-footer">
                    <button class="btn btn-secondary" type="button" data-evaluation-save-draft="${escapeEvaluationHtml(tender.reference)}">Save Draft</button>
                    <button class="btn btn-primary" type="button" data-tab-jump="recommendation">Continue Evaluation</button>
                    ${savedDraft?.status === 'Returned for review' ? '<button class="btn btn-secondary" type="button" data-tab-jump="technical">Re-evaluate</button>' : ''}
                </div>
            </article>
        </div>
    `;

    const renderEvaluationBasisSummary = () => `
        <section class="evaluation-basis-summary">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Evaluation basis studied from tender</span>
                    <h3>What this evaluation reads before scoring</h3>
                </div>
                ${renderEvaluationStatusBadge(tenderRequirementCount ? `${tenderRequirementCount} configured items` : 'No tender-specific setup')}
            </div>
            <div class="evaluation-basis-grid">
                <article>
                    <span>Tender type</span>
                    <strong>${escapeEvaluationHtml(tender.sourceTender?.type || tender.category || 'Not configured')}</strong>
                    <em>Used to choose the evaluation flow and commercial schedule shape.</em>
                </article>
                <article>
                    <span>Required documents</span>
                    <strong>${tenderRequiredDocuments.length}</strong>
                    <em>${escapeEvaluationHtml(tenderRequiredDocuments.slice(0, 3).join(', ') || 'No requirement configured')}</em>
                </article>
                <article>
                    <span>Licenses / eligibility basis</span>
                    <strong>${tenderLicenses.length}</strong>
                    <em>${escapeEvaluationHtml(tenderLicenses.slice(0, 2).map(item => item.license || item.name).filter(Boolean).join(', ') || 'No requirement configured')}</em>
                </article>
                <article>
                    <span>Evaluation criteria</span>
                    <strong>${criteria.length}</strong>
                    <em>${escapeEvaluationHtml(criteria.slice(0, 3).map(item => item.name).join(', ') || 'No technical criteria configured')}${allCriteria.length !== criteria.length ? '; price criteria handled in financial stage.' : ''}</em>
                </article>
                <article>
                    <span>Technical pass mark</span>
                    <strong>${passMark}%</strong>
                    <em>Financial ranking studies only technically qualified bidders.</em>
                </article>
                <article>
                    <span>Financial ranking method</span>
                    <strong>${escapeEvaluationHtml(selectionMethod)}</strong>
                    <em>Recommendation logic follows this studied method.</em>
                </article>
            </div>
        </section>
    `;

    const renderEvaluationWorkflowOverview = () => `
        <section class="evaluation-workflow-map">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Systematic buyer evaluation workflow</span>
                    <h3>Required order for this tender</h3>
                </div>
                ${renderEvaluationStatusBadge(`${stages.length} stages`)}
            </div>
            <div class="evaluation-workflow-grid">
                ${stages.map((stage, index) => `
                    <article>
                        <strong>${String(index + 1).padStart(2, '0')}</strong>
                        <span>${escapeEvaluationHtml(stage.label)}</span>
                        <em>${escapeEvaluationHtml(stage.id === 'conflict'
                            ? 'Must be cleared before bid contents are studied.'
                            : stage.id === 'financial'
                                ? 'Unlocked after technical pass mark.'
                                : stage.id === 'comparison'
                                    ? 'Ranking and side-by-side decision view.'
                                    : 'Tender-driven evaluation step.')}</em>
                    </article>
                `).join('')}
            </div>
        </section>
    `;

    const renderEvaluationAccessLock = (title = 'Evaluation access locked') => `
        <section class="procurement-panel evaluation-panel evaluation-access-lock">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Conflict declaration required</span>
                    <h2>${escapeEvaluationHtml(title)}</h2>
                </div>
                ${renderEvaluationStatusBadge(tender.conflictStatus || 'COI pending')}
            </div>
            <div class="evaluation-notice warning">The buyer cannot access supplier bid contents until the buyer conflict of interest declaration is submitted and cleared for this tender.</div>
            <button class="btn btn-primary" type="button" data-tab-jump="conflict">Go to Conflict Declaration</button>
        </section>
    `;

    const renderIntelligence = () => `
        <div class="evaluation-intel-grid">
            <article class="evaluation-intel-panel">
                <div class="panel-heading">
                    <div>
                        <span class="section-kicker">Price benchmarking</span>
                        <h3>Market realism check</h3>
                    </div>
                    ${renderEvaluationStatusBadge(evaluation.priceOutliers ? 'Watch' : 'Clear')}
                </div>
                <div class="evaluation-summary-grid">
                    <div><span>Buyer estimate</span><strong>${formatEvaluationMoney(benchmark.buyerEstimate)}</strong></div>
                    <div><span>Market median</span><strong>${formatEvaluationMoney(benchmark.marketMedian)}</strong></div>
                    <div><span>Best Evaluated Bid</span><strong>${formatEvaluationMoney(benchmark.comparableEconomicCost)}</strong></div>
                    <div><span>Variance band</span><strong>${escapeEvaluationHtml(benchmark.varianceBand || '-')}</strong></div>
                </div>
                <div class="evaluation-note-list">
                    ${(benchmark.notes || []).map(note => `<span>${escapeEvaluationHtml(note)}</span>`).join('')}
                </div>
            </article>
            <article class="evaluation-intel-panel">
                <div class="panel-heading">
                    <div>
                        <span class="section-kicker">Risk and compliance</span>
                        <h3>Signals before recommendation</h3>
                    </div>
                    ${renderEvaluationStatusBadge('1 watch item')}
                </div>
                <div class="evaluation-signal-list">
                    ${(evaluation.riskSignals || []).map(signal => `
                        <div>
                            <strong>${escapeEvaluationHtml(signal.supplier)}</strong>
                            <span>${escapeEvaluationHtml(signal.driver)}</span>
                            ${renderEvaluationStatusBadge(`${signal.risk} risk`)}
                        </div>
                    `).join('')}
                    ${(evaluation.collusionSignals || []).map(signal => `
                        <div>
                            <strong>${escapeEvaluationHtml(signal.signal)}</strong>
                            <span>${escapeEvaluationHtml(signal.detail)}</span>
                            ${renderEvaluationStatusBadge(signal.status)}
                        </div>
                    `).join('')}
                </div>
            </article>
        </div>
    `;

    const renderOpening = () => `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Bid opening summary</span>
                    <h2>Submissions are locked and disclosed by stage</h2>
                </div>
                ${renderEvaluationStatusBadge(opening.hashStatus || 'Verified')}
            </div>
            <div class="evaluation-notice success">${escapeEvaluationHtml(opening.message || evaluation.emptyStates?.notStarted || '')}</div>
            <div class="evaluation-summary-grid">
                <div><span>Opening time</span><strong>${escapeEvaluationHtml(opening.openingTime)}</strong></div>
                <div><span>Envelope opened</span><strong>${escapeEvaluationHtml(opening.envelope)}</strong></div>
                <div><span>Authorized by</span><strong>${escapeEvaluationHtml((opening.authorizedBy || []).join(', '))}</strong></div>
                <div><span>Audit reference</span><strong>${escapeEvaluationHtml(opening.auditReference)}</strong></div>
            </div>
            <div class="data-table evaluation-table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Supplier</th>
                            <th>Submission time</th>
                            <th>Bid status</th>
                            <th>Documents</th>
                            <th>Technical</th>
                            <th>Financial</th>
                            <th>Bid security</th>
                            <th>Deadline</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(opening.submissions || []).map(row => `
                            <tr>
                                <td>${escapeEvaluationHtml(row.supplier)}</td>
                                <td>${escapeEvaluationHtml(row.time)}</td>
                                <td>${renderEvaluationStatusBadge(row.status)}</td>
                                <td>${escapeEvaluationHtml((row.documents || []).join(', '))}</td>
                                <td>${escapeEvaluationHtml(row.technicalOffer)}</td>
                                <td>${escapeEvaluationHtml(row.financialOffer)}</td>
                                <td>${escapeEvaluationHtml(row.bidSecurity)}</td>
                                <td>${renderEvaluationStatusBadge(row.deadline)}</td>
                                <td>${escapeEvaluationHtml(row.remarks)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>
    `;

    const renderConflict = () => `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Conflict of interest declaration</span>
                    <h2>Declaration required before evaluation</h2>
                </div>
                ${renderEvaluationStatusBadge(tender.conflictStatus || 'Pending')}
            </div>
            <p class="evaluation-lead">Before evaluating this tender, the buyer must confirm whether they have any personal, financial, professional, or other relationship with any bidder that may affect impartial judgment. Supplier details and bid documents remain locked until this declaration is submitted and cleared.</p>
            <div class="evaluation-option-row">
                <label><input type="radio" name="conflict-option" checked> I have no conflict of interest.</label>
                <label><input type="radio" name="conflict-option"> I have a potential conflict of interest.</label>
            </div>
            <div class="evaluation-form-grid">
                <label>Supplier involved <input class="form-input" type="text" value="Prime Contractors"></label>
                <label>Type of conflict <input class="form-input" type="text" value="Professional"></label>
                <label>Recommended action <input class="form-input" type="text" value="Record and manage before evaluation"></label>
                <label>Explanation <textarea class="form-input" rows="3">Prior project relationship disclosed for buyer review.</textarea></label>
            </div>
            <div class="data-table">
                <table>
                    <thead><tr><th>Buyer user</th><th>Role</th><th>Declaration</th><th>Supplier</th><th>Action</th><th>Submitted</th><th>Status</th></tr></thead>
                    <tbody>
                        ${(evaluation.conflictDeclarations || []).map(item => `
                            <tr>
                                <td>${escapeEvaluationHtml(item.buyerUser)}</td>
                                <td>${escapeEvaluationHtml(item.role)}</td>
                                <td>${escapeEvaluationHtml(item.declaration)}</td>
                                <td>${escapeEvaluationHtml(item.supplier)}</td>
                                <td>${escapeEvaluationHtml(item.action)}</td>
                                <td>${escapeEvaluationHtml(item.submittedAt)}</td>
                                <td>${renderEvaluationStatusBadge(item.status)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>
    `;

    const renderPreliminary = () => !conflictCleared ? renderEvaluationAccessLock('Preliminary evaluation locked') : `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Preliminary evaluation</span>
                    <h2>Mandatory administrative compliance</h2>
                </div>
                ${renderEvaluationStatusBadge('Opening Completed')}
            </div>
            <p class="evaluation-lead">Confirm that each bidder submitted required documents and complied with basic tender instructions before technical evaluation. Checklist items are generated from the selected tender's submission documents and requirements. Result options are Passed, Failed, Requires Clarification, and Not Applicable.</p>
            <div class="evaluation-supplier-grid">
                ${bids.map((bid, bidderIndex) => `
                    <article class="evaluation-supplier-card">
                        <div class="evaluation-supplier-head">
                            <div>
                                <strong>${escapeEvaluationHtml(bid.supplier)}</strong>
                                <span>${escapeEvaluationHtml(bid.registrationNumber)} / ${escapeEvaluationHtml(bid.contactPerson)}</span>
                            </div>
                            ${renderEvaluationStatusBadge(bid.preliminaryResult)}
                        </div>
                        ${renderEvaluationChecklist(generateEvaluationPreliminaryChecklist(tender, bid, bidderIndex))}
                    </article>
                `).join('')}
            </div>
        </section>
    `;

    const renderEligibility = () => !conflictCleared ? renderEvaluationAccessLock('Eligibility evaluation locked') : `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Eligibility evaluation</span>
                    <h2>Legal, professional, and capacity qualification</h2>
                </div>
                ${renderEvaluationStatusBadge('Eligibility Review')}
            </div>
            <div class="evaluation-supplier-grid">
                ${bids.map((bid, bidderIndex) => `
                    <article class="evaluation-supplier-card">
                        <div class="evaluation-supplier-head">
                            <div>
                                <strong>${escapeEvaluationHtml(bid.supplier)}</strong>
                                <span>${escapeEvaluationHtml((bid.documents || []).join(', '))}</span>
                            </div>
                            ${renderEvaluationStatusBadge(bid.eligibilityResult)}
                        </div>
                        ${renderEvaluationChecklist(generateEvaluationEligibilityChecklist(tender, bid, bidderIndex))}
                    </article>
                `).join('')}
            </div>
        </section>
    `;

    const renderTechnical = () => {
        if (!conflictCleared) return renderEvaluationAccessLock('Technical evaluation locked');
        const criterion = criteria[currentCriterionIndex] || criteria[0] || {};
        const bid = bids[currentBidderIndex] || bids[0] || {};
        const savedResult = getEvaluationDraftScore(savedDraft, bid.supplier, criterion.id, 'result', 'Pass');
        const savedScore = getEvaluationDraftScore(savedDraft, bid.supplier, criterion.id, 'score', getDefaultEvaluationScore(bid, criterion));
        const savedComment = getEvaluationDraftScore(savedDraft, bid.supplier, criterion.id, 'comment', '');
        const savedEvidence = getEvaluationDraftScore(savedDraft, bid.supplier, criterion.id, 'evidence', (criterion.subcriteria || []).slice(0, 2).join(', '));
        const completedCount = criteria.reduce((sum, item) => (
            sum + bids.filter(candidate => isEvaluationScoreComplete(savedDraft?.scores?.[candidate.supplier]?.[item.id], item)).length
        ), 0);
        const totalItems = Math.max(1, criteria.length * bids.length);
        const bidDocument = renderEvaluationSupplierBidDocument(tender, bid, currentBidderIndex, criteria);
        const criterionEvidence = getEvaluationCriterionEvidence(tender, bid, currentBidderIndex, criterion);
        const commentRequired = isEvaluationScoreCommentRequired({ result: savedResult, score: savedScore }, criterion);

        return `
            <section class="procurement-panel evaluation-panel">
                <div class="panel-heading">
                    <div>
                        <span class="section-kicker">Buyer evaluation workspace</span>
                        <h2>Evaluate one criterion and one bidder at a time</h2>
                    </div>
                    ${renderEvaluationStatusBadge(`${completedCount} of ${totalItems} items recorded`)}
                </div>
                <div class="evaluation-notice success">This evaluation studies the tender design to understand what should be scored. Same-browser bid submissions are optional evidence; when unavailable, mock evaluation data is clearly labelled.</div>
                <div class="evaluation-assignment-grid">
                    ${criteria.map((item, index) => {
                        return `
                            <article>
                                <span>${escapeEvaluationHtml(item.name)}</span>
                                <strong>${escapeEvaluationHtml(tender.organization || mockData.users?.buyer?.organization || 'Buyer')}</strong>
                                <small>${escapeEvaluationHtml(savedDraft?.scoringMode || 'Buyer scoring')}</small>
                            </article>
                        `;
                    }).join('')}
                </div>
                <div class="evaluation-step-grid" data-evaluation-step-panel data-current-criterion-index="${currentCriterionIndex}" data-current-bidder-index="${currentBidderIndex}" data-total-items="${totalItems}">
                    <aside class="evaluation-step-rail">
                        <span class="section-kicker">Criteria from tender</span>
                        ${criteria.map((item, index) => `
                            <button class="evaluation-step-criterion ${index === currentCriterionIndex ? 'active' : ''}" type="button" data-evaluation-jump-criterion="${index}">
                                <strong>${escapeEvaluationHtml(item.name)}</strong>
                                <span>${escapeEvaluationHtml(item.weight || item.maxScore)}% / ${(item.subcriteria || []).length} subcriteria</span>
                            </button>
                        `).join('')}
                    </aside>
                    <section class="evaluation-step-card">
                        <div class="evaluation-step-head">
                            <div>
                                <span class="section-kicker">Criterion ${currentCriterionIndex + 1} of ${criteria.length}</span>
                                <h3>${escapeEvaluationHtml(criterion.name)}</h3>
                                <p>Weight / maximum score: ${escapeEvaluationHtml(criterion.weight || criterion.maxScore)}. Evaluation type: Technical or compliance review. Price ranking is handled separately in Financial Evaluation.</p>
                            </div>
                            <div class="evaluation-bidder-switcher">
                                <span>Bidder ${currentBidderIndex + 1} of ${bids.length}</span>
                                <strong>${escapeEvaluationHtml(bid.supplier)}</strong>
                            </div>
                        </div>

                        <div class="evaluation-subcriteria-panel">
                            <span class="section-kicker">Items to check under this criterion</span>
                            <div class="evaluation-subcriteria-list-readonly">
                                ${(criterion.subcriteria || []).map(item => `<span>${escapeEvaluationHtml(item)}</span>`).join('') || '<span>No subcriteria defined for this criterion.</span>'}
                            </div>
                        </div>

                        <div class="evaluation-criterion-review-grid">
                            <article>
                                <span class="section-kicker">Tender criterion</span>
                                <h4>${escapeEvaluationHtml(criterion.name || 'Criterion')}</h4>
                                <p>${escapeEvaluationHtml((criterion.subcriteria || []).join(', ') || criterion.description || 'Evaluate against the tender definition.')}</p>
                            </article>
                            <article>
                                <span class="section-kicker">Bidder response evidence</span>
                                <div class="evaluation-evidence-list">
                                    ${criterionEvidence.map(item => `
                                        <div>
                                            <strong>${escapeEvaluationHtml(item.label)}</strong>
                                            <span>${escapeEvaluationHtml(item.value)}</span>
                                            <small>${escapeEvaluationHtml([item.source, item.document].filter(Boolean).join(' / '))}</small>
                                        </div>
                                    `).join('')}
                                </div>
                            </article>
                        </div>

                        ${criterion.type === 'financial' ? `
                            <div class="evaluation-financial-review">
                                <div><span>Quoted price</span><strong>${formatEvaluationMoney(bid.price, bid.financial?.currency || 'TZS')}</strong></div>
                                <div><span>Corrected price</span><strong>${formatEvaluationMoney(bid.financial?.correctedPrice, bid.financial?.currency || 'TZS')}</strong></div>
                                <div><span>BOQ status</span><strong>${escapeEvaluationHtml(bid.financial?.boqStatus || 'Pending')}</strong></div>
                                <div><span>Ranking</span><strong>${escapeEvaluationHtml(bid.financial?.ranking || '-')}</strong></div>
                            </div>
                        ` : ''}

                        <div class="evaluation-entry-grid">
                            <label>Result
                                <select class="form-input" data-eval-result data-bidder="${escapeEvaluationHtml(bid.supplier)}" data-criterion="${escapeEvaluationHtml(criterion.id)}">
                                    ${['Pass', 'Fail', 'Requires Clarification', 'Not Applicable'].map(option => `<option value="${option}" ${option === savedResult ? 'selected' : ''}>${option}</option>`).join('')}
                                </select>
                            </label>
                            <label>Score
                                <input class="form-input" type="number" min="0" max="${escapeEvaluationHtml(criterion.maxScore)}" data-max-score="${escapeEvaluationHtml(criterion.maxScore)}" value="${escapeEvaluationHtml(savedScore)}" data-eval-score data-bidder="${escapeEvaluationHtml(bid.supplier)}" data-criterion="${escapeEvaluationHtml(criterion.id)}">
                            </label>
                            <label>Evidence / document note
                                <input class="form-input" value="${escapeEvaluationHtml(savedEvidence)}" data-eval-evidence data-bidder="${escapeEvaluationHtml(bid.supplier)}" data-criterion="${escapeEvaluationHtml(criterion.id)}">
                            </label>
                            <label>Buyer evaluation comment
                                <textarea class="form-input" rows="4" ${commentRequired ? 'required' : ''} data-eval-comment data-bidder="${escapeEvaluationHtml(bid.supplier)}" data-criterion="${escapeEvaluationHtml(criterion.id)}">${escapeEvaluationHtml(savedComment)}</textarea>
                                ${commentRequired ? '<small class="evaluation-field-help">Justification required for Fail, Requires Clarification, or a score below 50% of the maximum.</small>' : '<small class="evaluation-field-help">Comment is optional when result and score are complete.</small>'}
                            </label>
                        </div>

                        <details class="evaluation-bid-document-review">
                            <summary>Open full submitted bid package</summary>
                            ${bidDocument}
                        </details>

                        <div class="evaluation-step-actions">
                            <button class="btn btn-secondary" type="button" data-evaluation-move="previous">Previous Item</button>
                            <button class="btn btn-secondary" type="button" data-evaluation-save-draft="${escapeEvaluationHtml(tender.reference)}">Save Draft</button>
                            <button class="btn btn-primary" type="button" data-evaluation-move="next">Save and Next Item</button>
                        </div>
                    </section>
                </div>
            </section>
        `;
    };

    const renderTechnicalGate = () => !conflictCleared ? renderEvaluationAccessLock('Technical pass approval locked') : `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Technical pass/fail approval</span>
                    <h2>Confirm which bidders can proceed to financial evaluation</h2>
                </div>
                ${renderEvaluationStatusBadge(`${passedTechnical.length} qualified`)}
            </div>
            <div class="evaluation-notice success">Financial opening and ranking use only bidders that meet or exceed the ${passMark}% technical pass mark. Below-threshold bidders remain visible for audit but are blocked from financial ranking.</div>
            <div class="data-table evaluation-table-scroll">
                <table>
                    <thead><tr><th>Supplier</th><th>Technical score</th><th>Pass mark</th><th>Gate result</th><th>Document completeness</th><th>Risk signal</th></tr></thead>
                    <tbody>
                        ${bids.map((bid, index) => {
                            const technicalPercent = getEvaluationTechnicalPercentForBid(bid, criteria, savedDraft);
                            return `
                                <tr>
                                    <td>${escapeEvaluationHtml(bid.supplier)}</td>
                                    <td><strong>${technicalPercent}%</strong></td>
                                    <td>${passMark}%</td>
                                    <td>${renderEvaluationStatusBadge(technicalPercent >= passMark ? 'Pass to financial' : 'Blocked from financial')}</td>
                                    <td>${getEvaluationDocumentCompleteness(tender, bid, index)}%</td>
                                    <td>${renderEvaluationStatusBadge(getEvaluationRiskSummary(tender, bid, index, criteria, savedDraft))}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </section>
    `;

    const renderFinancial = () => !conflictCleared ? renderEvaluationAccessLock('Financial evaluation locked') : `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Financial evaluation</span>
                    <h2>Opened only after required technical pass</h2>
                </div>
                ${renderEvaluationStatusBadge(`${passedTechnical.length} of ${bids.length} technically qualified`)}
            </div>
            <div class="evaluation-notice warning">Supplier prices cannot be changed secretly. Every arithmetic correction must include an explanation and remains visible in the audit trail. Bidders below the ${passMark}% technical pass mark are shown as gated from financial ranking.</div>
            <div class="data-table evaluation-table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Supplier</th>
                            <th>Technical gate</th>
                            <th>Quoted price</th>
                            <th>Taxes</th>
                            <th>Discount</th>
                            <th>Arithmetic correction</th>
                            <th>Corrected price</th>
                            <th>BOQ status</th>
                            <th>Pricing status</th>
                            <th>Ranking</th>
                            <th>Correction note</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bids.map(bid => `
                            <tr>
                                <td>${escapeEvaluationHtml(bid.supplier)}</td>
                                <td>${renderEvaluationStatusBadge(getEvaluationTechnicalPercentForBid(bid, criteria, savedDraft) >= passMark ? `Pass ${getEvaluationTechnicalPercentForBid(bid, criteria, savedDraft)}%` : `Blocked ${getEvaluationTechnicalPercentForBid(bid, criteria, savedDraft)}%`)}</td>
                                <td>${formatEvaluationMoney(bid.price, bid.financial?.currency || 'TZS')}</td>
                                <td>${escapeEvaluationHtml(bid.financial?.taxesIncluded)}</td>
                                <td>${escapeEvaluationHtml(bid.financial?.discount)}</td>
                                <td>${formatEvaluationMoney(bid.financial?.arithmeticCorrection || 0, bid.financial?.currency || 'TZS')}</td>
                                <td><strong>${formatEvaluationMoney(bid.financial?.correctedPrice, bid.financial?.currency || 'TZS')}</strong></td>
                                <td>${renderEvaluationStatusBadge(bid.financial?.boqStatus || 'Pending')}</td>
                                <td>${escapeEvaluationHtml(bid.financial?.pricingStatus)}</td>
                                <td>${bid.financial?.ranking || '-'}</td>
                                <td>${escapeEvaluationHtml(bid.financial?.correctionNote)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="evaluation-boq-comparison">
                <div class="panel-heading">
                    <div>
                        <span class="section-kicker">BOQ / commercial schedule comparison</span>
                        <h3>Line-by-line estimate against evaluated bid amounts</h3>
                    </div>
                    ${renderEvaluationStatusBadge(`${boqComparisonRows.length} tender lines`)}
                </div>
                ${boqComparisonRows.length ? `
                    <div class="data-table evaluation-table-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>BOQ item</th>
                                    <th>Buyer estimate</th>
                                    ${bids.map(bid => `<th>${escapeEvaluationHtml(bid.supplier)}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${boqComparisonRows.map(row => `
                                    <tr>
                                        <td><strong>${escapeEvaluationHtml(row.item)}</strong><br>${escapeEvaluationHtml(row.description)}<br><small>${escapeEvaluationHtml(row.qty)} ${escapeEvaluationHtml(row.unit)}</small></td>
                                        <td>${formatEvaluationMoney(row.estimate)}</td>
                                        ${bids.map((bid, index) => {
                                            const amount = row.bidderAmounts[index] || 0;
                                            const variance = row.estimate ? ((amount - row.estimate) / row.estimate) * 100 : 0;
                                            return `<td>${formatEvaluationMoney(amount)}<br><small>${variance >= 0 ? '+' : ''}${variance.toFixed(1)}%</small></td>`;
                                        }).join('')}
                                    </tr>
                                `).join('')}
                                <tr>
                                    <td><strong>Total</strong></td>
                                    <td><strong>${formatEvaluationMoney(tenderBoqTotal)}</strong></td>
                                    ${bids.map(bid => `<td><strong>${formatEvaluationMoney(getEvaluationBidPrice(bid))}</strong></td>`).join('')}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ` : '<div class="scope-empty">No BOQ or commercial schedule lines were found on this tender.</div>'}
            </div>
        </section>
    `;

    const renderClarifications = () => `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Evaluation clarifications</span>
                    <h2>Official questions and responses</h2>
                </div>
                ${renderEvaluationStatusBadge(`${(evaluation.clarifications || []).length} active`)}
            </div>
            <div class="evaluation-notice warning">Clarifications must not materially alter the original bid. They cannot change price, replace major documents, or introduce new bid information after closing.</div>
            <div class="evaluation-clarification-list">
                ${(evaluation.clarifications || []).map(item => `
                    <article class="evaluation-clarification">
                        <div>
                            <span class="section-kicker">${escapeEvaluationHtml(item.supplier)}</span>
                            <h3>${escapeEvaluationHtml(item.subject)}</h3>
                            <p>${escapeEvaluationHtml(item.message)}</p>
                            <small>${escapeEvaluationHtml(item.requirement)} / Due ${escapeEvaluationHtml(item.deadline)}</small>
                        </div>
                        <div>
                            ${renderEvaluationStatusBadge(item.status)}
                            <p>${escapeEvaluationHtml(item.buyerNote)}</p>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>
    `;

    const renderPostQualification = () => !conflictCleared ? renderEvaluationAccessLock('Post-qualification locked') : `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Post-qualification</span>
                    <h2>Confirm capability of the leading substantially responsive bidder</h2>
                </div>
                ${renderEvaluationStatusBadge(topBid)}
            </div>
            <div class="evaluation-postqual-grid">
                ${[
                    ['Goods or sample verification', 'Confirm distributor authorization, sample outcome, warranty, and stock availability where required.'],
                    ['Site or reference verification', 'Confirm similar contract references and visit evidence where required.'],
                    ['Key personnel availability', 'Verify that nominated staff remain committed for delivery or contract execution.'],
                    ['Equipment and resources', 'Confirm owned, leased, or committed resources for delivery.'],
                    ['Performance security readiness', 'Confirm ability to provide security before contract signing where required.']
                ].map(([title, note]) => `
                    <article>
                        <strong>${escapeEvaluationHtml(title)}</strong>
                        <span>${escapeEvaluationHtml(note)}</span>
                        ${renderEvaluationStatusBadge('Pending confirmation')}
                    </article>
                `).join('')}
            </div>
        </section>
    `;

    const renderComparison = () => !conflictCleared ? renderEvaluationAccessLock('Comparison matrix locked') : `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Evaluation comparison matrix</span>
                    <h2>Side-by-side bidder decision view</h2>
                </div>
                ${renderEvaluationStatusBadge(`Recommended: ${topBid}`)}
            </div>
            <div class="data-table evaluation-table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Criteria</th>
                            ${bids.map(bid => `<th>${escapeEvaluationHtml(bid.supplier)}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${[
                            ['Preliminary evaluation', (bid, index) => generateEvaluationPreliminaryChecklist(tender, bid, index).every(item => /pass/i.test(item.result)) ? 'Pass' : 'Clarification'],
                            ['Eligibility', (bid, index) => generateEvaluationEligibilityChecklist(tender, bid, index).some(item => /not eligible|fail/i.test(item.result)) ? 'Not eligible' : 'Eligible'],
                            ...criteria.map(criterion => [
                                criterion.name,
                                bid => `${getEvaluationDraftScore(savedDraft, bid.supplier, criterion.id, 'score', getDefaultEvaluationScore(bid, criterion))}/${criterion.maxScore}`
                            ]),
                            ['Technical total', bid => `${getEvaluationTechnicalTotalForBid(bid, criteria, savedDraft)}/${technicalMax}`],
                            [`Pass mark (${passMark}%)`, bid => getEvaluationTechnicalPercentForBid(bid, criteria, savedDraft) >= passMark ? `Pass ${getEvaluationTechnicalPercentForBid(bid, criteria, savedDraft)}%` : `Fail ${getEvaluationTechnicalPercentForBid(bid, criteria, savedDraft)}%`],
                            ['Document completeness', (bid, index) => `${getEvaluationDocumentCompleteness(tender, bid, index)}%`],
                            ['Financial offer', bid => formatEvaluationMoney(bid.price)],
                            ['Corrected price', bid => formatEvaluationMoney(bid.financial?.correctedPrice)],
                            ['Variance from estimate', bid => {
                                const estimate = tenderBoqTotal || benchmark.buyerEstimate || 0;
                                const variance = estimate ? ((getEvaluationBidPrice(bid) - estimate) / estimate) * 100 : 0;
                                return estimate ? `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}%` : '-';
                            }],
                            ['Risk signal', (bid, index) => getEvaluationRiskSummary(tender, bid, index, criteria, savedDraft)],
                            ['Final ranking', bid => rankingBySupplier.get(bid.supplier)?.rank || '-'],
                            ['Recommended', bid => bid.supplier === topBid ? 'Yes' : 'No']
                        ].map(row => `
                            <tr>
                                <td><strong>${row[0]}</strong></td>
                                ${bids.map((bid, index) => `<td>${escapeEvaluationHtml(row[1](bid, index))}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>
    `;

    const renderReport = () => `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Evaluation report generator</span>
                    <h2>View and download generated report</h2>
                </div>
                <div class="inline-actions">
                    <button class="btn btn-secondary" type="button" data-evaluation-view-report="${escapeEvaluationHtml(tender.reference)}">View Report</button>
                    <button class="btn btn-primary" type="button" data-evaluation-download-report="${escapeEvaluationHtml(tender.reference)}">Download Report</button>
                </div>
            </div>
            ${renderEvaluationReportDocument(tender, criteria, bids, savedDraft, evaluation.auditTrail || [])}
        </section>
    `;

    const renderRecommendation = () => `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Recommendation for award</span>
                    <h2>Submit the buyer evaluation decision</h2>
                </div>
                ${renderEvaluationStatusBadge(recommended.decision || 'Draft')}
            </div>
            <div class="evaluation-form-grid recommendation-form">
                <label>Recommended tenderer <input class="form-input" value="${escapeEvaluationHtml(savedDraft?.recommendation?.supplier || topBid)}"></label>
                <label>Evaluation method used <input class="form-input" value="${escapeEvaluationHtml(selectionMethod)}"></label>
                <label>Recommended amount <input class="form-input" value="${formatEvaluationMoney(savedDraft?.recommendation?.amount || topBidRecord.financial?.correctedPrice || topBidRecord.price || recommended.amount, recommended.currency)}"></label>
                <label>Buyer evaluation decision <input class="form-input" value="${escapeEvaluationHtml(recommended.decision)}"></label>
                <label>Reason for recommendation <textarea class="form-input" rows="4">${escapeEvaluationHtml(savedDraft?.recommendation?.reason || `${topBid} is recommended using ${selectionMethod}; the technical pass mark gate and financial ranking were applied.`)}</textarea></label>
                <label>Conditions <textarea class="form-input" rows="4">${escapeEvaluationHtml(recommended.conditions)}</textarea></label>
            </div>
            <div class="evaluation-method-panel">
                <div><span>Qualified bidders</span><strong>${passedTechnical.length}/${bids.length}</strong></div>
                <div><span>Technical pass mark</span><strong>${passMark}%</strong></div>
                <div><span>Ranking basis</span><strong>${escapeEvaluationHtml(selectionMethod)}</strong></div>
                <div><span>Top evaluated rank</span><strong>${escapeEvaluationHtml(rankingBySupplier.get(topBid)?.rank || 1)}</strong></div>
            </div>
            <div class="inline-actions">
                <button class="btn btn-secondary" type="button" data-evaluation-save-draft="${escapeEvaluationHtml(tender.reference)}">Save Draft</button>
                <button class="btn btn-secondary" type="button" data-evaluation-view-report="${escapeEvaluationHtml(tender.reference)}">Preview Report</button>
                <button class="btn btn-primary" type="button" data-tab-jump="audit">Submit Recommendation</button>
                <button class="btn btn-secondary" type="button" data-evaluation-return-review="${escapeEvaluationHtml(tender.reference)}">Return for Review</button>
            </div>
        </section>
    `;

    const renderAudit = () => `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Approvals and audit trail</span>
                    <h2>Traceability and locked records</h2>
                </div>
                ${renderEvaluationStatusBadge('Audit recording')}
            </div>
            <div class="journey-grid two-col">
                <div class="evaluation-role-list">
                    ${(evaluation.roles || []).map(role => `
                        <div class="evaluation-role-row">
                            <strong>${escapeEvaluationHtml(role.role)}</strong>
                            <span>${escapeEvaluationHtml(role.access)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="evaluation-audit-list">
                    ${(evaluation.auditTrail || []).map(item => `
                        <div class="evaluation-audit-row">
                            <span>${escapeEvaluationHtml(item.time)}</span>
                            <strong>${escapeEvaluationHtml(item.event)}</strong>
                            <p>${escapeEvaluationHtml(item.actor)} / ${escapeEvaluationHtml(item.ref)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="evaluation-finish-panel">
                <div>
                    <span class="section-kicker">Finish evaluation</span>
                    <h3>Complete this tender evaluation</h3>
                    <p>Use this only after all buyer-defined criteria have been evaluated for every bidder. Current completion: ${completedEvaluationItems} of ${requiredEvaluationItems} required evaluation items.</p>
                </div>
                <div class="inline-actions">
                    <button class="btn btn-secondary" type="button" data-evaluation-save-draft="${escapeEvaluationHtml(tender.reference)}">Save Draft</button>
                    <button class="btn btn-primary" type="button" data-evaluation-complete="${escapeEvaluationHtml(tender.reference)}" ${canCompleteEvaluation ? '' : 'disabled'}>Complete Evaluation</button>
                </div>
            </div>
        </section>
    `;

    return `
        <div class="main-layout procurement-layout evaluation-app-layout">
            <aside class="sidebar evaluation-sidebar">
                <div class="evaluation-sidebar-head">
                    <h3>Bid Evaluation</h3>
                    <span>${escapeEvaluationHtml(tender.reference || '')}</span>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="workspace-dashboard">Workspace Dashboard</a></li>
                    <li><a href="#" data-navigate="bid-evaluation" class="active">Evaluation</a></li>
                    <li><a href="#" data-navigate="award-recommendation">Award Recommendation</a></li>
                    <li><a href="#" data-evaluation-clear-selection>Select Tender</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </aside>

            <main class="main-content procurement-content evaluation-workspace">
                <section class="procurement-hero evaluation-hero-panel">
                    <div>
                        <span class="section-kicker">Evaluation app</span>
                        <h1>${escapeEvaluationHtml(tender.title)}</h1>
                        <p>This workspace is scoped to one tender posted by the buyer. The buyer can save draft progress, return later, evaluate each criterion for each bidder, generate the report, and complete the tender evaluation.</p>
                    </div>
                    <div class="evaluation-hero-stats">
                        <div><strong>${evaluation.totalBids || bids.length}</strong><span>Total bids</span></div>
                        <div><strong>${evaluation.validSubmissions || bids.length}</strong><span>Valid submissions</span></div>
                        <div><strong>${progress}%</strong><span>Draft progress</span></div>
                        <div><strong>${escapeEvaluationHtml(draftStatus)}</strong><span>Draft status</span></div>
                    </div>
                </section>

                <section class="evaluation-top-summary">
                    <div><span>Tender title</span><strong>${escapeEvaluationHtml(tender.title)}</strong></div>
                    <div><span>Reference</span><strong>${escapeEvaluationHtml(tender.reference)}</strong></div>
                    <div><span>Stage</span><strong>${escapeEvaluationHtml(tender.stage)}</strong></div>
                    <div><span>Bidders</span><strong>${escapeEvaluationHtml(tender.bidders || bids.length)}</strong></div>
                    <div><span>Deadline</span><strong>${escapeEvaluationHtml(tender.evaluationDeadline)}</strong></div>
                    <div><span>Status</span>${renderEvaluationStatusBadge(tender.status || 'In Progress')}</div>
                    <div><span>Draft</span>${renderEvaluationStatusBadge(draftStatus)}</div>
                </section>

                <div class="tabs wizard-step-progress evaluation-stage-tabs" style="--wizard-progress-ratio: ${Math.min(1, Math.max(0, stageIndex / Math.max(1, stages.length - 1)))};">
                    ${stages.map((stage, index) => `
                        <button class="tab wizard-progress-step evaluation-stage-tab ${index < stageIndex ? 'completed' : ''} ${index === 0 ? 'active' : ''} ${stage.status}" type="button" data-tab="${escapeEvaluationHtml(stage.id)}">
                            <strong>${index + 1}</strong>
                            <span>${escapeEvaluationHtml(stage.label)}</span>
                        </button>
                    `).join('')}
                </div>

                <div class="evaluation-stage-content">
                    <div class="tab-content" data-tab="overview" style="display: block;">
                        <section class="procurement-panel evaluation-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Selected tender evaluation</span>
                                    <h2>Draftable evaluation record for this tender only</h2>
                                </div>
                                ${renderEvaluationStatusBadge(tender.conflictStatus || 'COI pending')}
                            </div>
                            ${renderTenderReadiness()}
                            ${renderEvaluationBasisSummary()}
                            ${renderEvaluationWorkflowOverview()}
                            <div class="evaluation-controls-grid">
                                ${(evaluation.controls || []).map(item => `
                                    <article>
                                        <strong>${escapeEvaluationHtml(item.control)}</strong>
                                        <p>${escapeEvaluationHtml(item.purpose)}</p>
                                        ${renderEvaluationStatusBadge(item.status)}
                                    </article>
                                `).join('')}
                            </div>
                            ${renderIntelligence()}
                        </section>
                    </div>
                    <div class="tab-content" data-tab="opening" style="display: none;">${renderOpening()}</div>
                    <div class="tab-content" data-tab="conflict" style="display: none;">${renderConflict()}</div>
                    <div class="tab-content" data-tab="preliminary" style="display: none;">${renderPreliminary()}</div>
                    <div class="tab-content" data-tab="eligibility" style="display: none;">${renderEligibility()}</div>
                    <div class="tab-content" data-tab="technical" style="display: none;">${renderTechnical()}</div>
                    <div class="tab-content" data-tab="technical-gate" style="display: none;">${renderTechnicalGate()}</div>
                    <div class="tab-content" data-tab="financial" style="display: none;">${renderFinancial()}</div>
                    <div class="tab-content" data-tab="postqual" style="display: none;">${renderPostQualification()}</div>
                    <div class="tab-content" data-tab="clarifications" style="display: none;">${renderClarifications()}</div>
                    <div class="tab-content" data-tab="comparison" style="display: none;">${renderComparison()}</div>
                    <div class="tab-content" data-tab="report" style="display: none;">${renderReport()}</div>
                    <div class="tab-content" data-tab="recommendation" style="display: none;">${renderRecommendation()}</div>
                    <div class="tab-content" data-tab="audit" style="display: none;">${renderAudit()}</div>
                </div>
            </main>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderBidEvaluation = renderBidEvaluation;
}

if (typeof document !== 'undefined' && !window.procurexEvaluationSelectionListenerReady) {
    window.procurexEvaluationSelectionListenerReady = true;
    document.addEventListener('click', (event) => {
        const selectButton = event.target.closest('[data-evaluation-select]');
        const clearButton = event.target.closest('[data-evaluation-clear-selection]');
        const saveDraftButton = event.target.closest('[data-evaluation-save-draft]');
        const completeButton = event.target.closest('[data-evaluation-complete]');
        const tabJumpButton = event.target.closest('[data-tab-jump]');
        const moveButton = event.target.closest('[data-evaluation-move]');
        const criterionJumpButton = event.target.closest('[data-evaluation-jump-criterion]');
        const viewReportButton = event.target.closest('[data-evaluation-view-report]');
        const downloadReportButton = event.target.closest('[data-evaluation-download-report]');
        const closeReportButton = event.target.closest('[data-evaluation-close-report]');
        const returnReviewButton = event.target.closest('[data-evaluation-return-review]');

        if (!selectButton && !clearButton && !saveDraftButton && !completeButton && !tabJumpButton && !moveButton && !criterionJumpButton && !viewReportButton && !downloadReportButton && !closeReportButton && !returnReviewButton) return;

        event.preventDefault();

        if (tabJumpButton) {
            const target = tabJumpButton.getAttribute('data-tab-jump');
            const tab = document.querySelector(`.evaluation-stage-tabs .tab[data-tab="${target}"]`);
            tab?.click();
            return;
        }

        if (moveButton || criterionJumpButton) {
            const selected = getSelectedEvaluationTenderReference(mockData.bidEvaluation || {});
            const draft = collectEvaluationDraftFromDom(selected, 'Saved as draft');
            const criteriaCount = document.querySelectorAll('[data-evaluation-jump-criterion]').length || 1;
            const bidderCount = mockData.bidEvaluation?.bids?.length || 1;

            if (criterionJumpButton) {
                draft.currentCriterionIndex = Number(criterionJumpButton.getAttribute('data-evaluation-jump-criterion') || 0);
                draft.currentBidderIndex = 0;
            } else {
                const direction = moveButton.getAttribute('data-evaluation-move');
                const flatIndex = (draft.currentCriterionIndex * bidderCount) + draft.currentBidderIndex + (direction === 'next' ? 1 : -1);
                const boundedIndex = Math.max(0, Math.min((criteriaCount * bidderCount) - 1, flatIndex));
                draft.currentCriterionIndex = Math.floor(boundedIndex / bidderCount);
                draft.currentBidderIndex = boundedIndex % bidderCount;
            }

            saveEvaluationDraft(selected, draft);
            if (window.app?.navigateTo) window.app.navigateTo('bid-evaluation');
            return;
        }

        if (downloadReportButton) {
            const reference = downloadReportButton.getAttribute('data-evaluation-download-report');
            const sourceTender = getEvaluationSourceTender(reference);
            const tender = getEvaluationTenderModel(mockData.bidEvaluation || {}, reference);
            const criteria = getEvaluationScoringCriteriaForTender(sourceTender, mockData.bidEvaluation?.technicalCriteria || []);
            const draft = getEvaluationDraft(reference);
            const html = renderEvaluationReportDocument(tender, criteria, mockData.bidEvaluation?.bids || [], draft, mockData.bidEvaluation?.auditTrail || []);
            const reportNode = document.createElement('div');
            reportNode.innerHTML = html;
            document.body.appendChild(reportNode);
            if (window.html2pdf) {
                window.html2pdf().set({
                    margin: 0.4,
                    filename: `${reference}-evaluation-report.pdf`,
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                }).from(reportNode).save().finally(() => reportNode.remove());
            } else {
                window.print();
                reportNode.remove();
            }
            return;
        }

        try {
            if (selectButton) {
                localStorage.setItem('procurex.selectedEvaluationTender', selectButton.getAttribute('data-evaluation-select'));
                localStorage.removeItem('procurex.selectedEvaluationReport');
            } else if (clearButton) {
                localStorage.removeItem('procurex.selectedEvaluationTender');
                localStorage.removeItem('procurex.selectedEvaluationReport');
            } else if (closeReportButton) {
                localStorage.removeItem('procurex.selectedEvaluationReport');
            } else if (viewReportButton) {
                localStorage.setItem('procurex.selectedEvaluationReport', viewReportButton.getAttribute('data-evaluation-view-report'));
                localStorage.removeItem('procurex.selectedEvaluationTender');
            } else if (returnReviewButton) {
                const reference = returnReviewButton.getAttribute('data-evaluation-return-review');
                const payload = collectEvaluationDraftFromDom(reference, 'Returned for review');
                payload.currentStage = 'technical';
                payload.returnedAt = new Date().toISOString();
                payload.returnReason = payload.returnReason || 'Recommendation returned for re-evaluation before approval.';
                saveEvaluationDraft(reference, payload);
                localStorage.setItem('procurex.selectedEvaluationTender', reference);
                localStorage.removeItem('procurex.selectedEvaluationReport');
            } else if (saveDraftButton) {
                const reference = saveDraftButton.getAttribute('data-evaluation-save-draft');
                const payload = collectEvaluationDraftFromDom(reference, 'Saved as draft');
                saveEvaluationDraft(reference, payload);
                localStorage.removeItem('procurex.selectedEvaluationTender');
            } else if (completeButton) {
                const reference = completeButton.getAttribute('data-evaluation-complete');
                const payload = collectEvaluationDraftFromDom(reference, 'Completed');
                const sourceTender = getEvaluationSourceTender(reference);
                const criteria = getEvaluationScoringCriteriaForTender(sourceTender, mockData.bidEvaluation?.technicalCriteria || []);
                const tender = getEvaluationTenderModel(mockData.bidEvaluation || {}, reference);
                const recommendedBid = getEvaluationRecommendedBid(tender, mockData.bidEvaluation?.bids || [], criteria, payload, {
                    passMark: mockData.bidEvaluation?.minimumTechnicalPassMark || 70,
                    recommendation: mockData.bidEvaluation?.recommendation || {},
                    benchmark: mockData.bidEvaluation?.benchmark || {}
                });
                payload.recommendation = {
                    supplier: recommendedBid.supplier,
                    amount: recommendedBid.financial?.correctedPrice || recommendedBid.price,
                    reason: `${recommendedBid.supplier} is recommended based on ${getEvaluationSelectionMethod(tender, mockData.bidEvaluation?.recommendation || {})}, the buyer-defined evaluation criteria, the technical pass mark gate, and the final evaluated price.`
                };
                saveEvaluationDraft(reference, payload);
                localStorage.removeItem('procurex.selectedEvaluationTender');
            }
        } catch (error) {
            if (selectButton) {
                window.procurexSelectedEvaluationTender = selectButton.getAttribute('data-evaluation-select');
                window.procurexSelectedEvaluationReport = '';
            } else if (clearButton) {
                window.procurexSelectedEvaluationTender = '';
                window.procurexSelectedEvaluationReport = '';
            } else if (closeReportButton) {
                window.procurexSelectedEvaluationReport = '';
            } else if (viewReportButton) {
                window.procurexSelectedEvaluationReport = viewReportButton.getAttribute('data-evaluation-view-report');
                window.procurexSelectedEvaluationTender = '';
            } else if (returnReviewButton) {
                const reference = returnReviewButton.getAttribute('data-evaluation-return-review');
                const payload = collectEvaluationDraftFromDom(reference, 'Returned for review');
                payload.currentStage = 'technical';
                payload.returnedAt = new Date().toISOString();
                payload.returnReason = payload.returnReason || 'Recommendation returned for re-evaluation before approval.';
                saveEvaluationDraft(reference, payload);
                window.procurexSelectedEvaluationTender = reference;
                window.procurexSelectedEvaluationReport = '';
            } else if (saveDraftButton || completeButton) {
                const isComplete = Boolean(completeButton);
                const reference = (saveDraftButton || completeButton).getAttribute(isComplete ? 'data-evaluation-complete' : 'data-evaluation-save-draft');
                const payload = collectEvaluationDraftFromDom(reference, isComplete ? 'Completed' : 'Saved as draft');
                saveEvaluationDraft(reference, payload);
                window.procurexSelectedEvaluationTender = '';
            }
        }

        if (window.app?.navigateTo) {
            window.app.navigateTo('bid-evaluation');
        }
    });
}
