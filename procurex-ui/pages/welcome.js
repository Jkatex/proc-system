// Welcome/Landing Page Component

function renderWelcome() {
    return `
        <div class="app-container">
            <!-- Hero Section -->
            <section class="welcome-hero">
                <div class="container">
                    <h1>Digitizing Tanzanian Procurement Excellence</h1>
                    <p>Transparent, efficient, and SME-empowering procurement platform</p>
                    <div class="flex gap-4 justify-center">
                        <button class="btn btn-primary" data-navigate="role-selection">Get Started</button>
                        <button class="btn btn-secondary" data-navigate="guest-marketplace">Browse Tenders</button>
                    </div>
                </div>
            </section>

            <!-- Features Grid -->
            <section class="container features-grid">
                <div class="feature-card">
                    <h3>Absolute Transparency</h3>
                    <p>Every bid, evaluation, and award is recorded on the blockchain for complete transparency</p>
                </div>
                <div class="feature-card">
                    <h3>SME Empowerment</h3>
                    <p>Level playing field for small and medium enterprises with smart matching algorithms</p>
                </div>
                <div class="feature-card">
                    <h3>Smart Bidding</h3>
                    <p>AI-powered bid optimization and real-time market intelligence</p>
                </div>
            </section>

            <!-- CTA Cards -->
            <section class="container cta-cards">
                <div class="card">
                    <h3>Procurement Officers</h3>
                    <p>Create tenders, evaluate bids, and award contracts with confidence</p>
                    <button class="btn btn-primary" data-navigate="role-selection" data-role="buyer">Start as Buyer</button>
                </div>
                <div class="card">
                    <h3>Suppliers & Contractors</h3>
                    <p>Access opportunities, submit competitive bids, and grow your business</p>
                    <button class="btn btn-primary" data-navigate="role-selection" data-role="supplier">Start as Supplier</button>
                </div>
            </section>

            <!-- Footer -->
            <footer class="text-center text-secondary" style="padding: 40px 0; border-top: 1px solid var(--border);">
                <p>&copy; 2024 ProcureX Tanzania. Digitizing procurement excellence.</p>
            </footer>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderWelcome = renderWelcome;
}