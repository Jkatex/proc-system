// Verification Status Page Component

function renderVerificationStatus() {
    const user = mockData.users[mockData.currentRole] || {};
    const docs = mockData.complianceDocs;
    const profile = mockData.eKycProfile || {};
    const dashboardPage = `${mockData.currentRole || 'buyer'}-dashboard`;

    return `
        <div class="main-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3 style="margin-bottom: 16px;">Trust Center</h3>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span class="badge badge-${user.trustTier === 'Gold' ? 'success' : 'warning'}">${user.trustTier} Tier</span>
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Risk Score: ${user.riskScore}/100</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Bid Limit: TZS ${user.bidLimit?.toLocaleString()}</div>
                    ${profile.businessName ? `<div style="font-size: 12px; color: var(--text-secondary); margin-top: 8px;">${profile.businessName}</div>` : ''}
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="verification-status" class="active">Compliance Center</a></li>
                    <li><a href="#" data-navigate="guest-marketplace">Marketplace</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <!-- Action Required Banner -->
                <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        <span style="font-weight: 600; color: #92400e;">Action Required</span>
                    </div>
                    <p style="color: #92400e; margin-top: 4px;">Please review and address the compliance issues below to unlock full platform access.</p>
                </div>

                <!-- Compliance Checklist -->
                <div class="card">
                    <h3 style="margin-bottom: 20px;">Compliance Checklist</h3>
                    ${profile.status === 'submitted' ? `
                        <div style="background: #ecfdf5; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin-bottom: 18px; color: #166534;">
                            eKYC submitted for <strong>${profile.role}</strong>${profile.businessLine ? ` in ${profile.businessLine}` : ''}. Digital signature and uploaded documents are now under review.
                        </div>
                    ` : ''}

                    <div style="space-y: 16px;">
                        ${docs.map(doc => `
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border: 1px solid var(--border); border-radius: 8px;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; ${doc.status === 'approved' ? 'background: #dcfce7; color: #166534;' : doc.status === 'reviewing' ? 'background: #fef3c7; color: #92400e;' : 'background: #fee2e2; color: #991b1b;'}">
                                        ${doc.status === 'approved' ? '✓' : doc.status === 'reviewing' ? '⏳' : '✗'}
                                    </div>
                                    <div>
                                        <div style="font-weight: 500;">${doc.name}</div>
                                        ${doc.reason ? `<div style="font-size: 12px; color: var(--error-red);">${doc.reason}</div>` : ''}
                                    </div>
                                </div>
                                <span class="badge badge-${doc.status === 'approved' ? 'success' : doc.status === 'reviewing' ? 'warning' : 'error'}">${doc.status}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border);">
                        <div style="display: flex; gap: 12px;">
                            <button class="btn btn-secondary" data-navigate="iam-verification">← Re-upload Documents</button>
                            <button class="btn btn-primary" data-navigate="${dashboardPage}">Continue to Dashboard</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderVerificationStatus = renderVerificationStatus;
}
