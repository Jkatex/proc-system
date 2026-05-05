// Admin Dashboard Page Component

function renderAdminDashboard() {
    const kpis = mockData.kpis.admin;
    const ops = mockData.platformOps;

    const permissionSets = [
        ['Evaluator', 'evaluation:*', 'COI declaration, assigned evaluations, bid package viewer, scoring, lock submission, consensus, report'],
        ['Approver', 'approval:*', 'Approvals inbox, approval detail, approve, reject, request changes'],
        ['Finance', 'invoice:* + payment:*', 'Invoice review, 3-way match, approve or block, payments, transaction record'],
        ['Compliance Officer', 'audit:* + compliance:*', 'Collusion alerts, audit explorer, timeline reconstruction, violations, sanctions, appeals'],
        ['Platform Admin', 'admin:* + rbac:*', 'Verification queue, RBAC console, SoD rules, delegation management'],
        ['Intelligence', 'analytics:* + model:*', 'Market liquidity, benchmark signals, model health, recommendations'],
        ['Integration Admin', 'integration:* + module:*', 'ERP sync, field mapping, webhook status, module registry']
    ];

    return `
        <div class="main-layout">
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>ProcureX Admin</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Shared RBAC workspace</div>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="admin-dashboard" class="active">Admin Workspace</a></li>
                    <li><a href="#" data-navigate="verification-status">IAM / Verification</a></li>
                    <li><a href="#" data-navigate="buyer-journey">Buyer Journey</a></li>
                    <li><a href="#" data-navigate="supplier-journey">Supplier Journey</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <div class="main-content">
                <div class="journey-page">
                    <section class="journey-hero compact">
                        <div>
                            <span class="badge badge-info">Single entry point</span>
                            <h1>Admin Workspace</h1>
                            <p>Evaluator, Approver, Finance, Compliance Officer, and Platform Admin are not separate portals. They are permission-scoped views rendered inside this shared Admin dashboard after IAM login.</p>
                        </div>
                        <div class="journey-scorecard">
                            <div><strong>${kpis.activeUsers}</strong><span>Active users</span></div>
                            <div><strong>${kpis.pendingVerifications}</strong><span>Verifications</span></div>
                            <div><strong>${kpis.supportTickets}</strong><span>Support tickets</span></div>
                            <div><strong>${kpis.systemUptime}%</strong><span>Uptime</span></div>
                        </div>
                    </section>

                    <section class="journey-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">How it works</span>
                                <h2>Login -> Admin Dashboard -> RBAC-rendered features</h2>
                            </div>
                            <span class="badge badge-success">IAM controlled</span>
                        </div>
                        <div class="permission-grid">
                            ${permissionSets.map(item => `
                                <article class="permission-card">
                                    <div>
                                        <h3>${item[0]}</h3>
                                        <code>${item[1]}</code>
                                    </div>
                                    <p>${item[2]}</p>
                                </article>
                            `).join('')}
                        </div>
                    </section>

                    <div class="tabs">
                        <div class="tab active" data-tab="evaluator">Evaluator</div>
                        <div class="tab" data-tab="approver">Approver</div>
                        <div class="tab" data-tab="finance">Finance</div>
                        <div class="tab" data-tab="compliance">Compliance / Audit</div>
                        <div class="tab" data-tab="platform">Platform Admin</div>
                        <div class="tab" data-tab="intelligence">Market Intelligence</div>
                        <div class="tab" data-tab="integrations">ERP & Modules</div>
                    </div>

                    <div>
                        <section class="tab-content" data-tab="evaluator" style="display: block;">
                            <div class="journey-grid two-col">
                                <div class="journey-panel">
                                    <div class="panel-heading">
                                        <div>
                                            <span class="section-kicker">evaluation:* permissions</span>
                                            <h2>Evaluator Workspace</h2>
                                        </div>
                                        <span class="badge badge-warning">COI required</span>
                                    </div>
                                    <div class="admin-flow">
                                        ${['COI Declaration', 'Assigned Evaluations', 'Bid Package Viewer', 'Scoring Workspace', 'Lock Submission', 'Evaluation Report'].map((item, index) => `
                                            <div class="${index < 1 ? 'current' : ''}"><strong>${item}</strong><span>${index === 0 ? 'Mandatory before accessing bids' : 'Rendered by evaluation permissions'}</span></div>
                                        `).join('')}
                                    </div>
                                </div>
                                <div class="journey-panel">
                                    <span class="section-kicker">Variance handling</span>
                                    <h2>Consensus Session</h2>
                                    <div class="risk-list">
                                        <div class="risk-item warning"><strong>15% scoring variance</strong><span>ABC Construction technical score requires reconciliation.</span><button class="btn btn-secondary">Open Consensus</button></div>
                                        <div class="risk-item success"><strong>Submission lock</strong><span>Final score cannot be edited after lock.</span></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="tab-content" data-tab="approver" style="display: none;">
                            <div class="journey-grid two-col">
                                <div class="journey-panel">
                                    <div class="panel-heading">
                                        <div>
                                            <span class="section-kicker">approval:* permissions</span>
                                            <h2>Approvals Inbox</h2>
                                        </div>
                                        <span class="badge badge-warning">4 pending</span>
                                    </div>
                                    <div class="inbox-list">
                                        <div class="inbox-item"><strong>Tender Draft Approval</strong><span>Construction of Rural Health Centers.</span><button class="btn btn-secondary">Open Detail</button></div>
                                        <div class="inbox-item"><strong>Award Recommendation</strong><span>Recommended supplier: ABC Construction Ltd.</span><button class="btn btn-secondary">Review</button></div>
                                        <div class="inbox-item"><strong>Contract Change Request</strong><span>Payment term update requested.</span><button class="btn btn-secondary">Review</button></div>
                                    </div>
                                </div>
                                <div class="journey-panel control-panel">
                                    <span class="section-kicker">Approval detail actions</span>
                                    <h2>Approve, Reject, Request Changes</h2>
                                    <div class="inline-actions">
                                        <button class="btn btn-primary">Approve</button>
                                        <button class="btn btn-secondary">Reject</button>
                                        <button class="btn btn-secondary">Request Changes</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="tab-content" data-tab="finance" style="display: none;">
                            <div class="journey-grid two-col">
                                <div class="journey-panel">
                                    <div class="panel-heading">
                                        <div>
                                            <span class="section-kicker">invoice:* + payment:* permissions</span>
                                            <h2>Invoice Review</h2>
                                        </div>
                                        <span class="badge badge-warning">3-way match pending</span>
                                    </div>
                                    <div class="data-table">
                                        <table>
                                            <thead><tr><th>Invoice</th><th>PO</th><th>GRN</th><th>Amount</th><th>Match</th><th>Action</th></tr></thead>
                                            <tbody>
                                                <tr><td>INV-2026-002</td><td>PO-0892</td><td>GRN-002</td><td>TZS 1,440,000,000</td><td><span class="badge badge-success">Matched</span></td><td><button class="btn btn-primary" style="font-size: 12px; padding: 6px 10px;">Approve</button></td></tr>
                                                <tr><td>INV-2026-003</td><td>PO-0892</td><td>Pending</td><td>TZS 1,200,000,000</td><td><span class="badge badge-warning">Blocked</span></td><td><button class="btn btn-secondary" style="font-size: 12px; padding: 6px 10px;">Block</button></td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="journey-panel">
                                    <span class="section-kicker">Payments</span>
                                    <h2>Record Transaction</h2>
                                    <div class="record-summary">
                                        <div><span>Payment rail</span><strong>Bank transfer</strong></div>
                                        <div><span>Transaction reference</span><strong>PAY-TZS-2026-00421</strong></div>
                                        <div><span>Status</span><strong>Ready for release</strong></div>
                                    </div>
                                    <button class="btn btn-primary">Record Transaction</button>
                                </div>
                            </div>
                        </section>

                        <section class="tab-content" data-tab="compliance" style="display: none;">
                            <div class="journey-grid two-col">
                                <div class="journey-panel">
                                    <div class="panel-heading">
                                        <div>
                                            <span class="section-kicker">audit:* + compliance:* permissions</span>
                                            <h2>Collusion Alerts Queue</h2>
                                        </div>
                                        <span class="badge badge-error">${ops.complianceQueue.filter(item => item.severity === 'High').length} high risk</span>
                                    </div>
                                    <div class="risk-list">
                                        ${ops.complianceQueue.map(item => `
                                            <div class="risk-item ${item.severity === 'High' ? 'warning' : 'success'}">
                                                <strong>${item.alert}</strong>
                                                <span>${item.status} - ${item.owner}</span>
                                                <button class="btn btn-secondary">Open</button>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                <div class="journey-panel">
                                    <span class="section-kicker">Audit explorer</span>
                                    <h2>Timeline Reconstruction</h2>
                                    <div class="execution-lane">
                                        ${ops.auditTrail.map(item => `
                                            <div><strong>${item.time}</strong><span>${item.event} (${item.ref})</span></div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="tab-content" data-tab="platform" style="display: none;">
                            <div class="journey-grid three-col">
                                <div class="journey-panel control-panel">
                                    <span class="section-kicker">Verification queue</span>
                                    <h2>KYB Reviews</h2>
                                    <p>Review buyer and supplier onboarding evidence submitted through IAM.</p>
                                    <button class="btn btn-secondary">Open Queue</button>
                                </div>
                                <div class="journey-panel control-panel">
                                    <span class="section-kicker">RBAC console</span>
                                    <h2>Permission Sets</h2>
                                    <p>Assign evaluation:*, approval:*, invoice:*, payment:*, audit:*, compliance:*, and admin:* permissions.</p>
                                    <button class="btn btn-primary">Manage RBAC</button>
                                </div>
                                <div class="journey-panel control-panel">
                                    <span class="section-kicker">Controls</span>
                                    <h2>SoD & Delegation</h2>
                                    <p>Configure separation-of-duties rules and temporary delegation windows.</p>
                                    <button class="btn btn-secondary">Configure Rules</button>
                                </div>
                            </div>
                        </section>

                        <section class="tab-content" data-tab="intelligence" style="display: none;">
                            <div class="journey-grid two-col">
                                <div class="journey-panel">
                                    <div class="panel-heading">
                                        <div>
                                            <span class="section-kicker">Logics 28, 30, 31, 38</span>
                                            <h2>Market Intelligence Dashboard</h2>
                                        </div>
                                        <span class="badge badge-success">Learning loop active</span>
                                    </div>
                                    <div class="metric-grid">
                                        <div><span>Liquidity index</span><strong>${ops.marketIntelligence.liquidityIndex}/100</strong></div>
                                        <div><span>Supplier coverage</span><strong>${ops.marketIntelligence.supplierCoverage}</strong></div>
                                        <div><span>Avg bids / tender</span><strong>${ops.marketIntelligence.avgBidsPerTender}</strong></div>
                                        <div><span>Price trend</span><strong>${ops.marketIntelligence.priceTrend}</strong></div>
                                    </div>
                                </div>
                                <div class="journey-panel">
                                    <span class="section-kicker">Behavioral correction signals</span>
                                    <h2>Recommended Interventions</h2>
                                    <div class="risk-list">
                                        ${ops.marketIntelligence.recommendations.map(item => `
                                            <div class="risk-item success"><strong>Recommendation</strong><span>${item}</span></div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="tab-content" data-tab="integrations" style="display: none;">
                            <div class="journey-grid two-col">
                                <div class="journey-panel">
                                    <div class="panel-heading">
                                        <div>
                                            <span class="section-kicker">Logics 35 and 40</span>
                                            <h2>ERP Integration Setup</h2>
                                        </div>
                                        <span class="badge badge-success">${ops.integration.status}</span>
                                    </div>
                                    <div class="record-summary">
                                        <div><span>ERP system</span><strong>${ops.integration.erpName}</strong></div>
                                        <div><span>Last sync</span><strong>${ops.integration.lastSync}</strong></div>
                                        <div><span>Discrepancy</span><strong>${ops.integration.discrepancy}</strong></div>
                                    </div>
                                    <div class="sync-columns">
                                        <div>
                                            <span class="section-kicker">Inbound</span>
                                            <div class="clean-list">${ops.integration.inbound.map(item => `<div>${item}</div>`).join('')}</div>
                                        </div>
                                        <div>
                                            <span class="section-kicker">Outbound</span>
                                            <div class="clean-list">${ops.integration.outbound.map(item => `<div>${item}</div>`).join('')}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="journey-panel">
                                    <div class="panel-heading">
                                        <div>
                                            <span class="section-kicker">Module registry</span>
                                            <h2>Expansion Modules</h2>
                                        </div>
                                        <span class="badge badge-info">${ops.modules.length} modules</span>
                                    </div>
                                    <div class="data-table">
                                        <table>
                                            <thead><tr><th>Module</th><th>Status</th><th>Version</th></tr></thead>
                                            <tbody>
                                                ${ops.modules.map(module => `
                                                    <tr>
                                                        <td>${module.name}</td>
                                                        <td><span class="badge badge-${module.status === 'Active' ? 'success' : 'info'}">${module.status}</span></td>
                                                        <td>${module.version}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    `;
}

if (window.app) {
    window.app.renderAdminDashboard = renderAdminDashboard;
}
