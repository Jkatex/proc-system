// Buyer-side award workflow after evaluation completion.

const PXAwardUtils = window.ProcureXShared || {};
const escapeAwardRecommendationHtml = PXAwardUtils.escapeHtml || ((value = '') => String(value));
const formatAwardRecommendationMoney = PXAwardUtils.formatMoney || ((value, currency = 'TZS') => `${currency} ${Number(value || 0).toLocaleString()}`);
const formatAwardRecommendationDate = PXAwardUtils.formatDate || ((value = '') => value || '-');
const renderAwardRecommendationBadge = PXAwardUtils.renderStatusBadge || ((value = '') => `<span class="badge badge-info">${escapeAwardRecommendationHtml(value)}</span>`);

const awardWorkflowSteps = [
    { id: 'evaluation-result', title: 'Evaluation Results', shortTitle: 'Evaluation Results', meta: 'Report and ranked bidders' },
    { id: 'award-decision', title: 'Award Decision', shortTitle: 'Award Decision', meta: 'Supplier, amount, and reason' },
    { id: 'approval', title: 'Approval', shortTitle: 'Approval', meta: 'Authority and COI declaration' },
    { id: 'award-notification', title: 'Notices', shortTitle: 'Notices', meta: 'Required bidder notifications' },
    { id: 'standstill-period', title: 'Standstill & Complaints', shortTitle: 'Standstill', meta: 'Contracting lock window' },
    { id: 'supplier-acceptance', title: 'Supplier Acceptance', shortTitle: 'Acceptance', meta: 'Accept, decline, or clarify' },
    { id: 'pre-contract-documents', title: 'Pre-Contract Documents', shortTitle: 'Documents', meta: 'Supplier evidence checklist' },
    { id: 'draft-contract', title: 'Draft Contract', shortTitle: 'Draft Contract', meta: 'Generate only after blockers clear' }
];

function normalizeAwardStep(step = '') {
    if (step === 'notice') return 'award-notification';
    if (step === 'evaluation-results') return 'evaluation-result';
    return awardWorkflowSteps.some(item => item.id === step) ? step : 'evaluation-result';
}

function getAwardRecommendationStepState(stepId, currentStep) {
    const order = awardWorkflowSteps.map(step => step.id);
    const currentIndex = Math.max(0, order.indexOf(normalizeAwardStep(currentStep)));
    const index = order.indexOf(stepId);
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
}

function renderAwardWizardProgress(steps, currentStep) {
    return `
        <nav class="wizard-step-progress award-step-progress" aria-label="Award workflow progress">
            ${steps.map((step, index) => {
                const state = getAwardRecommendationStepState(step.id, currentStep);
                return `
                    <button class="wizard-progress-step ${state === 'active' ? 'active' : ''} ${state === 'completed' ? 'completed' : ''}" type="button" data-award-step-index="${index}" aria-current="${state === 'active' ? 'step' : 'false'}">
                        <strong>${String(index + 1).padStart(2, '0')}</strong>
                        <span>${escapeAwardRecommendationHtml(step.shortTitle)}</span>
                    </button>
                `;
            }).join('')}
        </nav>
    `;
}

function renderAwardWizardRail(steps, currentStep) {
    return `
        <aside class="wizard-rail award-wizard-rail">
            ${steps.map((step, index) => {
                const state = getAwardRecommendationStepState(step.id, currentStep);
                return `
                    <button class="wizard-rail-step ${state === 'active' ? 'active' : ''} ${state === 'completed' ? 'completed' : ''}" type="button" data-award-step-index="${index}">
                        <strong>${String(index + 1).padStart(2, '0')}</strong>
                        <span>${escapeAwardRecommendationHtml(step.title)}</span>
                    </button>
                `;
            }).join('')}
        </aside>
    `;
}

function renderAwardRecommendationRows(rows = []) {
    return rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
}

function getStandstillStatus(award = {}) {
    const now = new Date();
    const start = award.standstillStart ? new Date(award.standstillStart) : null;
    const end = award.standstillEnd ? new Date(award.standstillEnd) : null;
    const unresolvedComplaint = award.complaintsReceived && award.complaintsReceived !== 'None' && !award.complaintsResolved;
    const hasValidWindow = Boolean(start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()));
    const durationDays = hasValidWindow ? Math.max(0, Math.ceil((end - start) / 86400000)) : 0;
    const active = hasValidWindow && now >= start && now <= end;
    const completed = hasValidWindow && now > end;
    const daysRemaining = hasValidWindow
        ? active
            ? Math.max(0, Math.ceil((end - now) / 86400000))
            : completed
                ? 0
                : durationDays
        : 0;
    const blocked = !completed || unresolvedComplaint;
    return { start, end, active, completed, blocked, unresolvedComplaint, durationDays, daysRemaining };
}

function renderAwardFieldError(message) {
    return `<small class="field-error" aria-live="polite">${escapeAwardRecommendationHtml(message)}</small>`;
}

function renderAwardCheck(label, complete) {
    return `
        <li class="${complete ? 'complete' : 'blocked'}">
            <span>${complete ? 'OK' : '!'}</span>
            <strong>${escapeAwardRecommendationHtml(label)}</strong>
        </li>
    `;
}

function renderAwardStatusPanel(statusItems = [], blockers = []) {
    const nextBlocker = blockers.find(item => !item.complete);
    return `
        <aside class="award-status-panel" aria-label="Award workflow status">
            <div>
                <span class="section-kicker">Status panel</span>
                <h3>${escapeAwardRecommendationHtml(nextBlocker ? 'Contract blocked' : 'Ready for draft contract')}</h3>
                <p>${escapeAwardRecommendationHtml(nextBlocker ? nextBlocker.label : 'All pre-contract conditions are clear.')}</p>
            </div>
            <div class="award-status-grid">
                ${statusItems.map(item => `
                    <article>
                        <span>${escapeAwardRecommendationHtml(item.label)}</span>
                        <strong>${item.value}</strong>
                    </article>
                `).join('')}
            </div>
            <div class="award-blocker-list">
                <strong>Contract unlock checklist</strong>
                <ul>
                    ${blockers.map(item => renderAwardCheck(item.label, item.complete)).join('')}
                </ul>
            </div>
        </aside>
    `;
}

function renderAwardQueueNavLink(label, queue, active = false) {
    return `<li><a href="#" data-award-guard-navigate data-navigate="awarding-contracts" data-route-search="queue=${escapeAwardRecommendationHtml(queue)}" class="${active ? 'active' : ''}">${escapeAwardRecommendationHtml(label)}</a></li>`;
}

function renderDocumentStatusBadge(status = '') {
    return renderAwardRecommendationBadge(status || 'Missing');
}

function renderAwardRecommendation() {
    const context = typeof getAwardContractLifecycleContext === 'function' ? getAwardContractLifecycleContext() : null;
    const lifecycle = mockData.awardingContracts || {};
    const tender = context?.tender || {};
    const draft = context?.draft || {};
    const award = {
        ...(lifecycle.award || {}),
        tenderTitle: draft.title || lifecycle.award?.tenderTitle,
        reference: draft.tenderReference || lifecycle.award?.reference,
        buyer: draft.buyer || lifecycle.award?.buyer,
        procurementType: draft.procurementType || lifecycle.award?.procurementType,
        closingDate: draft.closingDate || lifecycle.award?.closingDate,
        selectedSupplier: draft.awardDecision?.selectedSupplier || lifecycle.award?.selectedSupplier,
        awardAmount: draft.awardDecision?.awardAmount || lifecycle.award?.awardAmount,
        currency: draft.awardDecision?.currency || lifecycle.award?.currency,
        reason: draft.awardDecision?.reason || lifecycle.award?.reason,
        awardStatus: draft.awardStatus || lifecycle.award?.awardStatus,
        approval: {
            ...(lifecycle.award?.approval || {}),
            approver: draft.awardDecision?.approver || lifecycle.award?.approval?.approver,
            date: draft.awardDecision?.awardDate || lifecycle.award?.approval?.date,
            status: draft.awardDecision?.approvalConfirmed ? 'Approved' : 'Pending'
        },
        notices: lifecycle.award?.notices || [],
        supplierResponses: lifecycle.award?.supplierResponses || []
    };
    const evaluation = mockData.bidEvaluation || {};
    const bids = evaluation.bids || [];
    const recommendation = evaluation.recommendation || {};
    const criteria = (evaluation.technicalCriteria || []).filter(criterion => !/financial|price/i.test(String(criterion.name || criterion.label || '')));
    const technicalTotal = bid => criteria.reduce((sum, criterion) => sum + Number(bid.technicalScores?.[criterion.id] || 0), 0);
    const rankedBids = bids.slice().sort((a, b) => (a.financial?.ranking || 99) - (b.financial?.ranking || 99));
    const selectedSupplier = award.selectedSupplier || recommendation.supplier || rankedBids[0]?.supplier || 'Recommended supplier';
    const selectedBid = rankedBids.find(bid => bid.supplier === selectedSupplier) || rankedBids[0] || {};
    const firstRankedBid = rankedBids[0] || {};
    const nextRankedSupplier = rankedBids.find(bid => bid.supplier !== selectedSupplier)?.supplier || 'Next ranked responsive bidder';
    const selectedRank = Number(selectedBid.financial?.ranking || 0);
    const selectedIsFirstRanked = selectedRank === 1;
    const correctedPrice = Number(selectedBid.financial?.correctedPrice || recommendation.amount || 0);
    const awardAmount = Number(award.awardAmount || recommendation.amount || 0);
    const amountDifference = awardAmount - correctedPrice;
    const amountMismatch = correctedPrice > 0 && Math.abs(amountDifference) > 0;
    const approved = Boolean(draft.awardDecision?.approvalConfirmed);
    const standstill = getStandstillStatus(award);
    const currentStep = normalizeAwardStep(draft.currentStep || 'evaluation-result');
    const activeStepIndex = Math.max(0, awardWorkflowSteps.findIndex(step => step.id === currentStep));
    const responseDeadline = draft.notification?.responseDeadline || award.notices?.find(row => /award notification/i.test(row.type || ''))?.deadline || award.standstillEnd || '';
    const requiredNoticesSent = (award.notices || []).every(row => /sent|awaiting response/i.test(row.status || ''));
    const supplierAccepted = /accepted/i.test(award.awardStatus || '') || draft.supplierAccepted;
    const requiredDocuments = draft.documents || [];
    const requiredDocumentsApproved = requiredDocuments.length > 0 && requiredDocuments.every(row => /approved|verified/i.test(row.status || ''));
    const readonly = approved ? 'readonly aria-readonly="true"' : '';
    const blockers = [
        { label: 'Award decision approved', complete: approved },
        { label: 'Required notices sent', complete: requiredNoticesSent },
        { label: 'Standstill completed', complete: !standstill.blocked },
        { label: 'No unresolved complaints', complete: !standstill.unresolvedComplaint },
        { label: 'Supplier accepted award', complete: Boolean(supplierAccepted) },
        { label: 'Required pre-contract documents approved', complete: requiredDocumentsApproved }
    ];
    const statusItems = [
        { label: 'Current status', value: renderAwardRecommendationBadge(approved ? 'Award Approved' : 'Award Decision Pending') },
        { label: 'Next action', value: `<span>${escapeAwardRecommendationHtml(approved ? 'Send required notices' : 'Complete approval')}</span>` },
        { label: 'Contract status', value: renderAwardRecommendationBadge(blockers.some(item => !item.complete) ? 'Blocked' : 'Ready') }
    ];

    return `
        <div class="main-layout procurement-layout evaluation-app-layout award-page" data-award-contract-workspace data-award-current-step="${escapeAwardRecommendationHtml(currentStep)}" data-award-tender-id="${escapeAwardRecommendationHtml(draft.tenderId || tender.id || '')}">
            <aside class="sidebar evaluation-sidebar">
                <div class="evaluation-sidebar-head">
                    <h3>Awarding in Progress</h3>
                    <span>${escapeAwardRecommendationHtml(award.reference || 'Evaluation report')}</span>
                </div>
                <ul class="sidebar-nav">
                    ${renderAwardQueueNavLink('My Urgent Actions', 'my-urgent-actions')}
                    ${renderAwardQueueNavLink('Awarding in Progress', 'awarding-in-progress', true)}
                    ${renderAwardQueueNavLink('Awards Received', 'awards-received')}
                    ${renderAwardQueueNavLink('Contracts in Progress', 'contracts-in-progress')}
                    ${renderAwardQueueNavLink('Active Contracts', 'active-contracts')}
                    ${renderAwardQueueNavLink('Closed Contracts', 'closed-contracts')}
                    <li><a href="#" data-award-guard-navigate data-navigate="bid-evaluation">View Evaluation Report</a></li>
                    <li><a href="#" data-award-guard-navigate data-navigate="workspace-dashboard">Workspace Dashboard</a></li>
                    <li><a href="#" data-award-guard-navigate data-navigate="sign-in">Logout</a></li>
                </ul>
            </aside>

            <main class="main-content procurement-content evaluation-workspace">
                <section class="procurement-hero evaluation-hero-panel award-hero-panel">
                    <div>
                        <span class="section-kicker">Buyer / awarder path</span>
                        <h1>${escapeAwardRecommendationHtml(award.tenderTitle || 'Awarding in Progress')}</h1>
                        <p>${escapeAwardRecommendationHtml(award.reason || 'Award package is compiled from the finalized evaluation report, ranking table, corrections, conditions, and audit trail.')}</p>
                        <div class="award-recommended-callout">${renderAwardRecommendationBadge(`Selected supplier: ${selectedSupplier}`)}<span>Supplier response deadline: ${escapeAwardRecommendationHtml(responseDeadline || 'Not set')}</span></div>
                    </div>
                    <div class="evaluation-hero-stats">
                        <div><strong>${formatAwardRecommendationMoney(awardAmount || recommendation.amount, award.currency || recommendation.currency || 'TZS')}</strong><span>Award amount</span></div>
                        <div><strong>${escapeAwardRecommendationHtml(award.procurementType || 'Tender')}</strong><span>Procurement type</span></div>
                        <div><strong>${standstill.durationDays || 0} days</strong><span>Standstill duration</span></div>
                    </div>
                </section>

                <section class="evaluation-top-summary">
                    <div><span>Tender</span><strong>${escapeAwardRecommendationHtml(award.tenderTitle || '')}</strong></div>
                    <div><span>Reference</span><strong>${escapeAwardRecommendationHtml(award.reference || '')}</strong></div>
                    <div><span>Buyer</span><strong>${escapeAwardRecommendationHtml(award.buyer || '')}</strong></div>
                    <div><span>Evaluation</span>${renderAwardRecommendationBadge(award.evaluationStatus || 'Completed')}</div>
                    <div><span>Supplier</span><strong>${escapeAwardRecommendationHtml(selectedSupplier)}</strong></div>
                </section>

                ${draft.hasRestorableDraft ? `<div class="draft-restore-banner"><strong>Draft from ${escapeAwardRecommendationHtml(draft.lastEditedAt ? new Date(draft.lastEditedAt).toLocaleString() : 'previous session')}</strong><span>Restored from local draft storage for this tender.</span></div>` : ''}

                <section class="award-wizard-page tender-wizard-page">
                    <div class="award-draft-strip">
                        <div>
                            <span class="section-kicker">Resumable workspace</span>
                            <h2>Evaluation Results to Draft Contract</h2>
                        </div>
                        <div class="inline-actions">
                            ${renderAwardRecommendationBadge(draft.draftSaved ? 'Draft saved' : 'Unsaved draft')}
                            <button class="btn btn-secondary" type="button" data-award-save-draft data-award-step="${escapeAwardRecommendationHtml(currentStep)}">Save Draft</button>
                            <button class="btn btn-secondary" type="button" data-award-save-exit data-award-step="${escapeAwardRecommendationHtml(currentStep)}">Save Draft & Exit</button>
                        </div>
                    </div>

                    <div class="wizard-shell award-wizard-shell" data-award-wizard data-award-active-step="${activeStepIndex}">
                        ${renderAwardWizardProgress(awardWorkflowSteps, currentStep)}
                        ${renderAwardWizardRail(awardWorkflowSteps, currentStep)}

                        <div class="award-wizard-main">
                            <div class="wizard-workspace">
                                <section class="journey-panel ${activeStepIndex === 0 ? 'active' : ''}" id="award-step-evaluation-results" data-award-step-panel data-award-step-id="evaluation-result">
                                    <div class="panel-heading">
                                        <div><span class="section-kicker">Step 1</span><h2>Evaluation Results</h2></div>
                                        ${renderAwardRecommendationBadge('Evaluation completed')}
                                    </div>
                                    <div class="award-evaluation-summary-grid">
                                        <article><span>Evaluation status</span><strong>Completed</strong></article>
                                        <article><span>Evaluation method</span><strong>${escapeAwardRecommendationHtml(recommendation.method || award.procurementMethod || 'Best evaluated responsive bid')}</strong></article>
                                        <article><span>Procurement type</span><strong>${escapeAwardRecommendationHtml(award.procurementType || 'Tender')}</strong></article>
                                        <article><span>Completion date</span><strong>${escapeAwardRecommendationHtml(evaluation.activeTender?.evaluationDeadline || '2026-06-28')}</strong></article>
                                    </div>
                                    <div class="inline-actions">
                                        <button class="btn btn-secondary" type="button" data-award-guard-navigate data-navigate="bid-evaluation">View Evaluation Report</button>
                                    </div>
                                    <div class="data-table evaluation-table-scroll">
                                        <table>
                                            <thead><tr><th>Rank</th><th>Supplier</th><th>Preliminary</th><th>Eligibility</th><th>Technical</th><th>Corrected Price</th><th>Final Result</th><th>Decision</th></tr></thead>
                                            <tbody>
                                                ${rankedBids.map(bid => `
                                                    <tr>
                                                        <td>${renderAwardRecommendationBadge(String(bid.financial?.ranking || '-'))}</td>
                                                        <td><strong>${escapeAwardRecommendationHtml(bid.supplier)}</strong></td>
                                                        <td>${escapeAwardRecommendationHtml(bid.preliminaryResult)}</td>
                                                        <td>${escapeAwardRecommendationHtml(bid.eligibilityResult)}</td>
                                                        <td>${technicalTotal(bid)}%</td>
                                                        <td>${formatAwardRecommendationMoney(bid.financial?.correctedPrice, bid.financial?.currency || 'TZS')}</td>
                                                        <td>${renderAwardRecommendationBadge(bid.finalResult)}</td>
                                                        <td>${bid.supplier === selectedSupplier ? renderAwardRecommendationBadge('Selected') : 'Responsive'}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                    ${!selectedIsFirstRanked ? `
                                        <div class="evaluation-notice warning">Selected supplier is not the first-ranked bidder. Provide justification before approval.</div>
                                        <div class="evaluation-form-grid recommendation-form award-justification-form">
                                            <label>Justification option
                                                <select class="form-input" data-award-draft-field="awardDecision.rankJustification">
                                                    <option>First-ranked bidder declined</option>
                                                    <option>First-ranked bidder failed post-qualification</option>
                                                    <option>First-ranked bidder failed clarification</option>
                                                    <option>First-ranked bidder had unresolved compliance issue</option>
                                                    <option>Approved exception</option>
                                                    <option>Other reason</option>
                                                </select>
                                            </label>
                                            <label>Justification for selecting ${escapeAwardRecommendationHtml(selectedSupplier)}
                                                <textarea class="form-input" rows="4" data-award-draft-field="awardDecision.rankJustificationComment" placeholder="Explain why the selected supplier is acceptable for award.">${escapeAwardRecommendationHtml(draft.awardDecision?.rankJustificationComment || '')}</textarea>
                                            </label>
                                        </div>
                                    ` : ''}
                                </section>

                                <section class="journey-panel ${activeStepIndex === 1 ? 'active' : ''}" id="award-step-award-decision" data-award-step-panel data-award-step-id="award-decision">
                                    <div class="panel-heading">
                                        <div><span class="section-kicker">Step 2</span><h2>Award Decision</h2></div>
                                        ${renderAwardRecommendationBadge(award.awardStatus || 'Draft')}
                                    </div>
                                    <div class="award-price-comparison">
                                        <article><span>Evaluated corrected price</span><strong>${formatAwardRecommendationMoney(correctedPrice, award.currency || 'TZS')}</strong></article>
                                        <article><span>Entered award amount</span><strong>${formatAwardRecommendationMoney(awardAmount, award.currency || 'TZS')}</strong></article>
                                        <article><span>Difference</span><strong>${formatAwardRecommendationMoney(amountDifference, award.currency || 'TZS')}</strong></article>
                                        <article>${renderAwardRecommendationBadge(amountMismatch ? 'Requires justification' : 'Aligned')}</article>
                                    </div>
                                    <div class="evaluation-form-grid recommendation-form award-decision-form" data-award-validation-form>
                                        <label>Selected supplier <input class="form-input" required ${readonly} data-award-required="Selected supplier" data-award-draft-field="awardDecision.selectedSupplier" value="${escapeAwardRecommendationHtml(selectedSupplier)}">${renderAwardFieldError('Required before approval')}</label>
                                        <label>Award amount <input class="form-input" required ${readonly} type="number" data-award-required="Award amount" data-award-draft-field="awardDecision.awardAmount" value="${escapeAwardRecommendationHtml(award.awardAmount || '')}">${renderAwardFieldError('Required before approval')}</label>
                                        <label>Currency <input class="form-input" required ${readonly} data-award-required="Currency" data-award-draft-field="awardDecision.currency" value="${escapeAwardRecommendationHtml(award.currency || 'TZS')}">${renderAwardFieldError('Required before approval')}</label>
                                        <label>Award decision date <input class="form-input" required ${readonly} type="date" data-award-required="Award decision date" data-award-draft-field="awardDecision.awardDate" value="${escapeAwardRecommendationHtml(draft.awardDecision?.awardDate || '')}">${renderAwardFieldError('Required before approval')}</label>
                                        <label>Award reason <textarea class="form-input" required ${readonly} rows="4" data-award-required="Award reason" data-award-draft-field="awardDecision.reason">${escapeAwardRecommendationHtml(award.reason || '')}</textarea>${renderAwardFieldError('Required before approval')}</label>
                                        <label>Award conditions <textarea class="form-input" ${readonly} rows="4" data-award-draft-field="awardDecision.conditions">${escapeAwardRecommendationHtml(draft.awardDecision?.conditions || '')}</textarea></label>
                                        <label>Negotiation required <select class="form-input" ${approved ? 'disabled aria-disabled="true"' : ''} data-award-draft-field="awardDecision.negotiationRequired"><option ${draft.awardDecision?.negotiationRequired === 'Yes' ? 'selected' : ''}>Yes</option><option ${draft.awardDecision?.negotiationRequired === 'No' ? 'selected' : ''}>No</option></select></label>
                                        <label>Authorized representative <input class="form-input" required ${readonly} data-award-required="Authorized representative" data-award-draft-field="awardDecision.approver" value="${escapeAwardRecommendationHtml(award.approval?.approver || '')}">${renderAwardFieldError('Required before approval')}</label>
                                        ${amountMismatch ? `
                                            <label>Reason for amount difference <textarea class="form-input" rows="3" data-award-draft-field="awardDecision.amountDifferenceReason">${escapeAwardRecommendationHtml(draft.awardDecision?.amountDifferenceReason || '')}</textarea></label>
                                            <label>Approval authority required <select class="form-input" data-award-draft-field="awardDecision.amountApprovalAuthority"><option>Accounting Officer</option><option>Tender Board</option><option>Finance Officer</option><option>Approved exception committee</option></select></label>
                                            <label>Supporting document upload <input class="form-input" data-award-draft-field="awardDecision.amountSupportDocument" placeholder="Attach or reference approval document"></label>
                                        ` : ''}
                                    </div>
                                </section>

                                <section class="journey-panel ${activeStepIndex === 2 ? 'active' : ''}" id="award-step-approval" data-award-step-panel data-award-step-id="approval">
                                    <div class="panel-heading">
                                        <div><span class="section-kicker">Step 3</span><h2>Approval</h2></div>
                                        ${renderAwardRecommendationBadge(award.approval?.status || 'Pending')}
                                    </div>
                                    <ul class="award-checklist">
                                        ${[
                                            ['Evaluation report completed', true],
                                            ['Selected supplier confirmed', Boolean(selectedSupplier)],
                                            ['Award amount checked', !amountMismatch || Boolean(draft.awardDecision?.amountDifferenceReason)],
                                            ['COI declaration completed', Boolean(draft.awardDecision?.coiDeclared && draft.awardDecision?.basedOnEvaluation && draft.awardDecision?.fairTreatmentConfirmed)],
                                            ['Budget confirmed', true],
                                            ['Award reason provided', Boolean(award.reason)],
                                            ['Standstill rule identified', Boolean(award.standstillStart && award.standstillEnd)],
                                            ['Notices prepared', (award.notices || []).length > 0]
                                        ].map(([label, complete]) => renderAwardCheck(label, complete)).join('')}
                                    </ul>
                                    <fieldset class="award-coi-panel">
                                        <legend>Conflict of Interest Declaration</legend>
                                        <label class="confirm-inline"><input type="checkbox" data-award-required-checkbox data-award-draft-field="awardDecision.coiDeclared" ${draft.awardDecision?.coiDeclared ? 'checked' : ''} ${approved ? 'disabled' : ''}> I confirm that I have no personal or financial interest in the recommended supplier.</label>
                                        <label class="confirm-inline"><input type="checkbox" data-award-required-checkbox data-award-draft-field="awardDecision.basedOnEvaluation" ${draft.awardDecision?.basedOnEvaluation ? 'checked' : ''} ${approved ? 'disabled' : ''}> I confirm that the award is based solely on the approved evaluation results.</label>
                                        <label class="confirm-inline"><input type="checkbox" data-award-required-checkbox data-award-draft-field="awardDecision.fairTreatmentConfirmed" ${draft.awardDecision?.fairTreatmentConfirmed ? 'checked' : ''} ${approved ? 'disabled' : ''}> I confirm that no bidder has received unfair treatment.</label>
                                        <label>Declaration by <input class="form-input" ${readonly} data-award-draft-field="awardDecision.coiDeclaredBy" value="${escapeAwardRecommendationHtml(draft.awardDecision?.coiDeclaredBy || award.approval?.approver || '')}"></label>
                                    </fieldset>
                                    <div class="award-approval-route">
                                        ${[
                                            ['Procurement Officer', 'Reviewed', '2026-06-03'],
                                            ['Evaluation Committee Chair', 'Recommended', '2026-06-03'],
                                            ['Authorized Representative', approved ? 'Approved' : 'Pending Approval', award.approval?.date || 'Pending'],
                                            ['Finance Officer', 'Pending Budget Confirmation', 'Pending'],
                                            ['Legal Officer', 'Not Started', 'Pending']
                                        ].map(([actor, status, date]) => `<article><strong>${escapeAwardRecommendationHtml(actor)}</strong>${renderAwardRecommendationBadge(status)}<span>${escapeAwardRecommendationHtml(date)}</span></article>`).join('')}
                                    </div>
                                    <div class="inline-actions">
                                        <button class="btn btn-secondary" type="button" data-award-save-draft data-award-step="approval">Save Draft</button>
                                        <button class="btn btn-secondary" type="button">Return for Correction</button>
                                        <button class="btn btn-secondary" type="button">Request Clarification</button>
                                        <button class="btn btn-primary" type="button" data-award-approval-button data-award-save-continue data-award-next-step="award-notification" data-award-required-action="Send Required Notices" disabled aria-disabled="true">Approve Award Decision</button>
                                    </div>
                                </section>

                                <section class="journey-panel ${activeStepIndex === 3 ? 'active' : ''}" id="award-step-notices" data-award-step-panel data-award-step-id="award-notification">
                                    <div class="panel-heading">
                                        <div><span class="section-kicker">Step 4</span><h2>Notification before contracting</h2></div>
                                        ${renderAwardRecommendationBadge(requiredNoticesSent ? 'Required notices sent' : 'Required notices pending')}
                                    </div>
                                    <div class="data-table evaluation-table-scroll">
                                        <table>
                                            <thead><tr><th>Notice</th><th>Recipient</th><th>Status</th><th>Deadline</th><th>Action</th></tr></thead>
                                            <tbody>${renderAwardRecommendationRows((award.notices || []).map(row => [
                                                escapeAwardRecommendationHtml(row.type),
                                                escapeAwardRecommendationHtml(row.recipient),
                                                renderAwardRecommendationBadge(row.status),
                                                escapeAwardRecommendationHtml(row.deadline),
                                                /sent|awaiting response/i.test(row.status || '') ? '<button class="btn btn-secondary btn-sm" type="button">View</button>' : '<button class="btn btn-primary btn-sm" type="button">Send</button>'
                                            ]))}</tbody>
                                        </table>
                                    </div>
                                    ${!requiredNoticesSent ? '<div class="evaluation-notice warning">Contract blocked: one or more required notices have not been sent.</div>' : ''}
                                    <div class="evaluation-form-grid recommendation-form award-notice-decision-form">
                                        <label>Notice type
                                            <select class="form-input" data-award-draft-field="notification.noticeType">
                                                <option>Notice of Intention to Award</option>
                                                <option>Award Notification</option>
                                                <option>Unsuccessful Bidder Notice</option>
                                            </select>
                                        </label>
                                        <label>Recipient scope
                                            <select class="form-input" data-award-draft-field="notification.recipientScope">
                                                <option>All bidders</option>
                                                <option>Selected supplier only</option>
                                                <option>Unsuccessful bidders only</option>
                                            </select>
                                        </label>
                                        <label>Delivery method
                                            <select class="form-input" data-award-draft-field="notification.deliveryMethod">
                                                <option>ProcureX portal and email</option>
                                                <option>ProcureX portal only</option>
                                                <option>Email and physical letter</option>
                                            </select>
                                        </label>
                                        <label>Response deadline <input class="form-input" type="date" data-award-draft-field="notification.responseDeadline" value="${escapeAwardRecommendationHtml(draft.notification?.responseDeadline || '')}"></label>
                                        <label>Notify unsuccessful bidders <select class="form-input" data-award-draft-field="notification.notifyUnsuccessful"><option ${draft.notification?.notifyUnsuccessful === 'Yes' ? 'selected' : ''}>Yes</option><option ${draft.notification?.notifyUnsuccessful === 'No' ? 'selected' : ''}>No</option></select></label>
                                        <label>Debrief option <select class="form-input" data-award-draft-field="notification.debriefOption"><option>Allow debrief requests</option><option>Do not allow debrief requests</option><option>Debrief by appointment only</option></select></label>
                                        <label>Complaint deadline <input class="form-input" type="date" data-award-draft-field="notification.complaintDeadline" value="${escapeAwardRecommendationHtml(award.standstillEnd || '')}"></label>
                                        <label>Message to awarded supplier <textarea class="form-input" rows="4" data-award-draft-field="notification.message">${escapeAwardRecommendationHtml(draft.notification?.message || '')}</textarea></label>
                                    </div>
                                    <div class="inline-actions">
                                        <button class="btn btn-secondary" type="button" data-award-save-draft data-award-step="award-notification">Save Draft</button>
                                        <button class="btn btn-primary" type="button" data-award-save-continue data-award-next-step="standstill-period" data-award-required-action="Monitor Standstill Period">Send Required Notices</button>
                                    </div>
                                </section>

                                <section class="journey-panel ${activeStepIndex === 4 ? 'active' : ''}" id="award-step-standstill" data-award-step-panel data-award-step-id="standstill-period">
                                    <div class="panel-heading">
                                        <div><span class="section-kicker">Step 5</span><h2>Standstill & Complaints</h2></div>
                                        ${renderAwardRecommendationBadge(standstill.blocked ? 'Contract blocked' : 'Window clear')}
                                    </div>
                                    <div class="award-control-grid">
                                        <article><strong>Notice date</strong><span>${formatAwardRecommendationDate(award.noticeDate, 'Not sent')}</span></article>
                                        <article><strong>Standstill duration</strong><span>${standstill.durationDays || 0} days</span></article>
                                        <article><strong>Standstill start</strong><span>${formatAwardRecommendationDate(award.standstillStart, 'Not set')}</span></article>
                                        <article><strong>Standstill end</strong><span>${formatAwardRecommendationDate(award.standstillEnd, 'Not set')}</span></article>
                                        <article><strong>Days remaining</strong><span>${standstill.daysRemaining}</span></article>
                                        <article><strong>Contract status</strong>${renderAwardRecommendationBadge(standstill.blocked ? 'Blocked' : 'Clear')}</article>
                                    </div>
                                    <div class="data-table evaluation-table-scroll">
                                        <table>
                                            <thead><tr><th>Complaint ID</th><th>Bidder</th><th>Date Received</th><th>Issue</th><th>Status</th><th>Deadline</th><th>Action</th></tr></thead>
                                            <tbody>
                                                <tr><td colspan="7">No complaints received during the standstill period.</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="evaluation-notice ${standstill.blocked ? 'warning' : 'success'}">${standstill.blocked ? 'Draft contract generation is blocked until the standstill window closes and any complaints are resolved.' : 'Standstill and complaint conditions are clear for contract generation.'}</div>
                                </section>

                                <section class="journey-panel ${activeStepIndex === 5 ? 'active' : ''}" id="award-step-acceptance" data-award-step-panel data-award-step-id="supplier-acceptance">
                                    <div class="panel-heading">
                                        <div><span class="section-kicker">Step 6</span><h2>Supplier Acceptance</h2></div>
                                        ${renderAwardRecommendationBadge(supplierAccepted ? 'Accepted' : 'Awaiting supplier response')}
                                    </div>
                                    <div class="award-control-grid">
                                        ${(award.supplierResponses || []).map(row => `
                                            <article>
                                                <strong>${escapeAwardRecommendationHtml(row.action)}</strong>
                                                <span>${escapeAwardRecommendationHtml(row.detail)}</span>
                                                ${renderAwardRecommendationBadge(row.status)}
                                            </article>
                                        `).join('')}
                                    </div>
                                    <div class="evaluation-notice warning">Clarification is allowed only for award and contract preparation. It cannot change the evaluated bid substance.</div>
                                    <div class="award-fallback-panel">
                                        <strong>Supplier decline fallback</strong>
                                        <span>If the winning supplier declines, prepare a recorded fallback decision before restarting approval.</span>
                                        <div class="inline-actions">
                                            <button class="btn btn-secondary" type="button">Award to Next Ranked Bidder: ${escapeAwardRecommendationHtml(nextRankedSupplier)}</button>
                                            <button class="btn btn-secondary" type="button">Cancel Award Process</button>
                                            <button class="btn btn-secondary" type="button">Return to Approval Stage</button>
                                        </div>
                                    </div>
                                </section>

                                <section class="journey-panel ${activeStepIndex === 6 ? 'active' : ''}" id="award-step-documents" data-award-step-panel data-award-step-id="pre-contract-documents">
                                    <div class="panel-heading">
                                        <div><span class="section-kicker">Step 7</span><h2>Pre-Contract Documents</h2></div>
                                        ${renderAwardRecommendationBadge(requiredDocumentsApproved ? 'Documents approved' : 'Documents pending')}
                                    </div>
                                    <div class="data-table evaluation-table-scroll">
                                        <table>
                                            <thead><tr><th>Document</th><th>Required</th><th>Status</th><th>Expiry Date</th><th>Reviewed By</th><th>Action</th></tr></thead>
                                            <tbody>${renderAwardRecommendationRows(requiredDocuments.map(row => [
                                                `<strong>${escapeAwardRecommendationHtml(row.name)}</strong>`,
                                                'Yes',
                                                renderDocumentStatusBadge(row.status),
                                                escapeAwardRecommendationHtml(row.expiryDate || '-'),
                                                escapeAwardRecommendationHtml(row.reviewedBy || '-'),
                                                `<button class="btn btn-secondary btn-sm" type="button">${/pending|missing/i.test(row.status || '') ? 'Upload' : 'View'}</button>`
                                            ]))}</tbody>
                                        </table>
                                    </div>
                                    ${!requiredDocumentsApproved ? '<div class="evaluation-notice warning">Contract blocked: required pre-contract documents are missing, pending, or not approved.</div>' : ''}
                                </section>

                                <section class="journey-panel ${activeStepIndex === 7 ? 'active' : ''}" id="award-step-draft-contract" data-award-step-panel data-award-step-id="draft-contract">
                                    <div class="panel-heading">
                                        <div><span class="section-kicker">Step 8</span><h2>Draft Contract</h2></div>
                                        ${renderAwardRecommendationBadge(blockers.some(item => !item.complete) ? 'Blocked' : 'Ready')}
                                    </div>
                                    <div class="evaluation-notice ${blockers.some(item => !item.complete) ? 'warning' : 'success'}">Contract negotiation opens only after award approval, notice controls, standstill/complaint handling, supplier acceptance, and document approval are satisfied.</div>
                                    <div class="award-blocker-list draft-contract-unlock">
                                        <strong>Contract can be generated only when:</strong>
                                        <ul>${blockers.map(item => renderAwardCheck(item.label, item.complete)).join('')}</ul>
                                    </div>
                                    <div class="award-source-grid">
                                        <article><strong>From tender</strong><span>Title, reference, procurement type, scope, BOQ, and specifications.</span></article>
                                        <article><strong>From award</strong><span>Selected supplier, amount, conditions, award date, and approved reason.</span></article>
                                        <article><strong>From supplier</strong><span>Legal name, registration details, bank details, and authorized signatory.</span></article>
                                        <article><strong>From contract settings</strong><span>Start date, duration, payment terms, security, penalties, and dispute resolution.</span></article>
                                    </div>
                                    <div class="inline-actions">
                                        <button class="btn btn-secondary" type="button" data-award-guard-navigate data-navigate="bid-evaluation">View Evaluation Report</button>
                                        <button class="btn btn-secondary" type="button" data-award-save-exit data-award-step="draft-contract">Save Draft & Exit</button>
                                        <button class="btn btn-primary" type="button" ${blockers.some(item => !item.complete) ? 'disabled aria-disabled="true"' : ''} data-award-save-continue data-award-next-step="draft-contract" data-award-required-action="Generate Draft Contract" data-navigate="contract-negotiation" data-route-search="tab=overview">Generate Draft Contract</button>
                                    </div>
                                </section>

                                <div class="wizard-flow-controls" data-award-flow-controls>
                                    <button class="btn btn-secondary" type="button" data-award-prev>Back</button>
                                    <div class="wizard-flow-progress">
                                        <strong data-award-progress>Step ${activeStepIndex + 1} of ${awardWorkflowSteps.length}</strong>
                                        <span data-award-step-title>${escapeAwardRecommendationHtml(awardWorkflowSteps[activeStepIndex]?.title || awardWorkflowSteps[0].title)}</span>
                                    </div>
                                    <button class="btn btn-primary" type="button" data-award-next>Continue</button>
                                </div>
                            </div>
                            ${renderAwardStatusPanel(statusItems, blockers)}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    `;
}

function initializeAwardRecommendation() {
    const wizard = document.querySelector('[data-award-wizard]');
    const form = document.querySelector('[data-award-validation-form]');
    const button = document.querySelector('[data-award-approval-button]');

    if (wizard && wizard.dataset.ready !== 'true') {
        wizard.dataset.ready = 'true';
        const panels = Array.from(wizard.querySelectorAll('[data-award-step-panel]'));
        const stepButtons = Array.from(wizard.querySelectorAll('[data-award-step-index]'));
        const previousButton = wizard.querySelector('[data-award-prev]');
        const nextButton = wizard.querySelector('[data-award-next]');
        const progressOutput = wizard.querySelector('[data-award-progress]');
        const stepTitleOutput = wizard.querySelector('[data-award-step-title]');
        let activeStepIndex = Number(wizard.dataset.awardActiveStep || 0);

        const setActiveStep = (index) => {
            activeStepIndex = Math.min(Math.max(index, 0), panels.length - 1);
            panels.forEach((panel, panelIndex) => panel.classList.toggle('active', panelIndex === activeStepIndex));
            stepButtons.forEach(step => {
                const stepIndex = Number(step.dataset.awardStepIndex);
                const active = stepIndex === activeStepIndex;
                step.classList.toggle('active', active);
                step.classList.toggle('completed', stepIndex < activeStepIndex);
                step.setAttribute('aria-current', active ? 'step' : 'false');
            });
            if (previousButton) previousButton.disabled = activeStepIndex === 0;
            if (nextButton) nextButton.disabled = activeStepIndex === panels.length - 1;
            if (progressOutput) progressOutput.textContent = `Step ${activeStepIndex + 1} of ${panels.length}`;
            if (stepTitleOutput) stepTitleOutput.textContent = awardWorkflowSteps[activeStepIndex]?.title || '';
            wizard.closest('[data-award-contract-workspace]')?.setAttribute('data-award-current-step', panels[activeStepIndex]?.getAttribute('data-award-step-id') || 'evaluation-result');
        };

        stepButtons.forEach(step => {
            step.addEventListener('click', () => setActiveStep(Number(step.dataset.awardStepIndex)));
        });
        previousButton?.addEventListener('click', () => setActiveStep(activeStepIndex - 1));
        nextButton?.addEventListener('click', () => setActiveStep(activeStepIndex + 1));
        setActiveStep(activeStepIndex);
    }

    if (!form || !button) return;

    const sync = () => {
        const fieldsValid = [...form.querySelectorAll('[data-award-required]')].every(field => String(field.value || '').trim());
        const checksValid = [...document.querySelectorAll('[data-award-required-checkbox]')].every(field => field.checked);
        const valid = fieldsValid && checksValid;
        button.disabled = !valid;
        button.setAttribute('aria-disabled', String(!valid));
        form.classList.toggle('is-valid', valid);
    };

    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', sync);
        field.addEventListener('change', sync);
    });
    sync();
}

if (window.app) {
    window.app.renderAwardRecommendation = renderAwardRecommendation;
}

window.initializeAwardRecommendation = initializeAwardRecommendation;
