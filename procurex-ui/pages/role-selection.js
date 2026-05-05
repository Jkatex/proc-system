// Role Selection Page Component

function renderRoleSelection() {
    return `
        <div class="app-container">
            <div style="max-width: 800px; margin: 80px auto; text-align: center;">
                <h1 style="margin-bottom: 16px;">Choose Your Role</h1>
                <p style="color: var(--text-secondary); margin-bottom: 40px;">Select how you want to use the ProcureX platform</p>

                <!-- Step Indicator -->
                <div class="step-indicator">
                    <div class="step active">
                        <div class="step-circle">1</div>
                        <span>Choose Role</span>
                    </div>
                    <div class="step-line"></div>
                    <div class="step">
                        <div class="step-circle">2</div>
                        <span>Organization</span>
                    </div>
                    <div class="step-line"></div>
                    <div class="step">
                        <div class="step-circle">3</div>
                        <span>Verification</span>
                    </div>
                </div>

                <!-- Role Cards -->
                <div class="role-cards">
                    <div class="role-card" data-navigate="register" data-role="buyer">
                        <svg class="role-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <h3>Procurement Officer</h3>
                        <p>Create tenders, evaluate bids, and manage procurement processes</p>
                    </div>

                    <div class="role-card" data-navigate="register" data-role="supplier">
                        <svg class="role-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                        <h3>Supplier/Contractor</h3>
                        <p>Access opportunities, submit bids, and win government contracts</p>
                    </div>

                    <div class="role-card" data-navigate="register" data-role="admin">
                        <svg class="role-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <h3>Admin</h3>
                        <p>Manage platform settings and user governance</p>
                    </div>
                </div>

                <div style="margin-top: 40px;">
                    <button class="btn btn-secondary" data-navigate="welcome">← Back</button>
                </div>
            </div>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderRoleSelection = renderRoleSelection;
}