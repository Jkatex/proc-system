// Buyer-side award workflow after evaluation completion.

function escapeAwardRecommendationHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatAwardRecommendationMoney(value, currency = 'TZS') {
    const amount = Number(value || 0);
    return Number.isFinite(amount) ? `${currency} ${amount.toLocaleString()}` : escapeAwardRecommendationHtml(value || '-');
}

function renderAwardRecommendationBadge(value = '') {
    if (typeof renderEvaluationStatusBadge === 'function') return renderEvaluationStatusBadge(value);
    return `<span class="badge badge-info">${escapeAwardRecommendationHtml(value)}</span>`;
}

function renderAwardRecommendationRows(rows = []) {
    return rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
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
            status: draft.awardDecision?.approvalConfirmed ? 'Approved' : lifecycle.award?.approval?.status
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

    const phaseRows = [
        ['Evaluation Completed', 'Buyer reviews finalized ranking and responsiveness.', 'Complete'],
        ['Award Decision', 'Buyer confirms selected supplier, award value, reason, and conditions.', award.awardStatus || 'Pending'],
        ['Internal Approval', 'Authorized representative digitally confirms award decision.', award.approval?.status || 'Pending'],
        ['Notice of Intention', 'Winning and unsuccessful bidders receive controlled notice.', 'Sent'],
        ['Supplier Acceptance', 'Winner accepts, declines, or requests clarification.', award.awardStatus || 'Awaiting Response'],
        ['Draft Contract', 'Contract generation opens only after supplier acceptance.', 'Next']
    ];

    return `
        <div class="main-layout procurement-layout evaluation-app-layout award-page" data-award-contract-workspace data-award-current-step="${escapeAwardRecommendationHtml(draft.currentStep || 'award-decision')}" data-award-tender-id="${escapeAwardRecommendationHtml(draft.tenderId || tender.id || '')}">
            <aside class="sidebar evaluation-sidebar">
                <div class="evaluation-sidebar-head">
                    <h3>Award Decision</h3>
                    <span>${escapeAwardRecommendationHtml(award.reference || 'Evaluation report')}</span>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-award-guard-navigate data-navigate="awarding-contracts">Awarding Dashboard</a></li>
                    <li><a href="#" data-award-guard-navigate data-navigate="bid-evaluation">Back to Evaluation</a></li>
                    <li><a href="#" data-award-guard-navigate data-navigate="contract-negotiation">Contract Workspace</a></li>
                    <li><a href="#" data-award-guard-navigate data-navigate="workspace-dashboard">Workspace Dashboard</a></li>
                    <li><a href="#" data-award-guard-navigate data-navigate="welcome">Logout</a></li>
                </ul>
            </aside>

            <main class="main-content procurement-content evaluation-workspace">
                <section class="procurement-hero evaluation-hero-panel award-hero-panel">
                    <div>
                        <span class="section-kicker">Buyer / awarder path</span>
                        <h1>${escapeAwardRecommendationHtml(selectedSupplier)}</h1>
                        <p>${escapeAwardRecommendationHtml(award.reason || 'Award package is compiled from the finalized evaluation report, ranking table, corrections, conditions, and audit trail.')}</p>
                    </div>
                    <div class="evaluation-hero-stats">
                        <div><strong>${formatAwardRecommendationMoney(award.awardAmount || recommendation.amount, award.currency || recommendation.currency || 'TZS')}</strong><span>Award amount</span></div>
                        <div><strong>${escapeAwardRecommendationHtml(award.procurementType || 'Tender')}</strong><span>Procurement type</span></div>
                        <div><strong>${escapeAwardRecommendationHtml(award.awardStatus || 'Pending')}</strong><span>Award status</span></div>
                    </div>
                </section>

                <section class="evaluation-top-summary">
                    <div><span>Tender</span><strong>${escapeAwardRecommendationHtml(award.tenderTitle || '')}</strong></div>
                    <div><span>Reference</span><strong>${escapeAwardRecommendationHtml(award.reference || '')}</strong></div>
                    <div><span>Buyer</span><strong>${escapeAwardRecommendationHtml(award.buyer || '')}</strong></div>
                    <div><span>Evaluation</span>${renderAwardRecommendationBadge(award.evaluationStatus || 'Completed')}</div>
                    <div><span>Supplier</span><strong>${escapeAwardRecommendationHtml(selectedSupplier)}</strong></div>
                </section>

                <section class="procurement-panel evaluation-panel award-draft-control-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Resumable workspace</span>
                            <h2>Save this tender and return to the start page any time</h2>
                        </div>
                        ${renderAwardRecommendationBadge(draft.draftSaved ? 'Draft saved' : 'Unsaved draft')}
                    </div>
                    <div class="award-control-grid">
                        <article><strong>Current step</strong><span>${escapeAwardRecommendationHtml(draft.currentStep || 'evaluation-result')}</span></article>
                        <article><strong>Required action</strong><span>${escapeAwardRecommendationHtml(draft.requiredAction || 'Continue Award')}</span></article>
                        <article><strong>Last edited</strong><span>${escapeAwardRecommendationHtml(draft.lastEditedAt ? new Date(draft.lastEditedAt).toLocaleString() : 'Not saved')}</span></article>
                    </div>
                    <div class="inline-actions">
                        <button class="btn btn-secondary" type="button" data-award-save-draft data-award-step="award-decision">Save Draft</button>
                        <button class="btn btn-secondary" type="button" data-award-save-exit data-award-step="award-decision">Save Draft & Exit</button>
                        <button class="btn btn-secondary" type="button" data-award-guard-navigate data-navigate="awarding-contracts">Open Another Tender</button>
                    </div>
                </section>

                <section class="award-workflow-map">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Awarding controls</span>
                            <h2>Evaluation result to accepted award</h2>
                        </div>
                        ${renderAwardRecommendationBadge('Pre-contract')}
                    </div>
                    <div class="award-workflow-grid">
                        ${phaseRows.map(([title, note, status], index) => `
                            <article>
                                <strong>${String(index + 1).padStart(2, '0')}</strong>
                                <span>${escapeAwardRecommendationHtml(title)}</span>
                                <em>${escapeAwardRecommendationHtml(note)} ${escapeAwardRecommendationHtml(status)}</em>
                            </article>
                        `).join('')}
                    </div>
                </section>

                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Final ranked bidders</span>
                            <h2>Buyer confirms the recommended winner</h2>
                        </div>
                        ${renderAwardRecommendationBadge(`Recommended: ${selectedSupplier}`)}
                    </div>
                    <div class="data-table evaluation-table-scroll">
                        <table>
                            <thead>
                                <tr><th>Rank</th><th>Supplier</th><th>Preliminary</th><th>Eligibility</th><th>Technical</th><th>Corrected Price</th><th>Final Result</th><th>Decision</th></tr>
                            </thead>
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
                </section>

                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Award approval</span>
                            <h2>Authorized representative confirmation</h2>
                        </div>
                        ${renderAwardRecommendationBadge(award.approval?.status || 'Pending')}
                    </div>
                    <div class="award-control-grid">
                        <article><strong>Selected supplier</strong><span>${escapeAwardRecommendationHtml(selectedSupplier)}</span></article>
                        <article><strong>Award value</strong><span>${formatAwardRecommendationMoney(award.awardAmount, award.currency)}</span></article>
                        <article><strong>Approver</strong><span>${escapeAwardRecommendationHtml(award.approval?.approver || 'Authorized representative')}</span></article>
                        <article><strong>Approval date</strong><span>${escapeAwardRecommendationHtml(award.approval?.date || 'Pending')}</span></article>
                    </div>
                    <div class="evaluation-form-grid recommendation-form">
                        <label>Selected supplier <input class="form-input" data-award-draft-field="awardDecision.selectedSupplier" value="${escapeAwardRecommendationHtml(selectedSupplier)}"></label>
                        <label>Award amount <input class="form-input" type="number" data-award-draft-field="awardDecision.awardAmount" value="${escapeAwardRecommendationHtml(award.awardAmount || '')}"></label>
                        <label>Currency <input class="form-input" data-award-draft-field="awardDecision.currency" value="${escapeAwardRecommendationHtml(award.currency || 'TZS')}"></label>
                        <label>Award decision date <input class="form-input" type="date" data-award-draft-field="awardDecision.awardDate" value="${escapeAwardRecommendationHtml(draft.awardDecision?.awardDate || '')}"></label>
                        <label>Award reason <textarea class="form-input" rows="4" data-award-draft-field="awardDecision.reason">${escapeAwardRecommendationHtml(award.reason || '')}</textarea></label>
                        <label>Award conditions <textarea class="form-input" rows="4" data-award-draft-field="awardDecision.conditions">${escapeAwardRecommendationHtml(draft.awardDecision?.conditions || '')}</textarea></label>
                        <label>Negotiation required <select class="form-input" data-award-draft-field="awardDecision.negotiationRequired"><option ${draft.awardDecision?.negotiationRequired === 'Yes' ? 'selected' : ''}>Yes</option><option ${draft.awardDecision?.negotiationRequired === 'No' ? 'selected' : ''}>No</option></select></label>
                        <label>Authorized representative <input class="form-input" data-award-draft-field="awardDecision.approver" value="${escapeAwardRecommendationHtml(award.approval?.approver || '')}"></label>
                        <label class="confirm-inline"><input type="checkbox" data-award-draft-field="awardDecision.approvalConfirmed" ${draft.awardDecision?.approvalConfirmed ? 'checked' : ''}> I confirm that this award decision is based on the approved evaluation results.</label>
                    </div>
                    <div class="evaluation-notice success">${escapeAwardRecommendationHtml(award.approval?.note || 'Approval record will be stored in the award audit trail.')}</div>
                    <div class="inline-actions">
                        <button class="btn btn-secondary" type="button" data-award-save-draft data-award-step="award-decision">Save Draft</button>
                        <button class="btn btn-primary" type="button" data-award-save-continue data-award-next-step="award-notification" data-award-required-action="Send Award Notification">Approve Award Decision</button>
                    </div>
                </section>

                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Notices and supplier response</span>
                            <h2>Notification before contracting</h2>
                        </div>
                        ${renderAwardRecommendationBadge('Awaiting supplier acceptance')}
                    </div>
                    <div class="data-table evaluation-table-scroll">
                        <table>
                            <thead><tr><th>Notice</th><th>Recipient</th><th>Status</th><th>Deadline</th></tr></thead>
                            <tbody>
                                ${renderAwardRecommendationRows((award.notices || []).map(row => [
                                    escapeAwardRecommendationHtml(row.type),
                                    escapeAwardRecommendationHtml(row.recipient),
                                    renderAwardRecommendationBadge(row.status),
                                    escapeAwardRecommendationHtml(row.deadline)
                                ]))}
                            </tbody>
                        </table>
                    </div>
                    <div class="evaluation-form-grid recommendation-form">
                        <label>Notification subject <input class="form-input" data-award-draft-field="notification.subject" value="${escapeAwardRecommendationHtml(draft.notification?.subject || '')}"></label>
                        <label>Response deadline <input class="form-input" type="date" data-award-draft-field="notification.responseDeadline" value="${escapeAwardRecommendationHtml(draft.notification?.responseDeadline || '')}"></label>
                        <label>Notify unsuccessful bidders <select class="form-input" data-award-draft-field="notification.notifyUnsuccessful"><option ${draft.notification?.notifyUnsuccessful === 'Yes' ? 'selected' : ''}>Yes</option><option ${draft.notification?.notifyUnsuccessful === 'No' ? 'selected' : ''}>No</option></select></label>
                        <label>Message to awarded supplier <textarea class="form-input" rows="4" data-award-draft-field="notification.message">${escapeAwardRecommendationHtml(draft.notification?.message || '')}</textarea></label>
                    </div>
                    <div class="award-control-grid">
                        ${(draft.documents || []).map(document => `
                            <article>
                                <strong>${escapeAwardRecommendationHtml(document.name)}</strong>
                                <span>${escapeAwardRecommendationHtml(document.type)}</span>
                                ${renderAwardRecommendationBadge(document.status)}
                            </article>
                        `).join('')}
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
                    <div class="inline-actions">
                        <button class="btn btn-secondary" type="button" data-award-save-draft data-award-step="award-notification">Save Draft</button>
                        <button class="btn btn-primary" type="button" data-award-save-continue data-award-next-step="supplier-acceptance" data-award-required-action="Await Supplier Acceptance">Send Award Notification</button>
                    </div>
                </section>

                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Contract unlock rule</span>
                            <h2>Awarding chooses the winner, contracting agrees the final terms</h2>
                        </div>
                    </div>
                    <div class="evaluation-notice warning">Contract negotiation opens only after award approval, notice controls, complaint handling, and supplier acceptance are satisfied.</div>
                    <div class="inline-actions">
                        <button class="btn btn-secondary" type="button" data-award-save-exit data-award-step="supplier-acceptance">Save Draft & Exit</button>
                        <button class="btn btn-secondary" type="button" data-award-guard-navigate data-navigate="bid-evaluation">Preview Evaluation Report</button>
                        <button class="btn btn-primary" type="button" data-award-save-continue data-award-next-step="draft-contract" data-award-required-action="Generate Draft Contract" data-navigate="contract-negotiation">Generate Draft Contract</button>
                    </div>
                </section>
            </main>
        </div>
    `;
}

if (window.app) {
    window.app.renderAwardRecommendation = renderAwardRecommendation;
}
