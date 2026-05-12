// Bidding Workspace Page Component (Supplier sealed bid flow)

const bidWorkspaceDraftStoragePrefix = 'procurex.supplierBidDraft.v1.';
const bidWorkspaceSubmittedStorageKey = 'procurex.supplierSubmittedBids.v1';

function escapeBidWorkspaceHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function parseBidWorkspaceNumber(value) {
    if (typeof parseCreateTenderNumber === 'function') return parseCreateTenderNumber(value);
    const parsed = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
}

function formatBidWorkspaceMoney(value) {
    if (typeof formatCreateTenderMoney === 'function') return formatCreateTenderMoney(value);
    return `TZS ${Math.round(parseBidWorkspaceNumber(value)).toLocaleString('en-US')}`;
}

function getBidWorkspaceTypeId(tender = {}) {
    if (typeof getCreateTenderTypeId === 'function') {
        return getCreateTenderTypeId(tender.procurementTypeId || tender.id || tender.type || tender.label);
    }
    const raw = String(tender.procurementTypeId || tender.type || 'works').toLowerCase();
    if (raw.includes('good')) return 'goods';
    if (raw.includes('consult')) return 'consultancy';
    if (raw.includes('service')) return 'services';
    return 'works';
}

function getBidWorkspaceTender() {
    const selectedTender = typeof getProcurexSelectedTender === 'function'
        ? getProcurexSelectedTender()
        : mockData.tenders[0];
    if (selectedTender && !selectedTender.createdByCurrentUser) return selectedTender;

    const marketplaceTender = typeof getProcurexMarketplaceTenders === 'function'
        ? getProcurexMarketplaceTenders().find(tender => !tender.createdByCurrentUser)
        : null;
    return marketplaceTender || selectedTender || mockData.tenders[0];
}

function getBidWorkspaceProfile(tender) {
    if (typeof getCreateTenderTypeProfile === 'function') return getCreateTenderTypeProfile(tender);
    return {
        id: getBidWorkspaceTypeId(tender),
        commercialName: 'Pricing Schedule',
        commercialTitle: 'Pricing Schedule',
        reviewLabel: 'Bid value',
        responseTitle: 'Technical Response',
        responseFields: ['Technical response', 'Delivery approach'],
        bidderPreparation: ['Technical response', 'Pricing schedule', 'Evidence documents'],
        submissionDocuments: ['Registration certificate', 'Tax clearance', 'Technical proposal'],
        defaultItems: [{ item: '1.1', description: 'Tender line item', qty: 1, unit: 'Lot', rate: 0 }],
        evaluationCriteria: [['Technical compliance', 40, 'Responsiveness'], ['Financial proposal', 60, 'Price']]
    };
}

function getBidWorkspaceCommercialItems(tender, profile) {
    const items = tender.commercialItems || tender.boqItems || profile.defaultItems || [];
    return items.length ? items : [{ item: '1.1', description: 'Tender requirement', qty: 1, unit: 'Lot', rate: tender.budget || 0 }];
}

function getBidWorkspaceAmount(items) {
    return items.reduce((total, item) => total + (parseBidWorkspaceNumber(item.qty) * parseBidWorkspaceNumber(item.rate)), 0);
}

function humanizeBidWorkspaceKey(value = '') {
    return String(value || '')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^./, letter => letter.toUpperCase());
}

function getBidWorkspaceRequirementId(title = '', category = '', index = 0) {
    const base = `${category}-${title}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return base || `requirement-${index}`;
}

function isBidWorkspaceMeaningfulValue(value) {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.values(value).some(isBidWorkspaceMeaningfulValue);
    return String(value).trim() !== '';
}

function normalizeBidWorkspaceFlag(value) {
    if (value === true) return true;
    if (value === false) return false;
    const raw = String(value ?? '').trim().toLowerCase();
    if (['true', 'yes', 'mandatory', 'required'].includes(raw)) return true;
    if (['false', 'no', 'not mandatory', 'optional'].includes(raw)) return false;
    return false;
}

function getBidWorkspaceRequirementTitle(item = {}, fallback = 'Tender requirement') {
    const titleFields = [
        'requirementName',
        'documentTitle',
        'deliverableName',
        'positionTitle',
        'activityTitle',
        'responsibilityTitle',
        'responsibility',
        'staffRole',
        'reportType',
        'regulatoryBody',
        'registrationType',
        'itemDescription',
        'workItem',
        'productDescription',
        'serviceTask',
        'objectiveTitle',
        'clauseTitle',
        'milestone'
    ];
    const title = titleFields.map(field => item[field]).find(isBidWorkspaceMeaningfulValue);
    return String(title || fallback);
}

function getBidWorkspaceRequirementDescription(item = {}) {
    if (!item || typeof item !== 'object') return '';
    const skip = new Set(['id', 'mandatory', 'mandatoryActivity', 'required', 'requiresUpload', 'sampleRequired', 'file', 'upload']);
    const pairs = Object.entries(item)
        .filter(([key, value]) => !skip.has(key) && isBidWorkspaceMeaningfulValue(value))
        .slice(0, 4)
        .map(([key, value]) => {
            const formatted = Array.isArray(value)
                ? value.map(entry => typeof entry === 'object' ? getBidWorkspaceRequirementTitle(entry, '') : entry).filter(Boolean).join(', ')
                : typeof value === 'object'
                    ? getBidWorkspaceRequirementTitle(value, '')
                    : String(value);
            return `${humanizeBidWorkspaceKey(key)}: ${formatted}`;
        });
    return pairs.join(' / ');
}

function getBidWorkspaceResponseType(requirement = {}) {
    const text = `${requirement.title || ''} ${requirement.description || ''} ${requirement.category || ''}`.toLowerCase();
    if (requirement.responseType) return requirement.responseType;
    if (/upload|file|certificate|license|registration|tax|bank|statement|audited|authorization|cv|evidence|security|insurance|proof/.test(text)) return 'upload';
    if (/declaration|acknowledge|confirm|eligibility|conflict|confidentiality|anti-corruption|anti corruption/.test(text)) return 'checkbox';
    if (/price|financial|fee|rate|cost|boq|quantity schedule/.test(text)) return 'financial';
    return 'text';
}

function getBidWorkspaceRequirementSet(tender = {}, profile = getBidWorkspaceProfile(tender)) {
    const mandatory = [];
    const optional = [];
    const seen = new Set();
    let count = 0;

    const addRequirement = (requirement = {}) => {
        const title = String(requirement.title || '').trim();
        if (!title) return;
        const category = String(requirement.category || 'Tender requirement');
        const dedupeKey = `${category.toLowerCase()}::${title.toLowerCase()}`;
        if (seen.has(dedupeKey)) return;
        seen.add(dedupeKey);
        const normalized = {
            id: requirement.id || getBidWorkspaceRequirementId(title, category, count),
            title,
            category,
            description: String(requirement.description || '').trim(),
            mandatory: requirement.mandatory !== false,
            responseType: getBidWorkspaceResponseType(requirement),
            source: requirement.source || 'buyer'
        };
        count += 1;
        (normalized.mandatory ? mandatory : optional).push(normalized);
    };

    addRequirement({
        title: 'Confirm eligibility to participate',
        category: 'Administrative compliance',
        description: tender.eligibility || 'Confirm that the supplier meets the eligibility rules defined by the buyer.',
        mandatory: true,
        responseType: 'checkbox',
        source: 'system'
    });

    (tender.regulatoryLicenses || []).forEach((license, index) => addRequirement({
        id: `regulatory-license-${index}`,
        title: license.license || license.registrationType || license.regulatoryBody || 'Regulatory license',
        category: 'Regulatory license',
        description: license.body || license.group || 'Upload current license evidence and expiry details where applicable.',
        mandatory: license.mandatory !== false,
        responseType: 'upload'
    }));

    const fields = tender.requirements?.fields || {};
    Object.entries(fields).forEach(([key, value]) => {
        if (!isBidWorkspaceMeaningfulValue(value)) return;

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (!isBidWorkspaceMeaningfulValue(item)) return;
                const objectItem = typeof item === 'object' ? item : { text: item };
                const hasMandatorySignal = ['mandatory', 'mandatoryActivity', 'required', 'sampleRequired', 'requiresUpload']
                    .some(field => Object.prototype.hasOwnProperty.call(objectItem, field));
                const title = getBidWorkspaceRequirementTitle(objectItem, `${humanizeBidWorkspaceKey(key)} ${index + 1}`);
                const description = getBidWorkspaceRequirementDescription(objectItem);
                addRequirement({
                    title,
                    category: humanizeBidWorkspaceKey(key),
                    description,
                    mandatory: hasMandatorySignal
                        ? ['mandatory', 'mandatoryActivity', 'required', 'sampleRequired'].some(field => normalizeBidWorkspaceFlag(objectItem[field]))
                        : false,
                    responseType: normalizeBidWorkspaceFlag(objectItem.requiresUpload) ? 'upload' : undefined
                });
            });
            return;
        }

        if (typeof value === 'boolean') {
            if (!value || !/required|mandatory|need|upload|cv|certificate|statement|license/i.test(key)) return;
            addRequirement({
                title: humanizeBidWorkspaceKey(key).replace(/\s+Required$/i, ''),
                category: 'Buyer requirement',
                description: 'Buyer marked this evidence as required for bid responsiveness.',
                mandatory: true
            });
            return;
        }

        if (/required|mandatory/i.test(key)) {
            addRequirement({
                title: humanizeBidWorkspaceKey(key),
                category: 'Buyer requirement',
                description: String(value),
                mandatory: true
            });
        }
    });

    Object.entries(tender.requirements?.lists || {}).forEach(([key, items]) => {
        (items || []).forEach((item, index) => {
            const text = typeof item === 'object' ? item.text : item;
            if (!String(text || '').trim()) return;
            addRequirement({
                title: String(text),
                category: humanizeBidWorkspaceKey(key),
                description: 'Respond to this buyer-defined tender item.',
                mandatory: /mandatory|required/i.test(key),
                responseType: 'text'
            });
        });
    });

    (profile.submissionDocuments || []).forEach((documentName, index) => addRequirement({
        id: `submission-document-${index}`,
        title: documentName,
        category: 'Submission document',
        description: 'Attach or describe the evidence required for this bid.',
        mandatory: index < 3,
        responseType: 'upload',
        source: 'profile'
    }));

    addRequirement({
        title: `Complete ${profile.commercialName || 'pricing schedule'}`,
        category: 'Financial offer',
        description: 'Enter rates, fees, or offer values for the commercial schedule defined in this tender.',
        mandatory: false,
        responseType: 'financial',
        source: 'system'
    });

    (profile.bidderPreparation || []).forEach((item, index) => addRequirement({
        id: `bidder-preparation-${index}`,
        title: item,
        category: 'Bid preparation',
        description: 'Complete this response inside the bid submission wizard.',
        mandatory: false,
        responseType: getBidWorkspaceResponseType({ title: item })
    }));

    return { mandatory, optional };
}

function renderBidWorkspaceRequirementSummary(requirements = []) {
    return requirements.map(requirement => `
        <article class="bid-requirement-summary-card">
            <span>${escapeBidWorkspaceHtml(requirement.category)}</span>
            <strong>${escapeBidWorkspaceHtml(requirement.title)}</strong>
            <small>${escapeBidWorkspaceHtml(requirement.description || 'Supplier response required.')}</small>
        </article>
    `).join('');
}

function getBidWorkspaceDraft(tenderId = 'selected') {
    try {
        const parsed = JSON.parse(localStorage.getItem(`${bidWorkspaceDraftStoragePrefix}${tenderId}`) || '{}');
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        return {};
    }
}

function saveBidWorkspaceDraft(tenderId = 'selected', draft = {}) {
    localStorage.setItem(`${bidWorkspaceDraftStoragePrefix}${tenderId}`, JSON.stringify({
        ...draft,
        savedAt: new Date().toISOString()
    }));
}

function getBidWorkspaceSavedResponse(draft = {}, requirementId = '') {
    return draft.responses?.[requirementId] ?? '';
}

function renderBidWorkspaceRequirementInput(requirement, draft, required = false) {
    const value = getBidWorkspaceSavedResponse(draft, requirement.id);
    const attrs = `data-bid-response="${escapeBidWorkspaceHtml(requirement.id)}" ${required ? 'data-bid-required-response="true"' : ''}`;
    const label = required ? 'Required response' : 'Optional response';

    if (requirement.responseType === 'checkbox') {
        return `
            <label class="bid-response-check">
                <input type="checkbox" ${attrs} ${value === true || value === 'true' ? 'checked' : ''}>
                <span>I confirm and accept this requirement.</span>
            </label>
        `;
    }

    if (requirement.responseType === 'upload') {
        return `
            <input class="form-input" type="text" ${attrs} value="${escapeBidWorkspaceHtml(value)}" placeholder="Enter file name or evidence reference" aria-label="${label}">
        `;
    }

    if (requirement.responseType === 'financial') {
        return `
            <input class="form-input" type="number" min="0" step="1000" ${attrs} value="${escapeBidWorkspaceHtml(value)}" placeholder="Enter amount or confirm pricing schedule" aria-label="${label}">
        `;
    }

    return `
        <textarea class="form-input" rows="3" ${attrs} placeholder="Write your response" aria-label="${label}">${escapeBidWorkspaceHtml(value)}</textarea>
    `;
}

function renderBidWorkspaceRequirementCards(requirements = [], draft = {}, required = false) {
    if (!requirements.length) {
        return '<div class="scope-empty">No requirements were configured for this group.</div>';
    }
    return requirements.map(requirement => `
        <article class="bid-requirement-card" data-bid-requirement-card="${escapeBidWorkspaceHtml(requirement.id)}">
            <div>
                <span class="section-kicker">${escapeBidWorkspaceHtml(requirement.category)}</span>
                <h3>${escapeBidWorkspaceHtml(requirement.title)}</h3>
                <p>${escapeBidWorkspaceHtml(requirement.description || 'Supplier response required.')}</p>
            </div>
            ${renderBidWorkspaceRequirementInput(requirement, draft, required)}
        </article>
    `).join('');
}

function renderBidWorkspaceCommercialRows(items) {
    return items.map((item, index) => {
        const qty = parseBidWorkspaceNumber(item.qty || item.quantity) || 1;
        const rate = parseBidWorkspaceNumber(item.rate || item.unitPrice || item.amount);
        const bidderRate = Math.round(rate ? rate * 0.98 : 0);
        const description = item.description || item.itemDescription || item.workItem || item.serviceTask || item.deliverableName || 'Tender requirement';
        return `
            <tr>
                <td>${escapeBidWorkspaceHtml(item.item || item.itemNumber || `${index + 1}.1`)}</td>
                <td>${escapeBidWorkspaceHtml(description)}</td>
                <td>${escapeBidWorkspaceHtml(item.qty || item.quantity || 1)} ${escapeBidWorkspaceHtml(item.unit || item.unitOfMeasure || 'Lot')}</td>
                <td><input class="form-input boq-input boq-number" type="number" min="0" step="1000" value="${bidderRate}" data-bid-rate aria-label="Bid rate or fee"></td>
                <td data-bid-line-amount>${formatBidWorkspaceMoney(qty * bidderRate)}</td>
            </tr>
        `;
    }).join('');
}

function renderBidWorkspaceEvaluationRows(tender, profile) {
    const criteria = tender.evaluation?.criteria?.length
        ? tender.evaluation.criteria.map(item => [item.name, item.weight, (item.subcriteria || []).join(', ')])
        : (profile.evaluationCriteria || []);
    return criteria.map(item => `
        <tr>
            <td>${escapeBidWorkspaceHtml(item[0] || item.name || 'Criterion')}</td>
            <td>${escapeBidWorkspaceHtml(item[1] || item.weight || 0)}%</td>
            <td>${escapeBidWorkspaceHtml(item[2] || item.description || 'Buyer-defined evaluation requirement')}</td>
        </tr>
    `).join('');
}

function renderBiddingWorkspace() {
    const tender = getBidWorkspaceTender();
    const profile = getBidWorkspaceProfile(tender);
    const tenderId = tender.id || 'selected';
    const draft = getBidWorkspaceDraft(tenderId);
    const commercialItems = getBidWorkspaceCommercialItems(tender, profile);
    const bidAmount = getBidWorkspaceAmount(commercialItems.map(item => ({ ...item, rate: Math.round(parseBidWorkspaceNumber(item.rate || item.unitPrice || item.amount) * 0.98) })));
    const documents = tender.documents?.length ? tender.documents : profile.documentLabels || ['Tender document'];
    const requirementSet = getBidWorkspaceRequirementSet(tender, profile);
    const mandatoryCount = requirementSet.mandatory.length;
    const optionalCount = requirementSet.optional.length;
    const responseFields = profile.responseFields || ['Technical response', 'Delivery approach'];
    const steps = [
        ['01', 'Mandatory Requirements', 'Complete all buyer-required items before bidding'],
        ['02', 'Tender Review', 'Confirm scope, documents, timeline, and evaluation'],
        ['03', 'Dynamic Responses', 'Answer optional and technical tender requirements'],
        ['04', 'Financial Offer', `${profile.commercialName} rates and commercial schedule`],
        ['05', 'Review & Submit', 'Validate, declare, and submit sealed bid'],
        ['06', 'Receipt', 'Bid hash and post-submission actions']
    ];

    return `
        <div class="main-layout">
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>My Bids</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">${escapeBidWorkspaceHtml(tender.title)}</div>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="supplier-tender-detail">Tender Detail</a></li>
                    <li><a href="#" data-navigate="supplier-marketplace">Marketplace</a></li>
                    <li><a href="#" data-navigate="supplier-journey">Supplier Journey</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <div class="main-content">
                <div class="journey-page tender-wizard-page bid-flow-page">
                    <section class="journey-hero compact">
                        <div>
                            <span class="badge badge-info">${escapeBidWorkspaceHtml(tender.type)} bid</span>
                            <h1>Bid Submission Workspace</h1>
                            <p>${escapeBidWorkspaceHtml(tender.title)} / ${escapeBidWorkspaceHtml(tender.organization)}. The wizard is generated from the tender requirements, mandatory evidence, evaluation setup, and commercial schedule.</p>
                        </div>
                        <div class="hero-action-stack">
                            <button class="btn btn-secondary" type="button" data-bid-save-draft>Save Draft</button>
                            <button class="btn btn-primary" type="button" data-bid-jump-submit>Review Submit</button>
                        </div>
                    </section>

                    <div class="wizard-shell" data-bid-wizard data-bid-tender-id="${escapeBidWorkspaceHtml(tenderId)}">
                        <aside class="wizard-rail">
                            ${steps.map((step, index) => `
                                <a href="#bid-step-${index + 1}" class="wizard-rail-step ${index === 0 ? 'active' : ''}" data-bid-step-index="${index}">
                                    <strong>${step[0]}</strong>
                                    <span>${step[1]}</span>
                                </a>
                            `).join('')}
                        </aside>

                        <div class="wizard-workspace">
                            <section class="journey-panel active bid-mandatory-gate" id="bid-step-1">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 1</span>
                                        <h2>Mandatory Requirements Gate</h2>
                                    </div>
                                    <span class="badge badge-warning" data-bid-gate-badge>${mandatoryCount} required</span>
                                </div>
                                <div class="bid-gate-status" data-bid-gate-status>
                                    Complete all mandatory buyer requirements to unlock the full bid submission wizard.
                                </div>
                                <div class="bid-requirement-list">
                                    ${renderBidWorkspaceRequirementCards(requirementSet.mandatory, draft, true)}
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-2">
                                <div class="panel-heading">
                                    <div><span class="section-kicker">Step 2</span><h2>Tender Review</h2></div>
                                    <span class="badge badge-success">${documents.length} documents</span>
                                </div>
                                <div class="record-summary">
                                    <div><span>Tender</span><strong>${escapeBidWorkspaceHtml(tender.title)}</strong></div>
                                    <div><span>Procurement type</span><strong>${escapeBidWorkspaceHtml(tender.type)}</strong></div>
                                    <div><span>Buyer</span><strong>${escapeBidWorkspaceHtml(tender.organization)}</strong></div>
                                    <div><span>Deadline</span><strong>${escapeBidWorkspaceHtml(tender.closingDate)}</strong></div>
                                </div>
                                <div class="review-checklist">
                                    <div><strong>Tender explanation</strong><span>${escapeBidWorkspaceHtml(tender.description || 'Buyer has not added a narrative description.')}</span></div>
                                    <div><strong>Eligibility</strong><span>${escapeBidWorkspaceHtml(tender.eligibility || 'Eligibility will be checked against mandatory responses.')}</span></div>
                                    <div><strong>Envelope rule</strong><span>${profile.id === 'consultancy' ? 'Technical and financial proposals may be kept separate for QCBS/QBS workflows.' : 'Technical and financial responses are prepared for sealed submission.'}</span></div>
                                </div>
                                <div class="attachment-grid" style="margin-top: 18px;">
                                    ${documents.map(file => `<div class="attachment-card"><strong>${escapeBidWorkspaceHtml(file)}</strong><span>Review before submission</span></div>`).join('')}
                                </div>
                                <div class="data-table" style="margin-top: 18px;">
                                    <table>
                                        <thead><tr><th>Evaluation criterion</th><th>Weight</th><th>What supplier should address</th></tr></thead>
                                        <tbody>${renderBidWorkspaceEvaluationRows(tender, profile)}</tbody>
                                    </table>
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-3">
                                <div class="panel-heading">
                                    <div><span class="section-kicker">Step 3</span><h2>Dynamic Responses</h2></div>
                                    <span class="badge badge-info">${optionalCount} additional</span>
                                </div>
                                <div class="form-grid two" style="margin-bottom: 20px;">
                                    <div class="form-group"><label class="form-label">${escapeBidWorkspaceHtml(responseFields[0])}</label><textarea class="form-input" rows="5" data-bid-free-response="technical">${escapeBidWorkspaceHtml(draft.freeResponses?.technical || `Response aligned to ${tender.description || tender.title}.`)}</textarea></div>
                                    <div class="form-group"><label class="form-label">${escapeBidWorkspaceHtml(responseFields[1] || 'Delivery approach')}</label><textarea class="form-input" rows="5" data-bid-free-response="approach">${escapeBidWorkspaceHtml(draft.freeResponses?.approach || `Approach for ${String(tender.type || '').toLowerCase()}, including resources, controls, timing, and handover.`)}</textarea></div>
                                </div>
                                <div class="bid-requirement-list">
                                    ${renderBidWorkspaceRequirementCards(requirementSet.optional, draft, false)}
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-4">
                                <div class="panel-heading">
                                    <div><span class="section-kicker">Step 4</span><h2>${escapeBidWorkspaceHtml(profile.commercialTitle || 'Financial Offer')}</h2></div>
                                    <span class="badge badge-info" data-bid-total>${formatBidWorkspaceMoney(bidAmount)}</span>
                                </div>
                                <div class="data-table">
                                    <table>
                                        <thead><tr><th>Code</th><th>Requirement</th><th>Qty / Duration</th><th>Bid rate / fee</th><th>Amount</th></tr></thead>
                                        <tbody data-bid-commercial-body>${renderBidWorkspaceCommercialRows(commercialItems)}</tbody>
                                    </table>
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-5">
                                <div class="panel-heading">
                                    <div><span class="section-kicker">Step 5</span><h2>Review & Submit</h2></div>
                                    <span class="badge badge-info" data-bid-review-total>${formatBidWorkspaceMoney(bidAmount)}</span>
                                </div>
                                <div class="record-summary">
                                    <div><span>Bidder</span><strong>${escapeBidWorkspaceHtml(mockData.users?.supplier?.organization || 'Supplier organization')}</strong></div>
                                    <div><span>Mandatory requirements</span><strong data-bid-gate-summary>Pending validation</strong></div>
                                    <div><span>Additional responses</span><strong>${optionalCount} dynamic items</strong></div>
                                    <div><span>Deadline</span><strong>${escapeBidWorkspaceHtml(tender.closingDate)}</strong></div>
                                </div>
                                <div class="confirm-action" data-confirm-control>
                                    <input type="checkbox" class="confirm-action-input" data-bid-declaration>
                                    <button type="button" class="confirm-action-button" data-confirm-toggle aria-pressed="false">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M20 6L9 17l-5-5"/>
                                        </svg>
                                        <span>Confirm bid declaration</span>
                                    </button>
                                    <p class="confirm-action-note" data-confirm-note>Confirm that this sealed bid is complete, accurate, and authorized for submission.</p>
                                </div>
                                <div class="submit-strip">
                                    <div>
                                        <strong>Ready to seal</strong>
                                        <span>The system will store a receipt and lock the bid after the configured closing date.</span>
                                    </div>
                                    <button class="btn btn-primary" type="button" data-bid-submit>Submit Bid</button>
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-6">
                                <div class="panel-heading"><div><span class="section-kicker">Step 6</span><h2>Submission Receipt</h2></div><span class="badge badge-success">Receipt ready</span></div>
                                <div class="review-summary-grid">
                                    <article class="review-card">
                                        <span>Receipt hash</span>
                                        <strong data-bid-receipt-hash>Generated after submit</strong>
                                        <small>Stored with the submitted bid package.</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Deadline lock</span>
                                        <strong>${escapeBidWorkspaceHtml(tender.closingDate)}</strong>
                                        <small>No edits are allowed after bid closing.</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Bid status</span>
                                        <strong data-bid-final-status>Draft until submitted</strong>
                                        <small>Withdraw or resubmit only before the deadline.</small>
                                    </article>
                                </div>
                                <div class="inline-actions" style="margin-top: 18px;">
                                    <button class="btn btn-secondary" type="button" data-bid-save-draft>Save Copy</button>
                                    <button class="btn btn-primary" data-navigate="supplier-journey">View Outcome Center</button>
                                </div>
                            </section>

                            <div class="wizard-flow-controls" data-bid-flow-controls>
                                <button class="btn btn-secondary" type="button" data-bid-prev>Back</button>
                                <div class="wizard-flow-progress">
                                    <strong data-bid-progress>Step 1 of ${steps.length}</strong>
                                    <span data-bid-step-title>${escapeBidWorkspaceHtml(steps[0][1])}</span>
                                </div>
                                <button class="btn btn-primary" type="button" data-bid-next>Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initializeBiddingWorkspace() {
    const wizard = document.querySelector('[data-bid-wizard]');
    if (!wizard || wizard.dataset.ready === 'true') return;

    const tenderId = wizard.dataset.bidTenderId || 'selected';
    const panels = Array.from(wizard.querySelectorAll('.wizard-workspace > .journey-panel'));
    const railSteps = Array.from(wizard.querySelectorAll('[data-bid-step-index]'));
    const previousButton = wizard.querySelector('[data-bid-prev]');
    const nextButton = wizard.querySelector('[data-bid-next]');
    const progressOutput = wizard.querySelector('[data-bid-progress]');
    const stepTitleOutput = wizard.querySelector('[data-bid-step-title]');
    const gateStatus = wizard.querySelector('[data-bid-gate-status]');
    const gateBadge = wizard.querySelector('[data-bid-gate-badge]');
    const gateSummary = wizard.querySelector('[data-bid-gate-summary]');
    const receiptHash = wizard.querySelector('[data-bid-receipt-hash]');
    const finalStatus = wizard.querySelector('[data-bid-final-status]');
    const existingDraft = getBidWorkspaceDraft(tenderId);
    let activeStepIndex = Number(existingDraft.step || 0);

    const collectDraft = () => {
        const responses = {};
        wizard.querySelectorAll('[data-bid-response]').forEach(input => {
            responses[input.dataset.bidResponse] = input.type === 'checkbox' ? input.checked : input.value;
        });
        const freeResponses = {};
        wizard.querySelectorAll('[data-bid-free-response]').forEach(input => {
            freeResponses[input.dataset.bidFreeResponse] = input.value;
        });
        return {
            ...getBidWorkspaceDraft(tenderId),
            step: activeStepIndex,
            responses,
            freeResponses,
            total: wizard.querySelector('[data-bid-review-total]')?.textContent || ''
        };
    };

    const saveDraft = () => saveBidWorkspaceDraft(tenderId, collectDraft());

    const isResponseComplete = (input) => {
        if (!input) return false;
        if (input.type === 'checkbox') return input.checked;
        return String(input.value || '').trim().length > 0;
    };

    const validateMandatoryGate = (show = false) => {
        const requiredInputs = Array.from(wizard.querySelectorAll('[data-bid-required-response]'));
        const completeInputs = requiredInputs.filter(isResponseComplete);
        requiredInputs.forEach(input => {
            const card = input.closest('[data-bid-requirement-card]');
            const complete = isResponseComplete(input);
            card?.classList.toggle('completed', complete);
            card?.classList.toggle('invalid', show && !complete);
        });
        const valid = requiredInputs.length > 0 && completeInputs.length === requiredInputs.length;
        const remaining = Math.max(requiredInputs.length - completeInputs.length, 0);
        if (gateStatus) {
            gateStatus.textContent = valid
                ? 'All mandatory requirements are complete. You can continue to the bid wizard.'
                : `${completeInputs.length} of ${requiredInputs.length} mandatory requirements complete. Complete ${remaining} more to continue.`;
            gateStatus.classList.toggle('balanced', valid);
        }
        if (gateBadge) {
            gateBadge.textContent = valid ? 'Gate complete' : `${remaining} remaining`;
            gateBadge.className = `badge ${valid ? 'badge-success' : 'badge-warning'}`;
        }
        if (gateSummary) gateSummary.textContent = valid ? 'Complete' : `${remaining} mandatory item(s) pending`;
        if (nextButton && activeStepIndex === 0) nextButton.disabled = !valid;
        return valid;
    };

    const setActiveStep = (index, force = false) => {
        if (index > 0 && !force && !validateMandatoryGate(true)) {
            activeStepIndex = 0;
        } else {
            activeStepIndex = Math.min(Math.max(index, 0), panels.length - 1);
        }
        panels.forEach((panel, panelIndex) => {
            const active = panelIndex === activeStepIndex;
            panel.classList.toggle('active', active);
            panel.setAttribute('aria-hidden', active ? 'false' : 'true');
        });
        railSteps.forEach((step, stepIndex) => {
            const active = stepIndex === activeStepIndex;
            step.classList.toggle('active', active);
            step.setAttribute('aria-current', active ? 'step' : 'false');
        });
        if (previousButton) previousButton.disabled = activeStepIndex === 0;
        if (nextButton) {
            nextButton.hidden = activeStepIndex === panels.length - 1;
            nextButton.disabled = activeStepIndex === 0 && !validateMandatoryGate(false);
        }
        if (progressOutput) progressOutput.textContent = `Step ${activeStepIndex + 1} of ${panels.length}`;
        if (stepTitleOutput) stepTitleOutput.textContent = railSteps[activeStepIndex]?.querySelector('span')?.textContent || '';
        saveDraft();
    };

    const refreshBidTotals = () => {
        let total = 0;
        wizard.querySelectorAll('[data-bid-commercial-body] tr').forEach((row) => {
            const rate = parseBidWorkspaceNumber(row.querySelector('[data-bid-rate]')?.value);
            const qty = parseBidWorkspaceNumber(row.children[2]?.textContent || '1') || 1;
            const amount = rate * qty;
            total += amount;
            const output = row.querySelector('[data-bid-line-amount]');
            if (output) output.textContent = formatBidWorkspaceMoney(amount);
        });
        wizard.querySelector('[data-bid-total]')?.replaceChildren(document.createTextNode(formatBidWorkspaceMoney(total)));
        wizard.querySelector('[data-bid-review-total]')?.replaceChildren(document.createTextNode(formatBidWorkspaceMoney(total)));
    };

    const storeSubmittedBid = () => {
        const submitted = (() => {
            try {
                const parsed = JSON.parse(localStorage.getItem(bidWorkspaceSubmittedStorageKey) || '[]');
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        })();
        const hash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
        const bid = {
            tenderId,
            submittedAt: new Date().toISOString(),
            receiptHash: hash,
            draft: collectDraft()
        };
        localStorage.setItem(bidWorkspaceSubmittedStorageKey, JSON.stringify([bid, ...submitted.filter(item => item.tenderId !== tenderId)]));
        if (receiptHash) receiptHash.textContent = hash;
        if (finalStatus) finalStatus.textContent = 'Submitted and sealed';
        return hash;
    };

    wizard.addEventListener('click', (event) => {
        const railStep = event.target?.closest('[data-bid-step-index]');
        if (railStep) {
            event.preventDefault();
            setActiveStep(Number(railStep.dataset.bidStepIndex));
            return;
        }

        const target = event.target?.closest('button');
        if (!target) return;

        if (target.matches('[data-bid-prev]')) {
            setActiveStep(activeStepIndex - 1);
            return;
        }

        if (target.matches('[data-bid-next]')) {
            setActiveStep(activeStepIndex + 1);
            return;
        }

        if (target.matches('[data-bid-jump-submit]')) {
            setActiveStep(4);
            return;
        }

        if (target.matches('[data-bid-save-draft]')) {
            saveDraft();
            alert('Bid draft saved for later review.');
            return;
        }

        if (target.matches('[data-bid-submit]')) {
            if (!validateMandatoryGate(true)) {
                setActiveStep(0, true);
                return;
            }
            const declaration = wizard.querySelector('[data-bid-declaration]');
            if (declaration && !declaration.checked) {
                alert('Confirm the bid declaration before submitting.');
                return;
            }
            refreshBidTotals();
            storeSubmittedBid();
            saveDraft();
            setActiveStep(5, true);
            alert('Bid submitted successfully.');
        }
    });

    wizard.addEventListener('input', (event) => {
        if (event.target?.matches('[data-bid-rate]')) refreshBidTotals();
        if (event.target?.matches('[data-bid-response], [data-bid-free-response]')) {
            validateMandatoryGate(false);
            saveDraft();
        }
    });

    wizard.addEventListener('change', (event) => {
        if (event.target?.matches('[data-bid-response], [data-bid-free-response]')) {
            validateMandatoryGate(false);
            saveDraft();
        }
    });

    refreshBidTotals();
    validateMandatoryGate(false);
    setActiveStep(activeStepIndex);
    wizard.dataset.ready = 'true';
}

if (window.app) {
    window.app.renderBiddingWorkspace = renderBiddingWorkspace;
}

window.getBidWorkspaceRequirementSet = getBidWorkspaceRequirementSet;
window.initializeBiddingWorkspace = initializeBiddingWorkspace;
