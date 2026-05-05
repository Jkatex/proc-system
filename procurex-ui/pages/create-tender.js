// Create Tender Page Component (Buyer procurement design wizard)

function renderCreateTender() {
    const steps = [
        ['01', 'Procurement Type', 'Works, goods, services, category, method'],
        ['02', 'Scope', 'Specifications, objectives, deliverables'],
        ['03', 'BOQ', 'Items, units, rates, totals'],
        ['04', 'Evaluation', 'Criteria, weights, pass marks'],
        ['05', 'Timeline', 'Milestones, closing, opening, award'],
        ['06', 'Budget', 'Budget line, approvals, funds check'],
        ['07', 'Visibility', 'Public, restricted, invitation model'],
        ['08', 'Review', 'Attachments, declarations, final preview'],
        ['09', 'Risk Check', 'Quality flags, fixes, justifications']
    ];

    return `
        <div class="main-layout">
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Create Tender</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Design and approval package</div>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="buyer-dashboard">Dashboard</a></li>
                    <li><a href="#" data-navigate="buyer-journey">Buyer Journey</a></li>
                    <li><a href="#" data-navigate="tender-publication">Draft Detail</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <div class="main-content">
                <div class="journey-page">
                    <section class="journey-hero compact">
                        <div>
                            <span class="badge badge-info">Procurement design</span>
                            <h1>Create Tender Wizard</h1>
                            <p>Build the tender package, validate compliance quality, and submit it for internal approval before publication.</p>
                        </div>
                        <div class="hero-action-stack">
                            <button class="btn btn-secondary" data-navigate="buyer-dashboard">Save Draft</button>
                            <button class="btn btn-primary" data-navigate="tender-publication">Submit for Approval</button>
                        </div>
                    </section>

                    <div class="wizard-shell">
                        <aside class="wizard-rail">
                            ${steps.map((step, index) => `
                                <a href="#wizard-step-${index + 1}" class="wizard-rail-step ${index === 0 ? 'active' : ''}">
                                    <strong>${step[0]}</strong>
                                    <span>${step[1]}</span>
                                </a>
                            `).join('')}
                        </aside>

                        <div class="wizard-workspace">
                            <section class="journey-panel" id="wizard-step-1">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 1</span>
                                        <h2>Procurement Type & Category</h2>
                                    </div>
                                    <span class="badge badge-success">Method valid</span>
                                </div>
                                <div class="option-grid four">
                                    ${['Goods', 'Works', 'Services', 'Consultancy'].map((type, index) => `
                                        <label class="option-card ${index === 1 ? 'selected' : ''}">
                                            <input type="radio" name="procurementType" ${index === 1 ? 'checked' : ''}>
                                            <strong>${type}</strong>
                                            <span>${index === 1 ? 'Construction and infrastructure projects' : 'Buyer controlled procurement category'}</span>
                                        </label>
                                    `).join('')}
                                </div>
                                <div class="form-grid two">
                                    <div class="form-group">
                                        <label class="form-label">Procurement method</label>
                                        <select class="form-input">
                                            <option>Open competitive tender</option>
                                            <option>Restricted tender</option>
                                            <option>Request for quotation</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Category</label>
                                        <select class="form-input">
                                            <option>Healthcare infrastructure</option>
                                            <option>Medical equipment</option>
                                            <option>ICT and digital services</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-2">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 2</span>
                                        <h2>Specifications / Scope</h2>
                                    </div>
                                    <span class="badge badge-warning">Needs detail</span>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Tender title</label>
                                    <input class="form-input" value="Construction of Rural Health Centers" aria-label="Tender title">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Scope of work</label>
                                    <textarea class="form-input" rows="5">Construction of five rural health centers in Dodoma region, including civil works, MEP installation, site preparation, finishing, equipment rooms, and handover documentation.</textarea>
                                </div>
                                <div class="split-list">
                                    <div>
                                        <h3>Key deliverables</h3>
                                        <ul class="clean-list">
                                            <li>Site readiness and foundation certification</li>
                                            <li>Structural, electrical, plumbing, and finishing works</li>
                                            <li>Final inspection pack and as-built drawings</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3>Required attachments</h3>
                                        <ul class="clean-list">
                                            <li>Technical specifications</li>
                                            <li>Drawings and BOQ template</li>
                                            <li>Draft contract conditions</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-3">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 3</span>
                                        <h2>BOQ Editor</h2>
                                    </div>
                                    <span class="badge badge-info">TZS 4.8B estimate</span>
                                </div>
                                <div class="data-table">
                                    <table>
                                        <thead>
                                            <tr><th>Item</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>1.1</td><td>Site clearing and preparation</td><td>5</td><td>Sites</td><td>32,000,000</td><td>160,000,000</td></tr>
                                            <tr><td>2.1</td><td>Foundation and structural frame</td><td>5</td><td>Centers</td><td>380,000,000</td><td>1,900,000,000</td></tr>
                                            <tr><td>3.1</td><td>MEP installations</td><td>5</td><td>Centers</td><td>210,000,000</td><td>1,050,000,000</td></tr>
                                            <tr><td>4.1</td><td>Finishes, fixtures, handover</td><td>5</td><td>Centers</td><td>338,000,000</td><td>1,690,000,000</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="inline-actions">
                                    <button class="btn btn-secondary">Import BOQ</button>
                                    <button class="btn btn-secondary">Add Item</button>
                                    <button class="btn btn-secondary">Recalculate</button>
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-4">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 4</span>
                                        <h2>Evaluation Criteria & Weights</h2>
                                    </div>
                                    <span class="badge badge-success">100% balanced</span>
                                </div>
                                <div class="criteria-grid">
                                    ${[
                                        ['Technical capacity', 30, 'Team, equipment, methodology'],
                                        ['Relevant experience', 25, 'Healthcare construction history'],
                                        ['Financial proposal', 25, 'Price and payment realism'],
                                        ['Delivery schedule', 10, 'Milestone feasibility'],
                                        ['Compliance and ESG', 10, 'Licenses, safety, local participation']
                                    ].map(item => `
                                        <div class="criterion-row">
                                            <div><strong>${item[0]}</strong><span>${item[2]}</span></div>
                                            <input type="number" class="form-input" value="${item[1]}" min="0" max="100">
                                            <span>%</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-5">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 5</span>
                                        <h2>Timeline & Milestones</h2>
                                    </div>
                                    <span class="badge badge-success">Compliant window</span>
                                </div>
                                <div class="timeline-grid">
                                    ${[
                                        ['Publication', 'May 12, 2026'],
                                        ['Clarification deadline', 'May 28, 2026'],
                                        ['Bid closing', 'June 12, 2026'],
                                        ['Bid opening', 'June 12, 2026'],
                                        ['Evaluation complete', 'June 24, 2026'],
                                        ['Award approval', 'June 30, 2026']
                                    ].map(item => `<div class="timeline-tile"><strong>${item[0]}</strong><span>${item[1]}</span></div>`).join('')}
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-6">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 6</span>
                                        <h2>Budget Link</h2>
                                    </div>
                                    <span class="badge badge-success">Funds reserved</span>
                                </div>
                                <div class="form-grid three">
                                    <div class="form-group"><label class="form-label">Budget code</label><input class="form-input" value="MOH-CAPEX-2026-042"></div>
                                    <div class="form-group"><label class="form-label">Available funds</label><input class="form-input" value="TZS 5,200,000,000"></div>
                                    <div class="form-group"><label class="form-label">Tender estimate</label><input class="form-input" value="TZS 4,800,000,000"></div>
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-7">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 7</span>
                                        <h2>Visibility Model</h2>
                                    </div>
                                    <span class="badge badge-info">Marketplace ready</span>
                                </div>
                                <div class="option-grid three">
                                    <label class="option-card selected"><input type="radio" checked><strong>Public</strong><span>Visible to all verified suppliers.</span></label>
                                    <label class="option-card"><input type="radio"><strong>Restricted</strong><span>Only pre-qualified suppliers.</span></label>
                                    <label class="option-card"><input type="radio"><strong>Invitation</strong><span>Direct invited supplier list.</span></label>
                                </div>
                            </section>

                            <section class="journey-panel" id="wizard-step-8">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 8</span>
                                        <h2>Review & Attachments</h2>
                                    </div>
                                    <span class="badge badge-warning">2 unsigned files</span>
                                </div>
                                <div class="attachment-grid">
                                    ${['Technical Specifications.pdf', 'BOQ Template.xlsx', 'Draft Contract.docx', 'Drawings.zip'].map((file, index) => `
                                        <div class="attachment-card">
                                            <strong>${file}</strong>
                                            <span>${index < 2 ? 'Verified' : 'Needs final sign-off'}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>

                            <section class="journey-panel risk-panel" id="wizard-step-9">
                                <div class="panel-heading">
                                    <div>
                                        <span class="section-kicker">Step 9</span>
                                        <h2>Quality Flags & Risk Check</h2>
                                    </div>
                                    <span class="badge badge-warning">Fix or justify</span>
                                </div>
                                <div class="risk-list">
                                    <div class="risk-item warning"><strong>Clarification period is tight</strong><span>Add 3 days or justify urgency.</span><button class="btn btn-secondary">Justify</button></div>
                                    <div class="risk-item success"><strong>Weights total 100%</strong><span>Evaluation criteria are balanced.</span><button class="btn btn-secondary">View</button></div>
                                    <div class="risk-item warning"><strong>Two attachments unsigned</strong><span>Route drawings and draft contract for e-signature.</span><button class="btn btn-secondary">Fix</button></div>
                                </div>
                                <div class="submit-strip">
                                    <div>
                                        <strong>Ready to submit for approval</strong>
                                        <span>Creates Tender Draft Detail with status Pending Approval.</span>
                                    </div>
                                    <button class="btn btn-primary" data-navigate="tender-publication">Submit for Approval</button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

if (window.app) {
    window.app.renderCreateTender = renderCreateTender;
}
