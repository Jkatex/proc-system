function renderTenderPlanning() {
    const kpis = [
        ['Total APP Items', '42', 'Captured demand records', 'info'],
        ['Approved APP Items', '6', 'Ready to create SPP', 'success'],
        ['Active SPP Schedules', '18', 'Milestones in progress', 'info'],
        ['Budget Issues', '9', 'Finance checks pending', 'warning'],
        ['Pending Approvals', '11', 'Board and HOP actions', 'warning'],
        ['Missing Documents', '5', 'Evidence needs review', 'warning'],
        ['Overall Readiness %', '73%', 'Tender handoff progress', 'success']
    ];

    const appRows = [
        ['APP-2026-014', 'Hospital theatre equipment', 'Health Services', 'TZS 480M', 'NCT', 'Approved', '88%', ['View', 'Edit', 'Create SPP']],
        ['APP-2026-021', 'Fleet maintenance framework', 'Operations', 'TZS 125M', 'Framework', 'Budget Review', '54%', ['View', 'Edit']],
        ['APP-2026-027', 'Ward renovation works', 'Infrastructure', 'TZS 760M', 'NCT', 'SPP Created', '79%', ['View', 'Submit for Approval']],
        ['APP-2026-032', 'ICT helpdesk support', 'ICT', 'TZS 94M', 'RFQ', 'Draft', '36%', ['View', 'Edit']]
    ];

    const sppMilestones = [
        ['Specifications/TOR', 'Jun 2', 'Amina Yusuf', 'Complete', '100%'],
        ['Budget confirmation', 'Jun 3', 'Fatma M.', 'Due today', '68%'],
        ['Approval memo', 'Jun 5', 'Head of Procurement', 'Queued', '42%'],
        ['Tender/RFQ preparation', 'Jun 7', 'Procurement officer', 'Planned', '18%']
    ];

    const badgeClass = (status) => {
        const normalized = status.toLowerCase();
        if (normalized.includes('approved') || normalized.includes('created') || normalized.includes('ready') || normalized.includes('complete')) return 'badge-success';
        if (normalized.includes('review') || normalized.includes('pending') || normalized.includes('due') || normalized.includes('queued')) return 'badge-warning';
        if (normalized.includes('returned')) return 'badge-error';
        return 'badge-info';
    };

    return `
        <div class="main-layout tender-planning-page procurement-planning-control">
            <main class="main-content tender-planning-content">
                <nav class="planning-tabs" aria-label="Tender planning workspace sections">
                    <a href="#" data-navigate="procurement-planning-dashboard" class="active">Dashboard</a>
                    <a href="#" data-navigate="procurement-planning-app-items">APP Items</a>
                    <a href="#" data-navigate="procurement-planning-spp-schedule">SPP Schedule</a>
                    <a href="#" data-navigate="procurement-planning-budget-funding">Budget &amp; Funding</a>
                    <a href="#" data-navigate="procurement-planning-approvals">Approvals</a>
                    <a href="#" data-navigate="procurement-planning-documents-evidence">Documents &amp; Evidence</a>
                    <a href="#" data-navigate="procurement-planning-risks-alerts">Risks &amp; Alerts</a>
                    <a href="#" data-navigate="procurement-planning-reports">Reports</a>
                </nav>

                <section class="planning-dashboard-header" id="planning-dashboard">
                    <div>
                        <span class="section-kicker">Procurement Planning</span>
                        <h1>Tender Planning</h1>
                        <p>Plan APP demand, convert approved items into SPP schedules, confirm funding, collect approvals, and prepare clean Tender/RFQ handoff.</p>
                        <div class="inline-actions">
                            <button class="btn btn-primary" type="button">New APP Item</button>
                            <button class="btn btn-secondary" type="button">Upload Documents</button>
                            <button class="btn btn-secondary" type="button">Export Report</button>
                        </div>
                    </div>
                    <article class="planning-readiness-summary">
                        <span>Readiness</span>
                        <strong>73%</strong>
                        <div class="planning-readiness-meter" aria-hidden="true"><i style="width: 73%"></i></div>
                        <em>6 APP items ready for Tender/RFQ</em>
                    </article>
                </section>

                <div class="planning-compact-workflow" aria-label="Tender planning workflow">
                    ${['APP', 'SPP', 'Budget', 'Approval', 'Tender/RFQ', 'Evaluation', 'Award', 'Contract'].map((step, index) => `
                        <span class="${index < 2 ? 'complete' : index === 2 ? 'active' : ''}">${step}</span>
                    `).join('')}
                </div>

                <section class="planning-kpi-grid" aria-label="Planning KPIs">
                    ${kpis.map(([label, value, note, tone]) => `
                        <article class="planning-kpi-card ${tone}">
                            <span>${label}</span>
                            <strong>${value}</strong>
                            <em>${note}</em>
                        </article>
                    `).join('')}
                </section>

                <section class="procurement-panel evaluation-panel planning-control-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Search and filters</span>
                            <h2>APP/SPP records</h2>
                            <p class="panel-note">Find planning records by item, department, method, owner, status, or readiness.</p>
                        </div>
                        <div class="inline-actions">
                            <button class="btn btn-secondary btn-sm" type="button">Export Excel</button>
                            <button class="btn btn-secondary btn-sm" type="button">Export PDF</button>
                        </div>
                    </div>
                    <div class="planning-filter-bar">
                        <label>Search <input class="form-input" placeholder="APP code, item, SPP code"></label>
                        <label>Department <select class="form-input"><option>All departments</option><option>Health Services</option><option>Operations</option><option>Infrastructure</option><option>ICT</option></select></label>
                        <label>Status <select class="form-input"><option>All statuses</option><option>Draft</option><option>Budget Review</option><option>Approved</option><option>SPP Created</option><option>Returned</option><option>Ready for Tender</option></select></label>
                        <button class="btn btn-secondary btn-sm" type="button">Apply filters</button>
                    </div>
                    <div class="data-table planning-records-table">
                        <table>
                            <thead><tr><th>APP Code</th><th>Item</th><th>Department</th><th>Budget</th><th>Method</th><th>Status</th><th>Readiness</th><th>Action</th></tr></thead>
                            <tbody>
                                ${appRows.map(([code, item, department, budget, method, status, readiness, actions]) => `
                                    <tr>
                                        <td><strong>${code}</strong></td>
                                        <td>${item}</td>
                                        <td>${department}</td>
                                        <td>${budget}</td>
                                        <td>${method}</td>
                                        <td><span class="badge ${badgeClass(status)}">${status}</span></td>
                                        <td><span class="planning-readiness-pill">${readiness}</span></td>
                                        <td><div class="planning-table-actions">${actions.map(action => `<button class="btn ${action.includes('Create') || action.includes('Submit') ? 'btn-primary' : 'btn-secondary'} btn-sm" type="button">${action}</button>`).join('')}</div></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section class="planning-two-col planning-detail-layout">
                    <article class="procurement-panel evaluation-panel" id="app-items">
                        <div class="panel-heading">
                            <div><span class="section-kicker">APP Planning</span><h2>Selected APP item details</h2></div>
                            <span class="badge badge-success">Approved</span>
                        </div>
                        <div class="planning-detail-grid">
                            <div><span>APP Code</span><strong>APP-2026-014</strong></div>
                            <div><span>Department</span><strong>Health Services</strong></div>
                            <div><span>Budget</span><strong>TZS 480,000,000</strong></div>
                            <div><span>Method</span><strong>NCT</strong></div>
                            <div><span>Priority</span><strong>High</strong></div>
                            <div><span>Officer</span><strong>Amina Yusuf</strong></div>
                        </div>
                        <div class="planning-card-actions">
                            <button class="btn btn-primary btn-sm" type="button">Create SPP</button>
                            <button class="btn btn-secondary btn-sm" type="button">Edit APP</button>
                            <button class="btn btn-secondary btn-sm" type="button">View details</button>
                        </div>
                    </article>

                    <article class="procurement-panel evaluation-panel" id="spp-schedule">
                        <div class="panel-heading">
                            <div><span class="section-kicker">SPP Planning</span><h2>Activity schedule</h2></div>
                            <span class="badge badge-info">SPP-2026-006</span>
                        </div>
                        <div class="planning-spp-cards">
                            ${sppMilestones.map(([milestone, due, owner, status, progress]) => `
                                <div>
                                    <strong>${milestone}</strong>
                                    <span>${owner} / ${due}</span>
                                    <em class="badge ${badgeClass(status)}">${status}</em>
                                    <i style="width: ${progress}"></i>
                                </div>
                            `).join('')}
                        </div>
                    </article>
                </section>

                <section class="planning-two-col">
                    <article class="procurement-panel evaluation-panel" id="budget-funding">
                        <div class="panel-heading"><div><span class="section-kicker">Budget & Funding</span><h2>Finance checks</h2></div><span class="badge badge-warning">9 pending</span></div>
                        <div class="planning-card-list">
                            <div><strong>Hospital theatre equipment</strong><span>Development budget / TZS 480M</span><em class="badge badge-success">Confirmed</em><button class="btn btn-secondary btn-sm" type="button">View details</button></div>
                            <div><strong>Fleet maintenance framework</strong><span>Operational budget / TZS 125M</span><em class="badge badge-warning">Shortfall</em><button class="btn btn-primary btn-sm" type="button">Resolve</button></div>
                            <div><strong>Ward renovation works</strong><span>Capital projects / TZS 760M</span><em class="badge badge-info">Pending</em><button class="btn btn-secondary btn-sm" type="button">View details</button></div>
                        </div>
                    </article>

                    <article class="procurement-panel evaluation-panel" id="approvals">
                        <div class="panel-heading"><div><span class="section-kicker">Approvals</span><h2>Approval queue</h2></div><span class="badge badge-warning">11 pending</span></div>
                        <div class="planning-card-list">
                            <div><strong>SPP-2026-006</strong><span>Head of procurement approval required</span><em class="badge badge-warning">Queued</em><button class="btn btn-primary btn-sm" type="button">Approve</button></div>
                            <div><strong>APP-2026-021</strong><span>Finance returned budget shortfall</span><em class="badge badge-error">Returned</em><button class="btn btn-secondary btn-sm" type="button">Review</button></div>
                            <div><strong>SPP-2026-011</strong><span>Tender board review scheduled</span><em class="badge badge-info">Scheduled</em><button class="btn btn-secondary btn-sm" type="button">View details</button></div>
                        </div>
                    </article>
                </section>

                <section class="planning-two-col">
                    <article class="procurement-panel evaluation-panel" id="documents-evidence">
                        <div class="panel-heading"><div><span class="section-kicker">Documents & Evidence</span><h2>Planning document register</h2></div><span class="badge badge-warning">5 pending review</span></div>
                        <div class="planning-upload-box"><div><strong>Attach APP/SPP evidence</strong><span>Needs assessment, specifications/TOR, budget confirmation, approval memo, board minutes, and handoff notes</span></div><button class="btn btn-primary btn-sm" type="button">Upload documents</button></div>
                        <div class="planning-card-list">
                            <div><strong>Needs assessment</strong><span>APP-2026-014 / Requesting department</span><em class="badge badge-success">Accepted</em><button class="btn btn-secondary btn-sm" type="button">View details</button></div>
                            <div><strong>Specifications/TOR</strong><span>SPP-2026-006 / Procurement officer</span><em class="badge badge-warning">Review</em><button class="btn btn-primary btn-sm" type="button">Approve</button></div>
                        </div>
                    </article>

                    <article class="procurement-panel evaluation-panel" id="risks-alerts">
                        <div class="panel-heading"><div><span class="section-kicker">Risks & Alerts</span><h2>Delayed activities</h2></div><span class="badge badge-warning">7 alerts</span></div>
                        <div class="dashboard-action-queue planning-alert-list">
                            <button class="dashboard-action-row critical" type="button"><span class="dashboard-action-count">3</span><div><strong>Budget confirmation overdue</strong><span>Finance officer action required today</span></div><em>Critical</em><b>Remind</b></button>
                            <button class="dashboard-action-row attention" type="button"><span class="dashboard-action-count">4</span><div><strong>Specifications delayed</strong><span>Requesting departments have pending uploads</span></div><em>Attention</em><b>Notify</b></button>
                        </div>
                    </article>
                </section>

                <section class="procurement-panel evaluation-panel" id="monitoring-reports">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Monitoring & Reports</span>
                            <h2>Planning performance and audit activity</h2>
                            <p class="panel-note">Delayed activities, recent planning events, export reports, APP by department, and SPP progress in one workspace.</p>
                        </div>
                        <div class="inline-actions">
                            <button class="btn btn-secondary btn-sm" type="button">Export Excel</button>
                            <button class="btn btn-secondary btn-sm" type="button">Export PDF</button>
                        </div>
                    </div>
                    <div class="planning-monitoring-grid">
                        <article class="analytics-card"><span>APP by department</span><strong>42 items</strong><p>Health Services, Operations, Infrastructure, and ICT demand grouped by status.</p><button class="btn btn-secondary btn-sm" type="button">Open report</button></article>
                        <article class="analytics-card"><span>SPP progress</span><strong>73%</strong><p>Activity completion, due dates, workload, and delayed milestone tracking.</p><button class="btn btn-secondary btn-sm" type="button">Open report</button></article>
                        <article class="analytics-card"><span>Recent event</span><strong>Jun 2</strong><p>Finance confirmed budget for Hospital theatre equipment.</p><button class="btn btn-secondary btn-sm" type="button">View audit trail</button></article>
                    </div>
                </section>
            </main>
        </div>
    `;
}

window.renderTenderPlanning = renderTenderPlanning;
