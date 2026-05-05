// Bidding Workspace Page Component

function renderBiddingWorkspace() {
    return `
        <div class="main-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Bidding Workspace</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Construction of Rural Health Centers</div>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="tender-details">← Back to Tender</a></li>
                    <li><a href="#" data-navigate="supplier-marketplace">Marketplace</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <div style="max-width: 1000px; margin: 0 auto;">
                    <!-- Step Indicator -->
                    <div class="wizard-steps" style="margin-bottom: 32px;">
                        <div class="step-indicator">
                            <div class="step completed">
                                <div class="step-circle">✓</div>
                                <span>Eligibility</span>
                            </div>
                            <div class="step-line"></div>
                            <div class="step active">
                                <div class="step-circle">2</div>
                                <span>Technical</span>
                            </div>
                            <div class="step-line"></div>
                            <div class="step">
                                <div class="step-circle">3</div>
                                <span>Financial</span>
                            </div>
                            <div class="step-line"></div>
                            <div class="step">
                                <div class="step-circle">4</div>
                                <span>Review</span>
                            </div>
                        </div>
                    </div>

                    <!-- Envelope Tabs -->
                    <div class="envelope-tabs">
                        <div class="tabs">
                            <div class="tab active" data-tab="technical">Envelope A: Technical</div>
                            <div class="tab" data-tab="financial">Envelope B: Financial</div>
                        </div>
                    </div>

                    <!-- Tab Content -->
                    <div class="envelope-content">
                        <div class="tab-content" data-tab="technical" style="display: block;">
                            <h3 style="margin-bottom: 24px;">Technical Proposal (Envelope A)</h3>

                            <!-- Legal Documents -->
                            <div style="margin-bottom: 32px;">
                                <h4 style="margin-bottom: 16px;">Legal & Compliance Documents</h4>
                                <div class="upload-grid">
                                    <div class="upload-card">
                                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 8px;">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Business License</div>
                                        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">PDF, DOC up to 5MB</div>
                                        <input type="file" hidden>
                                        <button class="btn btn-secondary" style="font-size: 12px;">Choose File</button>
                                    </div>

                                    <div class="upload-card">
                                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 8px;">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Tax Clearance</div>
                                        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">PDF, DOC up to 5MB</div>
                                        <input type="file" hidden>
                                        <button class="btn btn-secondary" style="font-size: 12px;">Choose File</button>
                                    </div>

                                    <div class="upload-card">
                                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 8px;">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Company Profile</div>
                                        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">PDF, DOC up to 10MB</div>
                                        <input type="file" hidden>
                                        <button class="btn btn-secondary" style="font-size: 12px;">Choose File</button>
                                    </div>

                                    <div class="upload-card">
                                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 8px;">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <div style="font-weight: 500; margin-bottom: 4px;">Technical Proposal</div>
                                        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">PDF, DOC up to 20MB</div>
                                        <input type="file" hidden>
                                        <button class="btn btn-secondary" style="font-size: 12px;">Choose File</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Capability Statements -->
                            <div style="margin-bottom: 32px;">
                                <h4 style="margin-bottom: 16px;">Capability Statements</h4>
                                <div class="card">
                                    <div style="margin-bottom: 16px;">
                                        <label class="form-label">Relevant Experience</label>
                                        <textarea class="form-input" rows="4" placeholder="Describe your relevant experience with similar projects..."></textarea>
                                    </div>

                                    <div style="margin-bottom: 16px;">
                                        <label class="form-label">Technical Expertise</label>
                                        <textarea class="form-input" rows="4" placeholder="Detail your technical capabilities and expertise..."></textarea>
                                    </div>

                                    <div style="margin-bottom: 16px;">
                                        <label class="form-label">Project Team</label>
                                        <textarea class="form-input" rows="3" placeholder="Describe your project team composition and experience..."></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- Navigation -->
                            <div style="display: flex; justify-content: space-between; padding: 24px; background: var(--background); border-radius: 8px;">
                                <div>
                                    <div style="font-weight: 500; margin-bottom: 4px;">Envelope A Status</div>
                                    <div style="font-size: 14px; color: var(--text-secondary);">4 of 4 documents uploaded</div>
                                </div>
                                <div style="display: flex; gap: 12px;">
                                    <button class="btn btn-secondary">Save Draft</button>
                                    <button class="btn btn-primary">Next: Financial</button>
                                </div>
                            </div>
                        </div>

                        <div class="tab-content" data-tab="financial" style="display: none;">
                            <h3 style="margin-bottom: 24px;">Financial Proposal (Envelope B)</h3>

                            <!-- BOQ Table -->
                            <div style="margin-bottom: 32px;">
                                <h4 style="margin-bottom: 16px;">Bill of Quantities</h4>
                                <div class="card">
                                    <div class="data-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Description</th>
                                                    <th>Qty</th>
                                                    <th>Unit</th>
                                                    <th>Rate (TZS)</th>
                                                    <th>Amount (TZS)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1.1</td>
                                                    <td>Site preparation and clearing</td>
                                                    <td>1000</td>
                                                    <td>m²</td>
                                                    <td><input type="number" class="form-input" style="width: 100px; font-size: 12px;" placeholder="0"></td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <td>1.2</td>
                                                    <td>Foundation excavation</td>
                                                    <td>500</td>
                                                    <td>m³</td>
                                                    <td><input type="number" class="form-input" style="width: 100px; font-size: 12px;" placeholder="0"></td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <td>1.3</td>
                                                    <td>Concrete foundation</td>
                                                    <td>200</td>
                                                    <td>m³</td>
                                                    <td><input type="number" class="form-input" style="width: 100px; font-size: 12px;" placeholder="0"></td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <td>1.4</td>
                                                    <td>Structural steel work</td>
                                                    <td>50</td>
                                                    <td>tonnes</td>
                                                    <td><input type="number" class="form-input" style="width: 100px; font-size: 12px;" placeholder="0"></td>
                                                    <td>0</td>
                                                </tr>
                                                <tr style="background: var(--background); font-weight: 600;">
                                                    <td colspan="5">SUBTOTAL</td>
                                                    <td>0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <!-- Bank Guarantee -->
                            <div style="margin-bottom: 32px;">
                                <h4 style="margin-bottom: 16px;">Bid Security (Bank Guarantee)</h4>
                                <div class="upload-card" style="max-width: 300px;">
                                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 8px;">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <div style="font-weight: 500; margin-bottom: 4px;">Bank Guarantee</div>
                                    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">PDF, DOC up to 5MB</div>
                                    <input type="file" hidden>
                                    <button class="btn btn-secondary" style="font-size: 12px;">Choose File</button>
                                </div>
                            </div>

                            <!-- Navigation -->
                            <div style="display: flex; justify-content: space-between; padding: 24px; background: var(--background); border-radius: 8px;">
                                <div>
                                    <div style="font-weight: 500; margin-bottom: 4px;">Envelope B Status</div>
                                    <div style="font-size: 14px; color: var(--text-secondary);">BOQ: 0% complete • Guarantee: Not uploaded</div>
                                </div>
                                <div style="display: flex; gap: 12px;">
                                    <button class="btn btn-secondary">← Back to Technical</button>
                                    <button class="btn btn-primary">Review & Submit</button>
                                </div>
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
    window.app.renderBiddingWorkspace = renderBiddingWorkspace;
}