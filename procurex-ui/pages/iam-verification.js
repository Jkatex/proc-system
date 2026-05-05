// IAM Verification Page Component

function renderIAMVerification() {
    return `
        <div class="app-container">
            <div style="max-width: 800px; margin: 40px auto;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1>Identity Verification</h1>
                    <p style="color: var(--text-secondary);">Complete your verification to access the platform</p>
                </div>

                <!-- Step Indicator -->
                <div class="step-indicator" style="margin-bottom: 40px;">
                    <div class="step completed">
                        <div class="step-circle">✓</div>
                        <span>Choose Role</span>
                    </div>
                    <div class="step-line"></div>
                    <div class="step completed">
                        <div class="step-circle">✓</div>
                        <span>Organization</span>
                    </div>
                    <div class="step-line"></div>
                    <div class="step active">
                        <div class="step-circle">3</div>
                        <span>Verification</span>
                    </div>
                </div>

                <!-- OTP Verification -->
                <div class="card" style="margin-bottom: 32px;">
                    <h3 style="margin-bottom: 16px;">Phone Number Verification</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 24px;">
                        We've sent a 6-digit code to +255 XXX XXX XXX
                    </p>
                    <form data-action="verify-otp">
                        <div class="otp-inputs">
                            <input type="text" class="otp-input" maxlength="1" required>
                            <input type="text" class="otp-input" maxlength="1" required>
                            <input type="text" class="otp-input" maxlength="1" required>
                            <input type="text" class="otp-input" maxlength="1" required>
                            <input type="text" class="otp-input" maxlength="1" required>
                            <input type="text" class="otp-input" maxlength="1" required>
                        </div>
                        <div style="text-align: center; margin-top: 24px;">
                            <button type="submit" class="btn btn-primary">Verify Code</button>
                        </div>
                    </form>
                    <div style="text-align: center; margin-top: 16px;">
                        <button class="btn btn-secondary" style="font-size: 14px;">Resend Code</button>
                    </div>
                </div>

                <!-- Document Upload -->
                <div class="card">
                    <h3 style="margin-bottom: 16px;">Document Verification</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 24px;">
                        Upload the required documents for compliance verification
                    </p>

                    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                        <div class="upload-area">
                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 8px;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <div>BRELA Registration</div>
                            <input type="file" hidden>
                        </div>

                        <div class="upload-area">
                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 8px;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <div>TIN Certificate</div>
                            <input type="file" hidden>
                        </div>

                        <div class="upload-area">
                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 8px;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <div>Tax Clearance</div>
                            <input type="file" hidden>
                        </div>

                        <div class="upload-area">
                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 8px;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <div>Director's ID</div>
                            <input type="file" hidden>
                        </div>
                    </div>

                    <div style="margin-top: 24px;">
                        <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                            <input type="checkbox" required>
                            <span style="font-size: 14px;">I consent to the processing of my personal data for verification purposes</span>
                        </label>

                        <div style="display: flex; gap: 12px; justify-content: space-between;">
                            <button class="btn btn-secondary" data-navigate="role-selection">← Back</button>
                            <div style="display: flex; gap: 8px;">
                                <button class="btn btn-secondary" data-action="upload-documents" form="document-form">AI Auto-Verification</button>
                                <button class="btn btn-primary" data-action="upload-documents" form="document-form">Expert Manual Review</button>
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
    window.app.renderIAMVerification = renderIAMVerification;
}