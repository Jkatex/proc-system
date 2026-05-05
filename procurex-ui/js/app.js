// ProcureX SPA Application

class ProcureXApp {
    constructor() {
        this.currentPage = 'welcome';
        this.currentRole = null;
        this.pages = {};
        this.registrationTimer = null;
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

    getNavigationHeader() {
        // Auth and onboarding pages include their own focused headers.
        if (['welcome', 'register', 'sign-in', 'iam-verification'].includes(this.currentPage)) return '';

        const backPage = this.getBackPage();
        const pageTitle = this.getPageTitle();

        return `
            <div class="nav-header">
                <div class="nav-header-content">
                    ${backPage ? `<button class="nav-back-btn" data-navigate="${backPage}" title="Go back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>` : ''}
                    <h1 class="nav-title">${pageTitle}</h1>
                    <div class="nav-actions">
                        <button class="nav-home-btn" data-navigate="welcome" title="Home">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getBackPage() {
        const navigationFlow = {
            'register': 'welcome',
            'sign-in': 'register',
            'role-selection': 'welcome',
            'iam-verification': 'sign-in',
            'verification-status': 'iam-verification',
            'admin-dashboard': 'verification-status',
            'buyer-dashboard': 'verification-status',
            'buyer-journey': 'buyer-dashboard',
            'supplier-dashboard': 'verification-status',
            'supplier-journey': 'supplier-dashboard',
            'supplier-marketplace': 'supplier-dashboard',
            'supplier-tender-detail': 'supplier-marketplace',
            'guest-marketplace': 'welcome',
            'create-tender': 'buyer-dashboard',
            'tender-publication': 'create-tender',
            'tender-details': 'tender-publication',
            'bidding-workspace': 'supplier-tender-detail',
            'bid-evaluation': 'buyer-dashboard',
            'award-recommendation': 'bid-evaluation',
            'contract-negotiation': 'award-recommendation',
            'post-award-tracking': 'contract-negotiation'
        };
        return navigationFlow[this.currentPage] || null;
    }

    getPageTitle() {
        const titles = {
            'register': 'Create Account',
            'sign-in': 'Sign In',
            'role-selection': 'Select Your Role',
            'iam-verification': 'eKYC Onboarding',
            'verification-status': 'Verification Status',
            'admin-dashboard': 'Admin Dashboard',
            'buyer-dashboard': 'Buyer Dashboard',
            'buyer-journey': 'Buyer Journey',
            'supplier-dashboard': 'Supplier Dashboard',
            'supplier-journey': 'Supplier Journey',
            'supplier-marketplace': 'Supplier Marketplace',
            'supplier-tender-detail': 'Tender Detail',
            'guest-marketplace': 'ProcureX Marketplace',
            'create-tender': 'Create Tender',
            'tender-publication': 'Tender Draft Detail',
            'tender-details': 'Tender Detail',
            'bidding-workspace': 'Bidding Workspace',
            'bid-evaluation': 'Bid Evaluation',
            'award-recommendation': 'Award Recommendation',
            'contract-negotiation': 'Contract Negotiation',
            'post-award-tracking': 'Post-Award Tracking'
        };
        return titles[this.currentPage] || this.currentPage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    renderPage() {
        const pageContent = document.getElementById('page-content');
        if (this.pages[this.currentPage]) {
            const pageHtml = this.pages[this.currentPage]();
            const navHeader = this.getNavigationHeader();
            pageContent.innerHTML = navHeader + pageHtml;
            this.initializePageComponents();
        } else {
            pageContent.innerHTML = this.renderComingSoon();
        }
    }

    initializePageComponents() {
        // Initialize charts if Chart.js is available. The page should still render if the CDN is blocked.
        if (typeof window.createChart === 'function' && typeof window.Chart !== 'undefined') {
            if (document.getElementById('admin-activity-chart')) {
                createChart('admin-activity-chart', 'adminActivity');
            }
            if (document.getElementById('buyer-spend-chart')) {
                createChart('buyer-spend-chart', 'buyerSpend');
            }
        }

        // Initialize any interactive components
        this.initializeTabs();
        this.initializeForms();
        this.initializeAuthPage();
        this.initializeRegistrationPage();
        this.initializeEkycPage();
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
                if (input && area.tagName !== 'LABEL') input.click();
            });

            const fileInput = area.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.addEventListener('change', () => {
                    this.updateUploadLabel(area, fileInput.files?.[0]?.name);
                });
            }

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
                const input = area.querySelector('input[type="file"]');
                if (input && files.length) {
                    this.updateUploadLabel(area, files[0].name);
                }
            });
        });
    }

    updateUploadLabel(area, fileName) {
        const fileNameEl = area.querySelector('.file-name');
        if (fileNameEl && fileName) {
            fileNameEl.textContent = fileName;
            area.classList.add('has-file');
        }
    }

    initializeAuthPage() {
        document.querySelectorAll('.password-toggle-new').forEach((button) => {
            button.addEventListener('click', () => {
                const input = button.closest('.password-input-wrapper-new')?.querySelector('input');
                if (input) input.type = input.type === 'password' ? 'text' : 'password';
            });
        });

        document.querySelectorAll('.demo-account').forEach((button) => {
            button.addEventListener('click', () => {
                const form = button.closest('.screens-container-new')?.querySelector('form[data-action="sign-in"]');
                const emailInput = form?.querySelector('input[name="email"]');
                const passwordInput = form?.querySelector('input[name="password"]');
                if (emailInput) emailInput.value = button.getAttribute('data-demo-email') || '';
                if (passwordInput) passwordInput.value = button.getAttribute('data-demo-password') || '';
                passwordInput?.focus();
            });
        });
    }

    initializeRegistrationPage() {
        const registration = document.querySelector('.screens-container-new .register-screen-new');
        if (!registration) return;

        const otpInputs = Array.from(document.querySelectorAll('.otp-input-new'));
        const verifyButton = document.querySelector('form[data-action="register-step2"] .btn-continue-new');

        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 1);
                if (e.target.value && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
                if (verifyButton) {
                    verifyButton.disabled = !otpInputs.every(field => field.value);
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });

        document.querySelector('.btn-continue-to-password-new')?.addEventListener('click', () => {
            this.showRegistrationScreen(4);
        });

        document.querySelector('[data-fill-signup]')?.addEventListener('click', () => {
            const example = mockData.mockAuth?.signupExample;
            const form = document.querySelector('form[data-action="register-step1"]');
            if (!example || !form) return;

            const emailInput = form.querySelector('input[name="email"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            if (emailInput) emailInput.value = example.email;
            if (phoneInput) phoneInput.value = example.phone;
        });

        const passwordInput = document.querySelector('.password-input-new');
        const confirmInput = document.querySelector('.confirm-password-new');
        const termsInput = document.querySelector('input[name="termsAccepted"]');
        [passwordInput, confirmInput, termsInput].forEach((input) => {
            input?.addEventListener('input', () => this.updateRegistrationPasswordState());
            input?.addEventListener('change', () => this.updateRegistrationPasswordState());
        });
    }

    initializeEkycPage() {
        const ekycForm = document.querySelector('.ekyc-form');
        if (!ekycForm) return;

        const roleCards = ekycForm.querySelectorAll('.ekyc-role-card');
        roleCards.forEach((card) => {
            card.addEventListener('click', () => {
                roleCards.forEach(item => item.classList.remove('selected'));
                card.classList.add('selected');
            });
        });

        const signatureName = ekycForm.querySelector('input[name="signatureName"]');
        const signaturePreview = document.getElementById('signature-preview');
        signatureName?.addEventListener('input', () => {
            const value = signatureName.value.trim();
            signaturePreview.innerHTML = value
                ? `<strong>${value}</strong><span>Digitally signed on ProcureX</span>`
                : '<span>Typed signature preview</span>';
        });

        document.getElementById('save-ekyc-draft')?.addEventListener('click', () => {
            this.saveEkycProfile(ekycForm, 'draft');
            alert('eKYC draft saved.');
        });
    }

    handleFormAction(action, form) {
        switch (action) {
            case 'register-step1':
                this.handleRegisterStep1(form);
                break;
            case 'register-step2':
                this.handleRegisterStep2(form);
                break;
            case 'register-step4':
                this.handleRegisterStep4(form);
                break;
            case 'sign-in':
                this.handleSignIn(form);
                break;
            case 'complete-ekyc':
                this.handleEkycCompletion(form);
                break;
            case 'register-account':
                this.handleAccountRegistration(form);
                break;
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

    handleRegisterStep1(form) {
        const email = form.querySelector('input[name="email"]')?.value.trim();
        const phone = form.querySelector('input[name="phone"]')?.value.trim();

        if (!this.isValidEmail(email)) {
            this.showFormError(form.querySelector('input[name="email"]'), 'Enter a valid email address.');
            return;
        }

        if (!phone || phone.replace(/\D/g, '').length < 9) {
            this.showFormError(form.querySelector('input[name="phone"]'), 'Enter a valid mobile number.');
            return;
        }

        mockData.registrationDraft = { email, phone };
        this.clearFormErrors(form);
        this.showRegistrationScreen(2);
        this.startRegistrationTimer();

        const phoneDisplay = document.getElementById('phone-display');
        if (phoneDisplay) phoneDisplay.textContent = phone;
        document.querySelector('.otp-input-new')?.focus();
    }

    handleRegisterStep2(form) {
        const otpInputs = Array.from(form.querySelectorAll('.otp-input-new'));
        const otp = otpInputs.map(input => input.value).join('');

        if (otp.length !== 6) {
            this.showFormError(form.querySelector('.otp-container-new'), 'Enter all 6 digits.');
            return;
        }

        this.clearFormErrors(form);
        if (this.registrationTimer) clearInterval(this.registrationTimer);
        this.showRegistrationScreen(3);

        const emailDisplay = document.getElementById('email-display');
        if (emailDisplay) emailDisplay.textContent = mockData.registrationDraft.email;
    }

    handleRegisterStep4(form) {
        const password = form.querySelector('input[name="password"]')?.value;
        const confirmPassword = form.querySelector('input[name="confirmPassword"]')?.value;
        const termsAccepted = form.querySelector('input[name="termsAccepted"]')?.checked;

        if (!this.isRegistrationPasswordValid(password)) {
            alert('Password must meet all strength requirements.');
            return;
        }

        if (password !== confirmPassword) {
            this.showFormError(form.querySelector('input[name="confirmPassword"]'), 'Passwords do not match.');
            return;
        }

        if (!termsAccepted) {
            alert('Please accept the terms before creating the account.');
            return;
        }

        mockData.pendingAccount = {
            email: mockData.registrationDraft.email,
            phone: mockData.registrationDraft.phone,
            password,
            role: null,
            isNewUser: true,
            ekycCompleted: false
        };

        this.upsertMockAuthAccount(mockData.pendingAccount);

        mockData.session = {
            isAuthenticated: false,
            isNewUser: true,
            email: mockData.pendingAccount.email
        };
        mockData.eKycProfile = { status: 'not_started', role: null };

        this.showRegistrationScreen(5);
    }

    handleSignIn(form) {
        const email = form.querySelector('input[name="email"]')?.value.trim();
        const password = form.querySelector('input[name="password"]')?.value;
        const account = this.findMockAuthAccount(email);

        if (!this.isValidEmail(email) || !password) {
            alert('Enter your email and password.');
            return;
        }

        if (!account || account.password !== password) {
            alert('These credentials do not match any mock account.');
            return;
        }

        mockData.pendingAccount = account;
        mockData.session = {
            isAuthenticated: true,
            isNewUser: !account.ekycCompleted,
            email
        };
        if (account.role) this.setRole(account.role);

        if (mockData.session.isNewUser) {
            this.navigateTo('iam-verification');
            return;
        }

        const role = account.role || mockData.currentRole || mockData.eKycProfile?.role || 'buyer';
        this.setRole(role);
        this.navigateTo(`${role}-dashboard`);
    }

    handleEkycCompletion(form) {
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const selectedProducts = Array.from(form.querySelectorAll('input[name="products"]:checked'));
        if (!selectedProducts.length) {
            alert('Select at least one product or service.');
            return;
        }

        const uploadedCount = Array.from(form.querySelectorAll('input[type="file"]'))
            .filter(input => input.files?.length).length;

        if (uploadedCount < 3) {
            alert('Upload at least three verification documents for this demo flow.');
            return;
        }

        this.saveEkycProfile(form, 'submitted');
        const role = mockData.eKycProfile.role;
        mockData.pendingAccount = {
            ...(mockData.pendingAccount || {}),
            role,
            isNewUser: false,
            ekycCompleted: true
        };
        this.upsertMockAuthAccount(mockData.pendingAccount);
        mockData.session.isNewUser = false;

        this.setRole(role);
        this.navigateTo('verification-status');
    }

    saveEkycProfile(form, status) {
        const formData = new FormData(form);
        const role = formData.get('accountRole') || 'buyer';
        const products = formData.getAll('products');

        mockData.eKycProfile = {
            status,
            role,
            businessName: formData.get('businessName') || '',
            registrationNumber: formData.get('registrationNumber') || '',
            taxNumber: formData.get('taxNumber') || '',
            licenseNumber: formData.get('licenseNumber') || '',
            country: formData.get('country') || '',
            region: formData.get('region') || '',
            address: formData.get('address') || '',
            representativeName: formData.get('representativeName') || '',
            representativeTitle: formData.get('representativeTitle') || '',
            representativeEmail: formData.get('representativeEmail') || '',
            representativePhone: formData.get('representativePhone') || '',
            businessLine: formData.get('businessLine') || '',
            businessSize: formData.get('businessSize') || '',
            annualCapacity: formData.get('annualCapacity') || '',
            deliveryRegions: formData.get('deliveryRegions') || '',
            products,
            requirements: formData.get('requirements') || '',
            bankDetails: formData.get('bankDetails') || '',
            signatureName: formData.get('signatureName') || '',
            signatureTitle: formData.get('signatureTitle') || ''
        };
    }

    showRegistrationScreen(screenNumber) {
        document.querySelectorAll('.register-screen-new').forEach((screen) => {
            screen.classList.toggle('active', screen.getAttribute('data-screen') === String(screenNumber));
        });

        document.querySelectorAll('.progress-step-new').forEach((step) => {
            const stepNumber = Number(step.getAttribute('data-step'));
            step.classList.toggle('active', stepNumber === screenNumber);
            step.classList.toggle('completed', stepNumber < screenNumber || screenNumber === 5);
        });
    }

    startRegistrationTimer() {
        if (this.registrationTimer) clearInterval(this.registrationTimer);

        let remaining = 30;
        const timer = document.getElementById('timer');
        const resendButton = document.getElementById('resend-otp-btn');
        if (timer) timer.textContent = remaining;
        if (resendButton) resendButton.disabled = true;

        this.registrationTimer = setInterval(() => {
            remaining -= 1;
            if (timer) timer.textContent = Math.max(remaining, 0);

            if (remaining <= 0) {
                clearInterval(this.registrationTimer);
                if (resendButton) resendButton.disabled = false;
            }
        }, 1000);
    }

    updateRegistrationPasswordState() {
        const password = document.querySelector('.password-input-new')?.value || '';
        const confirmPassword = document.querySelector('.confirm-password-new')?.value || '';
        const termsAccepted = document.querySelector('input[name="termsAccepted"]')?.checked;
        const submitButton = document.querySelector('.btn-create-new');

        const checks = {
            length: password.length >= 8 && password.length <= 12,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
        };

        Object.entries(checks).forEach(([name, isMet]) => {
            const item = document.querySelector(`[data-requirement="${name}"]`);
            if (!item) return;
            item.classList.toggle('met', isMet);
            const icon = item.querySelector('.requirement-icon-new');
            if (icon) icon.textContent = isMet ? 'OK' : 'o';
        });

        const metCount = Object.values(checks).filter(Boolean).length;
        const strengthFill = document.querySelector('.strength-fill-new');
        const strengthText = document.querySelector('.strength-text-new strong');
        if (strengthFill) strengthFill.style.width = `${(metCount / 4) * 100}%`;
        if (strengthText) {
            strengthText.textContent = metCount <= 1 ? 'Weak' : metCount < 4 ? 'Medium' : 'Strong';
        }

        if (submitButton) {
            submitButton.disabled = !this.isRegistrationPasswordValid(password) || password !== confirmPassword || !termsAccepted;
        }
    }

    isRegistrationPasswordValid(password) {
        return Boolean(
            password &&
            password.length >= 8 &&
            password.length <= 12 &&
            /[A-Z]/.test(password) &&
            /\d/.test(password) &&
            /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
        );
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
    }

    findMockAuthAccount(email) {
        const normalizedEmail = (email || '').toLowerCase();
        const accounts = mockData.mockAuth?.accounts || [];
        return accounts.find(account => account.email.toLowerCase() === normalizedEmail) || null;
    }

    upsertMockAuthAccount(account) {
        if (!account?.email || !mockData.mockAuth?.accounts) return;

        const accounts = mockData.mockAuth.accounts;
        const index = accounts.findIndex(item => item.email.toLowerCase() === account.email.toLowerCase());
        const nextAccount = {
            displayName: account.displayName || account.email,
            phone: account.phone || '',
            password: account.password,
            role: account.role || null,
            isNewUser: account.isNewUser ?? !account.ekycCompleted,
            ekycCompleted: Boolean(account.ekycCompleted),
            email: account.email
        };

        if (index >= 0) {
            accounts[index] = { ...accounts[index], ...nextAccount };
            return;
        }

        accounts.unshift(nextAccount);
    }

    showFormError(target, message) {
        const wrapper = target?.closest('.form-group-new, .form-group');
        const error = wrapper?.querySelector('.form-error-new, .form-error');
        if (error) {
            error.textContent = message;
            error.classList.add('show');
            error.style.display = 'block';
        }
    }

    clearFormErrors(form) {
        form.querySelectorAll('.form-error-new, .form-error').forEach((error) => {
            error.textContent = '';
            error.classList.remove('show');
            error.style.display = '';
        });
    }

    handleAccountRegistration(form) {
        // Validate form
        const fullName = form.querySelector('input[name="fullName"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const phone = form.querySelector('input[name="phone"]').value;
        const password = form.querySelector('input[name="password"]').value;
        const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;
        const termsAccepted = form.querySelector('input[name="termsAccepted"]').checked;

        // Basic validation
        if (!fullName || !email || !phone || !password || !confirmPassword) {
            alert('Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (!termsAccepted) {
            alert('Please accept the Terms of Service and Privacy Policy');
            return;
        }

        // Simulate account registration
        console.log('Registering account:', {
            fullName,
            email,
            phone,
            role: this.currentRole
        });

        setTimeout(() => {
            // Navigate to IAM verification after successful registration
            this.navigateTo('iam-verification');
        }, 1000);
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
        // Load all page modules - render functions are registered by individual page files or available globally
        const pageNames = [
            'welcome',
            'register',
            'sign-in',
            'role-selection',
            'iam-verification',
            'verification-status',
            'admin-dashboard',
            'buyer-dashboard',
            'buyer-journey',
            'guest-marketplace',
            'supplier-dashboard',
            'supplier-journey',
            'supplier-marketplace',
            'supplier-tender-detail',
            'create-tender',
            'tender-publication',
            'tender-details',
            'bidding-workspace',
            'bid-evaluation',
            'award-recommendation',
            'contract-negotiation',
            'post-award-tracking'
        ];

        this.pages = {};
        pageNames.forEach((page) => {
            this.pages[page] = () => this.getPageRenderFunction(page);
        });
    }

    getPageRenderFunction(pageName) {
        const renderFnName = 'render' + pageName.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
        if (typeof window[renderFnName] === 'function') {
            return window[renderFnName]();
        }
        if (typeof window.app?.[renderFnName] === 'function' && !this.isPlaceholderRenderer(renderFnName, window.app[renderFnName])) {
            return window.app[renderFnName]();
        }
        return this.renderComingSoon();
    }

    isPlaceholderRenderer(renderFnName, renderFn) {
        return ProcureXApp.prototype[renderFnName] === renderFn;
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
    getLoadingSpinner(pageName) {
        return `<div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading ${pageName}...</p>
        </div>`;
    }

    renderWelcome() { return this.getLoadingSpinner('welcome page'); }
    renderSignIn() { return this.getLoadingSpinner('sign in'); }
    renderRoleSelection() { return this.getLoadingSpinner('role selection'); }
    renderIamVerification() { return this.getLoadingSpinner('IAM verification'); }
    renderIAMVerification() { return this.getLoadingSpinner('IAM verification'); }
    renderVerificationStatus() { return this.getLoadingSpinner('verification status'); }
    renderAdminDashboard() { return this.getLoadingSpinner('admin dashboard'); }
    renderBuyerDashboard() { return this.getLoadingSpinner('buyer dashboard'); }
    renderSupplierDashboard() { return this.getLoadingSpinner('supplier dashboard'); }
    renderSupplierJourney() { return this.getLoadingSpinner('supplier journey'); }
    renderGuestMarketplace() { return this.getLoadingSpinner('guest marketplace'); }
    renderSupplierMarketplace() { return this.getLoadingSpinner('supplier marketplace'); }
    renderSupplierTenderDetail() { return this.getLoadingSpinner('supplier tender detail'); }
    renderCreateTender() { return this.getLoadingSpinner('create tender'); }
    renderTenderPublication() { return this.getLoadingSpinner('tender publication'); }
    renderTenderDetails() { return this.getLoadingSpinner('tender details'); }
    renderBiddingWorkspace() { return this.getLoadingSpinner('bidding workspace'); }
    renderBidEvaluation() { return this.getLoadingSpinner('bid evaluation'); }
    renderAwardRecommendation() { return this.getLoadingSpinner('award recommendation'); }
    renderContractNegotiation() { return this.getLoadingSpinner('contract negotiation'); }
    renderPostAwardTracking() { return this.getLoadingSpinner('post-award tracking'); }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ProcureXApp();
});
