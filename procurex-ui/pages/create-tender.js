// Create Tender Page Component (Wizard)

function renderCreateTender() {
    return `
        <div class="main-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Create Tender</h3>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="buyer-dashboard">← Back to Dashboard</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <div class="wizard-container">
                    <!-- Step Indicator -->
                    <div class="wizard-steps">
                        <div class="step-indicator">
                            <div class="step active">
                                <div class="step-circle">1</div>
                                <span>General Info</span>
                            </div>
                            <div class="step-line"></div>
                            <div class="step">
                                <div class="step-circle">2</div>
                                <span>BOQ & Budget</span>
                            </div>
                            <div class="step-line"></div>
                            <div class="step">
                                <div class="step-circle">3</div>
                                <span>Timelines</span>
                            </div>
                            <div class="step-line"></div>
                            <div class="step">
                                <div class="step-circle">4</div>
                                <span>Evaluation</span>
                            </div>
                        </div>
                    </div>

                    <!-- Wizard Content -->
                    <div class="wizard-content">
                        <h2 style="margin-bottom: 24px;">Step 1: General Information</h2>

                        <!-- Tender Classification -->
                        <div style="margin-bottom: 32px;">
                            <h3 style="margin-bottom: 16px;">Tender Classification</h3>
                            <p style="color: var(--text-secondary); margin-bottom: 16px;">Select the type of goods, works, or services you want to procure</p>

                            <div class="classification-grid">
                                <div class="classification-card selected">
                                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 12px;">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                    <h4>Goods</h4>
                                    <p>Purchase of physical items, equipment, or supplies</p>
                                </div>

                                <div class="classification-card">
                                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 12px;">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    <h4>Works</h4>
                                    <p>Construction, infrastructure, or building projects</p>
                                </div>

                                <div class="classification-card">
                                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 12px;">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <h4>Services</h4>
                                    <p>Professional services, maintenance, or consulting</p>
                                </div>

                                <div class="classification-card">
                                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 12px;">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                    <h4>Consultancy</h4>
                                    <p>Expert advice, studies, or technical assistance</p>
                                </div>
                            </div>
                        </div>

                        <!-- Tender Details -->
                        <div style="margin-bottom: 32px;">
                            <h3 style="margin-bottom: 16px;">Tender Details</h3>

                            <div class="form-group">
                                <label class="form-label">Tender Title *</label>
                                <input type="text" class="form-input" placeholder="Enter a clear, descriptive title for your tender" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Scope of Work *</label>
                                <textarea class="form-input" rows="4" placeholder="Describe the goods, works, or services required in detail" required></textarea>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Procuring Entity</label>
                                <input type="text" class="form-input" value="${mockData.users.buyer.organization}" readonly>
                            </div>
                        </div>

                        <!-- Compliance Sentinel Sidebar -->
                        <div style="background: var(--background); padding: 20px; border-radius: 8px; border: 1px solid var(--border);">
                            <h4 style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Compliance Sentinel
                            </h4>

                            <div style="space-y: 12px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--success-green);"></div>
                                    <span style="font-size: 14px;">Tender classification selected</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--warning-amber);"></div>
                                    <span style="font-size: 14px;">Tender title required</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--warning-amber);"></div>
                                    <span style="font-size: 14px;">Scope description required</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--success-green);"></div>
                                    <span style="font-size: 14px;">Procuring entity verified</span>
                                </div>
                            </div>
                        </div>

                        <!-- Navigation -->
                        <div style="display: flex; justify-content: space-between; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border);">
                            <button class="btn btn-secondary" data-navigate="buyer-dashboard">Cancel</button>
                            <button class="btn btn-primary" data-navigate="tender-publication">Next: BOQ & Budget</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderCreateTender = renderCreateTender;
}