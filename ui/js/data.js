// ══════════════════════════════════════════════
// ProcureIQ — Mock Data
// ══════════════════════════════════════════════

const DATA = {

    tenders: [
        { id: 'TND-2026-001', title: 'Construction of District Health Clinic', category: 'Construction', status: 'Open', budget: '$2,400,000', deadline: 'Mar 15, 2026', bids: 8, trust: 'Tier-1', region: 'East Region', risk: 'Low' },
        { id: 'TND-2026-002', title: 'ICT Equipment Supply & Support Services', category: 'ICT', status: 'Evaluation', budget: '$380,000', deadline: 'Feb 28, 2026', bids: 12, trust: 'Open', region: 'National', risk: 'Medium' },
        { id: 'TND-2026-003', title: 'Pharmaceutical Supplies – Q2 2026', category: 'Healthcare', status: 'Open', budget: '$920,000', deadline: 'Mar 10, 2026', bids: 5, trust: 'Tier-2', region: 'West Region', risk: 'Low' },
        { id: 'TND-2026-004', title: 'Security & Surveillance System Installation', category: 'Security', status: 'Awarded', budget: '$145,000', deadline: 'Jan 31, 2026', bids: 6, trust: 'Tier-1', region: 'Capital', risk: 'Low' },
        { id: 'TND-2026-005', title: 'Fleet Management & Maintenance Services', category: 'Transport', status: 'Closed', budget: '$560,000', deadline: 'Feb 05, 2026', bids: 9, trust: 'Open', region: 'National', risk: 'High' },
        { id: 'TND-2026-006', title: 'Architectural Consulting — Phase 2', category: 'Consulting', status: 'Draft', budget: '$180,000', deadline: 'Mar 30, 2026', bids: 0, trust: 'Tier-2', region: 'South Region', risk: 'Low' },
        { id: 'TND-2026-007', title: 'Catering Services — Annual Contract', category: 'Services', status: 'Open', budget: '$95,000', deadline: 'Mar 20, 2026', bids: 14, trust: 'Open', region: 'Capital', risk: 'Low' },
        { id: 'TND-2026-008', title: 'Road Rehabilitation — Northern Corridor', category: 'Infrastructure', status: 'Evaluation', budget: '$8,200,000', deadline: 'Feb 20, 2026', bids: 4, trust: 'Tier-1', region: 'North Region', risk: 'Medium' },
    ],

    bids: [
        { id: 'BID-2026-0041', tender: 'TND-2026-001', supplier: 'BuildRight Construction Ltd', amount: '$2,180,000', submitted: 'Feb 12, 2026', status: 'Under Evaluation', techScore: 84, trustTier: 'Tier-1', risk: 'Low' },
        { id: 'BID-2026-0042', tender: 'TND-2026-001', supplier: 'Apex Infrastructure Group', amount: '$2,350,000', submitted: 'Feb 11, 2026', status: 'Under Evaluation', techScore: 91, trustTier: 'Tier-1', risk: 'Low' },
        { id: 'BID-2026-0043', tender: 'TND-2026-001', supplier: 'NovaBuild Partners', amount: '$2,095,000', submitted: 'Feb 13, 2026', status: 'Under Evaluation', techScore: 76, trustTier: 'Tier-2', risk: 'Medium' },
        { id: 'BID-2026-0044', tender: 'TND-2026-002', supplier: 'TechPoint Solutions', amount: '$362,000', submitted: 'Feb 10, 2026', status: 'Ranked #1', techScore: 95, trustTier: 'Tier-1', risk: 'Low' },
        { id: 'BID-2026-0045', tender: 'TND-2026-002', supplier: 'Digital Frontier Inc', amount: '$375,000', submitted: 'Feb 10, 2026', status: 'Ranked #2', techScore: 88, trustTier: 'Tier-2', risk: 'Low' },
        { id: 'BID-2026-0046', tender: 'TND-2026-003', supplier: 'MediSource Global', amount: '$891,000', submitted: 'Feb 14, 2026', status: 'Under Evaluation', techScore: 82, trustTier: 'Tier-1', risk: 'Low' },
    ],

    suppliers: [
        { id: 'SUP-001', name: 'BuildRight Construction Ltd', category: 'Construction', trustTier: 'Tier-1', trustScore: 94, contracts: 18, performance: 96, region: 'East Region', since: '2022', status: 'Active', flags: 0 },
        { id: 'SUP-002', name: 'Apex Infrastructure Group', category: 'Construction', trustTier: 'Tier-1', trustScore: 91, contracts: 22, performance: 93, region: 'National', since: '2021', status: 'Active', flags: 0 },
        { id: 'SUP-003', name: 'TechPoint Solutions', category: 'ICT', trustTier: 'Tier-1', trustScore: 89, contracts: 14, performance: 91, region: 'Capital', since: '2023', status: 'Active', flags: 0 },
        { id: 'SUP-004', name: 'MediSource Global', category: 'Healthcare', trustTier: 'Tier-1', trustScore: 87, contracts: 9, performance: 95, region: 'West Region', since: '2022', status: 'Active', flags: 0 },
        { id: 'SUP-005', name: 'NovaBuild Partners', category: 'Construction', trustTier: 'Tier-2', trustScore: 71, contracts: 5, performance: 78, region: 'South Region', since: '2024', status: 'Active', flags: 1 },
        { id: 'SUP-006', name: 'FleetPro Transport Services', category: 'Transport', trustTier: 'Tier-2', trustScore: 65, contracts: 7, performance: 74, region: 'National', since: '2023', status: 'Under Review', flags: 2 },
        { id: 'SUP-007', name: 'Securitas Systems Ltd', category: 'Security', trustTier: 'Tier-1', trustScore: 88, contracts: 11, performance: 92, region: 'Capital', since: '2021', status: 'Active', flags: 0 },
        { id: 'SUP-008', name: 'Digital Frontier Inc', category: 'ICT', trustTier: 'Tier-2', trustScore: 76, contracts: 6, performance: 83, region: 'National', since: '2024', status: 'Active', flags: 0 },
    ],

    contracts: [
        { id: 'CON-2025-041', title: 'ICT Network Upgrade', supplier: 'TechPoint Solutions', amount: '$290,000', start: 'Oct 1, 2025', end: 'Mar 31, 2026', status: 'Active', progress: 68, milestones: 4, done: 3 },
        { id: 'CON-2025-038', title: 'Security System – Phase 1', supplier: 'Securitas Systems Ltd', amount: '$145,000', start: 'Sep 15, 2025', end: 'Feb 28, 2026', status: 'Active', progress: 91, milestones: 3, done: 3 },
        { id: 'CON-2025-029', title: 'Pharma Supply – Q3 2025', supplier: 'MediSource Global', amount: '$780,000', start: 'Jul 1, 2025', end: 'Dec 31, 2025', status: 'Completed', progress: 100, milestones: 4, done: 4 },
        { id: 'CON-2026-001', title: 'Road Rehab – North Corridor', supplier: 'Apex Infrastructure Group', amount: '$7,900,000', start: 'Apr 1, 2026', end: 'Dec 31, 2027', status: 'Pending', progress: 0, milestones: 8, done: 0 },
        { id: 'CON-2025-033', title: 'Fleet Management – Year 2', supplier: 'FleetPro Transport Services', amount: '$430,000', start: 'Aug 1, 2025', end: 'Jul 31, 2026', status: 'Active', progress: 45, milestones: 6, done: 3 },
    ],

    invoices: [
        { id: 'INV-2026-0189', contract: 'CON-2025-041', supplier: 'TechPoint Solutions', amount: '$72,500', submitted: 'Feb 15, 2026', status: 'Pending Matching', dueDate: 'Mar 15, 2026', matched: false },
        { id: 'INV-2026-0188', contract: 'CON-2025-038', supplier: 'Securitas Systems Ltd', amount: '$48,333', submitted: 'Feb 10, 2026', status: 'Approved', dueDate: 'Mar 10, 2026', matched: true },
        { id: 'INV-2026-0185', contract: 'CON-2025-033', supplier: 'FleetPro Transport Services', amount: '$35,833', submitted: 'Feb 8, 2026', status: 'Disputed', dueDate: 'Mar 8, 2026', matched: false },
        { id: 'INV-2026-0181', contract: 'CON-2025-029', supplier: 'MediSource Global', amount: '$195,000', submitted: 'Jan 5, 2026', status: 'Paid', dueDate: 'Feb 5, 2026', matched: true },
    ],

    riskAlerts: [
        { id: 'RISK-009', type: 'Collusion Detected', severity: 'Critical', tender: 'TND-2026-005', description: 'Bid pricing correlation (r=0.94) detected between 3 suppliers. Identical subcontractor references.', time: '2h ago', status: 'Under Review' },
        { id: 'RISK-010', type: 'Trust Tier Violation', severity: 'High', tender: 'TND-2026-002', description: 'SUP-006 submitted bid while under active compliance review. Trust tier restriction bypassed.', time: '6h ago', status: 'Escalated' },
        { id: 'RISK-011', type: 'Budget Overrun Risk', severity: 'Medium', tender: 'TND-2026-008', description: 'Lowest bid (8.2M) exceeds approved budget by 12.5%. Amendment approval required.', time: '1d ago', status: 'Resolved' },
        { id: 'RISK-012', type: 'Late Submission', severity: 'Low', tender: 'TND-2026-003', description: '2 bids received within 60-second window of deadline. Timestamp verification in progress.', time: '2d ago', status: 'Resolved' },
    ],

    auditLog: [
        { id: 'AUD-5041', action: 'Award Decision', actor: 'Sarah M.', role: 'P.Officer', resource: 'TND-2026-004', time: 'Feb 18, 2026 14:32', ip: '192.168.1.45', status: 'Success' },
        { id: 'AUD-5040', action: 'Evaluation Score Locked', actor: 'James K.', role: 'Evaluator', resource: 'TND-2026-002', time: 'Feb 18, 2026 11:14', ip: '10.0.0.12', status: 'Success' },
        { id: 'AUD-5039', action: 'Contract Signed', actor: 'System', role: 'Auto', resource: 'CON-2025-038', time: 'Feb 17, 2026 16:00', ip: '—', status: 'Success' },
        { id: 'AUD-5038', action: 'Collusion Flag Raised', actor: 'System (ML)', role: 'Auto', resource: 'TND-2026-005', time: 'Feb 17, 2026 09:22', ip: '—', status: 'Alert' },
        { id: 'AUD-5037', action: 'User Trust Upgrade', actor: 'Admin', role: 'Platform Admin', resource: 'SUP-003', time: 'Feb 16, 2026 15:45', ip: '10.0.0.1', status: 'Success' },
        { id: 'AUD-5036', action: 'Tender Published', actor: 'Maria O.', role: 'P.Manager', resource: 'TND-2026-007', time: 'Feb 16, 2026 10:11', ip: '192.168.1.88', status: 'Success' },
        { id: 'AUD-5035', action: 'Failed Login Attempt', actor: 'Unknown', role: '—', resource: 'Auth', time: 'Feb 15, 2026 22:14', ip: '41.72.140.5', status: 'Blocked' },
    ],

    marketIntel: {
        categories: ['Construction', 'ICT', 'Healthcare', 'Transport', 'Security', 'Consulting'],
        avgPrices: [2100000, 350000, 870000, 490000, 135000, 170000],
        liquidity: [82, 94, 71, 65, 88, 79],
        benchmarks: [
            { category: 'Construction', marketMedian: '$2.05M/unit', platformAvg: '$2.12M', delta: '+3.4%', trend: 'Stable' },
            { category: 'ICT Equipment', marketMedian: '$340K', platformAvg: '$362K', delta: '+6.5%', trend: 'Rising' },
            { category: 'Pharmaceuticals', marketMedian: '$850K', platformAvg: '$878K', delta: '+3.3%', trend: 'Stable' },
            { category: 'Transport Fleet', marketMedian: '$510K', platformAvg: '$490K', delta: '-3.9%', trend: 'Falling' },
        ]
    }
};
