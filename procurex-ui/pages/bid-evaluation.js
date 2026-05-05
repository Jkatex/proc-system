// Bid Evaluation Page Component

function renderBidEvaluation() {
    const evaluation = mockData.bidEvaluation;

    return `
        <div class="main-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Bid Evaluation</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Construction of Rural Health Centers</div>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="buyer-dashboard">← Back to Dashboard</a></li>
                    <li><a href="#" data-navigate="coming-soon">Evaluation</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <!-- KPI Row -->
                <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); margin-bottom: 24px;">
                    <div class="kpi-card">
                        <div class="kpi-value">${evaluation.totalBids}</div>
                        <div class="kpi-label">TOTAL BIDS</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${evaluation.validSubmissions}</div>
                        <div class="kpi-label">VALID SUBMISSIONS</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${evaluation.priceOutliers}</div>
                        <div class="kpi-label">PRICE OUTLIERS</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${evaluation.evaluatorsActive}</div>
                        <div class="kpi-label">EVALUATORS ACTIVE</div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="tabs">
                    <div class="tab active" data-tab="scoring">Evaluation Scoring</div>
                    <div class="tab" data-tab="benchmarking">Price Benchmarking</div>
                    <div class="tab" data-tab="opening">Opening Report</div>
                </div>

                <!-- Tab Content -->
                <div class="tab-content" data-tab="scoring" style="display: block;">
                    <div class="evaluation-matrix">
                        <h3 style="margin-bottom: 20px;">Bid Comparison Matrix</h3>

                        <div class="data-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Supplier</th>
                                        <th>Technical Score</th>
                                        <th>Financial Score</th>
                                        <th>Total Score</th>
                                        <th>Price (TZS)</th>
                                        <th>Integrity Hash</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${evaluation.bids.map(bid => `
                                        <tr>
                                            <td>${bid.supplier}</td>
                                            <td>${bid.technicalScore}%</td>
                                            <td>${bid.financialScore}%</td>
                                            <td style="font-weight: 600;">${bid.totalScore}%</td>
                                            <td>${bid.price.toLocaleString()}</td>
                                            <td style="font-family: monospace; font-size: 12px;">${bid.integrityHash.substring(0, 10)}...</td>
                                            <td><span class="badge badge-success">Valid</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Independent Evaluation -->
                    <div class="scoring-form">
                        <h3 style="margin-bottom: 20px;">Independent Evaluation Scoring</h3>

                        <div style="margin-bottom: 24px;">
                            <h4 style="margin-bottom: 16px;">Technical Evaluation Criteria</h4>
                            <div style="space-y: 16px;">
                                <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 16px; align-items: center;">
                                    <div>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Relevant Experience (25%)</div>
                                        <div style="font-size: 14px; color: var(--text-secondary);">Experience with similar healthcare projects</div>
                                    </div>
                                    <input type="number" min="0" max="25" class="form-input" style="width: 80px;">
                                    <span>/25</span>
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 16px; align-items: center;">
                                    <div>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Technical Capability (30%)</div>
                                        <div style="font-size: 14px; color: var(--text-secondary);">Equipment, technology, and expertise</div>
                                    </div>
                                    <input type="number" min="0" max="30" class="form-input" style="width: 80px;">
                                    <span>/30</span>
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 16px; align-items: center;">
                                    <div>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Project Team (20%)</div>
                                        <div style="font-size: 14px; color: var(--text-secondary);">Qualification and experience of team members</div>
                                    </div>
                                    <input type="number" min="0" max="20" class="form-input" style="width: 80px;">
                                    <span>/20</span>
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 16px; align-items: center;">
                                    <div>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Methodology (25%)</div>
                                        <div style="font-size: 14px; color: var(--text-secondary);">Approach and work plan quality</div>
                                    </div>
                                    <input type="number" min="0" max="25" class="form-input" style="width: 80px;">
                                    <span>/25</span>
                                </div>
                            </div>
                        </div>

                        <div style="margin-bottom: 24px;">
                            <h4 style="margin-bottom: 16px;">Financial Evaluation</h4>
                            <div style="display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center;">
                                <div>
                                    <div style="font-weight: 500; margin-bottom: 4px;">Price Competitiveness</div>
                                    <div style="font-size: 14px; color: var(--text-secondary);">Reasonableness of proposed pricing</div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <input type="number" min="0" max="100" class="form-input" style="width: 80px;">
                                    <span>/100</span>
                                </div>
                            </div>
                        </div>

                        <div style="margin-bottom: 24px;">
                            <h4 style="margin-bottom: 16px;">Comments & Recommendations</h4>
                            <textarea class="form-input" rows="4" placeholder="Provide detailed evaluation comments and recommendations..."></textarea>
                        </div>

                        <div style="display: flex; gap: 12px;">
                            <button class="btn btn-primary">Save Evaluation</button>
                            <button class="btn btn-secondary">Disqualify Bid</button>
                        </div>
                    </div>

                    <!-- Discrepancy Warning -->
                    <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin-top: 24px;">
                        <div style="display: flex; align-items: start; gap: 12px;">
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20" style="color: #d97706; flex-shrink: 0;">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            <div>
                                <h4 style="color: #92400e; margin-bottom: 4px;">Evaluation Discrepancy Detected</h4>
                                <p style="color: #92400e; font-size: 14px;">
                                    There is a 15% variance between evaluator scores for ABC Construction Ltd's technical proposal.
                                    Please review and reconcile before proceeding to award recommendation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tab-content" data-tab="benchmarking" style="display: none;">
                    <div class="card">
                        <h3 style="margin-bottom: 16px;">Price Benchmarking Analysis</h3>
                        <p>Price benchmarking analysis would be displayed here.</p>
                    </div>
                </div>

                <div class="tab-content" data-tab="opening" style="display: none;">
                    <div class="card">
                        <h3 style="margin-bottom: 16px;">Bid Opening Report</h3>
                        <p>Bid opening report would be displayed here.</p>
                    </div>
                </div>

                <!-- Attached Documents -->
                <div class="card" style="margin-top: 24px;">
                    <h3 style="margin-bottom: 16px;">Attached Documents</h3>
                    <div style="space-y: 12px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid var(--border); border-radius: 6px;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <div>
                                    <div style="font-weight: 500;">Technical Proposal - ABC Construction.pdf</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Uploaded 2 hours ago • 5.2 MB</div>
                                </div>
                            </div>
                            <button class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;">Download</button>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid var(--border); border-radius: 6px;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <div>
                                    <div style="font-weight: 500;">Financial Proposal - ABC Construction.pdf</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Uploaded 2 hours ago • 2.1 MB</div>
                                </div>
                            </div>
                            <button class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;">Download</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderBidEvaluation = renderBidEvaluation;
}