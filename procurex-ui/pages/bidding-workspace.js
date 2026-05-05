// Bidding Workspace Page Component (Supplier sealed bid flow)

function renderBiddingWorkspace() {
    const steps = [
        ['01', 'Bid Type', 'Joint venture, solo bid, alternates'],
        ['02', 'Technical Response', 'Methodology, team, experience'],
        ['03', 'Financial Response', 'BOQ, taxes, discounts'],
        ['04', 'Uploads', 'Compliance and proposal files'],
        ['05', 'Samples', 'Physical or digital sample register'],
        ['06', 'Validate Bid', 'Eligibility and completeness checks'],
        ['07', 'Review Summary', 'Envelope preview and declarations'],
        ['08', 'Submit Sealed Bid', 'Receipt and immutable hash']
    ];

    return `
        <div class="main-layout">
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>My Bids</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Construction of Rural Health Centers</div>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="supplier-tender-detail">Tender Detail</a></li>
                    <li><a href="#" data-navigate="supplier-journey">Supplier Journey</a></li>
                    <li><a href="#" data-navigate="supplier-marketplace">Marketplace</a></li>
                    <li><a href="#" data-navigate="supplier-dashboard">Dashboard</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <div class="main-content">
                <div class="journey-page">
                    <section class="journey-hero compact">
                        <div>
                            <span class="badge badge-info">Sealed bid workspace</span>
                            <h1>Bid Submission</h1>
                            <p>Complete all bid envelopes, validate requirements, submit a sealed bid, and receive a timestamped receipt hash.</p>
                        </div>
                        <div class="hero-action-stack">
                            <button class="btn btn-secondary">Save Draft</button>
                            <button class="btn btn-primary" data-navigate="supplier-journey">Submit Sealed Bid</button>
                        </div>
                    </section>

                    <div class="wizard-shell">
                        <aside class="wizard-rail">
                            ${steps.map((step, index) => `
                                <a href="#bid-step-${index + 1}" class="wizard-rail-step ${index === 0 ? 'active' : ''}">
                                    <strong>${step[0]}</strong>
                                    <span>${step[1]}</span>
                                </a>
                            `).join('')}
                        </aside>

                        <div class="wizard-workspace">
                            <section class="journey-panel" id="bid-step-1">
                                <div class="panel-heading"><div><span class="section-kicker">Step 1</span><h2>Bid Type</h2></div><span class="badge badge-success">Eligible</span></div>
                                <div class="option-grid three">
                                    <label class="option-card selected"><input type="radio" checked><strong>Single Supplier</strong><span>Submit as ABC Construction Ltd.</span></label>
                                    <label class="option-card"><input type="radio"><strong>Joint Venture</strong><span>Add partner details and JV agreement.</span></label>
                                    <label class="option-card"><input type="radio"><strong>Alternative Bid</strong><span>Include compliant alternate method.</span></label>
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-2">
                                <div class="panel-heading"><div><span class="section-kicker">Step 2</span><h2>Technical Response</h2></div><span class="badge badge-warning">Draft</span></div>
                                <div class="form-grid two">
                                    <div class="form-group"><label class="form-label">Relevant experience</label><textarea class="form-input" rows="5">Completed 8 healthcare construction projects across Dodoma and Morogoro with certified project managers and site engineers.</textarea></div>
                                    <div class="form-group"><label class="form-label">Methodology</label><textarea class="form-input" rows="5">Phased construction plan with site mobilization, foundation works, MEP coordination, quality gates, and handover inspections.</textarea></div>
                                </div>
                                <div class="criteria-grid">
                                    <div class="criterion-row"><div><strong>Project team</strong><span>Site engineer, QS, HSE lead, foreman</span></div><input class="form-input" value="Complete"><span></span></div>
                                    <div class="criterion-row"><div><strong>Equipment plan</strong><span>Excavators, mixers, lifting equipment</span></div><input class="form-input" value="Attached"><span></span></div>
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-3">
                                <div class="panel-heading"><div><span class="section-kicker">Step 3</span><h2>Financial Response</h2></div><span class="badge badge-info">TZS 4.72B</span></div>
                                <div class="data-table">
                                    <table>
                                        <thead><tr><th>Item</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
                                        <tbody>
                                            <tr><td>1.1</td><td>Site clearing and preparation</td><td>5 sites</td><td>30,000,000</td><td>150,000,000</td></tr>
                                            <tr><td>2.1</td><td>Foundation and structural frame</td><td>5 centers</td><td>372,000,000</td><td>1,860,000,000</td></tr>
                                            <tr><td>3.1</td><td>MEP installations</td><td>5 centers</td><td>206,000,000</td><td>1,030,000,000</td></tr>
                                            <tr><td>4.1</td><td>Finishes, fixtures, handover</td><td>5 centers</td><td>336,000,000</td><td>1,680,000,000</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-4">
                                <div class="panel-heading"><div><span class="section-kicker">Step 4</span><h2>Uploads</h2></div><span class="badge badge-success">6 of 6</span></div>
                                <div class="attachment-grid">
                                    ${['Business License.pdf', 'Tax Clearance.pdf', 'Company Profile.pdf', 'Technical Proposal.pdf', 'Financial Proposal.xlsx', 'Bid Security.pdf'].map(file => `<div class="attachment-card"><strong>${file}</strong><span>Uploaded and encrypted</span></div>`).join('')}
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-5">
                                <div class="panel-heading"><div><span class="section-kicker">Step 5</span><h2>Samples</h2></div><span class="badge badge-info">Optional</span></div>
                                <div class="data-table">
                                    <table>
                                        <thead><tr><th>Sample</th><th>Format</th><th>Status</th><th>Reference</th></tr></thead>
                                        <tbody>
                                            <tr><td>Finishing material catalog</td><td>Digital</td><td><span class="badge badge-success">Submitted</span></td><td>SMP-001</td></tr>
                                            <tr><td>Door fixture sample</td><td>Physical</td><td><span class="badge badge-warning">Courier scheduled</span></td><td>SMP-002</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-6">
                                <div class="panel-heading"><div><span class="section-kicker">Step 6</span><h2>Validate Bid</h2></div><span class="badge badge-success">Ready</span></div>
                                <div class="risk-list">
                                    <div class="risk-item success"><strong>Eligibility verified</strong><span>Supplier documents match tender requirements.</span></div>
                                    <div class="risk-item success"><strong>Both envelopes complete</strong><span>Technical and financial responses are present.</span></div>
                                    <div class="risk-item warning"><strong>Physical sample pending courier</strong><span>Submission can proceed with courier reference.</span><button class="btn btn-secondary">Justify</button></div>
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-7">
                                <div class="panel-heading"><div><span class="section-kicker">Step 7</span><h2>Review Summary</h2></div><span class="badge badge-info">Declaration required</span></div>
                                <div class="record-summary">
                                    <div><span>Bidder</span><strong>ABC Construction Ltd</strong></div>
                                    <div><span>Bid value</span><strong>TZS 4,720,000,000</strong></div>
                                    <div><span>Validity</span><strong>180 days</strong></div>
                                    <div><span>Deadline</span><strong>June 12, 2026, 10:00 EAT</strong></div>
                                </div>
                                <label class="signature-consent"><input type="checkbox" checked> I confirm this sealed bid is complete, accurate, and authorized for submission.</label>
                            </section>

                            <section class="journey-panel" id="bid-step-8">
                                <div class="panel-heading"><div><span class="section-kicker">Step 8</span><h2>Submit Sealed Bid</h2></div><span class="badge badge-success">Receipt ready</span></div>
                                <div class="submit-strip">
                                    <div>
                                        <strong>Receipt + Hash</strong>
                                        <span>Bid BID-PX-2026-014 submitted. Hash: 0x9f24e7c2b8aa49f8a73c.</span>
                                    </div>
                                    <button class="btn btn-primary" data-navigate="supplier-journey">Submit Sealed Bid</button>
                                </div>
                                <div class="journey-grid two-col" style="margin-top: 18px;">
                                    <div class="journey-panel">
                                        <span class="section-kicker">My Bids</span>
                                        <h2>Submitted</h2>
                                        <p>Sealed bid is locked until bid opening. You can withdraw and resubmit before the deadline.</p>
                                        <div class="inline-actions">
                                            <button class="btn btn-secondary">Withdraw</button>
                                            <button class="btn btn-secondary">Resubmit</button>
                                        </div>
                                    </div>
                                    <div class="journey-panel">
                                        <span class="section-kicker">Award outcome</span>
                                        <h2>Notifications Center</h2>
                                        <p>View results, score breakdown, and continue to contracting if awarded.</p>
                                        <button class="btn btn-secondary" data-navigate="supplier-journey">View Outcome</button>
                                    </div>
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
    window.app.renderBiddingWorkspace = renderBiddingWorkspace;
}
