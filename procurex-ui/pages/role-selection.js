// Onboarding entry page component

function renderRoleSelection() {
    return `
        <div class="app-container">
            <div style="max-width: 800px; margin: 80px auto; text-align: center;">
                <h1 style="margin-bottom: 16px;">Start ProcureX Onboarding</h1>
                <p style="color: var(--text-secondary); margin-bottom: 40px;">Create an account or sign in to continue with eKYC verification.</p>

                <div class="step-indicator">
                    <div class="step active">
                        <div class="step-circle">1</div>
                        <span>Account</span>
                    </div>
                    <div class="step-line"></div>
                    <div class="step">
                        <div class="step-circle">2</div>
                        <span>eKYC</span>
                    </div>
                    <div class="step-line"></div>
                    <div class="step">
                        <div class="step-circle">3</div>
                        <span>Verification Review</span>
                    </div>
                </div>

                <div class="role-cards">
                    <div class="role-card" data-navigate="register">
                        <svg class="role-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 00-8 0v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <h3>Create Account</h3>
                        <p>Register your login credentials before completing eKYC.</p>
                    </div>

                    <div class="role-card" data-navigate="sign-in">
                        <svg class="role-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 17l5-5-5-5"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H3"></path>
                        </svg>
                        <h3>Sign In</h3>
                        <p>Continue to eKYC or enter the platform with an existing account.</p>
                    </div>
                </div>

                <div style="margin-top: 40px;">
                    <button class="btn btn-secondary" data-navigate="welcome">Back</button>
                </div>
            </div>
        </div>
    `;
}

if (window.app) {
    window.app.renderRoleSelection = renderRoleSelection;
}
