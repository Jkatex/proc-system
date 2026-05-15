// Supplier Tender Detail Page Component

const supplierTenderSavedStorageKey = 'procurex.supplierSavedTenders.v1';
const supplierTenderClarificationStorageKey = 'procurex.supplierClarifications.v1';
const supplierTenderClarificationContextStorageKey = 'procurex.supplierClarificationContext.v1';
const supplierTenderClarificationCategories = ['Technical', 'Financial', 'Deliverables', 'Legal', 'Timeline', 'Commercial Schedule'];

function escapeSupplierTenderDetailHtml(value = '') {
    if (typeof escapeBidWorkspaceHtml === 'function') return escapeBidWorkspaceHtml(value);
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatSupplierTenderMoney(value) {
    if (typeof formatBidWorkspaceMoney === 'function') return formatBidWorkspaceMoney(value);
    if (typeof formatCreateTenderMoney === 'function') return formatCreateTenderMoney(value);
    return `TZS ${Math.round(Number(value || 0)).toLocaleString('en-US')}`;
}

function isProcurexTenderDetailMeaningful(value) {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.some(isProcurexTenderDetailMeaningful);
    if (typeof value === 'object') return Object.values(value).some(isProcurexTenderDetailMeaningful);
    return String(value).trim() !== '';
}

function humanizeProcurexTenderDetailKey(value = '') {
    return String(value || '')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^./, letter => letter.toUpperCase());
}

function formatProcurexTenderDetailScalar(value) {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value ?? '');
}

function getProcurexTenderDetailValueTitle(value, fallback = 'Item') {
    if (!value || typeof value !== 'object') return fallback;
    return [
        value.title,
        value.name,
        value.documentTitle,
        value.requirementName,
        value.deliverableName,
        value.activityTitle,
        value.responsibilityTitle,
        value.responsibility,
        value.positionTitle,
        value.position,
        value.milestone,
        value.workItem,
        value.itemDescription,
        value.productDescription,
        value.equipmentName,
        value.serviceTask,
        value.objectiveTitle,
        value.referenceName,
        value.reportType,
        value.license,
        value.text
    ].find(isProcurexTenderDetailMeaningful) || fallback;
}

function renderProcurexTenderDetailBadges(items = [], emptyText = 'Not specified') {
    const values = (Array.isArray(items) ? items : String(items || '').split(','))
        .map(item => typeof item === 'object' ? getProcurexTenderDetailValueTitle(item, '') : String(item || '').trim())
        .filter(Boolean);
    if (!values.length) return `<div class="scope-empty">${escapeSupplierTenderDetailHtml(emptyText)}</div>`;
    return `<div class="tender-detail-chip-list">${values.map(item => `<span>${escapeSupplierTenderDetailHtml(item)}</span>`).join('')}</div>`;
}

function renderProcurexTenderDetailSummary(rows = []) {
    const meaningfulRows = rows.filter(row => isProcurexTenderDetailMeaningful(row?.value));
    if (!meaningfulRows.length) return '<div class="scope-empty">No summary information configured.</div>';
    return `
        <div class="record-summary tender-detail-summary">
            ${meaningfulRows.map(row => `
                <div>
                    <span>${escapeSupplierTenderDetailHtml(row.label)}</span>
                    <strong>${escapeSupplierTenderDetailHtml(row.value)}</strong>
                </div>
            `).join('')}
        </div>
    `;
}

function renderProcurexTenderDetailValue(value) {
    if (!isProcurexTenderDetailMeaningful(value)) return '<span class="tender-detail-muted">Not specified</span>';
    if (Array.isArray(value)) {
        if (value.every(item => typeof item !== 'object')) {
            return renderProcurexTenderDetailBadges(value);
        }
        return renderProcurexTenderDetailObjectList(value);
    }
    if (typeof value === 'object') {
        return renderProcurexTenderDetailObject(value);
    }
    return `<span>${escapeSupplierTenderDetailHtml(formatProcurexTenderDetailScalar(value))}</span>`;
}

function renderProcurexTenderDetailObject(item = {}) {
    const entries = Object.entries(item).filter(([, value]) => isProcurexTenderDetailMeaningful(value));
    if (!entries.length) return '<div class="scope-empty">No information configured.</div>';
    return `
        <div class="tender-detail-object">
            ${entries.map(([key, value]) => `
                <div>
                    <span>${escapeSupplierTenderDetailHtml(humanizeProcurexTenderDetailKey(key))}</span>
                    <strong>${typeof value === 'object'
                        ? escapeSupplierTenderDetailHtml(Array.isArray(value)
                            ? value.map(entry => typeof entry === 'object' ? getProcurexTenderDetailValueTitle(entry, '') : entry).filter(Boolean).join(', ')
                            : getProcurexTenderDetailValueTitle(value, 'Configured'))
                        : escapeSupplierTenderDetailHtml(formatProcurexTenderDetailScalar(value))}
                    </strong>
                </div>
            `).join('')}
        </div>
    `;
}

function renderProcurexTenderDetailObjectList(items = []) {
    const meaningfulItems = items.filter(isProcurexTenderDetailMeaningful);
    if (!meaningfulItems.length) return '<div class="scope-empty">No items configured.</div>';
    if (meaningfulItems.every(item => item && typeof item === 'object')) {
        const keys = [...new Set(meaningfulItems.flatMap(item => Object.keys(item).filter(key => isProcurexTenderDetailMeaningful(item[key]))))].slice(0, 6);
        if (keys.length && meaningfulItems.length > 1) {
            return `
                <div class="data-table tender-detail-table">
                    <table>
                        <thead><tr>${keys.map(key => `<th>${escapeSupplierTenderDetailHtml(humanizeProcurexTenderDetailKey(key))}</th>`).join('')}</tr></thead>
                        <tbody>
                            ${meaningfulItems.map(item => `
                                <tr>
                                    ${keys.map(key => `
                                        <td>${escapeSupplierTenderDetailHtml(typeof item[key] === 'object'
                                            ? (Array.isArray(item[key])
                                                ? item[key].map(entry => typeof entry === 'object' ? getProcurexTenderDetailValueTitle(entry, '') : entry).filter(Boolean).join(', ')
                                                : getProcurexTenderDetailValueTitle(item[key], 'Configured'))
                                            : formatProcurexTenderDetailScalar(item[key] ?? ''))}</td>
                                    `).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
    return `
        <div class="tender-detail-card-list">
            ${meaningfulItems.map((item, index) => `
                <article class="supplier-requirement-preview">
                    <span>${escapeSupplierTenderDetailHtml(`Item ${index + 1}`)}</span>
                    <strong>${escapeSupplierTenderDetailHtml(typeof item === 'object' ? getProcurexTenderDetailValueTitle(item, `Item ${index + 1}`) : item)}</strong>
                    ${typeof item === 'object' ? renderProcurexTenderDetailObject(item) : ''}
                </article>
            `).join('')}
        </div>
    `;
}

function renderProcurexTenderDetailFieldCards(fields = {}) {
    const entries = Object.entries(fields || {}).filter(([, value]) => isProcurexTenderDetailMeaningful(value));
    if (!entries.length) return '<div class="scope-empty">No structured requirement fields configured.</div>';
    return `
        <div class="tender-detail-field-grid">
            ${entries.map(([key, value]) => `
                <article class="tender-detail-field-card">
                    <span>${escapeSupplierTenderDetailHtml(humanizeProcurexTenderDetailKey(key))}</span>
                    ${renderProcurexTenderDetailValue(value)}
                </article>
            `).join('')}
        </div>
    `;
}

function renderProcurexTenderDetailListGroups(lists = {}) {
    const entries = Object.entries(lists || {}).filter(([, value]) => isProcurexTenderDetailMeaningful(value));
    if (!entries.length) return '';
    return `
        <div class="tender-detail-list-groups">
            ${entries.map(([key, value]) => `
                <article class="tender-detail-list-group">
                    <span class="section-kicker">${escapeSupplierTenderDetailHtml(humanizeProcurexTenderDetailKey(key))}</span>
                    ${renderProcurexTenderDetailValue(value)}
                </article>
            `).join('')}
        </div>
    `;
}

function renderProcurexTenderDetailCommercial(tender = {}, profile = {}) {
    const items = typeof getBidWorkspaceCommercialItems === 'function'
        ? getBidWorkspaceCommercialItems(tender, profile)
        : (tender.commercialItems || tender.boqItems || []);
    if (!items.length) return '<div class="scope-empty">No commercial schedule configured.</div>';
    return `
        <div class="data-table tender-detail-table">
            <table>
                <thead><tr><th>Code</th><th>Requirement</th><th>Qty / Duration</th><th>Unit</th><th>Rate / Estimate</th><th>Total</th></tr></thead>
                <tbody>
                    ${items.map((item, index) => {
                        const qty = Number(item.qty ?? item.quantity ?? 1) || 0;
                        const rate = Number(item.rate ?? item.unitPrice ?? 0) || 0;
                        const total = Number(item.total ?? item.totalPrice ?? (qty * rate)) || 0;
                        return `
                            <tr>
                                <td>${escapeSupplierTenderDetailHtml(item.item || item.itemNumber || `${index + 1}.1`)}</td>
                                <td>${escapeSupplierTenderDetailHtml(item.description || item.itemDescription || item.workItem || item.serviceTask || 'Tender requirement')}</td>
                                <td>${escapeSupplierTenderDetailHtml(qty || item.qty || item.quantity || 1)}</td>
                                <td>${escapeSupplierTenderDetailHtml(item.unit || item.unitOfMeasure || 'Lot')}</td>
                                <td>${rate ? escapeSupplierTenderDetailHtml(formatSupplierTenderMoney(rate)) : 'Supplier priced'}</td>
                                <td>${total ? escapeSupplierTenderDetailHtml(formatSupplierTenderMoney(total)) : 'Supplier priced'}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderProcurexTenderDetailLicenses(tender = {}) {
    const licenses = tender.regulatoryLicenses || [];
    if (!licenses.length) return '<div class="scope-empty">No regulatory licenses configured for this tender.</div>';
    return `
        <div class="tender-detail-card-list">
            ${licenses.map(license => `
                <article class="supplier-requirement-preview">
                    <span>${escapeSupplierTenderDetailHtml(license.group || 'Regulatory license')}</span>
                    <strong>${escapeSupplierTenderDetailHtml(license.license || 'License requirement')}</strong>
                    <small>${escapeSupplierTenderDetailHtml(license.body || 'Issuing body not specified')} / ${license.mandatory === false ? 'Optional' : 'Mandatory'}</small>
                </article>
            `).join('')}
        </div>
    `;
}

function renderProcurexTenderDetailDocuments(documents = []) {
    if (!documents.length) return '<div class="scope-empty">No tender documents configured.</div>';
    return `
        <div class="attachment-grid tender-detail-attachment-grid">
            ${documents.map(doc => `<div class="attachment-card"><strong>${escapeSupplierTenderDetailHtml(doc)}</strong><span>Available for review</span></div>`).join('')}
        </div>
    `;
}

function renderProcurexTenderDocumentSection(number, title, kicker, content, aside = '') {
    return `
        <article class="tender-document-section">
            <div class="tender-document-section-heading">
                <span>${escapeSupplierTenderDetailHtml(number)}</span>
                <div>
                    <small>${escapeSupplierTenderDetailHtml(kicker)}</small>
                    <h3>${escapeSupplierTenderDetailHtml(title)}</h3>
                </div>
                ${aside}
            </div>
            <div class="tender-document-section-body">
                ${content}
            </div>
        </article>
    `;
}

function renderProcurexTenderDetailFullSections(tender = {}, profile = {}, options = {}) {
    const documents = tender.documents?.length ? tender.documents : profile.documentLabels || ['Tender document'];
    const requirementSet = options.requirementSet || getSupplierTenderRequirementSet(tender, profile);
    const clarifications = options.clarifications || getSupplierTenderClarifications(tender);
    const amendments = options.amendments || tender.amendments || [];
    const interestedSuppliers = options.interestedSuppliers || tender.interestedSuppliers || [];
    const showActivity = options.showActivity !== false;
    const showMarketplaceActivity = options.showMarketplaceActivity === true;
    const showSupplierInterest = options.showSupplierInterest === true;

    return `
        <section class="tender-document-view">
            <header class="tender-document-cover">
                <div>
                    <span class="section-kicker">Tender document</span>
                    <h2>${escapeSupplierTenderDetailHtml(tender.title || 'Tender brief')}</h2>
                    <p>${escapeSupplierTenderDetailHtml(tender.description || 'Review the structured tender information before preparing a bid.')}</p>
                </div>
                <div class="tender-document-stamp">
                    <strong>${escapeSupplierTenderDetailHtml(tender.status || 'Open')}</strong>
                    <span>${escapeSupplierTenderDetailHtml(tender.type || 'Tender')}</span>
                </div>
            </header>

            <div class="tender-document-meta-table">
                ${renderProcurexTenderDetailSummary([
                    { label: 'Tender ID', value: tender.id },
                    { label: 'Procuring entity', value: tender.organization },
                    { label: 'Procurement type', value: tender.type },
                    { label: 'Procurement method', value: tender.method },
                    { label: 'Visibility', value: tender.visibility },
                    { label: 'Budget estimate', value: formatSupplierTenderMoney(tender.budget) },
                    { label: 'Closing date', value: tender.closingDate },
                    { label: 'Location', value: tender.location },
                    { label: 'Commercial model', value: tender.commercialModel || profile.commercialName },
                    { label: 'Contract type', value: tender.contractType },
                    { label: 'Eligibility', value: tender.eligibility }
                ])}
                <div class="tender-document-categories">
                    <span>Categories</span>
                    ${renderProcurexTenderDetailBadges(tender.categories?.length ? tender.categories : [tender.category || tender.type])}
                </div>
            </div>

            ${renderProcurexTenderDocumentSection('1', 'Instructions and Tender Scope', 'General information', `
                <p class="tender-document-paragraph">${escapeSupplierTenderDetailHtml(tender.description || 'No narrative description provided.')}</p>
                ${renderProcurexTenderDetailFieldCards(tender.requirements?.fields || {})}
                ${renderProcurexTenderDetailListGroups(tender.requirements?.lists || {})}
                ${renderSupplierTenderClarificationPrompt('Need clarification on these structured requirements?', 'Technical')}
            `)}

            ${renderProcurexTenderDocumentSection('2', 'Eligibility and Compliance Requirements', 'Supplier qualification', `
                <div class="tender-document-two-column">
                    <div>
                        <h4>Regulatory licenses</h4>
                        ${renderProcurexTenderDetailLicenses(tender)}
                    </div>
                    <div>
                        <h4>Mandatory bid gate</h4>
                        <div class="supplier-requirement-preview-list">
                            ${renderSupplierTenderRequirementList(requirementSet.mandatory, 'No mandatory gate requirements were configured.')}
                        </div>
                    </div>
                </div>
            `, `<span class="badge badge-warning">${requirementSet.mandatory.length} required</span>`)}

            ${renderProcurexTenderDocumentSection('3', 'Documents and Annexes', 'Tender pack', `
                ${renderProcurexTenderDetailDocuments(documents)}
            `, `<span class="badge badge-info">${documents.length} files</span>`)}

            ${renderProcurexTenderDocumentSection('4', 'Evaluation Criteria and Submission Responses', 'Bid evaluation', `
                <div class="data-table tender-detail-table">
                    <table>
                        <thead><tr><th>Criterion</th><th>Weight</th><th>Supplier focus</th></tr></thead>
                        <tbody>${renderSupplierTenderEvaluationRows(tender, profile)}</tbody>
                    </table>
                </div>
                <h4>Additional response areas</h4>
                <div class="supplier-requirement-preview-list">
                    ${renderSupplierTenderRequirementList(requirementSet.optional, 'No additional dynamic requirements were configured.')}
                </div>
                ${renderSupplierTenderClarificationPrompt('Need clarification about evaluation criteria?', 'Technical')}
            `, '<span class="badge badge-success">Published</span>')}

            ${renderProcurexTenderDocumentSection('5', 'Programme and Key Dates', 'Tender timeline', `
                <div class="supplier-timeline-list">
                    ${renderSupplierTenderTimeline(tender)}
                </div>
                ${renderSupplierTenderClarificationPrompt('Need clarification about milestones or field visit timing?', 'Timeline')}
            `, `<span class="badge badge-info">${(tender.milestones || []).length || 4} milestones</span>`)}

            ${renderProcurexTenderDocumentSection('6', profile.commercialName || tender.commercialModel || 'Commercial Schedule', 'Pricing schedule', `
                ${renderProcurexTenderDetailCommercial(tender, profile)}
                ${renderSupplierTenderClarificationPrompt('Question about pricing lines?', 'Commercial Schedule')}
            `, `<span class="badge badge-info">${(tender.commercialItems || tender.boqItems || []).length} lines</span>`)}

            ${renderProcurexTenderDocumentSection('7', 'Deliverables and Required Outputs', 'Contract outputs', `
                ${renderProcurexTenderDetailValue(tender.deliverables || [])}
                ${renderSupplierTenderClarificationPrompt('Need clarification about deliverables?', 'Deliverables')}
            `, `<span class="badge badge-info">${(tender.deliverables || []).length} listed</span>`)}

            ${showMarketplaceActivity ? renderProcurexTenderDocumentSection('8', 'Clarifications and Amendments', 'Marketplace activity', `
                <div class="tender-detail-card-list">
                    ${clarifications.length ? clarifications.map(item => `
                        <article class="supplier-requirement-preview">
                            <span>Clarification</span>
                            <strong>${escapeSupplierTenderDetailHtml(item.title || item.question || 'Clarification')}</strong>
                            <small>${escapeSupplierTenderDetailHtml(item.question || item.detail || item.answer || item.status || 'Pending buyer response')}</small>
                        </article>
                    `).join('') : ''}
                    ${amendments.length ? amendments.map(item => `
                        <article class="supplier-requirement-preview">
                            <span>Amendment</span>
                            <strong>${escapeSupplierTenderDetailHtml(item.title || 'Amendment')}</strong>
                            <small>${escapeSupplierTenderDetailHtml(item.detail || item.status || 'No details provided')}</small>
                        </article>
                    `).join('') : ''}
                    ${!clarifications.length && !amendments.length ? '<div class="scope-empty">No clarifications or amendments yet.</div>' : ''}
                </div>
            `, `<span class="badge badge-info">${clarifications.length + amendments.length} items</span>`) : ''}

            ${showSupplierInterest && interestedSuppliers.length ? renderProcurexTenderDocumentSection('9', 'Supplier Interest', 'Buyer-side signal', `
                ${renderProcurexTenderDetailObjectList(interestedSuppliers)}
            `, `<span class="badge badge-info">${interestedSuppliers.length} suppliers</span>`) : ''}
        </section>
    `;
}

function getSupplierTenderSavedIds() {
    try {
        const parsed = JSON.parse(localStorage.getItem(supplierTenderSavedStorageKey) || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function getSupplierTenderStoredClarifications(tenderId = '') {
    try {
        const parsed = JSON.parse(localStorage.getItem(supplierTenderClarificationStorageKey) || '{}');
        return Array.isArray(parsed[tenderId]) ? parsed[tenderId] : [];
    } catch (error) {
        return [];
    }
}

function getSupplierTenderClarifications(tender = {}) {
    return [
        ...(tender.clarifications || []),
        ...getSupplierTenderStoredClarifications(tender.id)
    ];
}

function getSupplierTenderClarificationDeadline(tender = {}) {
    const milestone = (tender.milestones || []).find(item => /clarification/i.test(`${item.name || item.title || item.id || ''}`));
    return milestone?.date || null;
}

function getSupplierTenderClarificationDeadlineState(tender = {}) {
    const deadline = getSupplierTenderClarificationDeadline(tender);
    const time = Date.parse(`${deadline}T23:59:59`);
    const valid = Number.isFinite(time);
    const days = valid ? Math.ceil((time - Date.now()) / 86400000) : null;
    return {
        deadline,
        valid,
        closed: valid && time < Date.now(),
        daysRemaining: valid ? Math.max(0, days) : null,
        label: valid ? formatSupplierTenderDate(deadline) : 'Not set'
    };
}

function formatSupplierTenderDate(date) {
    const time = Date.parse(`${date}T00:00:00`);
    if (!Number.isFinite(time)) return date || 'Not set';
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(time));
}

function getSupplierTenderClarificationStatusClass(status = '') {
    const raw = String(status || '').toLowerCase();
    if (raw.includes('amendment')) return 'badge-warning';
    if (raw.includes('answered') || raw.includes('published')) return 'badge-success';
    if (raw.includes('closed')) return 'badge-info';
    return 'badge-warning';
}

function renderSupplierTenderClarificationDeadline(tender = {}) {
    const state = getSupplierTenderClarificationDeadlineState(tender);
    if (!state.valid) {
        return `
            <div class="clarification-deadline-card">
                <strong>Clarification deadline not set</strong>
                <span>Confirm the buyer's deadline before preparing questions.</span>
            </div>
        `;
    }
    return `
        <div class="clarification-deadline-card ${state.closed ? 'closed' : ''}">
            <strong>${state.closed ? 'Clarification period closed' : `Clarifications close in ${state.daysRemaining} days`}</strong>
            <span>${state.closed ? 'Buyer can no longer respond to pre-bid questions.' : `Deadline: ${escapeSupplierTenderDetailHtml(state.label)}`}</span>
        </div>
    `;
}

function renderSupplierTenderClarificationOptions(selected = '') {
    return supplierTenderClarificationCategories
        .map(category => `<option ${category === selected ? 'selected' : ''}>${escapeSupplierTenderDetailHtml(category)}</option>`)
        .join('');
}

function renderSupplierTenderPublicClarificationFeed(clarifications = []) {
    if (!clarifications.length) return '<div class="scope-empty">No public clarification responses yet.</div>';
    return clarifications.map(item => {
        const question = item.question || item.detail || item.title || 'Clarification question';
        const answer = item.answer || (/answered|published/i.test(item.status || '') ? item.detail : '') || 'Pending buyer response.';
        const status = item.status || (item.answer ? 'Answered' : 'Pending');
        return `
            <article class="public-clarification-item">
                <div class="public-clarification-topline">
                    <span>${escapeSupplierTenderDetailHtml(item.category || 'Technical')}</span>
                    <em class="badge ${getSupplierTenderClarificationStatusClass(status)}">${escapeSupplierTenderDetailHtml(status)}</em>
                </div>
                <p><strong>Q:</strong> ${escapeSupplierTenderDetailHtml(question)}</p>
                <p><strong>A:</strong> ${escapeSupplierTenderDetailHtml(answer)}</p>
                ${item.context ? `<small>Context: ${escapeSupplierTenderDetailHtml(item.context)}</small>` : ''}
            </article>
        `;
    }).join('');
}

function renderSupplierTenderClarificationPrompt(context = '', category = 'Technical') {
    return `
        <div class="contextual-clarification-prompt">
            <span>${escapeSupplierTenderDetailHtml(context || 'Need clarification on this section?')}</span>
            <button class="btn btn-secondary" type="button" data-supplier-focus-clarification data-clarification-context="${escapeSupplierTenderDetailHtml(context)}" data-clarification-category="${escapeSupplierTenderDetailHtml(category)}">Ask Buyer</button>
        </div>
    `;
}

function getSupplierTenderRequirementSet(tender, profile) {
    if (typeof getBidWorkspaceRequirementSet === 'function') return getBidWorkspaceRequirementSet(tender, profile);
    return {
        mandatory: [
            {
                id: 'eligibility',
                title: 'Confirm eligibility',
                category: 'Administrative compliance',
                description: tender.eligibility || 'Supplier must confirm eligibility before bidding.'
            }
        ],
        optional: profile.bidderPreparation?.map((item, index) => ({
            id: `optional-${index}`,
            title: item,
            category: 'Bid response',
            description: 'Complete during bid submission.'
        })) || []
    };
}

function renderSupplierTenderRequirementList(requirements = [], emptyText = 'No requirements configured.') {
    if (!requirements.length) return `<div class="scope-empty">${escapeSupplierTenderDetailHtml(emptyText)}</div>`;
    return requirements.map(requirement => `
        <article class="supplier-requirement-preview">
            <span>${escapeSupplierTenderDetailHtml(requirement.category || 'Requirement')}</span>
            <strong>${escapeSupplierTenderDetailHtml(requirement.title)}</strong>
            <small>${escapeSupplierTenderDetailHtml(requirement.description || 'Supplier response required.')}</small>
        </article>
    `).join('');
}

function renderSupplierTenderEvaluationRows(tender, profile) {
    const criteria = tender.evaluation?.criteria?.length
        ? tender.evaluation.criteria.map(item => [item.name, item.weight, (item.subcriteria || []).join(', ')])
        : (profile.evaluationCriteria || []);
    return criteria.map(item => `
        <tr>
            <td>${escapeSupplierTenderDetailHtml(item[0] || item.name || 'Criterion')}</td>
            <td>${escapeSupplierTenderDetailHtml(item[1] || item.weight || 0)}%</td>
            <td>${escapeSupplierTenderDetailHtml(item[2] || item.description || 'Buyer-defined scoring focus')}</td>
        </tr>
    `).join('');
}

function renderSupplierTenderCommercialPreview(tender, profile) {
    return renderProcurexTenderDetailCommercial(tender, profile);
}

function renderSupplierTenderTimeline(tender = {}) {
    const milestones = Array.isArray(tender.milestones) && tender.milestones.length
        ? tender.milestones
        : [
            { name: 'Clarification deadline', date: 'Before closing' },
            { name: 'Bid closing', date: tender.closingDate || 'Not set' },
            { name: 'Bid opening', date: tender.closingDate || 'After closing' },
            { name: 'Evaluation', date: 'After bid opening' }
        ];
    return milestones.map(item => `
        <div class="timeline-row">
            <strong>${escapeSupplierTenderDetailHtml(item.name || item.title || 'Milestone')}</strong>
            <span>${escapeSupplierTenderDetailHtml(item.date || item.targetDate || 'Not set')}</span>
        </div>
    `).join('');
}

function renderSupplierTenderDetail() {
    const tender = typeof getProcurexSelectedTender === 'function' ? getProcurexSelectedTender() : mockData.tenders[0];
    const profile = typeof getCreateTenderTypeProfile === 'function'
        ? getCreateTenderTypeProfile(tender)
        : { commercialName: 'Pricing schedule', bidderPreparation: ['Technical response', 'Pricing'], evaluationCriteria: [] };
    const documents = tender.documents?.length ? tender.documents : profile.documentLabels || ['Tender document'];
    const clarifications = getSupplierTenderClarifications(tender);
    const requirementSet = getSupplierTenderRequirementSet(tender, profile);
    const saved = getSupplierTenderSavedIds().includes(tender.id);
    const daysRemaining = Math.max(0, Math.ceil((Date.parse(`${tender.closingDate}T23:59:59`) - Date.now()) / 86400000)) || 0;
    const clarificationDeadline = getSupplierTenderClarificationDeadlineState(tender);

    return `
        <div class="main-layout">
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Tender Detail</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Supplier view</div>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="supplier-marketplace">Marketplace</a></li>
                    <li><a href="#" data-navigate="communication-center">Communication Center</a></li>
                    <li><a href="#" data-navigate="bidding-workspace">Start Bid</a></li>
                    <li><a href="#" data-navigate="supplier-journey">Supplier Journey</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <div class="main-content">
                <div class="journey-page supplier-tender-detail-page" data-supplier-tender-detail data-tender-id="${escapeSupplierTenderDetailHtml(tender.id)}">
                    <section class="journey-hero compact">
                        <div>
                            <span class="badge badge-success">${escapeSupplierTenderDetailHtml(tender.status)}</span>
                            <h1>${escapeSupplierTenderDetailHtml(tender.title)}</h1>
                            <p>${escapeSupplierTenderDetailHtml(tender.organization)}. Review the full tender, save it for later, ask clarifications, then start the bid only when ready.</p>
                        </div>
                        <div class="hero-action-stack">
                            <button class="btn btn-secondary" type="button" data-supplier-save-tender>${saved ? 'Saved for Later' : 'Save for Later Review'}</button>
                            <button class="btn btn-secondary" type="button" data-supplier-focus-clarification>Ask Clarification</button>
                            <button class="btn btn-primary" data-navigate="bidding-workspace">Start Bid</button>
                        </div>
                    </section>

                    <section class="journey-grid four-col">
                        <div class="kpi-card"><div class="kpi-value">${requirementSet.mandatory.length}</div><div class="kpi-label">Mandatory before bid</div></div>
                        <div class="kpi-card"><div class="kpi-value">${requirementSet.optional.length}</div><div class="kpi-label">Additional responses</div></div>
                        <div class="kpi-card"><div class="kpi-value">${daysRemaining}d</div><div class="kpi-label">Time remaining</div></div>
                        <div class="kpi-card"><div class="kpi-value">${clarificationDeadline.closed ? 'Closed' : clarifications.length}</div><div class="kpi-label">Clarifications</div></div>
                    </section>

                    ${renderSupplierTenderClarificationDeadline(tender)}

                    ${renderProcurexTenderDetailFullSections(tender, profile, { requirementSet, clarifications })}

                    <section class="journey-panel supplier-clarification-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Clarifications</span>
                                <h2>Ask the Buyer Before Bidding</h2>
                            </div>
                            <span class="badge badge-info">${clarifications.length} items</span>
                        </div>
                        ${renderSupplierTenderClarificationDeadline(tender)}
                        <div class="clarification-rule-note">
                            <strong>Pre-bid transparency rule</strong>
                            <span>Questions and buyer answers are public to all suppliers, with supplier identity hidden. After bid submission, evaluation-related clarifications are handled confidentially.</span>
                        </div>
                        <div class="clarification-compose enhanced">
                            <select class="form-input" data-clarification-category aria-label="Clarification category">
                                ${renderSupplierTenderClarificationOptions()}
                            </select>
                            <textarea class="form-input" rows="3" data-clarification-text placeholder="Write your question here"></textarea>
                            <button class="btn btn-secondary" type="button" data-clarification-attach>Attach File</button>
                            <button class="btn btn-primary" type="button" data-submit-clarification ${clarificationDeadline.closed ? 'disabled' : ''}>Send Clarification Request</button>
                        </div>
                        <div class="public-clarification-feed" data-clarification-list>
                            <div class="public-clarification-heading">
                                <span class="section-kicker">Public responses</span>
                                <strong>Supplier identity hidden from public Q&A</strong>
                            </div>
                            ${renderSupplierTenderPublicClarificationFeed(clarifications)}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `;
}

function initializeSupplierTenderDetail() {
    const root = document.querySelector('[data-supplier-tender-detail]');
    if (!root || root.dataset.ready === 'true') return;
    const tenderId = root.dataset.tenderId;
    const tender = typeof getProcurexSelectedTender === 'function' ? getProcurexSelectedTender() : mockData.tenders.find(item => item.id === tenderId);

    const focusClarificationComposer = (context = '', category = '') => {
        const input = root.querySelector('[data-clarification-text]');
        const categoryInput = root.querySelector('[data-clarification-category]');
        if (categoryInput && category) categoryInput.value = category;
        if (input && context && !input.value.trim()) input.value = `${context}\n\n`;
        input?.focus();
        root.querySelector('.supplier-clarification-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    try {
        const pendingContext = JSON.parse(localStorage.getItem(supplierTenderClarificationContextStorageKey) || 'null');
        if (pendingContext?.tenderId === tenderId) {
            setTimeout(() => focusClarificationComposer(pendingContext.context, pendingContext.category), 0);
            localStorage.removeItem(supplierTenderClarificationContextStorageKey);
        }
    } catch (error) {
        localStorage.removeItem(supplierTenderClarificationContextStorageKey);
    }

    root.addEventListener('click', (event) => {
        const saveButton = event.target.closest('[data-supplier-save-tender]');
        if (saveButton) {
            const saved = new Set(getSupplierTenderSavedIds());
            if (saved.has(tenderId)) {
                saved.delete(tenderId);
                saveButton.textContent = 'Save for Later Review';
            } else {
                saved.add(tenderId);
                saveButton.textContent = 'Saved for Later';
            }
            localStorage.setItem(supplierTenderSavedStorageKey, JSON.stringify([...saved]));
            return;
        }

        const clarificationButton = event.target.closest('[data-supplier-focus-clarification]');
        if (clarificationButton) {
            focusClarificationComposer(clarificationButton.dataset.clarificationContext || '', clarificationButton.dataset.clarificationCategory || '');
            return;
        }

        if (event.target.closest('[data-clarification-attach]')) {
            alert('Mock attachment noted. In the production workflow this would upload a file with the clarification request.');
            return;
        }

        if (event.target.closest('[data-submit-clarification]')) {
            const input = root.querySelector('[data-clarification-text]');
            const categoryInput = root.querySelector('[data-clarification-category]');
            const question = String(input?.value || '').trim();
            const deadline = getSupplierTenderClarificationDeadlineState(tender || {});
            if (deadline.closed) {
                alert('Clarification period is closed for this tender.');
                return;
            }
            if (!question) {
                alert('Write a clarification question before sending.');
                return;
            }
            const category = categoryInput?.value || 'Technical';
            const stored = (() => {
                try {
                    const parsed = JSON.parse(localStorage.getItem(supplierTenderClarificationStorageKey) || '{}');
                    return parsed && typeof parsed === 'object' ? parsed : {};
                } catch (error) {
                    return {};
                }
            })();
            stored[tenderId] = [
                { title: `${category} clarification`, category, question, detail: question, status: 'Pending', createdAt: new Date().toISOString() },
                ...(stored[tenderId] || [])
            ];
            localStorage.setItem(supplierTenderClarificationStorageKey, JSON.stringify(stored));
            window.addProcurexCommunicationItem?.({
                kind: 'clarification',
                category: category === 'Financial' || category === 'Commercial Schedule' ? 'BOQ / Pricing' : 'Tender Clarification',
                subject: `${category} clarification`,
                body: question,
                senderType: 'Supplier',
                senderName: mockData.users?.supplier?.organization || 'Supplier organization',
                recipientType: 'Buyer',
                recipientName: tender?.organization || 'Buyer organization',
                tenderId,
                tenderReference: tenderId,
                tenderTitle: tender?.title || 'Tender',
                priority: 'Normal',
                status: 'Pending Buyer Response',
                read: false,
                visibility: 'Private',
                thread: [
                    {
                        senderType: 'Supplier',
                        senderName: mockData.users?.supplier?.organization || 'Supplier organization',
                        body: question,
                        createdAt: new Date().toISOString()
                    }
                ],
                actionRequired: true,
                actionLabel: 'Reply',
                actionPage: 'communication-center',
                audience: ['buyer', 'admin', 'all']
            });
            window.addProcurexCommunicationItem?.({
                kind: 'notification',
                category: 'Tender Clarification',
                subject: 'Clarification Sent',
                body: `Your clarification request for ${tenderId} was sent and is awaiting buyer response.`,
                senderType: 'System',
                senderName: 'ProcureX System',
                recipientType: 'Supplier',
                recipientName: mockData.users?.supplier?.organization || 'Supplier organization',
                tenderId,
                tenderReference: tenderId,
                tenderTitle: tender?.title || 'Tender',
                priority: 'Normal',
                status: 'Unread',
                read: false,
                actionLabel: 'View Thread',
                actionPage: 'communication-center',
                audience: ['supplier', 'all']
            });
            if (input) input.value = '';
            window.app?.renderPage();
        }
    });

    root.dataset.ready = 'true';
}

if (window.app) {
    window.app.renderSupplierTenderDetail = renderSupplierTenderDetail;
}

window.initializeSupplierTenderDetail = initializeSupplierTenderDetail;
