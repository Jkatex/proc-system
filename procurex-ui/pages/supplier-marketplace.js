// Procurement app marketplace. No dashboard inside the app.

function renderSupplierMarketplace() {
    const tenders = typeof getProcurexMarketplaceTenders === 'function' ? getProcurexMarketplaceTenders() : (mockData.tenders || []);
    const openCount = tenders.filter(tender => tender.status === 'Open').length;

    return `
        <div class="procurement-app-page">
            <main class="procurement-market-shell">
                <section class="procurement-market-hero">
                    <div>
                        <span class="section-kicker">Procurement app</span>
                        <h1>Marketplace</h1>
                        <p>View available tenders, create a new tender when buying, or bid when interested in an open opportunity.</p>
                    </div>
                    <div class="procurement-market-actions">
                        <button class="btn btn-primary" data-navigate="create-tender">Create Tender</button>
                            </div>
                </section>

                <section class="procurement-search-panel">
                    <div class="market-search-field">
                        <input type="text" placeholder="Search tenders, buyer, sector, or category">
                    </div>
                    <select class="form-input">
                        <option>All sectors</option>
                        <option>Health</option>
                        <option>Infrastructure</option>
                        <option>ICT</option>
                    </select>
                    <select class="form-input">
                        <option>All tender types</option>
                        <option>Goods</option>
                        <option>Works</option>
                        <option>Non-Consultancy Services</option>
                        <option>Consultancy Services</option>
                    </select>
                    <button class="btn btn-primary">Search</button>
                </section>

                <section class="procurement-market-summary">
                    <div class="kpi-card"><div class="kpi-value">${openCount}</div><div class="kpi-label">Open tenders</div></div>
                    <div class="kpi-card"><div class="kpi-value">${mockData.kpis.supplier.bidsInProgress}</div><div class="kpi-label">Draft bids</div></div>
                    <div class="kpi-card"><div class="kpi-value">${Math.min(mockData.kpis.supplier.closing48h, openCount)}</div><div class="kpi-label">Closing soon</div></div>
                </section>

                <section class="procurement-list-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Tender list</span>
                            <h2>Available opportunities</h2>
                        </div>
                        <span class="badge badge-success">${openCount} open</span>
                    </div>

                    <div class="procurement-tender-list market-list">
                        ${tenders.map(tender => `
                            <article class="procurement-tender-row market-row">
                                <div>
                                    <div class="tender-row-title">
                                        <strong>${tender.title}</strong>
                                        <span class="badge badge-${tender.status === 'Open' ? 'success' : tender.status === 'Evaluation' ? 'warning' : 'info'}">${tender.status}</span>
                                    </div>
                                    <p>${tender.organization} / ${tender.type} / Budget: TZS ${tender.budget.toLocaleString()}</p>
                                    <span>${tender.description}</span>
                                </div>
                                <div class="tender-row-actions">
                                    <button class="btn btn-secondary" data-select-tender="${tender.id}" data-navigate="${tender.createdByCurrentUser ? 'tender-details' : 'supplier-tender-detail'}">View Tender</button>
                                    <button class="btn btn-primary" data-select-tender="${tender.id}" ${tender.status === 'Open' && !tender.createdByCurrentUser ? 'data-navigate="bidding-workspace"' : 'disabled'}>${tender.createdByCurrentUser ? 'Your Tender' : 'Bid'}</button>
                                </div>
                            </article>
                        `).join('') || '<div class="scope-empty">No active marketplace tenders right now.</div>'}
                    </div>
                </section>
            </main>
        </div>
    `;
}

if (window.app) {
    window.app.renderSupplierMarketplace = renderSupplierMarketplace;
}
