// IAM registration and eKYC review page.

function renderVerificationStatus() {
    const user = mockData.users.buyer || {};
    const docs = mockData.complianceDocs;
    const profile = mockData.eKycProfile || {};
    const account = mockData.pendingAccount || {};
    const isComplete = profile.status === 'completed' || account.ekycCompleted || mockData.session?.isNewUser === false;
    const applicantType = profile.entityType || 'account';
    const registryRecord = profile.registryRecord || {};

    return `
        <div class="main-layout">
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3 style="margin-bottom: 16px;">IAM</h3>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span class="badge ${isComplete ? 'badge-success' : 'badge-warning'}">${isComplete ? 'Completed' : 'Pending'} registration</span>
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Risk Score: ${user.riskScore}/100</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Bid Limit: TZS ${user.bidLimit?.toLocaleString()}</div>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="verification-status" class="active">IAM Review</a></li>
                    <li><a href="#" data-navigate="supplier-marketplace">Procurement App</a></li>
                    <li><a href="#" data-navigate="app-launcher">All Apps</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <div class="main-content">
                <div style="background: ${isComplete ? 'var(--success-bg)' : 'var(--warning-bg)'}; border: 1px solid ${isComplete ? 'rgba(49, 162, 76, 0.35)' : 'rgba(242, 169, 24, 0.55)'}; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="badge ${isComplete ? 'badge-success' : 'badge-warning'}">${isComplete ? 'Completed registration' : 'Action required'}</span>
                    </div>
                    <p style="color: var(--text-primary); margin-top: 8px;">${isComplete ? 'The IAM registration and eKYC record is complete. Review the verified details below before opening the procurement workspace.' : 'Complete eKYC to unlock the app launcher and procurement workspace.'}</p>
                </div>

                <div class="card">
                    <h3 style="margin-bottom: 20px;">Registered IAM Details</h3>
                    <div class="registry-summary" style="margin-bottom: 24px;">
                        <div><span>Applicant type</span><strong>${applicantType}</strong></div>
                        ${profile.businessRegistrationMethod ? `<div><span>Registration method</span><strong>${profile.businessRegistrationMethod}</strong></div>` : ''}
                        <div><span>Verified name</span><strong>${profile.verifiedName || registryRecord.name || account.displayName || 'Existing user account'}</strong></div>
                        <div><span>Registry source</span><strong>${profile.registrySource || registryRecord.source || 'TRA / BRELA'}</strong></div>
                        <div><span>Reference</span><strong>${profile.tinNumber || profile.brelaNumber || profile.businessNumber || registryRecord.reference || 'Stored on account'}</strong></div>
                        <div><span>Signature</span><strong>${profile.signatureName || 'Stored digital signature'}</strong></div>
                        <div><span>Blockchain anchor</span><strong>${profile.signatureAnchor || 'Pending implementation'}</strong></div>
                    </div>

                    <h3 style="margin-bottom: 16px;">Regulatory Documents</h3>
                    <div style="display: grid; gap: 12px;">
                        ${docs.map(doc => `
                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 16px; border: 1px solid var(--border); border-radius: 8px;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; ${doc.status === 'approved' ? 'background: #dcfce7; color: #166534;' : doc.status === 'reviewing' ? 'background: #fef3c7; color: #92400e;' : 'background: #fee2e2; color: #991b1b;'}">
                                        ${doc.status === 'approved' ? 'OK' : doc.status === 'reviewing' ? '...' : 'X'}
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
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <button class="btn btn-accent iam-update-button" data-navigate="iam-verification">Update IAM</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

if (window.app) {
    window.app.renderVerificationStatus = renderVerificationStatus;
}
