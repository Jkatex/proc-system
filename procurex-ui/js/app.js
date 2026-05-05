// ProcureX SPA Application

class ProcureXApp {
    constructor() {
        this.currentPage = 'welcome';
        this.currentRole = null;
        this.pages = {};
        this.init();
    }

    init() {
        this.setupRouting();
        this.loadAllPages();
        this.renderPage();
        this.setupEventListeners();
    }

    setupRouting() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, false);
            }
        });

        // Handle initial load
        const urlParams = new URLSearchParams(window.location.search);
        const initialPage = urlParams.get('page') || 'welcome';
        const initialRole = urlParams.get('role');

        if (initialRole && mockData.roles.includes(initialRole)) {
            this.setRole(initialRole);
        }

        this.navigateTo(initialPage, false);
    }

    setupEventListeners() {
        // Handle all navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-navigate]');
            if (link) {
                e.preventDefault();
                const page = link.getAttribute('data-navigate');
                const role = link.getAttribute('data-role');
                if (role) {
                    this.setRole(role);
                }
                this.navigateTo(page);
            }
        });

        // Handle form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const action = form.getAttribute('data-action');
            if (action) {
                e.preventDefault();
                this.handleFormAction(action, form);
            }
        });
    }

    setRole(role) {
        if (mockData.roles.includes(role)) {
            this.currentRole = role;
            mockData.currentRole = role;
            this.updateNavigation();
        }
    }

    navigateTo(page, updateHistory = true) {
        this.currentPage = page;
        if (updateHistory) {
            const url = `?page=${page}${this.currentRole ? `&role=${this.currentRole}` : ''}`;
            history.pushState({ page }, '', url);
        }
        this.renderPage();
    }

    renderPage() {
        const pageContent = document.getElementById('page-content');
        if (this.pages[this.currentPage]) {
            pageContent.innerHTML = this.pages[this.currentPage]();
            this.initializePageComponents();
        } else {
            pageContent.innerHTML = this.renderComingSoon();
        }
    }

    initializePageComponents() {
        // Initialize charts if present
        if (document.getElementById('admin-activity-chart')) {
            createChart('admin-activity-chart', 'adminActivity');
        }
        if (document.getElementById('buyer-spend-chart')) {
            createChart('buyer-spend-chart', 'buyerSpend');
        }

        // Initialize any interactive components
        this.initializeTabs();
        this.initializeForms();
    }

    initializeTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabGroup = tab.closest('.tabs');
                const tabContent = tabGroup.nextElementSibling;
                const targetTab = tab.getAttribute('data-tab');

                // Update tab states
                tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update content
                if (tabContent) {
                    tabContent.querySelectorAll('.tab-content').forEach(content => {
                        content.style.display = content.getAttribute('data-tab') === targetTab ? 'block' : 'none';
                    });
                }
            });
        });
    }

    initializeForms() {
        // Initialize OTP inputs
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });

        // Initialize file uploads
        const uploadAreas = document.querySelectorAll('.upload-area');
        uploadAreas.forEach(area => {
            area.addEventListener('click', () => {
                const input = area.querySelector('input[type="file"]');
                if (input) input.click();
            });

            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('dragover');
            });

            area.addEventListener('dragleave', () => {
                area.classList.remove('dragover');
            });

            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('dragover');
                const files = e.dataTransfer.files;
                // Handle file drop
            });
        });
    }

    handleFormAction(action, form) {
        switch (action) {
            case 'verify-otp':
                this.handleOTPVerification(form);
                break;
            case 'upload-documents':
                this.handleDocumentUpload(form);
                break;
            case 'create-tender':
                this.handleTenderCreation(form);
                break;
            case 'submit-bid':
                this.handleBidSubmission(form);
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    handleOTPVerification(form) {
        const otp = Array.from(form.querySelectorAll('.otp-input')).map(input => input.value).join('');
        if (otp.length === 6) {
            // Simulate verification
            setTimeout(() => {
                this.navigateTo('verification-status');
            }, 1000);
        }
    }

    handleDocumentUpload(form) {
        // Simulate upload
        setTimeout(() => {
            this.navigateTo('verification-status');
        }, 1000);
    }

    handleTenderCreation(form) {
        // Simulate tender creation
        setTimeout(() => {
            this.navigateTo('tender-publication');
        }, 1000);
    }

    handleBidSubmission(form) {
        // Simulate bid submission
        setTimeout(() => {
            alert('Bid submitted successfully!');
        }, 1000);
    }

    updateNavigation() {
        // Update sidebar navigation based on role
        const sidebarNavs = document.querySelectorAll('.sidebar-nav');
        sidebarNavs.forEach(nav => {
            nav.setAttribute('data-role', this.currentRole);
        });
    }

    loadAllPages() {
        // Load all page modules - render functions are registered by individual page files
        this.pages = {
            'welcome': () => window.app.renderWelcome ? window.app.renderWelcome() : this.renderWelcome(),
            'role-selection': () => window.app.renderRoleSelection ? window.app.renderRoleSelection() : this.renderRoleSelection(),
            'iam-verification': () => window.app.renderIAMVerification ? window.app.renderIAMVerification() : this.renderIAMVerification(),
            'verification-status': () => window.app.renderVerificationStatus ? window.app.renderVerificationStatus() : this.renderVerificationStatus(),
            'admin-dashboard': () => window.app.renderAdminDashboard ? window.app.renderAdminDashboard() : this.renderAdminDashboard(),
            'buyer-dashboard': () => window.app.renderBuyerDashboard ? window.app.renderBuyerDashboard() : this.renderBuyerDashboard(),
            'guest-marketplace': () => window.app.renderGuestMarketplace ? window.app.renderGuestMarketplace() : this.renderGuestMarketplace(),
            'supplier-marketplace': () => window.app.renderSupplierMarketplace ? window.app.renderSupplierMarketplace() : this.renderSupplierMarketplace(),
            'create-tender': () => window.app.renderCreateTender ? window.app.renderCreateTender() : this.renderCreateTender(),
            'tender-publication': () => window.app.renderTenderPublication ? window.app.renderTenderPublication() : this.renderTenderPublication(),
            'tender-details': () => window.app.renderTenderDetails ? window.app.renderTenderDetails() : this.renderTenderDetails(),
            'bidding-workspace': () => window.app.renderBiddingWorkspace ? window.app.renderBiddingWorkspace() : this.renderBiddingWorkspace(),
            'bid-evaluation': () => window.app.renderBidEvaluation ? window.app.renderBidEvaluation() : this.renderBidEvaluation(),
            'award-recommendation': () => window.app.renderAwardRecommendation ? window.app.renderAwardRecommendation() : this.renderAwardRecommendation(),
            'contract-negotiation': () => window.app.renderContractNegotiation ? window.app.renderContractNegotiation() : this.renderContractNegotiation(),
            'post-award-tracking': () => window.app.renderPostAwardTracking ? window.app.renderPostAwardTracking() : this.renderPostAwardTracking()
        };
    }

    renderComingSoon() {
        return `
            <div class="coming-soon">
                <svg class="coming-soon-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <h2 class="coming-soon-title">Coming Soon</h2>
                <p class="coming-soon-text">This feature is currently under development and will be available soon.</p>
                <button class="btn btn-primary" data-navigate="welcome">Back to Home</button>
            </div>
        `;
    }

    // Page render methods will be implemented in separate files
    renderWelcome() { return '<div>Loading welcome page...</div>'; }
    renderRoleSelection() { return '<div>Loading role selection...</div>'; }
    renderIAMVerification() { return '<div>Loading IAM verification...</div>'; }
    renderVerificationStatus() { return '<div>Loading verification status...</div>'; }
    renderAdminDashboard() { return '<div>Loading admin dashboard...</div>'; }
    renderBuyerDashboard() { return '<div>Loading buyer dashboard...</div>'; }
    renderGuestMarketplace() { return '<div>Loading guest marketplace...</div>'; }
    renderSupplierMarketplace() { return '<div>Loading supplier marketplace...</div>'; }
    renderCreateTender() { return '<div>Loading create tender...</div>'; }
    renderTenderPublication() { return '<div>Loading tender publication...</div>'; }
    renderTenderDetails() { return '<div>Loading tender details...</div>'; }
    renderBiddingWorkspace() { return '<div>Loading bidding workspace...</div>'; }
    renderBidEvaluation() { return '<div>Loading bid evaluation...</div>'; }
    renderAwardRecommendation() { return '<div>Loading award recommendation...</div>'; }
    renderContractNegotiation() { return '<div>Loading contract negotiation...</div>'; }
    renderPostAwardTracking() { return '<div>Loading post-award tracking...</div>'; }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ProcureXApp();
});