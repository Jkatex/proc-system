// Supplier Tender Detail Page Component

const supplierTenderSavedStorageKey = 'procurex.supplierSavedTenders.v1';
const supplierTenderClarificationStorageKey = 'procurex.supplierClarifications.v1';

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
    const items = typeof getBidWorkspaceCommercialItems === 'function'
        ? getBidWorkspaceCommercialItems(tender, profile)
        : (tender.commercialItems || tender.boqItems || []);
    if (!items.length) {
        return '<div class="scope-empty">Commercial schedule will be completed in the bid wizard.</div>';
    }
    return `
        <div class="data-table">
            <table>
                <thead><tr><th>Code</th><th>Requirement</th><th>Qty / Duration</th></tr></thead>
                <tbody>
                    ${items.slice(0, 5).map((item, index) => `
                        <tr>
                            <td>${escapeSupplierTenderDetailHtml(item.item || item.itemNumber || `${index + 1}.1`)}</td>
                            <td>${escapeSupplierTenderDetailHtml(item.description || item.itemDescription || item.workItem || item.serviceTask || 'Tender requirement')}</td>
                            <td>${escapeSupplierTenderDetailHtml(item.qty || item.quantity || 1)} ${escapeSupplierTenderDetailHtml(item.unit || item.unitOfMeasure || 'Lot')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
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

    return `
        <div class="main-layout">
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Tender Detail</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Supplier view</div>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="supplier-marketplace">Marketplace</a></li>
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
                        <div class="kpi-card"><div class="kpi-value">${clarifications.length}</div><div class="kpi-label">Clarifications</div></div>
                    </section>

                    <section class="journey-panel tender-explanation-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Tender explanation</span>
                                <h2>What the buyer is asking for</h2>
                            </div>
                            <span class="badge badge-info">${escapeSupplierTenderDetailHtml(tender.type)}</span>
                        </div>
                        <div class="record-summary">
                            <div><span>Description</span><strong>${escapeSupplierTenderDetailHtml(tender.description || 'No description provided')}</strong></div>
                            <div><span>Budget estimate</span><strong>${formatSupplierTenderMoney(tender.budget)}</strong></div>
                            <div><span>Eligibility</span><strong>${escapeSupplierTenderDetailHtml(tender.eligibility || 'Not specified')}</strong></div>
                            <div><span>Closing date</span><strong>${escapeSupplierTenderDetailHtml(tender.closingDate || 'Not set')}</strong></div>
                            <div><span>Commercial model</span><strong>${escapeSupplierTenderDetailHtml(tender.commercialModel || profile.commercialName || 'Pricing schedule')}</strong></div>
                            <div><span>Category</span><strong>${escapeSupplierTenderDetailHtml(tender.category || tender.type || 'General')}</strong></div>
                        </div>
                    </section>

                    <section class="journey-grid two-col">
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Before bidding</span>
                                    <h2>Mandatory Requirements</h2>
                                </div>
                                <span class="badge badge-warning">${requirementSet.mandatory.length} required</span>
                            </div>
                            <div class="supplier-requirement-preview-list">
                                ${renderSupplierTenderRequirementList(requirementSet.mandatory, 'No mandatory gate requirements were configured.')}
                            </div>
                            <div class="submit-strip compact">
                                <div>
                                    <strong>Bid gate</strong>
                                    <span>These requirements appear first when the supplier starts the bid.</span>
                                </div>
                                <button class="btn btn-primary" data-navigate="bidding-workspace">Complete Mandatory Requirements</button>
                            </div>
                        </div>

                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Submission workspace</span>
                                    <h2>Dynamic Bid Content</h2>
                                </div>
                                <span class="badge badge-info">${requirementSet.optional.length} dynamic</span>
                            </div>
                            <div class="supplier-requirement-preview-list">
                                ${renderSupplierTenderRequirementList(requirementSet.optional.slice(0, 6), 'No additional dynamic requirements were configured.')}
                            </div>
                        </div>
                    </section>

                    <section class="journey-grid two-col">
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Evaluation</span>
                                    <h2>Criteria and Weights</h2>
                                </div>
                                <span class="badge badge-success">Supplier view</span>
                            </div>
                            <div class="data-table">
                                <table>
                                    <thead><tr><th>Criterion</th><th>Weight</th><th>Supplier focus</th></tr></thead>
                                    <tbody>${renderSupplierTenderEvaluationRows(tender, profile)}</tbody>
                                </table>
                            </div>
                        </div>

                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Timeline</span>
                                    <h2>Important Dates</h2>
                                </div>
                                <span class="badge badge-warning">${daysRemaining} days left</span>
                            </div>
                            <div class="supplier-timeline-list">
                                ${renderSupplierTenderTimeline(tender)}
                            </div>
                        </div>
                    </section>

                    <section class="journey-grid two-col">
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Documents</span>
                                    <h2>Tender Pack</h2>
                                </div>
                                <span class="badge badge-info">${documents.length} files</span>
                            </div>
                            <div class="attachment-grid">
                                ${documents.map(doc => `<div class="attachment-card"><strong>${escapeSupplierTenderDetailHtml(doc)}</strong><span>Available for supplier review</span></div>`).join('')}
                            </div>
                        </div>

                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Commercial schedule</span>
                                    <h2>${escapeSupplierTenderDetailHtml(profile.commercialName || 'Pricing')}</h2>
                                </div>
                                <span class="badge badge-info">Preview</span>
                            </div>
                            ${renderSupplierTenderCommercialPreview(tender, profile)}
                        </div>
                    </section>

                    <section class="journey-panel supplier-clarification-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Clarifications</span>
                                <h2>Ask the Buyer Before Bidding</h2>
                            </div>
                            <span class="badge badge-info">${clarifications.length} items</span>
                        </div>
                        <div class="clarification-compose">
                            <textarea class="form-input" rows="3" data-clarification-text placeholder="Write a clarification question for the buyer"></textarea>
                            <button class="btn btn-primary" type="button" data-submit-clarification>Send Clarification Request</button>
                        </div>
                        <div class="inbox-list" data-clarification-list>
                            ${clarifications.length ? clarifications.map(item => `
                                <div class="inbox-item">
                                    <strong>${escapeSupplierTenderDetailHtml(item.title || item.question || 'Clarification request')}</strong>
                                    <span>${escapeSupplierTenderDetailHtml(item.detail || item.answer || item.status || 'Pending buyer response')}</span>
                                </div>
                            `).join('') : '<div class="scope-empty">No clarification requests yet.</div>'}
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

        if (event.target.closest('[data-supplier-focus-clarification]')) {
            root.querySelector('[data-clarification-text]')?.focus();
            root.querySelector('.supplier-clarification-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        if (event.target.closest('[data-submit-clarification]')) {
            const input = root.querySelector('[data-clarification-text]');
            const question = String(input?.value || '').trim();
            if (!question) {
                alert('Write a clarification question before sending.');
                return;
            }
            const stored = (() => {
                try {
                    const parsed = JSON.parse(localStorage.getItem(supplierTenderClarificationStorageKey) || '{}');
                    return parsed && typeof parsed === 'object' ? parsed : {};
                } catch (error) {
                    return {};
                }
            })();
            stored[tenderId] = [
                { title: 'Supplier clarification', detail: question, status: 'Pending buyer response', createdAt: new Date().toISOString() },
                ...(stored[tenderId] || [])
            ];
            localStorage.setItem(supplierTenderClarificationStorageKey, JSON.stringify(stored));
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
