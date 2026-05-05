// Tender Details Page Component

function renderTenderDetails() {
    const tender = mockData.tenders[0]; // Using first tender as example

    return `
        <div class="main-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Tender Details</h3>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="supplier-marketplace">← Back to Marketplace</a></li>
                    <li><a href="#" data-navigate="bidding-workspace">Start Bidding</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <div class="tender-content">
                    <!-- Main Content -->
                    <div class="tender-main">
                        <!-- Header -->
                        <div class="tender-header">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                                <button class="btn btn-secondary" data-navigate="supplier-marketplace">← Back to Marketplace</button>
                                <span class="badge badge-success">${tender.status}</span>
                            </div>
                            <h1>${tender.title}</h1>
                            <p style="color: var(--text-secondary); font-size: 16px;">Tender ID: ${tender.id} • ${tender.organization}</p>
                        </div>

                        <!-- Tabs -->
                        <div class="tender-tabs">
                            <div class="tabs">
                                <div class="tab active" data-tab="details">Tender Details</div>
                                <div class="tab" data-tab="documents">Documents & BOQ</div>
                                <div class="tab" data-tab="clarifications">Clarifications</div>
                            </div>
                        </div>

                        <!-- Tab Content -->
                        <div class="tab-content" data-tab="details" style="display: block;">
                            <!-- Executive Summary -->
                            <div class="card" style="margin-bottom: 24px;">
                                <h3 style="margin-bottom: 16px;">Executive Summary</h3>
                                <p style="margin-bottom: 16px;">${tender.description}</p>

                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px;">
                                    <div>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Estimated Budget</div>
                                        <div style="font-size: 18px; color: var(--primary-blue);">TZS ${tender.budget.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Tender Type</div>
                                        <div style="font-size: 18px;">${tender.type}</div>
                                    </div>
                                    <div>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Closing Date</div>
                                        <div style="font-size: 18px; color: var(--error-red);">${tender.closingDate}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Eligibility Requirements -->
                            <div class="card" style="margin-bottom: 24px;">
                                <h3 style="margin-bottom: 16px;">Eligibility Requirements</h3>
                                <ul style="space-y: 8px;">
                                    <li style="display: flex; align-items: start; gap: 8px;">
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style="color: var(--success-green); margin-top: 2px; flex-shrink: 0;">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span>${tender.eligibility}</span>
                                    </li>
                                    <li style="display: flex; align-items: start; gap: 8px;">
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style="color: var(--success-green); margin-top: 2px; flex-shrink: 0;">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span>Valid tax compliance certificate</span>
                                    </li>
                                    <li style="display: flex; align-items: start; gap: 8px;">
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style="color: var(--success-green); margin-top: 2px; flex-shrink: 0;">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span>Professional indemnity insurance</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- Bid Security -->
                            <div class="card">
                                <h3 style="margin-bottom: 16px;">Bid Security</h3>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                                    <div>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Security Amount</div>
                                        <div style="font-size: 18px; color: var(--primary-blue);">TZS 250,000</div>
                                    </div>
                                    <div>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Security Type</div>
                                        <div style="font-size: 18px;">Bank Guarantee</div>
                                    </div>
                                    <div>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Validity Period</div>
                                        <div style="font-size: 18px;">180 days</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-content" data-tab="documents" style="display: none;">
                            <div class="card">
                                <h3 style="margin-bottom: 16px;">Tender Documents</h3>
                                <div style="space-y: 12px;">
                                    ${tender.documents.map(doc => `
                                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid var(--border); border-radius: 6px;">
                                            <div style="display: flex; align-items: center; gap: 12px;">
                                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                <div>
                                                    <div style="font-weight: 500;">${doc}</div>
                                                    <div style="font-size: 12px; color: var(--text-secondary);">PDF • 2.3 MB</div>
                                                </div>
                                            </div>
                                            <button class="btn btn-primary" style="font-size: 12px; padding: 6px 12px;">Download</button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="tab-content" data-tab="clarifications" style="display: none;">
                            <div class="card">
                                <h3 style="margin-bottom: 16px;">Clarifications & Q&A</h3>
                                <p style="color: var(--text-secondary); margin-bottom: 16px;">No clarifications have been requested yet. Check back later or submit your own clarification request.</p>
                                <button class="btn btn-secondary">Request Clarification</button>
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="tender-sidebar">
                        <!-- Ready to Bid -->
                        <div class="card" style="margin-bottom: 24px;">
                            <h4 style="margin-bottom: 16px;">Ready to Bid?</h4>

                            <div style="margin-bottom: 16px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>Time Remaining</span>
                                    <span style="font-weight: 600; color: var(--error-red);">12 days 4 hours</span>
                                </div>
                                <div style="width: 100%; height: 8px; background: var(--background); border-radius: 4px;">
                                    <div style="width: 75%; height: 100%; background: var(--warning-amber); border-radius: 4px;"></div>
                                </div>
                            </div>

                            <div style="margin-bottom: 16px;">
                                <h5 style="margin-bottom: 8px;">Tender Timeline</h5>
                                <div style="space-y: 8px;">
                                    <div style="display: flex; justify-content: space-between; font-size: 14px;">
                                        <span>Publication</span>
                                        <span>Jan 15, 2024</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; font-size: 14px;">
                                        <span>Pre-bid Meeting</span>
                                        <span>Jan 25, 2024</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; font-size: 14px;">
                                        <span>Closing Date</span>
                                        <span>Feb 15, 2024</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; font-size: 14px;">
                                        <span>Evaluation</span>
                                        <span>Feb 20, 2024</span>
                                    </div>
                                </div>
                            </div>

                            <button class="btn btn-primary" style="width: 100%;" data-navigate="bidding-workspace">Start Bidding Process</button>
                        </div>

                        <!-- Tender Stats -->
                        <div class="card" style="margin-bottom: 24px;">
                            <h4 style="margin-bottom: 16px;">Tender Statistics</h4>
                            <div style="space-y: 12px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Views</span>
                                    <span style="font-weight: 600;">247</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Downloads</span>
                                    <span style="font-weight: 600;">89</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Watchers</span>
                                    <span style="font-weight: 600;">34</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Questions</span>
                                    <span style="font-weight: 600;">3</span>
                                </div>
                            </div>
                        </div>

                        <!-- Contact -->
                        <div class="card">
                            <h4 style="margin-bottom: 16px;">Contact Procurement Officer</h4>
                            <div style="space-y: 8px;">
                                <div style="font-size: 14px;">
                                    <div style="font-weight: 500;">Sarah Johnson</div>
                                    <div style="color: var(--text-secondary);">Procurement Officer</div>
                                </div>
                                <div style="font-size: 14px;">
                                    <div style="color: var(--text-secondary);">Email:</div>
                                    <div>sarah.johnson@health.go.tz</div>
                                </div>
                                <div style="font-size: 14px;">
                                    <div style="color: var(--text-secondary);">Phone:</div>
                                    <div>+255 22 123 4567</div>
                                </div>
                            </div>
                            <button class="btn btn-secondary" style="width: 100%; margin-top: 16px;">Send Message</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderTenderDetails = renderTenderDetails;
}