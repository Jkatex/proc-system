// Award Recommendation Page Component

function escapeAwardRecommendationHtml(value = '') {
    if (typeof escapeEvaluationHtml === 'function') return escapeEvaluationHtml(value);
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatAwardRecommendationMoney(value, currency = 'TZS') {
    if (typeof formatEvaluationMoney === 'function') return formatEvaluationMoney(value, currency);
    const amount = Number(value);
    return Number.isFinite(amount) ? `${currency} ${amount.toLocaleString()}` : escapeAwardRecommendationHtml(value || '-');
}

function renderAwardRecommendationBadge(value = '') {
    if (typeof renderEvaluationStatusBadge === 'function') return renderEvaluationStatusBadge(value);
    return `<span class="badge badge-info">${escapeAwardRecommendationHtml(value)}</span>`;
}

function renderAwardPhaseMap() {
    const phases = [
        ['01', 'Evaluation Report Finalized', 'Buyer confirms the ranked recommendation.'],
        ['02', 'Internal Approval', 'Approving authority reviews the full award package.'],
        ['03', 'Notice of Intention to Award', 'Winning and unsuccessful bidders are notified before final award.'],
        ['04', 'Standstill and Complaints', 'Debrief requests and complaints are tracked before signing.'],
        ['05', 'Supplier Acceptance', 'Winner accepts, asks clarification, or declines.'],
        ['06', 'Final Award Confirmation', 'Final letter of award unlocks contract negotiation.'],
        ['07', 'Contracting', 'Clause definition, negotiation, signatures, and activation.']
    ];

    return `
        <section class="award-workflow-map">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Awarding and contracting workflow</span>
                    <h2>Controlled path from evaluation to signed contract</h2>
                </div>
                ${renderAwardRecommendationBadge(`${phases.length} phases`)}
            </div>
            <div class="award-workflow-grid">
                ${phases.map(([step, title, note]) => `
                    <article>
                        <strong>${step}</strong>
                        <span>${escapeAwardRecommendationHtml(title)}</span>
                        <em>${escapeAwardRecommendationHtml(note)}</em>
                    </article>
                `).join('')}
            </div>
        </section>
    `;
}

function renderAwardRecommendation() {
    const evaluation = mockData.bidEvaluation || {};
    const tender = evaluation.activeTender || {};
    const recommendation = evaluation.recommendation || {};
    const bids = evaluation.bids || [];
    const criteria = (evaluation.technicalCriteria || []).filter(criterion => !/financial|price/i.test(String(criterion.name || criterion.label || '')));
    const technicalTotal = (bid) => criteria.reduce((sum, criterion) => sum + Number(bid.technicalScores?.[criterion.id] || 0), 0);
    const rankedBids = bids.slice().sort((a, b) => (a.financial?.ranking || 99) - (b.financial?.ranking || 99));
    const winner = rankedBids.find(bid => bid.supplier === recommendation.supplier) || rankedBids[0] || {};
    const standstillDays = recommendation.standstillDays || 14;
    const approvalSteps = [
        ['Recommendation submitted', 'Buyer submits the signed recommendation package.', 'Complete'],
        ['Approving authority review', 'Accounting Officer / Tender Board reviews evaluation report, comparison matrix, corrections, and audit trail.', 'Pending approval'],
        ['Decision', 'Approve, return for clarification, or reject the recommendation.', recommendation.decision || 'Draft'],
        ['Conditions noted', recommendation.conditions || 'No additional conditions recorded.', recommendation.conditions ? 'Conditioned' : 'Pending']
    ];
    const notificationRows = [
        ['Notice of Intention to Award', recommendation.supplier || winner.supplier || '-', `Recommended amount: ${formatAwardRecommendationMoney(recommendation.amount || winner.financial?.correctedPrice, recommendation.currency || winner.financial?.currency || 'TZS')}`],
        ['Unsuccessful Bidder Notice', `${Math.max(0, bids.length - 1)} bidders`, 'Includes ranking outcome, debrief option, and standstill period.'],
        ['Standstill Period', 'All bidders', `${standstillDays} days before final award confirmation and contract signing.`]
    ];
    const complaintRows = [
        ['Debrief request', 'Available during standstill', 'Procurement officer records response and date.'],
        ['Complaint submitted', 'Pauses award progression', 'Cannot proceed to final award until resolved.'],
        ['Complaint resolved', 'Standstill resumes or closes', 'Resolution attached to award audit trail.']
    ];
    const acceptanceRows = [
        ['Accept award and proceed to contract', 'Unlocks contract clause definition and negotiation.', 'Primary path'],
        ['Request clarification', 'Buyer responds without changing evaluation result or bid substance.', 'Allowed'],
        ['Decline award', 'System escalates next ranked responsive bidder for approval.', 'Controlled fallback']
    ];

    return `
        <div class="main-layout procurement-layout evaluation-app-layout award-page">
            <aside class="sidebar evaluation-sidebar">
                <div class="evaluation-sidebar-head">
                    <h3>Award Recommendation</h3>
                    <span>${escapeAwardRecommendationHtml(tender.reference || 'Evaluation report')}</span>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="bid-evaluation">Back to Evaluation</a></li>
                    <li><a href="#" data-navigate="contract-negotiation">Contract Negotiation</a></li>
                    <li><a href="#" data-navigate="workspace-dashboard">Workspace Dashboard</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </aside>

            <main class="main-content procurement-content evaluation-workspace">
                <section class="procurement-hero evaluation-hero-panel award-hero-panel">
                    <div>
                        <span class="section-kicker">Award recommendation package</span>
                        <h1>${escapeAwardRecommendationHtml(recommendation.supplier || winner.supplier || 'Recommended tenderer')}</h1>
                        <p>${escapeAwardRecommendationHtml(recommendation.reason || 'Recommendation is compiled from the finalized evaluation report, ranking table, corrections, and audit trail.')}</p>
                    </div>
                    <div class="evaluation-hero-stats">
                        <div><strong>${formatAwardRecommendationMoney(recommendation.amount || winner.financial?.correctedPrice, recommendation.currency || winner.financial?.currency || 'TZS')}</strong><span>Recommended amount</span></div>
                        <div><strong>${escapeAwardRecommendationHtml(recommendation.contractDuration || '-')}</strong><span>Contract duration</span></div>
                        <div><strong>${escapeAwardRecommendationHtml(recommendation.decision || 'Draft')}</strong><span>Buyer decision</span></div>
                    </div>
                </section>

                <section class="evaluation-top-summary">
                    <div><span>Tender</span><strong>${escapeAwardRecommendationHtml(tender.title || '')}</strong></div>
                    <div><span>Reference</span><strong>${escapeAwardRecommendationHtml(tender.reference || '')}</strong></div>
                    <div><span>Method</span><strong>${escapeAwardRecommendationHtml(recommendation.method || tender.method || '')}</strong></div>
                    <div><span>Status</span>${renderAwardRecommendationBadge(tender.status || 'Recommendation Draft')}</div>
                    <div><span>Standstill</span><strong>${standstillDays} days</strong></div>
                </section>

                ${renderAwardPhaseMap()}

                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Recommendation package</span>
                            <h2>Evidence file ready for approving authority</h2>
                        </div>
                    </div>
                    <div class="award-package-grid">
                        ${[
                            ['Bid opening record', 'Opening time, envelope, deadline compliance, submitted documents.'],
                            ['Conflict declaration', 'Buyer conflict declaration and management decision.'],
                            ['Preliminary and eligibility checks', 'Administrative and legal responsiveness.'],
                            ['Technical score sheet', 'Criterion-by-criterion scores for each bidder.'],
                            ['Financial corrections', 'Corrected prices and arithmetic correction notes.'],
                            ['Comparison matrix', 'Side-by-side ranking and risk signals.'],
                            ['Audit trail', 'Timestamped system and buyer actions.']
                        ].map(([title, note]) => `
                            <article>
                                <strong>${escapeAwardRecommendationHtml(title)}</strong>
                                <span>${escapeAwardRecommendationHtml(note)}</span>
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
                        ${renderAwardRecommendationBadge(`Recommended: ${recommendation.supplier || winner.supplier || '-'}`)}
                    </div>
                    <div class="data-table evaluation-table-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Supplier</th>
                                    <th>Preliminary</th>
                                    <th>Eligibility</th>
                                    <th>Technical score</th>
                                    <th>Corrected price</th>
                                    <th>Final result</th>
                                    <th>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rankedBids.map(bid => `
                                    <tr>
                                        <td>${renderAwardRecommendationBadge(String(bid.financial?.ranking || '-'))}</td>
                                        <td>${escapeAwardRecommendationHtml(bid.supplier)}</td>
                                        <td>${escapeAwardRecommendationHtml(bid.preliminaryResult)}</td>
                                        <td>${escapeAwardRecommendationHtml(bid.eligibilityResult)}</td>
                                        <td>${technicalTotal(bid)}%</td>
                                        <td>${formatAwardRecommendationMoney(bid.financial?.correctedPrice, bid.financial?.currency || 'TZS')}</td>
                                        <td>${renderAwardRecommendationBadge(bid.finalResult)}</td>
                                        <td><input type="radio" name="winner" ${bid.supplier === (recommendation.supplier || winner.supplier) ? 'checked' : ''}></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Internal approval</span>
                            <h2>Pre-contract authority review</h2>
                        </div>
                        ${renderAwardRecommendationBadge('Pre-contract')}
                    </div>
                    <div class="award-control-grid">
                        ${approvalSteps.map(([title, note, status]) => `
                            <article>
                                <strong>${escapeAwardRecommendationHtml(title)}</strong>
                                <span>${escapeAwardRecommendationHtml(note)}</span>
                            </article>
                        `).join('')}
                    </div>
                </section>

                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Notifications and standstill</span>
                            <h2>Notice of intention before final award</h2>
                        </div>
                        ${renderAwardRecommendationBadge('Standstill controlled')}
                    </div>
                    <div class="data-table evaluation-table-scroll">
                        <table>
                            <thead><tr><th>Notice</th><th>Recipient</th><th>Content</th></tr></thead>
                            <tbody>
                                ${notificationRows.map(row => `<tr>${row.map(cell => `<td>${escapeAwardRecommendationHtml(cell)}</td>`).join('')}</tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="award-control-grid">
                        ${complaintRows.map(([title, note, status]) => `
                            <article>
                                <strong>${escapeAwardRecommendationHtml(title)}</strong>
                                <span>${escapeAwardRecommendationHtml(note)}</span>
                            </article>
                        `).join('')}
                    </div>
                </section>

                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Supplier award acceptance</span>
                            <h2>Winner confirms willingness to proceed</h2>
                        </div>
                    </div>
                    <div class="award-control-grid">
                        ${acceptanceRows.map(([title, note, status]) => `
                            <article>
                                <strong>${escapeAwardRecommendationHtml(title)}</strong>
                                <span>${escapeAwardRecommendationHtml(note)}</span>
                            </article>
                        `).join('')}
                    </div>
                    <div class="evaluation-notice warning">Contract negotiation opens only after internal approval, standstill requirements, complaint handling, and supplier acceptance are satisfied.</div>
                </section>

                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Submission controls</span>
                            <h2>Recommendation details and actions</h2>
                        </div>
                    </div>
                    <div class="evaluation-form-grid recommendation-form">
                        <label>Recommended tenderer <input type="text" class="form-input" value="${escapeAwardRecommendationHtml(recommendation.supplier || winner.supplier || '')}"></label>
                        <label>Evaluation method used <input type="text" class="form-input" value="${escapeAwardRecommendationHtml(recommendation.method || '')}"></label>
                        <label>Recommended amount <input type="text" class="form-input" value="${formatAwardRecommendationMoney(recommendation.amount || winner.financial?.correctedPrice, recommendation.currency || winner.financial?.currency || 'TZS')}"></label>
                        <label>Approving authority decision <input type="text" class="form-input" value="${escapeAwardRecommendationHtml(recommendation.decision || '')}"></label>
                        <label>Evaluation summary <textarea class="form-input" rows="4">${escapeAwardRecommendationHtml(recommendation.summary || '')}</textarea></label>
                        <label>Conditions before award <textarea class="form-input" rows="4">${escapeAwardRecommendationHtml(recommendation.conditions || '')}</textarea></label>
                    </div>
                    <div class="inline-actions">
                        <button class="btn btn-secondary" type="button">Save Draft</button>
                        <button class="btn btn-secondary" type="button" data-navigate="bid-evaluation">Preview Evaluation Report</button>
                        <button class="btn btn-secondary" type="button" data-navigate="bid-evaluation">Return for Review</button>
                        <button class="btn btn-primary" type="button" data-navigate="contract-negotiation">Submit Recommendation</button>
                    </div>
                </section>
            </main>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderAwardRecommendation = renderAwardRecommendation;
}
