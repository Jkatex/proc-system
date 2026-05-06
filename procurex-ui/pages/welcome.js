
// Welcome/Landing Page Component

function renderWelcome() {
    return `
        <div class="landing-page">
            <header class="landing-nav">
                <div class="landing-nav-inner container">
                    <div class="brand">
                        <span class="brand-mark">PX</span>
                        <span class="brand-text">ProcureX</span>
                    </div>
                    <nav class="landing-nav-links">
                        <a href="#" data-navigate="welcome">Home</a>
                        <a href="#" data-navigate="guest-marketplace">Marketplace</a>
                        
                        <a href="#" data-navigate="sign-in">Sign in</a>
                        <a href="#" class="nav-link-secondary" data-navigate="register">Get Started</a>
                    </nav>
                </div>
            </header>

            <main class="landing-hero container">
                <div class="hero-copy animate-fade-in">
                    <span class="eyebrow">Trusted procurement for government and enterprise</span>
                    <h1>Transparent Procurement. Smarter Decisions.</h1>
                    <p>Connect buyers, suppliers, and regulators on a secure, compliant platform built for modern public sector procurement.</p>
                    <div class="hero-actions">
                        <button class="btn btn-primary" data-navigate="register">Get Started</button>
                        <button class="btn btn-secondary" data-navigate="guest-marketplace">Learn More</button>
                    </div>
                    <div class="hero-stat-grid">
                        <div class="stat-card">
                            <strong>500+</strong>
                            <span>tenders processed</span>
                        </div>
                        <div class="stat-card">
                            <strong>98%</strong>
                            <span>compliance accuracy</span>
                        </div>
                        <div class="stat-card">
                            <strong>24/7</strong>
                            <span>auditable visibility</span>
                        </div>
                    </div>
                </div>
                <div class="hero-visual animate-fade-in delay-1">
                    <div class="visual-card">
                        <div class="visual-header">
                            <div class="visual-chip">Buyer Dashboard</div>
                            <svg class="visual-menu" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="5" r="1"></circle>
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="12" cy="19" r="1"></circle>
                            </svg>
                        </div>
                        <img class="visual-screenshot" src="../visily/visily-buyer-dashboard.jpg" alt="ProcureX buyer dashboard preview">
                        <div class="dashboard-preview">
                            <div class="preview-kpis">
                                <div class="kpi">
                                    <span class="kpi-label">Active Tenders</span>
                                    <strong>42</strong>
                                </div>
                                <div class="kpi">
                                    <span class="kpi-label">Pending Bids</span>
                                    <strong>18</strong>
                                </div>
                                <div class="kpi">
                                    <span class="kpi-label">Compliance</span>
                                    <strong>98%</strong>
                                </div>
                            </div>
                            <div class="preview-chart-container">
                                <div class="chart-label">Tender Activity (30 days)</div>
                                <div class="mini-chart">
                                    <div class="bar" style="height: 40%"></div>
                                    <div class="bar" style="height: 65%"></div>
                                    <div class="bar" style="height: 52%"></div>
                                    <div class="bar" style="height: 78%"></div>
                                    <div class="bar" style="height: 60%"></div>
                                    <div class="bar" style="height: 88%"></div>
                                </div>
                            </div>
                            <div class="preview-table">
                                <div class="table-header">
                                    <span>Recent Tenders</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                                <div class="table-rows">
                                    <div class="table-row">
                                        <span class="tender-name">Road Construction Q2</span>
                                        <span class="tender-badge">Open</span>
                                    </div>
                                    <div class="table-row">
                                        <span class="tender-name">IT Infrastructure</span>
                                        <span class="tender-badge">Evaluating</span>
                                    </div>
                                    <div class="table-row">
                                        <span class="tender-name">Healthcare Supplies</span>
                                        <span class="tender-badge">Awarded</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <section class="landing-section container">
                <div class="section-header">
                    <span class="section-label">Key features</span>
                    <h2>Identity, bidding, and award workflows designed for trust.</h2>
                </div>
                <div class="features-grid">
                    <div class="feature-card animate-fade-in">
                        <div class="feature-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h3>Identity and Trust Verification</h3>
                        <p>Secure onboarding for buyers and suppliers with compliance-first verification.</p>
                    </div>
                    <div class="feature-card animate-fade-in delay-1">
                        <div class="feature-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                            </svg>
                        </div>
                        <h3>Smart Tender Matching</h3>
                        <p>Automatically surface relevant opportunities based on capability and compliance.</p>
                    </div>
                    <div class="feature-card animate-fade-in delay-2">
                        <div class="feature-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22 6 12 13 2 6"></polyline>
                            </svg>
                        </div>
                        <h3>Secure Bid Submission</h3>
                        <p>Confidential bidding with audit trails, encryption, and tamper-resistant records.</p>
                    </div>
                    <div class="feature-card animate-fade-in delay-3">
                        <div class="feature-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="9" y1="12" x2="15" y2="12"></line>
                                <line x1="9" y1="16" x2="15" y2="16"></line>
                            </svg>
                        </div>
                        <h3>Transparent Evaluation and Awarding</h3>
                        <p>Clear scoring, audit-ready decisions, and fair supplier ranking.</p>
                    </div>
                </div>
            </section>

            <section class="landing-section container">
                <div class="section-header">
                    <span class="section-label">How it works</span>
                    <h2>From registration to contract management in four simple steps.</h2>
                </div>
                <div class="steps-flow">
                    <div class="step-item animate-fade-in">
                        <div class="step-badge">1</div>
                        <h4>Register and Verify</h4>
                        <p>Create an account, verify identity and compliance credentials.</p>
                    </div>
                    <div class="step-item animate-fade-in delay-1">
                        <div class="step-badge">2</div>
                        <h4>Create or Discover Tenders</h4>
                        <p>Publish opportunities or find matching government contracts.</p>
                    </div>
                    <div class="step-item animate-fade-in delay-2">
                        <div class="step-badge">3</div>
                        <h4>Submit and Evaluate Bids</h4>
                        <p>Send secure proposals and review bids with transparent scoring.</p>
                    </div>
                    <div class="step-item animate-fade-in delay-3">
                        <div class="step-badge">4</div>
                        <h4>Award and Manage Contracts</h4>
                        <p>Finalize awards, manage milestones, and keep performance on track.</p>
                    </div>
                </div>
            </section>

            <section class="landing-section container benefits-section">
                <div class="benefits-copy animate-fade-in">
                    <span class="section-label">Benefits</span>
                    <h2>Reduce risk, increase competition, and speed up procurement.</h2>
                    <ul class="benefits-list">
                        <li>Reduce fraud and bias through transparent workflows.</li>
                        <li>Increase competition by connecting verified suppliers.</li>
                        <li>Improve efficiency with streamlined digital processes.</li>
                        <li>Ensure compliance with audit-ready reporting.</li>
                    </ul>
                </div>
                <aside class="trust-panel animate-fade-in delay-1">
                    <div class="trust-card">
                        <p class="trust-stat">500+</p>
                        <p>tenders processed across procurement cycles.</p>
                    </div>
                    <div class="trust-badges">
                        <span>ISO 27001</span>
                        <span>GDPR-ready</span>
                        <span>Secure encryption</span>
                    </div>
                    <div class="testimonial">
                        <p>“ProcureX gave our team visibility into every tender and protected supplier data at every step.”</p>
                        <strong>— Procurement Officer</strong>
                    </div>
                </aside>
            </section>

            <section class="landing-cta container animate-fade-in delay-2">
                <div class="cta-panel">
                    <div>
                        <h2>Join buyers and suppliers building a safer procurement ecosystem.</h2>
                        <p>Start with a platform designed for public sector trust, transparency, and efficiency.</p>
                    </div>
                    <div class="cta-actions">
                        <button class="btn btn-primary" data-navigate="register">Join</button>
                
                    </div>
                </div>
            </section>

            <footer class="landing-footer container">
                <div class="footer-links">
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                    <a href="#">Privacy Policy</a>
                </div>
                <div class="footer-socials">
                    <span>LinkedIn</span>
                    <span>Twitter</span>
                    <span>GitHub</span>
                </div>
            </footer>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderWelcome = renderWelcome;
}
