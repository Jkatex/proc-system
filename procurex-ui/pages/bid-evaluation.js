// Bid Evaluation Page Component

function renderBidEvaluation() {
    const evaluation = mockData.bidEvaluation;
    const benchmark = evaluation.benchmark;
    const opening = evaluation.openingReport;
    const signalClass = {
        Clear: 'success',
        Watch: 'warning',
        Escalate: 'error'
    };

    return `
        <div class="main-layout">
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Bid Evaluation</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Construction of Rural Health Centers</div>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="procurement-dashboard">Procurement Dashboard</a></li>
                    <li><a href="#" data-navigate="bid-evaluation" class="active">Evaluation</a></li>
                    <li><a href="#" data-navigate="award-recommendation">Award Recommendation</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <div class="main-content">
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

                <div class="tabs">
                    <div class="tab active" data-tab="scoring">Evaluation Scoring</div>
                    <div class="tab" data-tab="benchmarking">Price Benchmarking</div>
                    <div class="tab" data-tab="opening">Opening Report</div>
                    <div class="tab" data-tab="risk">Risk & Compliance</div>
                </div>

                <div class="tab-content" data-tab="scoring" style="display: block;">
                    <div class="journey-grid two-col">
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Logic 8 evaluation framework</span>
                                    <h2>Bid Comparison Matrix</h2>
                                </div>
                                <span class="badge badge-success">Criteria locked</span>
                            </div>
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

                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Independent scoring</span>
                                    <h2>Evaluator Workspace</h2>
                                </div>
                                <span class="badge badge-warning">Variance review</span>
                            </div>
                            <div class="criteria-grid">
                                ${[
                                    ['Relevant Experience', 25, 'Experience with similar healthcare projects'],
                                    ['Technical Capability', 30, 'Equipment, technology, and expertise'],
                                    ['Project Team', 20, 'Qualification and experience of team members'],
                                    ['Methodology', 25, 'Approach and work plan quality']
                                ].map(item => `
                                    <div class="criterion-row">
                                        <div><strong>${item[0]} (${item[1]}%)</strong><span>${item[2]}</span></div>
                                        <input type="number" min="0" max="${item[1]}" class="form-input" value="${Math.round(item[1] * 0.86)}">
                                        <span>/${item[1]}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="form-group" style="margin-top: 18px;">
                                <label class="form-label">Comments & Recommendations</label>
                                <textarea class="form-input" rows="4" placeholder="Provide detailed evaluation comments and recommendations..."></textarea>
                            </div>
                            <div class="inline-actions">
                                <button class="btn btn-primary">Save Evaluation</button>
                                <button class="btn btn-secondary">Disqualify Bid</button>
                                <button class="btn btn-secondary" data-navigate="award-recommendation">Continue to Award</button>
                            </div>
                        </div>
                    </div>

                    <div class="risk-item warning" style="margin-top: 24px;">
                        <strong>Evaluation Discrepancy Detected</strong>
                        <span>There is a 15% variance between evaluator scores for ABC Construction Ltd's technical proposal. Reconcile before award recommendation.</span>
                        <button class="btn btn-secondary">Open Consensus</button>
                    </div>
                </div>

                <div class="tab-content" data-tab="benchmarking" style="display: none;">
                    <div class="journey-grid two-col">
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Logic 9 and Logic 26</span>
                                    <h2>Price Benchmarking Analysis</h2>
                                </div>
                                <span class="badge badge-success">No outliers</span>
                            </div>
                            <div class="metric-grid">
                                <div><span>Buyer estimate</span><strong>TZS ${benchmark.buyerEstimate.toLocaleString()}</strong></div>
                                <div><span>Market median</span><strong>TZS ${benchmark.marketMedian.toLocaleString()}</strong></div>
                                <div><span>CEC winner</span><strong>TZS ${benchmark.comparableEconomicCost.toLocaleString()}</strong></div>
                                <div><span>Variance band</span><strong>${benchmark.varianceBand}</strong></div>
                            </div>
                            <div class="risk-list">
                                ${benchmark.notes.map(note => `
                                    <div class="risk-item success"><strong>Benchmark note</strong><span>${note}</span></div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Comparable economic cost</span>
                                    <h2>Regional Normalization</h2>
                                </div>
                                <span class="badge badge-info">${benchmark.regionalAdjustment}</span>
                            </div>
                            <div class="data-table">
                                <table>
                                    <thead><tr><th>Supplier</th><th>Raw Price</th><th>Adjustment</th><th>CEC</th><th>Flag</th></tr></thead>
                                    <tbody>
                                        ${evaluation.bids.map((bid, index) => {
                                            const adjustment = [28000000, 34000000, 31000000, 30000000][index];
                                            const cec = bid.price + adjustment;
                                            return `
                                                <tr>
                                                    <td>${bid.supplier}</td>
                                                    <td>TZS ${bid.price.toLocaleString()}</td>
                                                    <td>TZS ${adjustment.toLocaleString()}</td>
                                                    <td>TZS ${cec.toLocaleString()}</td>
                                                    <td><span class="badge badge-success">In band</span></td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tab-content" data-tab="opening" style="display: none;">
                    <div class="journey-grid two-col">
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Logic 7 controlled disclosure</span>
                                    <h2>Bid Opening Report</h2>
                                </div>
                                <span class="badge badge-success">${opening.hashStatus}</span>
                            </div>
                            <div class="record-summary">
                                <div><span>Opening time</span><strong>${opening.openingTime}</strong></div>
                                <div><span>Envelope opened</span><strong>${opening.envelope}</strong></div>
                                <div><span>Audit reference</span><strong>${opening.auditReference}</strong></div>
                            </div>
                        </div>
                        <div class="journey-panel">
                            <span class="section-kicker">Disclosure control</span>
                            <h2>Envelope State</h2>
                            <div class="status-pipeline">
                                <div class="done"><strong>Submission lock</strong><span>All bids sealed before deadline</span></div>
                                <div class="done"><strong>Hash verification</strong><span>${opening.hashStatus}</span></div>
                                <div class="current"><strong>Technical evaluation</strong><span>Evaluator scoring in progress</span></div>
                                <div><strong>Financial opening</strong><span>${opening.disclosureStatus}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tab-content" data-tab="risk" style="display: none;">
                    <div class="journey-grid two-col">
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Logic 16 and Logic 27</span>
                                    <h2>Risk Forecast by Supplier</h2>
                                </div>
                                <span class="badge badge-info">Explainable score</span>
                            </div>
                            <div class="data-table">
                                <table>
                                    <thead><tr><th>Supplier</th><th>Risk</th><th>Score</th><th>Primary Driver</th></tr></thead>
                                    <tbody>
                                        ${evaluation.riskSignals.map(signal => `
                                            <tr>
                                                <td>${signal.supplier}</td>
                                                <td><span class="badge badge-${signal.risk === 'Low' ? 'success' : 'warning'}">${signal.risk}</span></td>
                                                <td>${signal.score}/100</td>
                                                <td>${signal.driver}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Logic 23 anti-collusion</span>
                                    <h2>Compliance Signals</h2>
                                </div>
                                <span class="badge badge-warning">1 watch item</span>
                            </div>
                            <div class="risk-list">
                                ${evaluation.collusionSignals.map(signal => `
                                    <div class="risk-item ${signalClass[signal.status] || 'warning'}">
                                        <strong>${signal.signal}</strong>
                                        <span>${signal.detail}</span>
                                        <span class="badge badge-${signalClass[signal.status] || 'warning'}">${signal.status}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card" style="margin-top: 24px;">
                    <h3 style="margin-bottom: 16px;">Attached Documents</h3>
                    <div class="document-list">
                        ${[
                            ['Technical Proposal - ABC Construction.pdf', 'Uploaded 2 hours ago - 5.2 MB'],
                            ['Financial Proposal - ABC Construction.pdf', 'Uploaded 2 hours ago - 2.1 MB']
                        ].map(doc => `
                            <div class="document-row">
                                <div>
                                    <strong>${doc[0]}</strong>
                                    <span>${doc[1]}</span>
                                </div>
                                <button class="btn btn-secondary">Download</button>
                            </div>
                        `).join('')}
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
