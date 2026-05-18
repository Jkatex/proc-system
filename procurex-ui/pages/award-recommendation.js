// Award Recommendation Page Component

function renderAwardRecommendation() {
    const evaluation = mockData.bidEvaluation || {};
    const tender = evaluation.activeTender || {};
    const recommendation = evaluation.recommendation || {};
    const bids = evaluation.bids || [];
    const criteria = evaluation.technicalCriteria || [];
    const technicalTotal = (bid) => criteria.reduce((sum, criterion) => sum + Number(bid.technicalScores?.[criterion.id] || 0), 0);
    const rankedBids = bids.slice().sort((a, b) => (a.financial?.ranking || 99) - (b.financial?.ranking || 99));

    return `
        <div class="main-layout procurement-layout evaluation-app-layout">
            <aside class="sidebar evaluation-sidebar">
                <div class="evaluation-sidebar-head">
                    <h3>Award Recommendation</h3>
                    <span>${escapeEvaluationHtml(tender.reference || 'Evaluation report')}</span>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="bid-evaluation">Back to Evaluation</a></li>
                    <li><a href="#" data-navigate="workspace-dashboard">Workspace Dashboard</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </aside>

            <main class="main-content procurement-content evaluation-workspace">
                <section class="procurement-hero evaluation-hero-panel award-hero-panel">
                    <div>
                        <span class="section-kicker">Recommendation for award</span>
                        <h1>${escapeEvaluationHtml(recommendation.supplier || 'Recommended tenderer')}</h1>
                        <p>${escapeEvaluationHtml(recommendation.reason || '')}</p>
                    </div>
                    <div class="evaluation-hero-stats">
                        <div><strong>${formatEvaluationMoney(recommendation.amount, recommendation.currency)}</strong><span>Recommended amount</span></div>
                        <div><strong>${escapeEvaluationHtml(recommendation.contractDuration || '-')}</strong><span>Contract duration</span></div>
                        <div><strong>${escapeEvaluationHtml(recommendation.decision || 'Draft')}</strong><span>Committee decision</span></div>
                    </div>
                </section>

                <section class="evaluation-top-summary">
                    <div><span>Tender</span><strong>${escapeEvaluationHtml(tender.title || '')}</strong></div>
                    <div><span>Reference</span><strong>${escapeEvaluationHtml(tender.reference || '')}</strong></div>
                    <div><span>Method</span><strong>${escapeEvaluationHtml(recommendation.method || tender.method || '')}</strong></div>
                    <div><span>Status</span>${renderEvaluationStatusBadge(tender.status || 'Recommendation Draft')}</div>
                </section>

                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Top ranked bidders</span>
                            <h2>Final evaluated ranking</h2>
                        </div>
                        ${renderEvaluationStatusBadge(`Recommended: ${recommendation.supplier}`)}
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
                                        <td>${renderEvaluationStatusBadge(String(bid.financial?.ranking || '-'))}</td>
                                        <td>${escapeEvaluationHtml(bid.supplier)}</td>
                                        <td>${escapeEvaluationHtml(bid.preliminaryResult)}</td>
                                        <td>${escapeEvaluationHtml(bid.eligibilityResult)}</td>
                                        <td>${technicalTotal(bid)}%</td>
                                        <td>${formatEvaluationMoney(bid.financial?.correctedPrice, bid.financial?.currency || 'TZS')}</td>
                                        <td>${renderEvaluationStatusBadge(bid.finalResult)}</td>
                                        <td><input type="radio" name="winner" ${bid.supplier === recommendation.supplier ? 'checked' : ''}></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section class="procurement-panel evaluation-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Submission package</span>
                            <h2>Recommendation details</h2>
                        </div>
                        ${renderEvaluationStatusBadge(recommendation.decision || 'Draft')}
                    </div>
                    <div class="evaluation-form-grid recommendation-form">
                        <label>Recommended tenderer <input type="text" class="form-input" value="${escapeEvaluationHtml(recommendation.supplier || '')}"></label>
                        <label>Evaluation method used <input type="text" class="form-input" value="${escapeEvaluationHtml(recommendation.method || '')}"></label>
                        <label>Recommended amount <input type="text" class="form-input" value="${formatEvaluationMoney(recommendation.amount, recommendation.currency)}"></label>
                        <label>Evaluation team decision <input type="text" class="form-input" value="${escapeEvaluationHtml(recommendation.decision || '')}"></label>
                        <label>Evaluation summary <textarea class="form-input" rows="4">${escapeEvaluationHtml(recommendation.summary || '')}</textarea></label>
                        <label>Conditions before award <textarea class="form-input" rows="4">${escapeEvaluationHtml(recommendation.conditions || '')}</textarea></label>
                    </div>
                    <div class="evaluation-notice success">The recommendation package includes the bid opening record, conflict declarations, checklists, score sheet, financial corrections, comparison matrix, approvals, and audit trail.</div>
                    <div class="inline-actions">
                        <button class="btn btn-secondary" type="button">Save Draft</button>
                        <button class="btn btn-secondary" type="button">Preview Report</button>
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
