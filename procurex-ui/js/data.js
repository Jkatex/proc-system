// Mock data for the ProcureX application

const mockData = {
    // Workspace roles are assigned after onboarding, not during initial authentication.
    roles: ['buyer', 'supplier', 'admin'],
    accountTypes: ['new user', 'existing user', 'admin'],
    currentRole: null,
    registrationDraft: {
        email: '',
        phone: ''
    },
    pendingAccount: null,
    session: {
        isAuthenticated: false,
        isNewUser: true,
        email: null
    },
    eKycProfile: {
        status: 'not_started',
        role: null
    },
    eKycRegistryRecord: null,
    mockAuth: {
        signupExample: {
            email: 'newuser@procurex.test',
            phone: '+255 712 345 678',
            password: 'Newuser1!'
        },
        accounts: [
            {
                email: 'newuser@procurex.test',
                phone: '+255 712 345 678',
                password: 'Newuser1!',
                role: null,
                accountType: 'new user',
                isNewUser: true,
                ekycCompleted: false,
                displayName: 'New User Account'
            },
            {
                email: 'johndoe@procurex.test',
                phone: '+255 713 111 222',
                password: 'Procure1!',
                role: null,
                accountType: 'existing user',
                isNewUser: false,
                ekycCompleted: true,
                displayName: 'John Doe'
            },
            {
                email: 'admin@procurex.test',
                phone: '+255 715 555 666',
                password: 'Admin123!',
                role: 'admin',
                accountType: 'admin',
                isNewUser: false,
                ekycCompleted: true,
                displayName: 'Admin User'
            }
        ]
    },

    // User data
    users: {
        buyer: {
            name: 'John Doe',
            organization: 'Ministry of Health',
            trustTier: 'Gold',
            riskScore: 85,
            bidLimit: 5000000
        },
        supplier: {
            name: 'ABC Construction Ltd',
            organization: 'ABC Construction Ltd',
            trustTier: 'Silver',
            riskScore: 78,
            bidLimit: 2000000
        },
        admin: {
            name: 'Admin User',
            organization: 'ProcureX Platform',
            permissions: ['all']
        }
    },

    // Dashboard KPIs
    kpis: {
        admin: {
            activeUsers: 1247,
            pendingVerifications: 23,
            supportTickets: 8,
            systemUptime: 99.8
        },
        buyer: {
            activeTenders: 12,
            draftTenders: 5,
            approvalsNeeded: 3,
            totalSpend: 25000000
        },
        supplier: {
            matchedTenders: 8,
            bidsInProgress: 3,
            closing48h: 2,
            watchlist: 15
        }
    },

    // Tenders data
    tenders: [
        {
            id: 'T001',
            title: 'Construction of Rural Health Centers',
            type: 'Works',
            status: 'Open',
            budget: 5000000000,
            closingDate: '2026-06-12',
            organization: 'Ministry of Health',
            description: 'Construction of 5 rural health centers in Dodoma region',
            eligibility: 'Registered contractors with Class G1 license',
            documents: ['BOQ.pdf', 'Drawings.pdf', 'Specifications.pdf']
        },
        {
            id: 'T002',
            title: 'Supply of Medical Equipment',
            type: 'Goods',
            status: 'Evaluation',
            budget: 1200000000,
            closingDate: '2026-04-30',
            organization: 'Muhimbili Hospital',
            description: 'Supply and installation of medical imaging equipment',
            eligibility: 'Licensed medical equipment suppliers',
            documents: ['Specs.pdf', 'Requirements.pdf']
        },
        {
            id: 'T003',
            title: 'IT Infrastructure Upgrade',
            type: 'Services',
            status: 'Awarded',
            budget: 800000000,
            closingDate: '2026-04-18',
            organization: 'Tanzania Revenue Authority',
            description: 'Network infrastructure and cybersecurity upgrade',
            eligibility: 'Certified IT service providers',
            documents: ['TOR.pdf', 'Network_Diagram.pdf']
        }
    ],

    // Procurement setup used by the create tender wizard.
    procurementSetup: {
        methods: ['Open / public tender', 'Restricted tender', 'Closed / invited tender'],
        types: [
            {
                id: 'goods',
                label: 'Goods',
                description: 'Physical items, equipment, stock, and supplies.',
                categories: ['Medical equipment', 'Office supplies', 'ICT hardware', 'Vehicles and fleet', 'Pharmaceutical supplies']
            },
            {
                id: 'works',
                label: 'Works',
                description: 'Construction, rehabilitation, infrastructure, and civil works.',
                categories: ['Healthcare infrastructure', 'Roads and bridges', 'Building renovation', 'Water and sanitation works', 'Electrical installations']
            },
            {
                id: 'services',
                label: 'Services',
                description: 'Operational, technical, logistics, maintenance, and digital services.',
                categories: ['ICT and digital services', 'Logistics and transport', 'Maintenance services', 'Facility management', 'Training services']
            },
            {
                id: 'consultancy',
                label: 'Consultancy',
                description: 'Professional advisory, design, audit, research, and expert work.',
                categories: ['Engineering consultancy', 'Legal advisory', 'Financial audit', 'Project management', 'Research and studies']
            }
        ],
        defaultType: 'works'
    },

    // Compliance documents
    complianceDocs: [
        { name: 'BRELA Registration', status: 'approved', uploaded: true },
        { name: 'TIN Certificate', status: 'approved', uploaded: true },
        ],

    // Bid evaluation data
    bidEvaluation: {
        totalBids: 4,
        validSubmissions: 4,
        priceOutliers: 0,
        evaluatorsActive: 3,
        openingReport: {
            openingTime: 'June 12, 2026, 10:00 EAT',
            authorizedBy: ['Mary Komba', 'Joseph Mrema'],
            envelope: 'Technical envelope',
            hashStatus: '4 of 4 verified',
            auditReference: 'AUD-BIDOPEN-2026-014',
            disclosureStatus: 'Financial envelope locked until technical scores are finalized'
        },
        benchmark: {
            buyerEstimate: 4800000000,
            marketMedian: 4860000000,
            regionalAdjustment: 'Dodoma logistics index +2.8%',
            comparableEconomicCost: 4728000000,
            varianceBand: '-2.7% to +1.9%',
            notes: [
                'All bids sit inside the historical healthcare works price band.',
                'No abnormal discounting pattern detected after logistics normalization.',
                'ABC Construction has the strongest delivery feasibility after capacity adjustment.'
            ]
        },
        riskSignals: [
            { supplier: 'ABC Construction Ltd', risk: 'Low', score: 18, driver: 'Strong delivery history and current capacity headroom.' },
            { supplier: 'XYZ Builders', risk: 'Moderate', score: 41, driver: 'Two late milestones in the last 12 months.' },
            { supplier: 'BuildRight Ltd', risk: 'Moderate', score: 37, driver: 'Best technical score, but equipment utilization is near threshold.' },
            { supplier: 'Prime Contractors', risk: 'Low', score: 24, driver: 'Clean compliance record and balanced delivery load.' }
        ],
        collusionSignals: [
            { signal: 'Submission timing', status: 'Clear', detail: 'Bids submitted across a 17-hour spread.' },
            { signal: 'Price spread', status: 'Clear', detail: 'Normalized prices vary by 6.2%.' },
            { signal: 'Document similarity', status: 'Watch', detail: 'Two method statements share a common template, below escalation threshold.' }
        ],
        bids: [
            {
                supplier: 'ABC Construction Ltd',
                technicalScore: 85,
                financialScore: 90,
                totalScore: 87.5,
                integrityHash: '0x1234567890abcdef',
                price: 4800000000
            },
            {
                supplier: 'XYZ Builders',
                technicalScore: 78,
                financialScore: 95,
                totalScore: 84.3,
                integrityHash: '0xabcdef1234567890',
                price: 4950000000
            },
            {
                supplier: 'BuildRight Ltd',
                technicalScore: 92,
                financialScore: 82,
                totalScore: 88.4,
                integrityHash: '0x9876543210fedcba',
                price: 4650000000
            },
            {
                supplier: 'Prime Contractors',
                technicalScore: 88,
                financialScore: 88,
                totalScore: 88.0,
                integrityHash: '0xfedcba0987654321',
                price: 4750000000
            }
        ]
    },

    // Contract negotiation
    contractNegotiation: {
        contractId: 'PX-2026-0892',
        status: 'negotiation',
        poMatched: true,
        budgetVerified: true,
        signaturePending: true,
        messages: [
            { from: 'buyer', message: 'Please review the payment terms in section 3.2', timestamp: '2026-07-02 10:30' },
            { from: 'supplier', message: 'We can accept the revised payment schedule', timestamp: '2026-07-02 11:15' },
            { from: 'buyer', message: 'Great, let\'s proceed with the signature', timestamp: '2026-07-02 14:20' }
        ]
    },

    // Post-award tracking
    postAwardTracking: {
        contractId: 'PX-2026-0892',
        status: 'in_progress',
        progress: 65,
        supplierPerformance: {
            delivery: 85,
            quality: 90,
            communication: 88,
            overall: 87
        },
        supplierHealth: {
            trustScore: 82,
            riskLevel: 'Low',
            lastAudit: '2026-06-30'
        },
        disputes: [
            {
                id: 'D001',
                title: 'Delivery delay for Item #5',
                status: 'resolved',
                priority: 'medium',
                responseDue: 'Closed on August 22, 2026',
                evidence: ['Courier notice', 'Revised delivery schedule', 'Buyer acceptance memo'],
                outcome: 'No penalty; milestone dates updated in contract memory.'
            }
        ],
        invoiceChecks: [
            { invoice: 'INV-2026-001', result: 'Matched', detail: 'PO, GRN, and invoice values align.' },
            { invoice: 'INV-2026-002', result: 'Review', detail: 'GRN accepted after original due date; finance review required.' },
            { invoice: 'INV-2026-003', result: 'Blocked', detail: 'No GRN yet, payment cannot be released.' }
        ]
    },

    // Governance, intelligence, and integration operations
    platformOps: {
        complianceQueue: [
            { alert: 'Shared device fingerprint', severity: 'High', status: 'Investigation open', owner: 'Compliance Officer' },
            { alert: 'Document template similarity', severity: 'Medium', status: 'False-positive review', owner: 'Audit Team' },
            { alert: 'Late invoice anomaly', severity: 'Medium', status: 'Finance escalated', owner: 'Finance Officer' }
        ],
        auditTrail: [
            { time: '2026-06-12 10:00', event: 'Bid opening authorized by two users', ref: 'AUD-BIDOPEN-2026-014' },
            { time: '2026-06-12 10:01', event: 'Four technical envelopes decrypted', ref: 'HASH-SET-9042' },
            { time: '2026-06-24 16:30', event: 'Consensus score report locked', ref: 'EVAL-LOCK-2026-014' },
            { time: '2026-06-30 09:15', event: 'Award routed for approval', ref: 'APP-AWARD-2026-014' }
        ],
        marketIntelligence: {
            liquidityIndex: 74,
            supplierCoverage: '18 eligible suppliers in healthcare works',
            avgBidsPerTender: 4.6,
            priceTrend: '+3.4% quarter over quarter',
            recommendations: [
                'Extend clarification window by 3 days for high-value works.',
                'Invite two Tier 1 suppliers for SME participation balance.',
                'Use Dodoma logistics uplift in financial normalization.'
            ]
        },
        integration: {
            erpName: 'SAP S/4HANA',
            status: 'Healthy',
            lastSync: '2026-05-05 15:20 EAT',
            inbound: ['Budget lines', 'Vendor master', 'Purchase orders'],
            outbound: ['Award decisions', 'Invoice status', 'Supplier scores'],
            discrepancy: '1 unmatched vendor tax ID awaiting review'
        },
        modules: [
            { name: 'Core Procurement', status: 'Active', version: '1.0.0' },
            { name: 'Risk Forecasting', status: 'Active', version: '0.9.4' },
            { name: 'Supplier Financing', status: 'Available', version: '0.4.0' },
            { name: 'Cross-Border Controls', status: 'Available', version: '0.3.1' }
        ]
    },

    // Chart data
    charts: {
        adminActivity: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [1200, 1350, 1180, 1420, 1380, 1247]
        },
        buyerSpend: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [21000000, 22500000, 21800000, 23500000, 24200000, 25000000]
        }
    },

    // User dashboard operating data. The dashboard filters, sorts, and counts this per active account.
    userWorkspace: {
        urgentItems: [
            { type: 'Pending approvals', count: 3, urgency: 92, due: 'Today', nav: 'award-recommendation', audience: ['buyer', 'all'] },
            { type: 'New bids received', count: 7, urgency: 86, due: '2 hours', nav: 'bid-evaluation', audience: ['buyer', 'all'] },
            { type: 'Contracts awaiting signature', count: 2, urgency: 95, due: 'Today', nav: 'contract-negotiation', audience: ['buyer', 'supplier', 'all'] },
            { type: 'Payments overdue', count: 4, urgency: 89, due: 'Overdue', nav: 'post-award-tracking', audience: ['buyer', 'supplier', 'all'] },
            { type: 'Messages requiring reply', count: 5, urgency: 84, due: '1 day', nav: 'contract-negotiation', audience: ['buyer', 'supplier', 'all'] }
        ],
        workflows: [
            { title: 'Office IT Procurement', status: 'Draft', updatedHours: 2, urgency: 78, nav: 'create-tender', audience: ['buyer', 'all'] },
            { title: 'Vehicle Tender', status: 'Evaluation stage', updatedHours: 5, urgency: 88, nav: 'bid-evaluation', audience: ['buyer', 'all'] },
            { title: 'Contract - ABC Ltd', status: 'Execution', updatedHours: 1, urgency: 91, nav: 'post-award-tracking', audience: ['buyer', 'supplier', 'all'] },
            { title: 'Medical Equipment Bid', status: 'Clarification response due', updatedHours: 3, urgency: 87, nav: 'bidding-workspace', audience: ['supplier', 'all'] }
        ],
        quickActions: [
            { title: 'Review approvals', detail: 'Award and budget approvals waiting', nav: 'award-recommendation', audience: ['buyer', 'all'], signal: 'approvals' },
            { title: 'Evaluate new bids', detail: 'Open technical and financial review', nav: 'bid-evaluation', audience: ['buyer', 'all'], signal: 'bids' },
            { title: 'Sign contract', detail: 'Complete digital signature workflow', nav: 'contract-negotiation', audience: ['buyer', 'supplier', 'all'], signal: 'contracts' },
            { title: 'Reply to messages', detail: 'Procurement and contract conversations', nav: 'contract-negotiation', audience: ['buyer', 'supplier', 'all'], signal: 'messages' },
            { title: 'Find opportunities', detail: 'Open matching tenders and tenders near close', nav: 'supplier-marketplace', audience: ['supplier', 'all'], signal: 'opportunities' },
            { title: 'Create tender', detail: 'Start a new buyer procurement', nav: 'create-tender', audience: ['buyer', 'all'], signal: 'drafts' }
        ],
        appShortcuts: [
            { app: 'Procurement', detail: 'Tenders, bids, evaluation', usage: 96, nav: 'supplier-marketplace', audience: ['buyer', 'supplier', 'all'] },
            { app: 'Records & History', detail: 'Past tenders, bids, awards, cancellations', usage: 90, nav: 'records-history', audience: ['buyer', 'supplier', 'all'] },
            { app: 'IAM', detail: 'Registration and eKYC review', usage: 88, nav: 'verification-status', audience: ['buyer', 'supplier', 'all'] },
            { app: 'Dashboard', detail: 'Your work, spend, and insights', usage: 84, nav: 'workspace-dashboard', audience: ['buyer', 'supplier', 'all'] },
            { app: 'Contracts', detail: 'Signature and execution tracking', usage: 76, nav: 'contract-negotiation', audience: ['buyer', 'supplier', 'all'] },
            { app: 'Performance', detail: 'Delivery, GRN, invoice checks', usage: 68, nav: 'post-award-tracking', audience: ['supplier', 'all'] }
        ],
        insights: [
            { type: 'Suggested supplier', title: '3 suppliers match Office IT Procurement', detail: 'Two have low risk and recent delivery capacity.', urgency: 78, nav: 'supplier-marketplace', audience: ['buyer', 'all'] },
            { type: 'Price insight', title: 'Network equipment prices up 4.2%', detail: 'Use the updated benchmark before publishing.', urgency: 72, nav: 'create-tender', audience: ['buyer', 'all'] },
            { type: 'Risk alert', title: 'One evaluator conflict needs review', detail: 'Resolve before award recommendation is locked.', urgency: 90, nav: 'award-recommendation', audience: ['buyer', 'all'] },
            { type: 'Matching tender', title: 'New ICT tender matches your profile', detail: 'Closes soon and accepts digital service providers.', urgency: 84, nav: 'supplier-marketplace', audience: ['supplier', 'all'] },
            { type: 'Partnership', title: 'Logistics partner available in Dodoma', detail: 'Could improve bid feasibility for rural delivery.', urgency: 70, nav: 'supplier-marketplace', audience: ['supplier', 'all'] },
            { type: 'Market trend', title: 'Healthcare works liquidity is improving', detail: 'Average eligible supplier count rose this month.', urgency: 64, nav: 'workspace-dashboard', audience: ['buyer', 'supplier', 'all'] }
        ]
    }
};

// Export for use in other modules
window.mockData = mockData;
