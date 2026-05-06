// Supplier Tender Detail Page Component

function renderSupplierTenderDetail() {
    const tender = typeof getProcurexSelectedTender === 'function' ? getProcurexSelectedTender() : mockData.tenders[0];
    const clarifications = tender.clarifications || [];
    const profile = typeof getCreateTenderTypeProfile === 'function'
        ? getCreateTenderTypeProfile(tender)
        : { commercialName: 'BOQ', defaultAttachments: [{ text: 'Technical specifications' }, { text: 'BOQ template' }, { text: 'Draft contract conditions' }] };
    const documents = tender.documents?.length ? tender.documents : profile.defaultAttachments?.map(item => item.text) || ['Tender document'];

    return `
        <div class="main-layout">
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Tender Detail</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Supplier view</div>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="supplier-marketplace">Marketplace</a></li>
                    <li><a href="#" data-navigate="supplier-journey">Supplier Journey</a></li>
                    <li><a href="#" data-navigate="bidding-workspace">Start Bid</a></li>
                    <li><a href="#" data-navigate="procurement-dashboard">Procurement Dashboard</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <div class="main-content">
                <div class="journey-page">
                    <section class="journey-hero compact">
                        <div>
                            <span class="badge badge-success">${tender.status}</span>
                            <h1>${tender.title}</h1>
                            <p>${tender.organization}. Review eligibility, documents, clarifications, and decide whether to watch, ask, or submit a sealed bid.</p>
                        </div>
                        <div class="hero-action-stack">
                            <button class="btn btn-secondary">Watchlist</button>
                            <button class="btn btn-secondary">Ask Clarification</button>
                            <button class="btn btn-primary" data-navigate="bidding-workspace">Start Bid</button>
                        </div>
                    </section>

                    <section class="journey-grid three-col">
                        <div class="kpi-card"><div class="kpi-value">95%</div><div class="kpi-label">Supplier match</div></div>
                        <div class="kpi-card"><div class="kpi-value">12d</div><div class="kpi-label">Time remaining</div></div>
                        <div class="kpi-card"><div class="kpi-value">${clarifications.length || 3}</div><div class="kpi-label">Clarifications</div></div>
                    </section>

                    <section class="journey-grid two-col">
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Opportunity summary</span>
                                    <h2>Supplier Tender Detail</h2>
                                </div>
                                <span class="badge badge-info">${tender.type}</span>
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
                                    <span class="section-kicker">Clarifications</span>
                                    <h2>Q&A and Amendments</h2>
                                </div>
                                <span class="badge badge-warning">1 amendment</span>
                            </div>
                            <div class="inbox-list">
                                <div class="inbox-item"><strong>Ask buyer</strong><span>Submit a private clarification request before the deadline.</span><button class="btn btn-secondary">Ask</button></div>
                                <div class="inbox-item"><strong>Solar backup answer</strong><span>Buyer confirmed solar-ready wiring is included.</span><button class="btn btn-secondary">View</button></div>
                                <div class="inbox-item"><strong>Amendment 01</strong><span>${profile.commercialName} line updated by the buyer.</span><button class="btn btn-secondary">Acknowledge</button></div>
                            </div>
                        </div>
                    </section>

                    <section class="journey-grid two-col">
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Documents</span>
                                    <h2>Tender Pack</h2>
                                </div>
                                <span class="badge badge-success">Downloaded</span>
                            </div>
                            <div class="attachment-grid">
                                ${documents.map(doc => `<div class="attachment-card"><strong>${doc}</strong><span>PDF / 2.3 MB</span></div>`).join('')}
                            </div>
                        </div>

                        <div class="journey-panel control-panel">
                            <span class="section-kicker">Bid submission</span>
                            <h2>Start Sealed Bid</h2>
                            <p>Prepare a ${profile.commercialName.toLowerCase()} response, add tender-specific uploads, validate requirements, review summary, and submit sealed bid for receipt hash.</p>
                            <button class="btn btn-primary" data-navigate="bidding-workspace">Start Bid</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `;
}

if (window.app) {
    window.app.renderSupplierTenderDetail = renderSupplierTenderDetail;
}
