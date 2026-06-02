function renderTenderPlanning() {
    const kpis = [
        ['APP Items', '42', 'Captured in 2026/2027', 'info'],
        ['Approved', '18', 'Ready for SPP conversion', 'success'],
        ['Budget Confirmed', '31', 'Finance cleared records', 'success'],
        ['Shortfalls', '4', 'Funding action required', 'warning'],
        ['Pending Review', '9', 'Approval queue items', 'warning'],
        ['Evidence Ready', '79%', 'Required documents attached', 'info']
    ];

    const basicFields = [
        ['Procuring Entity', 'input', 'Dar es Salaam City Council'],
        ['Financial Year', 'input', '2026/2027'],
        ['APP Code', 'input', 'APP-2026-014'],
        ['Department / Requesting Unit', 'input', 'Health Services'],
        ['Procurement Category', 'select', ['Goods', 'Works', 'Services', 'Consultancy']],
        ['Procurement Item Description', 'textarea', 'Supply and installation of hospital theatre equipment'],
        ['Procurement Cycle', 'select', ['First Cycle', 'Second Cycle']],
        ['Priority', 'select', ['High', 'Medium', 'Low']],
        ['Responsible Officer', 'input', 'Amina Yusuf']
    ];

    const procurementFields = [
        ['Tender Number', 'input', 'PX-GDS-2026-014'],
        ['Lot Number', 'input', 'LOT-01'],
        ['Procurement Method', 'select', ['NCT', 'RFQ', 'Framework', 'Single Source', 'International Tendering']],
        ['Procurement Type', 'input', 'Supply and installation'],
        ['Estimated Budget', 'input', 'TZS 480,000,000'],
        ['Funding Source', 'input', 'Development budget'],
        ['Budget Status', 'select', ['Pending', 'Confirmed', 'Shortfall']],
        ['Justification / Need', 'textarea', 'Required to replace end-of-life theatre equipment and support planned surgical service expansion.']
    ];

    const scheduleFields = [
        ['Pre-qualification Invitation Date', '2026-07-01'],
        ['Pre-qualification Closing / Opening Date', '2026-07-15'],
        ['Notification of Applicants Date', '2026-07-22'],
        ['Tender Invitation Date', '2026-08-01'],
        ['Tender Closing / Opening Date', '2026-08-30'],
        ['Notice of Intention to Award Date', '2026-09-12'],
        ['Vetting / Ratification of Contract Date', '2026-09-20'],
        ['Notification of Award Date', '2026-09-25'],
        ['Contract Signature Date', '2026-10-04']
    ];

    const approvalFields = [
        ['Prepared By', 'input', 'Amina Yusuf'],
        ['Reviewed By', 'input', 'Head of Procurement'],
        ['Budget Confirmed By', 'input', 'Fatma Mhando'],
        ['Approved By', 'input', 'Tender Board Secretary'],
        ['Approval Status', 'select', ['Draft', 'Submitted', 'Approved', 'Returned', 'Rejected']],
        ['Approval Comments', 'textarea', 'Budget confirmed. Specifications and needs assessment attached for review.']
    ];

    const documents = [
        ['Needs Assessment', 'APP needs assessment.pdf', 'Accepted'],
        ['Specifications / TOR', 'Theatre equipment TOR.docx', 'Review'],
        ['Budget Confirmation', 'Finance confirmation.pdf', 'Accepted'],
        ['Market Survey', 'Supplier market survey.xlsx', 'Pending'],
        ['Approval Memo', 'Approval memo draft.docx', 'Draft'],
        ['Board Minutes', 'Tender board minutes.pdf', 'Missing'],
        ['SPP Schedule', 'SPP-2026-006.xlsx', 'Generated'],
        ['Handoff Notes', 'Tender handoff notes.txt', 'Draft']
    ];

    const appRows = [
        ['APP-2026-014', 'Hospital theatre equipment', 'Health Services', '2026/2027', 'TZS 480M', 'NCT', 'Approved', '88%', 'Create SPP'],
        ['APP-2026-021', 'Fleet maintenance framework', 'Operations', '2026/2027', 'TZS 125M', 'Framework', 'Returned', '54%', 'Review'],
        ['APP-2026-027', 'Ward renovation works', 'Infrastructure', '2026/2027', 'TZS 760M', 'NCT', 'Submitted', '79%', 'Open'],
        ['APP-2026-032', 'ICT helpdesk support', 'ICT', '2026/2027', 'TZS 94M', 'RFQ', 'Draft', '36%', 'Edit']
    ];

    const badgeClass = (status) => {
        const normalized = status.toLowerCase();
        if (normalized.includes('approved') || normalized.includes('accepted') || normalized.includes('generated') || normalized.includes('confirmed')) return 'badge-success';
        if (normalized.includes('returned') || normalized.includes('missing') || normalized.includes('shortfall')) return 'badge-error';
        if (normalized.includes('review') || normalized.includes('pending') || normalized.includes('submitted')) return 'badge-warning';
        return 'badge-info';
    };

    const renderField = ([label, type, value]) => {
        const name = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (type === 'select') {
            return `
                <label class="planning-field">
                    <span>${label}</span>
                    <select class="form-input" name="${name}">
                        ${value.map((option, index) => `<option ${index === 0 ? 'selected' : ''}>${option}</option>`).join('')}
                    </select>
                </label>
            `;
        }
        if (type === 'textarea') {
            return `
                <label class="planning-field planning-field-wide">
                    <span>${label}</span>
                    <textarea class="form-input" name="${name}" rows="4">${value}</textarea>
                </label>
            `;
        }
        return `
            <label class="planning-field">
                <span>${label}</span>
                <input class="form-input" name="${name}" value="${value}">
            </label>
        `;
    };

    const renderDateField = ([label, value]) => `
        <label class="planning-field">
            <span>${label}</span>
            <input class="form-input" type="date" value="${value}">
        </label>
    `;

    const renderDocumentCard = ([label, file, status]) => `
        <article class="planning-upload-tile">
            <div>
                <strong>${label}</strong>
                <span>${file}</span>
            </div>
            <span class="badge ${badgeClass(status)}">${status}</span>
            <input type="file" aria-label="Attach ${label}">
        </article>
    `;

    return `
        <div class="main-layout tender-planning-page procurement-planning-control app-planning-control">
            <main class="main-content tender-planning-content">
                <nav class="planning-tabs" aria-label="Tender planning workspace sections">
                    <a href="#app-planning-form" class="active">APP Form</a>
                    <a href="#planning-documents">Documents</a>
                    <a href="#planning-schedule">Schedule</a>
                    <a href="#planning-approvals">Approvals</a>
                    <a href="#planning-records">Records</a>
                </nav>

                <section class="planning-dashboard-header app-planning-hero" id="planning-dashboard">
                    <div>
                        <span class="section-kicker">Annual Procurement Plan</span>
                        <h1>Procurement Planning Control Center</h1>
                        <p>Create APP records from real annual procurement planning fields, attach evidence, confirm budgets, route approvals, and convert approved items into SPP schedules.</p>
                        <div class="inline-actions">
                            <button class="btn btn-primary" type="button">New APP Item</button>
                            <button class="btn btn-secondary" type="button">Import Planning Document</button>
                            <button class="btn btn-secondary" type="button">Export Report</button>
                        </div>
                    </div>
                    <article class="planning-readiness-summary">
                        <span>Portfolio readiness</span>
                        <strong>73%</strong>
                        <div class="planning-readiness-meter" aria-hidden="true"><i style="width: 73%"></i></div>
                        <em>18 approved APP items can be scheduled into SPP activities.</em>
                    </article>
                </section>

                <section class="planning-kpi-grid app-planning-kpis" aria-label="Planning KPIs">
                    ${kpis.map(([label, value, note, tone]) => `
                        <article class="planning-kpi-card ${tone}">
                            <span>${label}</span>
                            <strong>${value}</strong>
                            <em>${note}</em>
                        </article>
                    `).join('')}
                </section>

                <form class="app-planning-form" id="app-planning-form" data-action="save-app" novalidate>
                    <section class="procurement-panel evaluation-panel app-form-section">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">1. Basic Plan Details</span>
                                <h2>APP item identity</h2>
                            </div>
                            <span class="badge badge-info">Draft APP</span>
                        </div>
                        <div class="app-form-grid">
                            ${basicFields.map(renderField).join('')}
                        </div>
                    </section>

                    <section class="procurement-panel evaluation-panel app-form-section">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">2. Procurement Details</span>
                                <h2>Method, budget, and need</h2>
                            </div>
                            <span class="badge badge-success">Budget confirmed</span>
                        </div>
                        <div class="app-form-grid">
                            ${procurementFields.map(renderField).join('')}
                        </div>
                    </section>

                    <section class="procurement-panel evaluation-panel app-form-section" id="planning-schedule">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">3. Planning Schedule</span>
                                <h2>Pre-tender milestones</h2>
                            </div>
                            <span class="badge badge-warning">SPP dates ready</span>
                        </div>
                        <div class="app-form-grid app-date-grid">
                            ${scheduleFields.map(renderDateField).join('')}
                        </div>
                    </section>

                    <section class="procurement-panel evaluation-panel app-form-section" id="planning-approvals">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">4. Approval Information</span>
                                <h2>Review and authorization</h2>
                            </div>
                            <span class="badge badge-warning">Submitted</span>
                        </div>
                        <div class="app-form-grid">
                            ${approvalFields.map(renderField).join('')}
                        </div>
                    </section>

                    <section class="procurement-panel evaluation-panel app-form-section" id="planning-documents">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">5. Documents &amp; Evidence</span>
                                <h2>Supporting document uploads</h2>
                            </div>
                            <span class="badge badge-info">8 evidence types</span>
                        </div>
                        <div class="planning-upload-box app-upload-panel">
                            <div>
                                <strong>Attach APP/SPP evidence</strong>
                                <span>Needs assessment, specifications/TOR, budget confirmation, market survey, approvals, board minutes, schedules, and handoff notes.</span>
                            </div>
                            <button class="btn btn-primary btn-sm" type="button">Upload Documents</button>
                        </div>
                        <div class="app-upload-grid">
                            ${documents.map(renderDocumentCard).join('')}
                        </div>
                    </section>

                    <section class="procurement-panel evaluation-panel app-actions-section">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">6. Actions</span>
                                <h2>Save, route, schedule, and export</h2>
                            </div>
                            <span class="badge badge-success">Control center</span>
                        </div>
                        <div class="app-action-bar">
                            <button class="btn btn-primary" type="submit">Save APP Item</button>
                            <button class="btn btn-secondary" type="button">Submit for Review</button>
                            <button class="btn btn-secondary" type="button">Create SPP</button>
                            <button class="btn btn-secondary" type="button">Upload Documents</button>
                            <button class="btn btn-secondary" type="button">Import Planning Document</button>
                            <button class="btn btn-secondary" type="button">Export Report</button>
                        </div>
                        <div class="form-status app-form-status" data-form-status aria-live="polite"></div>
                    </section>
                </form>

                <section class="procurement-panel evaluation-panel planning-control-panel" id="planning-records">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Saved APP Records</span>
                            <h2>APP to SPP readiness table</h2>
                            <p class="panel-note">Approved APP records can be converted into SPP schedules once budget and evidence readiness are complete.</p>
                        </div>
                        <div class="inline-actions">
                            <button class="btn btn-secondary btn-sm" type="button">Export Excel</button>
                            <button class="btn btn-secondary btn-sm" type="button">Export PDF</button>
                        </div>
                    </div>
                    <div class="planning-filter-bar app-record-filter">
                        <label>Search <input class="form-input" placeholder="APP code, item, department"></label>
                        <label>Financial Year <select class="form-input"><option>2026/2027</option><option>2025/2026</option></select></label>
                        <label>Status <select class="form-input"><option>All statuses</option><option>Draft</option><option>Submitted</option><option>Approved</option><option>Returned</option><option>Rejected</option></select></label>
                        <button class="btn btn-secondary btn-sm" type="button">Apply filters</button>
                    </div>
                    <div class="data-table planning-records-table app-records-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>APP Code</th>
                                    <th>Item Description</th>
                                    <th>Department</th>
                                    <th>Financial Year</th>
                                    <th>Budget</th>
                                    <th>Procurement Method</th>
                                    <th>Status</th>
                                    <th>Readiness</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${appRows.map(([code, item, department, year, budget, method, status, readiness, action]) => `
                                    <tr>
                                        <td><strong>${code}</strong></td>
                                        <td>${item}</td>
                                        <td>${department}</td>
                                        <td>${year}</td>
                                        <td>${budget}</td>
                                        <td>${method}</td>
                                        <td><span class="badge ${badgeClass(status)}">${status}</span></td>
                                        <td><span class="planning-readiness-pill">${readiness}</span></td>
                                        <td><button class="btn ${action === 'Create SPP' ? 'btn-primary' : 'btn-secondary'} btn-sm" type="button">${action}</button></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    `;
}

window.renderTenderPlanning = renderTenderPlanning;
