// Guest Marketplace Page Component

function renderGuestMarketplace() {
    const tenders = mockData.tenders;

    return `
        <div class="app-container">
            <!-- Header -->
            <div class="header" style="position: sticky; top: 0; z-index: 10;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <h1>ProcureX Marketplace</h1>
                    <button class="btn btn-primary" data-navigate="sign-in">Sign In to Bid</button>
                </div>
            </div>

            <!-- Hero Section -->
            <div class="marketplace-hero">
                <h2>Discover Procurement Opportunities</h2>
                <p>Browse active tenders and government contracts</p>

                <!-- Search Bar -->
                <div class="marketplace-search-wrap">
                    <div class="marketplace-search">
                        <input type="text" placeholder="Search tenders...">
                        <button class="btn btn-secondary">Search</button>
                    </div>
                </div>
            </div>

            <!-- Filters and Content -->
            <div class="marketplace-grid">
                <!-- Sidebar Filters -->
                <div class="marketplace-sidebar">
                    <h3 style="margin-bottom: 16px;">Filters</h3>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-weight: 500; margin-bottom: 8px;">Sector</label>
                        <select class="form-input">
                            <option>All Sectors</option>
                            <option>Health</option>
                            <option>Education</option>
                            <option>Infrastructure</option>
                            <option>ICT</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-weight: 500; margin-bottom: 8px;">Tender Type</label>
                        <select class="form-input">
                            <option>All Types</option>
                            <option>Goods</option>
                            <option>Works</option>
                            <option>Non-Consultancy Services</option>
                            <option>Consultancy Services</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-weight: 500; margin-bottom: 8px;">Budget Range</label>
                        <select class="form-input">
                            <option>All Ranges</option>
                            <option>Under 1M TZS</option>
                            <option>1M - 10M TZS</option>
                            <option>10M - 50M TZS</option>
                            <option>Over 50M TZS</option>
                        </select>
                    </div>

                    <button class="btn btn-primary" style="width: 100%;">Apply Filters</button>
                </div>

                <!-- Main Content -->
                <div class="marketplace-content">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <h3>Latest Opportunities</h3>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-secondary">Sort by Date</button>
                            <button class="btn btn-secondary">Sort by Budget</button>
                        </div>
                    </div>

                    <!-- Tender Cards Grid -->
                    <div class="tenders-grid">
                        ${tenders.map(tender => `
                            <div class="tender-card">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <span class="badge badge-${tender.status === 'Open' ? 'success' : tender.status === 'Evaluation' ? 'warning' : 'info'}">${tender.status}</span>
                                    <span style="font-size: 12px; color: var(--text-secondary);">${tender.type}</span>
                                </div>
                                <h4 class="tender-title">${tender.title}</h4>
                                <div class="tender-meta">
                                    <div>${tender.organization}</div>
                                    <div>Budget: TZS ${tender.budget.toLocaleString()}</div>
                                    <div>Closes: ${tender.closingDate}</div>
                                </div>
                                <p class="tender-description">${tender.description}</p>
                                <div style="margin-top: 16px;">
                                    <button class="btn btn-primary" style="width: 100%;" data-navigate="sign-in">Sign In to Bid</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Value Proposition -->
                    <div style="background: var(--primary-blue-light); padding: 40px; border-radius: 12px; text-align: center; margin-top: 40px;">
                        <h3 style="margin-bottom: 16px;">Why Choose ProcureX?</h3>
                        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-top: 24px;">
                            <div>
                                <h4>Transparent Process</h4>
                                <p>Every bid and evaluation is recorded on blockchain for complete transparency</p>
                            </div>
                            <div>
                                <h4>SME Friendly</h4>
                                <p>Smart matching algorithms ensure fair opportunities for small businesses</p>
                            </div>
                            <div>
                                <h4>Secure & Compliant</h4>
                                <p>Bank-grade security with full regulatory compliance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderGuestMarketplace = renderGuestMarketplace;
}
