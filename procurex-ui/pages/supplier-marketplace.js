// Supplier Marketplace Page Component

function renderSupplierMarketplace() {
    const kpis = mockData.kpis.supplier;
    const tenders = mockData.tenders;

    return `
        <div class="main-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>ProcureX Supplier</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">${mockData.users.supplier.organization}</div>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="supplier-marketplace" class="active">Marketplace</a></li>
                    <li><a href="#" data-navigate="coming-soon">My Bids</a></li>
                    <li><a href="#" data-navigate="coming-soon">Contracts</a></li>
                    <li><a href="#" data-navigate="coming-soon">Performance</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <div class="header">
                    <h1>Supplier Marketplace</h1>
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span>Welcome, ${mockData.users.supplier.name}</span>
                        <button class="btn btn-secondary">Settings</button>
                    </div>
                </div>

                <!-- KPI Row -->
                <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); margin-bottom: 24px;">
                    <div class="kpi-card">
                        <div class="kpi-value">${kpis.matchedTenders}</div>
                        <div class="kpi-label">MATCHED TENDERS</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${kpis.bidsInProgress}</div>
                        <div class="kpi-label">BIDS IN PROGRESS</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${kpis.closing48h}</div>
                        <div class="kpi-label">CLOSING 48H</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${kpis.watchlist}</div>
                        <div class="kpi-label">WATCHLIST</div>
                    </div>
                </div>

                <!-- Search and Filters -->
                <div class="card" style="margin-bottom: 24px;">
                    <div style="display: flex; gap: 16px; align-items: center;">
                        <div style="flex: 1;">
                            <input type="text" placeholder="Search tenders..." style="width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px;">
                        </div>
                        <select style="padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px;">
                            <option>All Sectors</option>
                            <option>Health</option>
                            <option>Infrastructure</option>
                            <option>ICT</option>
                        </select>
                        <select style="padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px;">
                            <option>All Types</option>
                            <option>Goods</option>
                            <option>Works</option>
                            <option>Services</option>
                        </select>
                        <button class="btn btn-primary">Search</button>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="tabs">
                    <div class="tab active" data-tab="matched">Matched Opportunities</div>
                    <div class="tab" data-tab="watchlist">My Watchlist</div>
                    <div class="tab" data-tab="all">All Tenders</div>
                </div>

                <!-- Tab Content -->
                <div class="tab-content" data-tab="matched" style="display: block;">
                    <div class="tenders-grid">
                        ${tenders.filter(t => t.status === 'Open').map(tender => `
                            <div class="tender-card">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <span class="badge badge-success">${tender.status}</span>
                                    <div style="display: flex; gap: 4px;">
                                        <button class="btn btn-secondary" style="font-size: 12px; padding: 4px 8px;">Watch</button>
                                        <button class="btn btn-primary" style="font-size: 12px; padding: 4px 8px;" data-navigate="tender-details">View Details</button>
                                    </div>
                                </div>
                                <h4 class="tender-title">${tender.title}</h4>
                                <div class="tender-meta">
                                    <div>${tender.organization}</div>
                                    <div>Budget: TZS ${tender.budget.toLocaleString()}</div>
                                    <div>Closes: ${tender.closingDate}</div>
                                </div>
                                <p class="tender-description">${tender.description}</p>
                                <div style="margin-top: 16px; display: flex; gap: 8px;">
                                    <button class="btn btn-primary" style="flex: 1;" data-navigate="bidding-workspace">Bid Now</button>
                                    <div style="font-size: 12px; color: var(--text-secondary); align-self: center;">Match: 95%</div>
                                </div>
                            </div>
                        `).join('')}

                        ${tenders.filter(t => t.status !== 'Open').map(tender => `
                            <div class="tender-card" style="opacity: 0.7;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <span class="badge badge-warning">${tender.status}</span>
                                    <div style="display: flex; gap: 4px;">
                                        <button class="btn btn-secondary" style="font-size: 12px; padding: 4px 8px;">Watch</button>
                                        <button class="btn btn-primary" style="font-size: 12px; padding: 4px 8px;" data-navigate="tender-details">View Details</button>
                                    </div>
                                </div>
                                <h4 class="tender-title">${tender.title}</h4>
                                <div class="tender-meta">
                                    <div>${tender.organization}</div>
                                    <div>Budget: TZS ${tender.budget.toLocaleString()}</div>
                                    <div>Closes: ${tender.closingDate}</div>
                                </div>
                                <p class="tender-description">${tender.description}</p>
                                <div style="margin-top: 16px; display: flex; gap: 8px;">
                                    <button class="btn btn-secondary" style="flex: 1;" disabled>Compliance Required</button>
                                    <div style="font-size: 12px; color: var(--error-red); align-self: center;">Match: 45%</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="tab-content" data-tab="watchlist" style="display: none;">
                    <div class="card">
                        <p>Your watchlist is empty. Start watching tenders to get notified about updates.</p>
                    </div>
                </div>

                <div class="tab-content" data-tab="all" style="display: none;">
                    <div class="tenders-grid">
                        ${tenders.map(tender => `
                            <div class="tender-card">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <span class="badge badge-${tender.status === 'Open' ? 'success' : tender.status === 'Evaluation' ? 'warning' : 'info'}">${tender.status}</span>
                                    <button class="btn btn-primary" style="font-size: 12px; padding: 4px 8px;" data-navigate="tender-details">View Details</button>
                                </div>
                                <h4 class="tender-title">${tender.title}</h4>
                                <div class="tender-meta">
                                    <div>${tender.organization}</div>
                                    <div>Budget: TZS ${tender.budget.toLocaleString()}</div>
                                    <div>Closes: ${tender.closingDate}</div>
                                </div>
                                <p class="tender-description">${tender.description}</p>
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
    window.app.renderSupplierMarketplace = renderSupplierMarketplace;
}