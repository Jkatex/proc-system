// Tender Detail Page Component (Buyer View)

function renderTenderDetails() {
    const tender = mockData.tenders[0];

    return `
        <div class="main-layout">
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Tender Detail</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Buyer view and marketplace controls</div>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="tender-publication">Draft Detail</a></li>
                    <li><a href="#" data-navigate="buyer-journey">Buyer Journey</a></li>
                    <li><a href="#" data-navigate="bid-evaluation">Bid Opening</a></li>
                    <li><a href="#" data-navigate="award-recommendation">Award</a></li>
                    <li><a href="#" data-navigate="buyer-dashboard">Dashboard</a></li>
                </ul>
            </div>

            <div class="main-content">
                <div class="journey-page">
                    <section class="journey-hero compact">
                        <div>
                            <span class="badge badge-success">Active tender</span>
                            <h1>${tender.title}</h1>
                            <p>${tender.id} / ${tender.organization}. Manage live tender interactions, amendments, supplier clarifications, and bid opening controls.</p>
                        </div>
                        <div class="hero-action-stack">
                            <button class="btn btn-secondary">Create Amendment</button>
                            <button class="btn btn-primary" data-navigate="bid-evaluation">Authorize Opening</button>
                        </div>
                    </section>

                    <section class="journey-grid three-col">
                        <div class="kpi-card"><div class="kpi-value">247</div><div class="kpi-label">Marketplace views</div></div>
                        <div class="kpi-card"><div class="kpi-value">89</div><div class="kpi-label">Document downloads</div></div>
                        <div class="kpi-card"><div class="kpi-value">12d</div><div class="kpi-label">Time to close</div></div>
                    </section>

                    <section class="journey-grid two-col">
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Tender list active</span>
                                    <h2>Buyer Tender Detail</h2>
                                </div>
                                <span class="badge badge-success">${tender.status}</span>
                            </div>
                            <div class="record-summary">
                                <div><span>Description</span><strong>${tender.description}</strong></div>
                                <div><span>Budget</span><strong>TZS ${tender.budget.toLocaleString()}</strong></div>
                                <div><span>Eligibility</span><strong>${tender.eligibility}</strong></div>
                                <div><span>Closing date</span><strong>${tender.closingDate}</strong></div>
                            </div>
                        </div>

                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Clarifications inbox</span>
                                    <h2>Questions & Answers</h2>
                                </div>
                                <span class="badge badge-warning">3 open</span>
                            </div>
                            <div class="inbox-list">
                                <div class="inbox-item"><strong>Solar backup scope</strong><span>Does each health center include solar backup wiring?</span><button class="btn btn-secondary">Answer</button></div>
                                <div class="inbox-item"><strong>Site visit schedule</strong><span>Can suppliers attend one consolidated site visit?</span><button class="btn btn-secondary">Answer</button></div>
                                <div class="inbox-item"><strong>BOQ unit mismatch</strong><span>Item 3.1 shows centers but description says buildings.</span><button class="btn btn-secondary">Amend</button></div>
                            </div>
                        </div>
                    </section>

                    <section class="journey-grid three-col">
                        <div class="journey-panel control-panel">
                            <span class="section-kicker">Amendment control</span>
                            <h2>Amendment 01</h2>
                            <p>Update BOQ item 3.1 unit label, notify all watchers, and retain the previous version in the audit log.</p>
                            <button class="btn btn-secondary">Create Amendment</button>
                        </div>

                        <div class="journey-panel control-panel">
                            <span class="section-kicker">Bid opening authorization</span>
                            <h2>2 Users Required</h2>
                            <div class="approval-pair">
                                <span class="badge badge-success">Procurement officer signed</span>
                                <span class="badge badge-warning">Observer pending</span>
                            </div>
                            <button class="btn btn-primary" data-navigate="bid-evaluation">Open Authorization</button>
                        </div>

                        <div class="journey-panel control-panel">
                            <span class="section-kicker">Immutable report</span>
                            <h2>Opening Report</h2>
                            <p>Generated after bid opening, with envelope hashes, timestamp, and bidder register locked for evaluation.</p>
                            <button class="btn btn-secondary" data-navigate="bid-evaluation">Preview Report</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `;
}

if (window.app) {
    window.app.renderTenderDetails = renderTenderDetails;
}
