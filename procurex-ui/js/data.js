// Mock data for the ProcureX application

const mockData = {
    // User roles and authentication
    roles: ['buyer', 'supplier', 'admin'],
    currentRole: null,

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
            budget: 5000000,
            closingDate: '2024-02-15',
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
            budget: 1200000,
            closingDate: '2024-01-30',
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
            budget: 800000,
            closingDate: '2024-01-20',
            organization: 'Tanzania Revenue Authority',
            description: 'Network infrastructure and cybersecurity upgrade',
            eligibility: 'Certified IT service providers',
            documents: ['TOR.pdf', 'Network_Diagram.pdf']
        }
    ],

    // Compliance documents
    complianceDocs: [
        { name: 'BRELA Registration', status: 'approved', uploaded: true },
        { name: 'TIN Certificate', status: 'approved', uploaded: true },
        { name: 'Tax Clearance', status: 'reviewing', uploaded: true },
        { name: 'Director\'s ID', status: 'rejected', uploaded: true, reason: 'Document unclear' }
    ],

    // Bid evaluation data
    bidEvaluation: {
        totalBids: 4,
        validSubmissions: 4,
        priceOutliers: 0,
        evaluatorsActive: 3,
        bids: [
            {
                supplier: 'ABC Construction Ltd',
                technicalScore: 85,
                financialScore: 90,
                totalScore: 87.5,
                integrityHash: '0x1234567890abcdef',
                price: 4800000
            },
            {
                supplier: 'XYZ Builders',
                technicalScore: 78,
                financialScore: 95,
                totalScore: 84.3,
                integrityHash: '0xabcdef1234567890',
                price: 4950000
            },
            {
                supplier: 'BuildRight Ltd',
                technicalScore: 92,
                financialScore: 82,
                totalScore: 88.4,
                integrityHash: '0x9876543210fedcba',
                price: 4650000
            },
            {
                supplier: 'Prime Contractors',
                technicalScore: 88,
                financialScore: 88,
                totalScore: 88.0,
                integrityHash: '0xfedcba0987654321',
                price: 4750000
            }
        ]
    },

    // Contract negotiation
    contractNegotiation: {
        contractId: 'PX-2023-0892',
        status: 'negotiation',
        poMatched: true,
        budgetVerified: true,
        signaturePending: true,
        messages: [
            { from: 'buyer', message: 'Please review the payment terms in section 3.2', timestamp: '2024-01-15 10:30' },
            { from: 'supplier', message: 'We can accept the revised payment schedule', timestamp: '2024-01-15 11:15' },
            { from: 'buyer', message: 'Great, let\'s proceed with the signature', timestamp: '2024-01-15 14:20' }
        ]
    },

    // Post-award tracking
    postAwardTracking: {
        contractId: 'PX-2023-0892',
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
            lastAudit: '2023-12-01'
        },
        disputes: [
            { id: 'D001', title: 'Delivery delay for Item #5', status: 'resolved', priority: 'medium' }
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
    }
};

// Export for use in other modules
window.mockData = mockData;