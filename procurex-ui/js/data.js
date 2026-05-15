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
            id: 'PX-WRK-2026-001',
            title: 'Construction of District Maternal Health Wing',
            type: 'Works',
            procurementTypeId: 'works',
            status: 'Open',
            budget: 6850000000,
            closingDate: '2026-07-03',
            organization: 'Ministry of Health',
            description: 'Design review, construction, finishing, medical gas routing, and handover of a two-storey maternal health wing in Dodoma.',
            eligibility: 'Open Tender / Healthcare infrastructure / CRB Class I or II building contractor with OSHA compliance and audited accounts.',
            category: 'Healthcare infrastructure',
            categories: ['Healthcare infrastructure', 'Concrete and cement and plaster', 'Electrical equipment and components and supplies'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'Dodoma Regional Referral Hospital',
            commercialModel: 'BOQ',
            contractType: 'Unit Price Contract',
            documents: ['Architectural_Drawings.pdf', 'Structural_Drawings.pdf', 'Priced_BOQ_Template.xlsx', 'Site_Report.pdf', 'Conditions_of_Contract.pdf'],
            regulatoryLicenses: [
                { group: 'Construction & Real Estate', license: 'Contractor Registration Certificate', body: 'Contractors Registration Board (CRB) and Local Government Authorities', mandatory: true },
                { group: 'Environmental & Safety', license: 'Occupational Safety and Health Compliance Certificate', body: 'Occupational Safety and Health Authority (OSHA)', mandatory: true },
                { group: 'Environmental & Safety', license: 'Environmental Compliance Certificate', body: 'National Environment Management Council (NEMC)', mandatory: true }
            ],
            requirements: {
                fields: {
                    projectName: 'District Maternal Health Wing',
                    procuringEntity: 'Ministry of Health',
                    location: 'Dodoma Regional Referral Hospital',
                    contractType: 'Unit Price Contract',
                    completionPeriod: '14 months from site possession',
                    fundingSource: 'Government of Tanzania',
                    scopeSummary: 'Construction of a two-storey maternal health wing including foundations, structural frame, roofing, finishes, plumbing, electrical works, fire safety, medical gas containment routing, external drainage, access ramps, and defects liability support.',
                    mainConstructionActivities: [
                        { text: 'Site establishment and hoarding' },
                        { text: 'Foundation and reinforced concrete frame' },
                        { text: 'Mechanical, electrical, and plumbing installations' },
                        { text: 'Medical gas containment routing and plant room preparation' },
                        { text: 'External works, drainage, and handover testing' }
                    ],
                    technicalSpecificationDocuments: [
                        { documentTitle: 'Applicable standards / codes', documentUpload: 'Building_Standards.pdf', mandatory: true },
                        { documentTitle: 'Material specifications', documentUpload: 'Materials_Schedule.pdf', mandatory: true },
                        { documentTitle: 'Workmanship standards', documentUpload: 'Workmanship_Requirements.pdf', mandatory: true }
                    ],
                    drawingDesignRows: [
                        { documentType: 'Architectural drawings', buyerDocumentUpload: 'Architectural_Set.pdf' },
                        { documentType: 'Structural drawings', buyerDocumentUpload: 'Structural_Set.pdf' },
                        { documentType: 'Electrical drawings', buyerDocumentUpload: 'Electrical_Set.pdf' },
                        { documentType: 'Mechanical drawings', buyerDocumentUpload: 'Mechanical_Set.pdf' }
                    ],
                    boqRows: [
                        { workItem: 'Substructure and foundation works', quantity: 1, unit: 'Lot', laborCost: 220000000, materialCost: 780000000, equipmentCost: 120000000, totalCost: 1120000000, mandatory: true },
                        { workItem: 'Superstructure concrete frame and blockwork', quantity: 1, unit: 'Lot', laborCost: 380000000, materialCost: 1450000000, equipmentCost: 240000000, totalCost: 2070000000, mandatory: true },
                        { workItem: 'MEP installation and fire safety systems', quantity: 1, unit: 'Lot', laborCost: 310000000, materialCost: 1030000000, equipmentCost: 160000000, totalCost: 1500000000, mandatory: true }
                    ],
                    worksMilestoneRows: [
                        { milestone: 'Foundation complete', targetDate: '2026-10-15', liquidatedDamagesTrigger: false },
                        { milestone: 'Roofing complete', targetDate: '2027-02-20', liquidatedDamagesTrigger: true },
                        { milestone: 'Practical completion', targetDate: '2027-08-30', liquidatedDamagesTrigger: true }
                    ],
                    siteVisitRequirement: 'Mandatory',
                    similarCompletedProjectsRequired: true,
                    keyPersonnelCvsRequired: true,
                    bankStatementsRequired: true,
                    bankStatementPeriod: 'Submit bank statements covering the last 12 months plus audited financial statements for the last 3 years.'
                },
                lists: {
                    mandatoryDeclarations: [
                        { text: 'Declare no conflict of interest with the procuring entity.' },
                        { text: 'Confirm acceptance of defects liability and retention provisions.' }
                    ],
                    safetyRequirements: [
                        { text: 'Submit site-specific health and safety plan.' },
                        { text: 'Provide emergency response and incident reporting procedure.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Technical capacity', weight: 30, subcriteria: ['Construction methodology', 'Plant and equipment', 'Quality assurance'] },
                    { name: 'Relevant experience', weight: 25, subcriteria: ['Hospital projects', 'Projects above TZS 3B', 'Completion references'] },
                    { name: 'Financial proposal', weight: 25, subcriteria: ['BOQ completeness', 'Price realism', 'Cashflow reasonableness'] },
                    { name: 'Delivery schedule', weight: 10, subcriteria: ['Milestone feasibility', 'Critical path'] },
                    { name: 'Compliance and ESG', weight: 10, subcriteria: ['OSHA', 'NEMC', 'Local labor plan'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-18' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-19' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-07-03' },
                { id: 'milestone-opening', name: 'Bid opening', date: '2026-07-06' },
                { id: 'milestone-evaluation', name: 'Evaluation complete', date: '2026-07-24' },
                { id: 'milestone-award', name: 'Award target', date: '2026-08-07' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Substructure and foundation works', qty: 1, unit: 'Lot', rate: 1120000000 },
                { item: '2.1', description: 'Superstructure concrete frame and blockwork', qty: 1, unit: 'Lot', rate: 2070000000 },
                { item: '3.1', description: 'MEP installation and fire safety systems', qty: 1, unit: 'Lot', rate: 1500000000 },
                { item: '4.1', description: 'Finishes, external works, testing, and handover', qty: 1, unit: 'Lot', rate: 2160000000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Substructure and foundation works', qty: 1, unit: 'Lot', rate: 1120000000 },
                { item: '2.1', description: 'Superstructure concrete frame and blockwork', qty: 1, unit: 'Lot', rate: 2070000000 },
                { item: '3.1', description: 'MEP installation and fire safety systems', qty: 1, unit: 'Lot', rate: 1500000000 },
                { item: '4.1', description: 'Finishes, external works, testing, and handover', qty: 1, unit: 'Lot', rate: 2160000000 }
            ],
            deliverables: ['Completed maternal health wing', 'As-built drawings', 'Commissioning certificates', 'Defects liability support plan'],
            clarifications: [{ title: 'Site visit window', question: 'Mandatory site visit is scheduled for June 3 and June 4, 2026.', status: 'Published notice' }],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Amendment log is open for design or BOQ updates.' }],
            interestedSuppliers: [
                { name: 'ABC Construction Ltd', status: 'Downloaded documents', lastActivity: 'Today' },
                { name: 'Prime Contractors Tanzania', status: 'Watching tender', lastActivity: 'Yesterday' }
            ]
        },
        {
            id: 'PX-WRK-2026-002',
            title: 'Rehabilitation of Rural Water Supply Network',
            type: 'Works',
            procurementTypeId: 'works',
            status: 'Open',
            budget: 3420000000,
            closingDate: '2026-06-26',
            organization: 'Rural Water Supply and Sanitation Agency',
            description: 'Rehabilitation of boreholes, pumping stations, elevated tanks, distribution lines, chambers, and water kiosks across 12 villages in Singida.',
            eligibility: 'Open Tender / Water infrastructure / CRB civil works registration with EWURA water sector experience.',
            category: 'Water Pumps and Spare Parts',
            categories: ['Water Pumps and Spare Parts', 'Water and Sewer Treatment Equipment and consumables', 'Concrete and cement and plaster'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'Ikungi and Manyoni districts, Singida',
            commercialModel: 'BOQ',
            contractType: 'Unit Price Contract',
            documents: ['Hydraulic_Assessment.pdf', 'Water_Network_Drawings.pdf', 'BOQ_Water_Rehab.xlsx', 'Safeguards_Plan.pdf'],
            regulatoryLicenses: [
                { group: 'Construction & Real Estate', license: 'Contractor Registration Certificate', body: 'Contractors Registration Board (CRB) and Local Government Authorities', mandatory: true },
                { group: 'Energy & Water (EWURA)', license: 'Water Supply and Sanitation Services License', body: 'Energy and Water Utilities Regulatory Authority (EWURA)', mandatory: false },
                { group: 'Environmental & Safety', license: 'Environmental Compliance Certificate', body: 'National Environment Management Council (NEMC)', mandatory: true }
            ],
            requirements: {
                fields: {
                    projectName: 'Rural Water Supply Network Rehabilitation',
                    procuringEntity: 'Rural Water Supply and Sanitation Agency',
                    location: 'Singida region',
                    contractType: 'Unit Price Contract',
                    completionPeriod: '10 months',
                    fundingSource: 'Development partner grant',
                    scopeSummary: 'Rehabilitate water production and distribution assets, replace damaged pumps and pipe sections, construct valve chambers, test water quality, and train village water committees.',
                    mainConstructionActivities: [
                        { text: 'Borehole pump replacement and electrical rehabilitation' },
                        { text: 'Pipeline trenching, laying, pressure testing, and reinstatement' },
                        { text: 'Elevated tank repairs and chamber construction' },
                        { text: 'Water kiosk repairs and metering installation' }
                    ],
                    technicalSpecificationDocuments: [
                        { documentTitle: 'Engineering requirements', documentUpload: 'Hydraulic_Design_Requirements.pdf', mandatory: true },
                        { documentTitle: 'Material specifications', documentUpload: 'Pipe_Pump_Material_Specs.pdf', mandatory: true }
                    ],
                    drawingDesignRows: [
                        { documentType: 'Mechanical drawings', buyerDocumentUpload: 'Pump_Station_Details.pdf' },
                        { documentType: 'Other', otherDocumentName: 'Distribution line maps', buyerDocumentUpload: 'Distribution_Maps.pdf' }
                    ],
                    boqRows: [
                        { workItem: 'Submersible pump supply and installation', quantity: 12, unit: 'Set', laborCost: 60000000, materialCost: 840000000, equipmentCost: 90000000, totalCost: 990000000, mandatory: true },
                        { workItem: 'HDPE pipeline replacement', quantity: 48, unit: 'Km', laborCost: 380000000, materialCost: 980000000, equipmentCost: 210000000, totalCost: 1570000000, mandatory: true },
                        { workItem: 'Tank, chamber, and kiosk repairs', quantity: 1, unit: 'Lot', laborCost: 190000000, materialCost: 410000000, equipmentCost: 90000000, totalCost: 690000000, mandatory: true }
                    ],
                    worksMilestoneRows: [
                        { milestone: 'Pump station works complete', targetDate: '2026-10-10', liquidatedDamagesTrigger: true },
                        { milestone: 'Distribution pressure testing complete', targetDate: '2027-01-20', liquidatedDamagesTrigger: true },
                        { milestone: 'Community training complete', targetDate: '2027-03-30', liquidatedDamagesTrigger: false }
                    ],
                    siteVisitRequirement: 'Mandatory',
                    similarCompletedProjectsRequired: true,
                    keyPersonnelCvsRequired: true,
                    bankStatementsRequired: true,
                    bankStatementPeriod: 'Six months of bank statements and evidence of access to credit of at least TZS 600,000,000.'
                },
                lists: {
                    mandatoryDeclarations: [
                        { text: 'Commit to water quality testing after rehabilitation.' },
                        { text: 'Provide traffic and community safety arrangements for trenching works.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Technical capacity', weight: 30, subcriteria: ['Water works methodology', 'Pump installation team', 'Testing plan'] },
                    { name: 'Relevant experience', weight: 25, subcriteria: ['Rural water projects', 'Pump station references'] },
                    { name: 'Financial proposal', weight: 25, subcriteria: ['BOQ pricing', 'Mobilization cashflow'] },
                    { name: 'Delivery schedule', weight: 10, subcriteria: ['Village sequencing', 'Dry season planning'] },
                    { name: 'Compliance and ESG', weight: 10, subcriteria: ['Environmental safeguards', 'Community engagement'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-20' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-12' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-06-26' },
                { id: 'milestone-opening', name: 'Bid opening', date: '2026-06-29' },
                { id: 'milestone-evaluation', name: 'Evaluation complete', date: '2026-07-17' },
                { id: 'milestone-award', name: 'Award target', date: '2026-07-31' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Submersible pump supply and installation', qty: 12, unit: 'Set', rate: 82500000 },
                { item: '2.1', description: 'HDPE pipeline replacement and testing', qty: 48, unit: 'Km', rate: 32708333 },
                { item: '3.1', description: 'Tank, chamber, and kiosk repairs', qty: 1, unit: 'Lot', rate: 690000000 },
                { item: '4.1', description: 'Training, commissioning, and water quality testing', qty: 1, unit: 'Lot', rate: 170000000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Submersible pump supply and installation', qty: 12, unit: 'Set', rate: 82500000 },
                { item: '2.1', description: 'HDPE pipeline replacement and testing', qty: 48, unit: 'Km', rate: 32708333 },
                { item: '3.1', description: 'Tank, chamber, and kiosk repairs', qty: 1, unit: 'Lot', rate: 690000000 },
                { item: '4.1', description: 'Training, commissioning, and water quality testing', qty: 1, unit: 'Lot', rate: 170000000 }
            ],
            deliverables: ['Rehabilitated water production facilities', 'Pressure-tested distribution network', 'Water quality test reports', 'Community operator training'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Buyer can issue addenda for route maps or pump specifications.' }],
            interestedSuppliers: [
                { name: 'MajiWorks Engineering Ltd', status: 'Asked clarification', lastActivity: 'Today' },
                { name: 'ABC Construction Ltd', status: 'Watching tender', lastActivity: '2 days ago' }
            ]
        },
        {
            id: 'PX-WRK-2026-003',
            title: 'Solar Mini-Grid Civil Works and Distribution Network',
            type: 'Works',
            procurementTypeId: 'works',
            status: 'Open',
            budget: 4980000000,
            closingDate: '2026-07-17',
            organization: 'Rural Energy Agency',
            description: 'Civil works, mounting structures, distribution poles, service drops, earthing, control room construction, and commissioning support for three solar mini-grid sites.',
            eligibility: 'Invited Tender / Energy infrastructure / CRB contractor with solar or rural electrification project references.',
            category: 'Electrical equipment and components and supplies',
            categories: ['Electrical equipment and components and supplies', 'Concrete poles', 'Batteries and generators and kinetic power transmission'],
            method: 'Invited Tender',
            visibility: 'Invited suppliers only',
            visibilityNote: 'Visible to invited suppliers and buyer users.',
            invitedUsers: [
                { name: 'ABC Construction Ltd', organization: 'ABC Construction Ltd', email: 'supplier@abc.test' },
                { name: 'Kijiji Power Contractors', organization: 'Kijiji Power Contractors Ltd', email: 'bids@kijijipower.test' }
            ],
            location: 'Kigoma, Rukwa, and Katavi regions',
            commercialModel: 'BOQ',
            contractType: 'Lump Sum Contract',
            documents: ['Mini_Grid_Site_Layouts.pdf', 'Electrical_Single_Line_Diagrams.pdf', 'Lump_Sum_Pricing_Schedule.xlsx', 'EHS_Requirements.pdf'],
            regulatoryLicenses: [
                { group: 'Construction & Real Estate', license: 'Contractor Registration Certificate', body: 'Contractors Registration Board (CRB) and Local Government Authorities', mandatory: true },
                { group: 'Energy & Water (EWURA)', license: 'Electricity Distribution and Supply License', body: 'Energy and Water Utilities Regulatory Authority (EWURA)', mandatory: false },
                { group: 'Environmental & Safety', license: 'Occupational Safety and Health Compliance Certificate', body: 'Occupational Safety and Health Authority (OSHA)', mandatory: true }
            ],
            requirements: {
                fields: {
                    projectName: 'Solar Mini-Grid Civil Works and Distribution Network',
                    procuringEntity: 'Rural Energy Agency',
                    location: 'Western Tanzania cluster',
                    contractType: 'Lump Sum Contract',
                    completionPeriod: '8 months',
                    fundingSource: 'Renewable energy fund',
                    scopeSummary: 'Construct mini-grid control rooms, equipment plinths, fencing, pole foundations, LV distribution lines, customer service drops, earthing, lightning protection, and handover support.',
                    mainConstructionActivities: [
                        { text: 'Site clearing and control room construction' },
                        { text: 'PV mounting foundation and equipment plinths' },
                        { text: 'Pole erection and low voltage distribution network' },
                        { text: 'Earthing, lightning protection, and commissioning support' }
                    ],
                    technicalSpecificationDocuments: [
                        { documentTitle: 'Engineering requirements', documentUpload: 'Mini_Grid_Civil_Electrical_Interface.pdf', mandatory: true },
                        { documentTitle: 'Equipment requirements', documentUpload: 'Pole_Mounting_Earthing_Spec.pdf', mandatory: true }
                    ],
                    lumpSumPricingRows: [
                        { section: 'Site A works', description: 'Civil works and distribution network for Site A', amount: 1620000000, mandatory: true },
                        { section: 'Site B works', description: 'Civil works and distribution network for Site B', amount: 1710000000, mandatory: true },
                        { section: 'Site C works', description: 'Civil works and distribution network for Site C', amount: 1650000000, mandatory: true }
                    ],
                    worksMilestoneRows: [
                        { milestone: 'Control rooms complete', targetDate: '2026-10-30', liquidatedDamagesTrigger: true },
                        { milestone: 'Distribution network complete', targetDate: '2027-01-15', liquidatedDamagesTrigger: true },
                        { milestone: 'Commissioning support complete', targetDate: '2027-03-12', liquidatedDamagesTrigger: false }
                    ],
                    siteVisitRequirement: 'Mandatory',
                    similarCompletedProjectsRequired: true,
                    keyPersonnelCvsRequired: true,
                    bankStatementsRequired: false
                },
                lists: {
                    mandatoryDeclarations: [
                        { text: 'Confirm availability of certified electrical supervisor.' },
                        { text: 'Confirm acceptance of rural site logistics plan.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Technical capacity', weight: 30, subcriteria: ['Rural electrification method', 'Electrical safety', 'Equipment plan'] },
                    { name: 'Relevant experience', weight: 25, subcriteria: ['Solar mini-grid works', 'Remote logistics'] },
                    { name: 'Financial proposal', weight: 25, subcriteria: ['Lump sum completeness', 'Price realism'] },
                    { name: 'Delivery schedule', weight: 10, subcriteria: ['Parallel site mobilization'] },
                    { name: 'Compliance and ESG', weight: 10, subcriteria: ['Worker safety', 'Community liaison'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-25' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-07-01' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-07-17' },
                { id: 'milestone-opening', name: 'Bid opening', date: '2026-07-20' },
                { id: 'milestone-evaluation', name: 'Evaluation complete', date: '2026-08-07' },
                { id: 'milestone-award', name: 'Award target', date: '2026-08-21' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Site A civil and distribution works', qty: 1, unit: 'Lot', rate: 1620000000 },
                { item: '2.1', description: 'Site B civil and distribution works', qty: 1, unit: 'Lot', rate: 1710000000 },
                { item: '3.1', description: 'Site C civil and distribution works', qty: 1, unit: 'Lot', rate: 1650000000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Site A civil and distribution works', qty: 1, unit: 'Lot', rate: 1620000000 },
                { item: '2.1', description: 'Site B civil and distribution works', qty: 1, unit: 'Lot', rate: 1710000000 },
                { item: '3.1', description: 'Site C civil and distribution works', qty: 1, unit: 'Lot', rate: 1650000000 }
            ],
            deliverables: ['Completed control rooms', 'Distribution network ready for energization', 'Earthing test records', 'Commissioning support report'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Buyer can issue addenda for site layout updates.' }],
            interestedSuppliers: [
                { name: 'Kijiji Power Contractors', status: 'Downloaded drawings', lastActivity: 'Today' },
                { name: 'ABC Construction Ltd', status: 'Watching tender', lastActivity: 'Today' }
            ]
        },
        {
            id: 'PX-GDS-2026-001',
            title: 'Supply and Installation of Digital X-Ray Systems',
            type: 'Goods',
            procurementTypeId: 'goods',
            status: 'Open',
            budget: 2380000000,
            closingDate: '2026-06-22',
            organization: 'Medical Stores Department',
            description: 'Supply, installation, commissioning, warranty, and user training for digital X-ray systems for six regional hospitals.',
            eligibility: 'Open Tender / Medical equipment / TMDA medical device registration and manufacturer authorization required.',
            category: 'Medical Equipment and Accessories',
            categories: ['Medical Equipment and Accessories', 'Emergency and field medical services products', 'Computer Equipment and Accessories'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'Dar es Salaam, Mwanza, Arusha, Mbeya, Tabora, and Mtwara',
            commercialModel: 'Quantity Schedule',
            documents: ['Technical_Specifications.pdf', 'Quantity_Schedule.xlsx', 'Warranty_Terms.pdf', 'Installation_Requirements.pdf'],
            regulatoryLicenses: [
                { group: 'Food, Drugs & Cosmetics', license: 'Medical Devices Registration Permit', body: 'Tanzania Medicines and Medical Devices Authority (TMDA)', mandatory: true },
                { group: 'Specialized Services', license: 'Calibration Certificate', body: 'Weights and Measures Agency (WMA)', mandatory: false }
            ],
            requirements: {
                fields: {
                    quantityScheduleRows: [
                        { itemDescription: 'Digital X-ray system with flat panel detector', unitOfMeasure: 'Set', quantity: 6, unitPrice: 320000000, totalPrice: 1920000000, mandatory: true },
                        { itemDescription: 'Radiology workstation and diagnostic display', unitOfMeasure: 'Set', quantity: 6, unitPrice: 45000000, totalPrice: 270000000, mandatory: true },
                        { itemDescription: 'User training and commissioning kit', unitOfMeasure: 'Lot', quantity: 1, unitPrice: 190000000, totalPrice: 190000000, mandatory: true }
                    ],
                    specificationCards: [
                        { itemRowId: 'Digital X-ray system with flat panel detector', productDescription: 'Floor-mounted digital radiography unit with detector, generator, table, bucky stand, and DICOM connectivity.', brandRequirements: 'Brand-neutral or equivalent', standards: ['ISO', 'CE'], performanceSpecifications: 'Minimum 50 kW generator, flat panel detector, DICOM 3.0, PACS/RIS integration.', dimensions: 'Suitable for standard radiology room', materialQuality: 'Medical grade', warrantyRequirements: 'Minimum 3 years comprehensive warranty', packagingRequirements: 'Shock-protected export packaging', installationRequirements: 'Installation, calibration, acceptance testing, and radiation safety checks required.' },
                        { itemRowId: 'Radiology workstation and diagnostic display', productDescription: 'Diagnostic workstation with licensed image viewing software.', brandRequirements: 'Brand-neutral or equivalent', standards: ['CE'], performanceSpecifications: 'Medical-grade display and DICOM viewer with local storage.', dimensions: 'Desktop workstation', materialQuality: 'Medical grade', warrantyRequirements: 'Minimum 3 years warranty', installationRequirements: 'Configured with hospital PACS where available.' }
                    ],
                    requireSamples: 'No',
                    otherEligibilityRequirements: [
                        { requirementName: 'Manufacturer authorization', mandatory: true, requiresUpload: true, notes: 'Authorization must name Tanzania and the tender title.' },
                        { requirementName: 'After-sales service plan', mandatory: true, requiresUpload: true, notes: 'Include local engineers, spare parts stock, and response times.' },
                        { requirementName: 'Radiation safety installation references', mandatory: true, requiresUpload: true, notes: 'Provide at least three completed installations.' }
                    ]
                },
                lists: {
                    warrantyObligations: [
                        { text: 'Provide preventive maintenance schedule for warranty period.' },
                        { text: 'Provide spare parts availability commitment for seven years.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Specification compliance', weight: 35, subcriteria: ['Detector performance', 'DICOM compatibility', 'Radiation safety'] },
                    { name: 'Delivery capacity', weight: 20, subcriteria: ['Installation schedule', 'Local support team'] },
                    { name: 'Financial proposal', weight: 30, subcriteria: ['Unit price', 'Lifecycle cost'] },
                    { name: 'After-sales support', weight: 10, subcriteria: ['Warranty', 'Spare parts'] },
                    { name: 'Compliance documents', weight: 5, subcriteria: ['TMDA permit', 'Authorization'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-18' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-08' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-06-22' },
                { id: 'milestone-opening', name: 'Bid opening', date: '2026-06-23' },
                { id: 'milestone-evaluation', name: 'Evaluation complete', date: '2026-07-10' },
                { id: 'milestone-award', name: 'Award target', date: '2026-07-24' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Digital X-ray system with flat panel detector', qty: 6, unit: 'Set', rate: 320000000 },
                { item: '1.2', description: 'Radiology workstation and diagnostic display', qty: 6, unit: 'Set', rate: 45000000 },
                { item: '1.3', description: 'Training, commissioning, and acceptance testing', qty: 1, unit: 'Lot', rate: 190000000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Digital X-ray system with flat panel detector', qty: 6, unit: 'Set', rate: 320000000 },
                { item: '1.2', description: 'Radiology workstation and diagnostic display', qty: 6, unit: 'Set', rate: 45000000 },
                { item: '1.3', description: 'Training, commissioning, and acceptance testing', qty: 1, unit: 'Lot', rate: 190000000 }
            ],
            deliverables: ['Installed digital X-ray systems', 'Training certificates', 'Warranty certificates', 'Acceptance test reports'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Buyer can issue technical specification clarifications.' }],
            interestedSuppliers: [
                { name: 'AfyaMed Technologies', status: 'Downloaded documents', lastActivity: 'Today' },
                { name: 'MedEquip Tanzania Ltd', status: 'Watching tender', lastActivity: 'Yesterday' }
            ]
        },
        {
            id: 'PX-GDS-2026-002',
            title: 'Supply of School Science Laboratory Equipment',
            type: 'Goods',
            procurementTypeId: 'goods',
            status: 'Open',
            budget: 875000000,
            closingDate: '2026-06-18',
            organization: 'President Office Regional Administration and Local Government',
            description: 'Framework supply of science laboratory benches, glassware, microscopes, safety cabinets, and basic chemistry kits for public secondary schools.',
            eligibility: 'Open Tender / Education supplies / Suppliers with education equipment experience, TBS-compliant products, and delivery capacity.',
            category: 'Developmental and professional teaching aids and materials and accessories and supplies',
            categories: ['Developmental and professional teaching aids and materials and accessories and supplies', 'Classroom and instructional furniture and accessories', 'Laboratory Equipment and Supplies'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'Nationwide school delivery points',
            commercialModel: 'Quantity Schedule',
            documents: ['Science_Lab_Specifications.pdf', 'Delivery_Lot_Schedule.xlsx', 'Sample_Submission_Form.pdf', 'Warranty_Form.pdf'],
            regulatoryLicenses: [
                { group: 'Specialized Services', license: 'Weights and Measures Inspection Certificate', body: 'Weights and Measures Agency (WMA)', mandatory: false }
            ],
            requirements: {
                fields: {
                    quantityScheduleRows: [
                        { itemDescription: 'Student microscope, binocular', unitOfMeasure: 'Pcs', quantity: 500, unitPrice: 420000, totalPrice: 210000000, mandatory: true },
                        { itemDescription: 'Chemistry glassware starter kit', unitOfMeasure: 'Set', quantity: 250, unitPrice: 600000, totalPrice: 150000000, mandatory: true },
                        { itemDescription: 'Laboratory safety cabinet', unitOfMeasure: 'Pcs', quantity: 100, unitPrice: 2250000, totalPrice: 225000000, mandatory: true },
                        { itemDescription: 'Laboratory bench with chemical-resistant top', unitOfMeasure: 'Pcs', quantity: 200, unitPrice: 1450000, totalPrice: 290000000, mandatory: true }
                    ],
                    specificationCards: [
                        { itemRowId: 'Student microscope, binocular', productDescription: 'Durable school microscope with achromatic objectives and LED illumination.', brandRequirements: 'Brand-neutral or equivalent', standards: ['ISO', 'TBS'], performanceSpecifications: '40x to 1000x magnification, mechanical stage, rechargeable LED light.', materialQuality: 'Certified', warrantyRequirements: 'Minimum 24 months warranty', packagingRequirements: 'Individual shock-resistant box' },
                        { itemRowId: 'Laboratory safety cabinet', productDescription: 'Lockable chemical storage cabinet for school laboratories.', standards: ['TBS'], materialQuality: 'Industrial grade', warrantyRequirements: 'Minimum 24 months warranty', packagingRequirements: 'Flat packed or assembled with protective packaging' }
                    ],
                    requireSamples: 'Yes',
                    sampleRequirementRows: [
                        { relatedBoqItem: 'Student microscope, binocular', sampleRequired: true, numberOfSamples: 1, sampleDescription: 'One fully functional microscope sample.', deliveryLocation: 'Dar es Salaam PMU', deliveryDeadline: '2026-06-07', mandatory: true, returnableSample: true },
                        { relatedBoqItem: 'Chemistry glassware starter kit', sampleRequired: true, numberOfSamples: 1, sampleDescription: 'One representative starter kit.', deliveryLocation: 'Dar es Salaam PMU', deliveryDeadline: '2026-06-07', mandatory: true, returnableSample: false }
                    ],
                    otherEligibilityRequirements: [
                        { requirementName: 'Past supply contracts to schools', mandatory: true, requiresUpload: true, notes: 'At least two contracts completed within the last five years.' },
                        { requirementName: 'Delivery fleet or logistics partnership', mandatory: true, requiresUpload: true, notes: 'Provide delivery plan for all regions.' },
                        { requirementName: 'Product catalogues', mandatory: true, requiresUpload: true, notes: 'Catalogues must match offered items.' }
                    ]
                },
                lists: {
                    deliveryRequirements: [
                        { text: 'Deliver by region using buyer-approved delivery note format.' },
                        { text: 'Replace damaged items within 10 working days.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Specification compliance', weight: 35, subcriteria: ['Sample quality', 'TBS conformity', 'Durability'] },
                    { name: 'Delivery capacity', weight: 20, subcriteria: ['Regional logistics', 'Packaging'] },
                    { name: 'Financial proposal', weight: 30, subcriteria: ['Unit prices', 'Lot pricing'] },
                    { name: 'After-sales support', weight: 10, subcriteria: ['Replacement process', 'Warranty'] },
                    { name: 'Compliance documents', weight: 5, subcriteria: ['Registration', 'Tax clearance'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-19' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-04' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-06-18' },
                { id: 'milestone-opening', name: 'Bid opening', date: '2026-06-19' },
                { id: 'milestone-evaluation', name: 'Evaluation complete', date: '2026-07-03' },
                { id: 'milestone-award', name: 'Award target', date: '2026-07-17' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Student microscope, binocular', qty: 500, unit: 'Pcs', rate: 420000 },
                { item: '1.2', description: 'Chemistry glassware starter kit', qty: 250, unit: 'Set', rate: 600000 },
                { item: '1.3', description: 'Laboratory safety cabinet', qty: 100, unit: 'Pcs', rate: 2250000 },
                { item: '1.4', description: 'Laboratory bench with chemical-resistant top', qty: 200, unit: 'Pcs', rate: 1450000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Student microscope, binocular', qty: 500, unit: 'Pcs', rate: 420000 },
                { item: '1.2', description: 'Chemistry glassware starter kit', qty: 250, unit: 'Set', rate: 600000 },
                { item: '1.3', description: 'Laboratory safety cabinet', qty: 100, unit: 'Pcs', rate: 2250000 },
                { item: '1.4', description: 'Laboratory bench with chemical-resistant top', qty: 200, unit: 'Pcs', rate: 1450000 }
            ],
            deliverables: ['Supplied laboratory equipment', 'Regional delivery notes', 'Warranty cards', 'Sample evaluation records'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Sample submission clarifications can be added here.' }],
            interestedSuppliers: [
                { name: 'ElimuLab Supplies', status: 'Downloaded documents', lastActivity: 'Today' },
                { name: 'STEM Equip Tanzania', status: 'Saved tender', lastActivity: 'Yesterday' }
            ]
        },
        {
            id: 'PX-GDS-2026-003',
            title: 'Supply of Agricultural Seed and Soil Testing Kits',
            type: 'Goods',
            procurementTypeId: 'goods',
            status: 'Open',
            budget: 640000000,
            closingDate: '2026-06-29',
            organization: 'Ministry of Agriculture',
            description: 'Supply of certified maize and sunflower seed packs, soil testing kits, moisture meters, and farmer extension starter materials.',
            eligibility: 'Open Tender / Agricultural inputs / Certified seed supplier or authorized distributor with traceability records.',
            category: 'Seeds and Seedlings',
            categories: ['Seeds and Seedlings', 'Agricultural seeds treatment, preservation and processing', 'Fertilizers, Plants Nutrients and herbicides'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'Morogoro, Dodoma, Manyara, and Simiyu',
            commercialModel: 'Quantity Schedule',
            documents: ['Seed_Technical_Specifications.pdf', 'Lot_Delivery_Schedule.xlsx', 'Traceability_Form.pdf', 'Sample_Testing_Form.pdf'],
            regulatoryLicenses: [
                { group: 'Specialized Services', license: 'Weights and Measures Inspection Certificate', body: 'Weights and Measures Agency (WMA)', mandatory: false }
            ],
            requirements: {
                fields: {
                    quantityScheduleRows: [
                        { itemDescription: 'Certified maize seed 10kg packs', unitOfMeasure: 'Pcs', quantity: 18000, unitPrice: 18500, totalPrice: 333000000, mandatory: true },
                        { itemDescription: 'Certified sunflower seed 5kg packs', unitOfMeasure: 'Pcs', quantity: 12000, unitPrice: 13750, totalPrice: 165000000, mandatory: true },
                        { itemDescription: 'Portable soil testing kit', unitOfMeasure: 'Set', quantity: 400, unitPrice: 255000, totalPrice: 102000000, mandatory: true },
                        { itemDescription: 'Digital grain moisture meter', unitOfMeasure: 'Pcs', quantity: 200, unitPrice: 200000, totalPrice: 40000000, mandatory: true }
                    ],
                    specificationCards: [
                        { itemRowId: 'Certified maize seed 10kg packs', productDescription: 'Certified improved maize seed packed in 10kg sealed bags.', standards: ['TBS', 'Manufacturer certificate'], performanceSpecifications: 'Minimum germination 85 percent with batch traceability.', materialQuality: 'Certified', warrantyRequirements: 'Replacement for failed certified lots', packagingRequirements: 'Sealed moisture-resistant bags', shelfLifeRequirements: 'Minimum 12 months remaining shelf life' },
                        { itemRowId: 'Portable soil testing kit', productDescription: 'Portable field soil testing kit for pH, NPK, and organic matter indicators.', standards: ['ISO'], performanceSpecifications: 'Field-ready kit with reagents, instructions, and carrying case.', materialQuality: 'Certified', warrantyRequirements: '12 months warranty' }
                    ],
                    requireSamples: 'Yes',
                    sampleRequirementRows: [
                        { relatedBoqItem: 'Certified maize seed 10kg packs', sampleRequired: true, numberOfSamples: 2, sampleDescription: 'Two sealed sample packs with batch certificates.', deliveryLocation: 'Ministry PMU Dodoma', deliveryDeadline: '2026-06-13', mandatory: true, returnableSample: false },
                        { relatedBoqItem: 'Portable soil testing kit', sampleRequired: true, numberOfSamples: 1, sampleDescription: 'One kit sample for field inspection.', deliveryLocation: 'Ministry PMU Dodoma', deliveryDeadline: '2026-06-13', mandatory: true, returnableSample: true }
                    ],
                    otherEligibilityRequirements: [
                        { requirementName: 'Seed certification evidence', mandatory: true, requiresUpload: true, notes: 'Upload certification for each seed variety offered.' },
                        { requirementName: 'Batch traceability plan', mandatory: true, requiresUpload: true, notes: 'Include lot numbers, source farms, and warehouse records.' },
                        { requirementName: 'Regional delivery plan', mandatory: true, requiresUpload: true, notes: 'Show delivery sequence by district.' }
                    ]
                },
                lists: {
                    qualityControls: [
                        { text: 'Buyer may test samples for germination and moisture before award.' },
                        { text: 'Supplier must replace rejected lots within 14 days.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Specification compliance', weight: 35, subcriteria: ['Seed certification', 'Sample test results', 'Kit quality'] },
                    { name: 'Delivery capacity', weight: 20, subcriteria: ['Regional logistics', 'Storage control'] },
                    { name: 'Financial proposal', weight: 30, subcriteria: ['Unit prices', 'Lot totals'] },
                    { name: 'After-sales support', weight: 10, subcriteria: ['Replacement process', 'Extension support'] },
                    { name: 'Compliance documents', weight: 5, subcriteria: ['Registration', 'Tax clearance'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-21' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-13' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-06-29' },
                { id: 'milestone-opening', name: 'Bid opening', date: '2026-06-30' },
                { id: 'milestone-evaluation', name: 'Evaluation complete', date: '2026-07-14' },
                { id: 'milestone-award', name: 'Award target', date: '2026-07-28' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Certified maize seed 10kg packs', qty: 18000, unit: 'Pcs', rate: 18500 },
                { item: '1.2', description: 'Certified sunflower seed 5kg packs', qty: 12000, unit: 'Pcs', rate: 13750 },
                { item: '1.3', description: 'Portable soil testing kit', qty: 400, unit: 'Set', rate: 255000 },
                { item: '1.4', description: 'Digital grain moisture meter', qty: 200, unit: 'Pcs', rate: 200000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Certified maize seed 10kg packs', qty: 18000, unit: 'Pcs', rate: 18500 },
                { item: '1.2', description: 'Certified sunflower seed 5kg packs', qty: 12000, unit: 'Pcs', rate: 13750 },
                { item: '1.3', description: 'Portable soil testing kit', qty: 400, unit: 'Set', rate: 255000 },
                { item: '1.4', description: 'Digital grain moisture meter', qty: 200, unit: 'Pcs', rate: 200000 }
            ],
            deliverables: ['Certified seed packs delivered by district', 'Soil testing kits and meters', 'Batch traceability register', 'Acceptance inspection report'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Buyer can update sample testing instructions if needed.' }],
            interestedSuppliers: [
                { name: 'AgriSeed Tanzania', status: 'Downloaded documents', lastActivity: 'Today' },
                { name: 'GreenGrow Inputs Ltd', status: 'Watching tender', lastActivity: '2 days ago' }
            ]
        },
        {
            id: 'PX-GDS-2026-004',
            title: 'Framework Supply of Office Furniture and Ergonomic Chairs',
            type: 'Goods',
            procurementTypeId: 'goods',
            status: 'Open',
            budget: 1120000000,
            closingDate: '2026-07-06',
            organization: 'Tanzania Revenue Authority',
            description: 'Twelve-month framework supply of desks, ergonomic chairs, filing cabinets, reception counters, and meeting tables for TRA offices.',
            eligibility: 'Open Tender / Furniture framework / Supplier must show production or distribution capacity and warranty support.',
            category: 'Accommodation and Office furniture and accessories',
            categories: ['Accommodation and Office furniture and accessories', 'Commercial and industrial furniture and accessories', 'Containers and storage'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'TRA offices nationwide',
            commercialModel: 'Quantity Schedule',
            documents: ['Furniture_Catalogue_Requirements.pdf', 'Framework_Quantity_Schedule.xlsx', 'Warranty_Service_Form.pdf'],
            regulatoryLicenses: [],
            requirements: {
                fields: {
                    quantityScheduleRows: [
                        { itemDescription: 'Ergonomic office chair', unitOfMeasure: 'Pcs', quantity: 1800, unitPrice: 280000, totalPrice: 504000000, mandatory: true },
                        { itemDescription: 'Executive desk with cable management', unitOfMeasure: 'Pcs', quantity: 650, unitPrice: 520000, totalPrice: 338000000, mandatory: true },
                        { itemDescription: 'Steel filing cabinet four drawer', unitOfMeasure: 'Pcs', quantity: 500, unitPrice: 250000, totalPrice: 125000000, mandatory: true },
                        { itemDescription: 'Meeting table for 12 users', unitOfMeasure: 'Pcs', quantity: 90, unitPrice: 1700000, totalPrice: 153000000, mandatory: true }
                    ],
                    specificationCards: [
                        { itemRowId: 'Ergonomic office chair', productDescription: 'Adjustable ergonomic task chair with lumbar support and five-star base.', brandRequirements: 'Brand-neutral or equivalent', standards: ['TBS'], performanceSpecifications: 'Adjustable height, tilt, breathable fabric, minimum 120kg load rating.', dimensions: 'Standard task chair', materialQuality: 'Premium', warrantyRequirements: 'Minimum 24 months warranty', packagingRequirements: 'Protected delivery packaging' },
                        { itemRowId: 'Executive desk with cable management', productDescription: 'Office desk with modesty panel and cable management.', standards: ['TBS'], materialQuality: 'Premium', warrantyRequirements: 'Minimum 24 months warranty' }
                    ],
                    requireSamples: 'Yes',
                    sampleRequirementRows: [
                        { relatedBoqItem: 'Ergonomic office chair', sampleRequired: true, numberOfSamples: 1, sampleDescription: 'One assembled chair for ergonomic inspection.', deliveryLocation: 'TRA Headquarters Dar es Salaam', deliveryDeadline: '2026-06-20', mandatory: true, returnableSample: true }
                    ],
                    otherEligibilityRequirements: [
                        { requirementName: 'Warranty service arrangement', mandatory: true, requiresUpload: true, notes: 'Include service locations and replacement timelines.' },
                        { requirementName: 'Past framework supply references', mandatory: true, requiresUpload: true, notes: 'At least two framework contracts of similar scale.' },
                        { requirementName: 'Product catalog and finishes', mandatory: true, requiresUpload: true, notes: 'Include color, material, and finish options.' }
                    ]
                },
                lists: {
                    frameworkRules: [
                        { text: 'Call-off orders will be issued based on office demand.' },
                        { text: 'Supplier must maintain framework prices for 12 months.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Specification compliance', weight: 35, subcriteria: ['Sample quality', 'Durability', 'Finish'] },
                    { name: 'Delivery capacity', weight: 20, subcriteria: ['Nationwide delivery', 'Stock availability'] },
                    { name: 'Financial proposal', weight: 30, subcriteria: ['Framework rates', 'Discount structure'] },
                    { name: 'After-sales support', weight: 10, subcriteria: ['Warranty service', 'Replacement timeline'] },
                    { name: 'Compliance documents', weight: 5, subcriteria: ['Registration', 'Tax clearance'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-25' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-20' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-07-06' },
                { id: 'milestone-opening', name: 'Bid opening', date: '2026-07-07' },
                { id: 'milestone-evaluation', name: 'Evaluation complete', date: '2026-07-21' },
                { id: 'milestone-award', name: 'Award target', date: '2026-08-04' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Ergonomic office chair', qty: 1800, unit: 'Pcs', rate: 280000 },
                { item: '1.2', description: 'Executive desk with cable management', qty: 650, unit: 'Pcs', rate: 520000 },
                { item: '1.3', description: 'Steel filing cabinet four drawer', qty: 500, unit: 'Pcs', rate: 250000 },
                { item: '1.4', description: 'Meeting table for 12 users', qty: 90, unit: 'Pcs', rate: 1700000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Ergonomic office chair', qty: 1800, unit: 'Pcs', rate: 280000 },
                { item: '1.2', description: 'Executive desk with cable management', qty: 650, unit: 'Pcs', rate: 520000 },
                { item: '1.3', description: 'Steel filing cabinet four drawer', qty: 500, unit: 'Pcs', rate: 250000 },
                { item: '1.4', description: 'Meeting table for 12 users', qty: 90, unit: 'Pcs', rate: 1700000 }
            ],
            deliverables: ['Framework furniture supply', 'Sample approval report', 'Warranty register', 'Monthly delivery reports'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Buyer can update sample submission or color schedule.' }],
            interestedSuppliers: [
                { name: 'Kiti Bora Furnishers', status: 'Downloaded documents', lastActivity: 'Today' },
                { name: 'OfficeLine Tanzania', status: 'Watching tender', lastActivity: 'Yesterday' }
            ]
        },
        {
            id: 'PX-SVC-2026-001',
            title: 'Managed Cybersecurity Monitoring Service',
            type: 'Service',
            procurementTypeId: 'services',
            status: 'Open',
            budget: 1480000000,
            closingDate: '2026-07-10',
            organization: 'Tanzania Revenue Authority',
            description: 'Twenty-four month managed security operations center service covering SIEM monitoring, incident response, vulnerability scanning, and monthly reporting.',
            eligibility: 'Open Tender / ICT service / Certified cybersecurity provider with SOC analysts and data protection controls.',
            category: 'IT Support',
            categories: ['IT Support', 'Computer Software', 'Data Voice or Multimedia Network Equipment or Platforms and Accessories'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'Dar es Salaam and remote SOC operations',
            commercialModel: 'Service Schedule',
            documents: ['SOC_Service_TOR.pdf', 'SLA_Schedule.pdf', 'Reporting_Template.xlsx', 'Data_Protection_Requirements.pdf'],
            regulatoryLicenses: [
                { group: 'Communications & Transport', license: 'Application Services License', body: 'Tanzania Communications Regulatory Authority (TCRA)', mandatory: false },
                { group: 'Specialized Services', license: 'Calibration Certificate', body: 'Weights and Measures Agency (WMA)', mandatory: false }
            ],
            requirements: {
                fields: {
                    serviceCategory: 'IT Support',
                    scopeOfServices: 'Provide 24/7 SIEM monitoring, incident triage, vulnerability scanning, threat intelligence briefings, quarterly tabletop exercises, and audit-ready monthly service reports.',
                    serviceLocations: [
                        { text: 'TRA data center Dar es Salaam' },
                        { text: 'TRA disaster recovery site' },
                        { text: 'Supplier security operations center' }
                    ],
                    duration: '24 months',
                    fundingSource: 'Own source',
                    financialRequirementRows: [
                        { requirementType: 'Average Annual Turnover', minimumValue: 2500000000, currency: 'TZS', period: 'Last 3 Years', evidenceRequired: ['Audited accounts'], mandatory: true },
                        { requirementType: 'Access to Credit', minimumValue: 300000000, currency: 'TZS', period: 'Current', evidenceRequired: ['Bank letter', 'Credit facility letter'], mandatory: true }
                    ],
                    personnelRequirementRows: [
                        { position: 'SOC Manager', minimumEducation: 'Bachelor Degree', minimumYearsExperience: 8, cvRequired: true, mandatory: true },
                        { position: 'Incident Response Lead', minimumEducation: 'Professional Qualification', minimumYearsExperience: 6, cvRequired: true, mandatory: true },
                        { position: 'Tier 1 SOC Analysts', minimumEducation: 'Diploma', minimumYearsExperience: 3, cvRequired: true, mandatory: true }
                    ],
                    serviceDeliverables: [
                        { text: '24/7 monitoring and incident log' },
                        { text: 'Monthly security posture report' },
                        { text: 'Quarterly vulnerability assessment report' },
                        { text: 'Incident response after-action reports' }
                    ],
                    serviceMilestones: [
                        { text: 'Service onboarding within 30 days' },
                        { text: 'First vulnerability baseline within 45 days' }
                    ],
                    reportingRequirements: 'Monthly performance reports must include incidents, false positives, mean time to respond, vulnerability status, and remediation follow-up.',
                    slaRequirement: 'Critical incidents acknowledged within 15 minutes and escalated within 30 minutes.',
                    uptimeRequirement: '99.9 percent monitoring platform availability',
                    responseTime: 'Critical: 15 minutes, High: 1 hour, Medium: 4 hours',
                    supportHours: '24/7/365',
                    supportingDocumentRows: [
                        { documentName: 'SOC methodology', mandatory: true },
                        { documentName: 'Information security policy', mandatory: true },
                        { documentName: 'Data protection and confidentiality declaration', mandatory: true }
                    ],
                    esRequirementCards: [
                        { category: 'Worker Safety', description: 'Supplier must manage analyst fatigue and shift handover quality.', evidenceRequired: ['Procedure manual'], mandatory: false },
                        { category: 'Labor Compliance', description: 'All assigned staff must be formally employed or contracted.', evidenceRequired: ['Policy document'], mandatory: true }
                    ]
                },
                lists: {
                    mandatoryDeclarations: [
                        { text: 'Sign confidentiality and data processing agreement.' },
                        { text: 'Confirm no offshore data transfer without written buyer approval.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Service methodology', weight: 30, subcriteria: ['SOC process', 'Incident response', 'Threat intelligence'] },
                    { name: 'Team capability', weight: 25, subcriteria: ['Certifications', 'Shift coverage', 'Experience'] },
                    { name: 'SLA compliance plan', weight: 20, subcriteria: ['Response times', 'Escalation', 'Reporting'] },
                    { name: 'Financial proposal', weight: 15, subcriteria: ['Monthly fees', 'Tooling cost transparency'] },
                    { name: 'Compliance', weight: 10, subcriteria: ['Data protection', 'References'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-26' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-24' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-07-10' },
                { id: 'milestone-opening', name: 'Bid opening', date: '2026-07-13' },
                { id: 'milestone-evaluation', name: 'Evaluation complete', date: '2026-07-31' },
                { id: 'milestone-award', name: 'Award target', date: '2026-08-14' }
            ],
            commercialItems: [
                { item: '1.1', description: '24/7 SIEM monitoring and triage', qty: 24, unit: 'Month', rate: 42000000 },
                { item: '1.2', description: 'Vulnerability scanning and reporting', qty: 24, unit: 'Month', rate: 8500000 },
                { item: '1.3', description: 'Incident response retainer', qty: 24, unit: 'Month', rate: 7250000 },
                { item: '1.4', description: 'Onboarding, tuning, and tabletop exercises', qty: 1, unit: 'Lot', rate: 94000000 }
            ],
            boqItems: [
                { item: '1.1', description: '24/7 SIEM monitoring and triage', qty: 24, unit: 'Month', rate: 42000000 },
                { item: '1.2', description: 'Vulnerability scanning and reporting', qty: 24, unit: 'Month', rate: 8500000 },
                { item: '1.3', description: 'Incident response retainer', qty: 24, unit: 'Month', rate: 7250000 },
                { item: '1.4', description: 'Onboarding, tuning, and tabletop exercises', qty: 1, unit: 'Lot', rate: 94000000 }
            ],
            deliverables: ['SOC onboarding plan', 'Monthly security reports', 'Incident response reports', 'Quarterly executive briefings'],
            clarifications: [{ title: 'Tool ownership', question: 'Bidders may propose buyer-owned or supplier-hosted tooling, subject to data residency controls.', status: 'Answered' }],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'SLA clarifications can be issued as addenda.' }],
            interestedSuppliers: [
                { name: 'CyberShield Africa', status: 'Asked clarification', lastActivity: 'Today' },
                { name: 'SecureOps Tanzania', status: 'Downloaded documents', lastActivity: 'Today' }
            ]
        },
        {
            id: 'PX-SVC-2026-002',
            title: 'Hospital Cleaning, Laundry, and Waste Handling Services',
            type: 'Service',
            procurementTypeId: 'services',
            status: 'Open',
            budget: 920000000,
            closingDate: '2026-06-24',
            organization: 'Muhimbili National Hospital',
            description: 'Twelve-month cleaning, laundry, linen movement, and non-hazardous waste handling service for wards, theatres, offices, and public areas.',
            eligibility: 'Open Tender / Cleaning services / Provider with healthcare cleaning references, trained supervisors, PPE, and insurance cover.',
            category: 'Cleaning',
            categories: ['Cleaning Equipment and Supplies', 'Bedclothes and table and kitchen linen and towels', 'Waste Management'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'Muhimbili National Hospital campus',
            commercialModel: 'Service Schedule',
            documents: ['Cleaning_Scope.pdf', 'Area_Schedule.xlsx', 'Infection_Control_Requirements.pdf', 'SLA_Template.pdf'],
            regulatoryLicenses: [
                { group: 'Environmental & Safety', license: 'Occupational Safety and Health Compliance Certificate', body: 'Occupational Safety and Health Authority (OSHA)', mandatory: true },
                { group: 'Specialized Services', license: 'Hazardous Chemicals Handling Certificate', body: 'Government Chemist Laboratory Authority (GCLA)', mandatory: false }
            ],
            requirements: {
                fields: {
                    serviceCategory: 'Cleaning',
                    scopeOfServices: 'Daily cleaning, terminal cleaning, laundry movement, linen sorting, washroom replenishment, waste staging, and quality inspections for clinical and non-clinical spaces.',
                    serviceLocations: [
                        { text: 'Surgical wards' },
                        { text: 'Outpatient department' },
                        { text: 'Administrative offices' },
                        { text: 'Laundry collection points' }
                    ],
                    duration: '12 months with option to extend',
                    fundingSource: 'Own source',
                    financialRequirementRows: [
                        { requirementType: 'Minimum Annual Turnover', minimumValue: 1200000000, currency: 'TZS', period: 'Annual', evidenceRequired: ['Audited accounts', 'Tax clearance'], mandatory: true }
                    ],
                    personnelRequirementRows: [
                        { position: 'Contract Manager', minimumEducation: 'Diploma', minimumYearsExperience: 5, cvRequired: true, mandatory: true },
                        { position: 'Infection Control Supervisor', minimumEducation: 'Professional Qualification', minimumYearsExperience: 4, cvRequired: true, mandatory: true },
                        { position: 'Cleaning Supervisors', minimumEducation: 'Certificate', minimumYearsExperience: 3, cvRequired: true, mandatory: true }
                    ],
                    cleaningAreas: 'Wards, theatres support areas, outpatient waiting rooms, washrooms, corridors, offices, and public access areas.',
                    cleaningFrequency: 'Daily',
                    cleaningMaterials: 'Hospital-grade disinfectants, microfiber systems, color-coded mops, PPE, and consumables.',
                    wasteDisposalRequirements: 'Segregate non-hazardous waste, coordinate with hospital waste team, and record daily collection logs.',
                    equipmentRequirementRows: [
                        { equipmentName: 'Floor scrubber', quantity: 6, ownershipRequirement: 'Owned', technicalSpecification: 'Battery-powered scrubber suitable for hospital floors.', evidenceRequired: ['Photos', 'Purchase receipt'], mandatory: true, evaluationMethod: 'Compliance Review', supplierResponseType: 'Upload + Text' },
                        { equipmentName: 'Laundry carts', quantity: 40, ownershipRequirement: 'Either', technicalSpecification: 'Washable enclosed carts for linen movement.', evidenceRequired: ['Photos'], mandatory: true, evaluationMethod: 'Pass/Fail', supplierResponseType: 'Upload' }
                    ],
                    esRequirementCards: [
                        { category: 'Worker Safety', description: 'Provide PPE, vaccination guidance, and infection prevention training.', evidenceRequired: ['Training records', 'Procedure manual'], mandatory: true },
                        { category: 'Labor Compliance', description: 'Submit staff roster and lawful employment declaration.', evidenceRequired: ['Policy document'], mandatory: true }
                    ],
                    supportingDocumentRows: [
                        { documentName: 'Healthcare cleaning methodology', mandatory: true },
                        { documentName: 'Staff training records', mandatory: true },
                        { documentName: 'Insurance certificate', mandatory: true }
                    ],
                    insuranceCovers: [
                        { text: 'Public liability insurance' },
                        { text: 'Workers compensation cover' }
                    ],
                    riskAssessmentRequirement: 'Submit risk assessment for clinical areas and chemical handling.',
                    safetyPlanRequirement: 'Submit hospital cleaning safety plan and escalation procedure.',
                    ppeRequirements: 'Gloves, masks, aprons, eye protection, and color-coded cleaning tools.'
                },
                lists: {
                    mandatoryDeclarations: [
                        { text: 'Confirm staff will follow hospital infection prevention protocols.' },
                        { text: 'Confirm all cleaning chemicals will be approved before use.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Service methodology', weight: 30, subcriteria: ['Healthcare cleaning plan', 'Quality control'] },
                    { name: 'Team capability', weight: 25, subcriteria: ['Supervision', 'Training', 'Staffing levels'] },
                    { name: 'SLA compliance plan', weight: 20, subcriteria: ['Inspection system', 'Response time'] },
                    { name: 'Financial proposal', weight: 15, subcriteria: ['Monthly fees', 'Consumables realism'] },
                    { name: 'Compliance', weight: 10, subcriteria: ['OSHA', 'Insurance', 'Labor compliance'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-17' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-10' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-06-24' },
                { id: 'milestone-opening', name: 'Bid opening', date: '2026-06-25' },
                { id: 'milestone-evaluation', name: 'Evaluation complete', date: '2026-07-09' },
                { id: 'milestone-award', name: 'Award target', date: '2026-07-23' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Clinical and public area cleaning service', qty: 12, unit: 'Month', rate: 52000000 },
                { item: '1.2', description: 'Laundry movement and linen support', qty: 12, unit: 'Month', rate: 11500000 },
                { item: '1.3', description: 'Consumables and PPE provision', qty: 12, unit: 'Month', rate: 9800000 },
                { item: '1.4', description: 'Mobilization, training, and quality baseline', qty: 1, unit: 'Lot', rate: 40000000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Clinical and public area cleaning service', qty: 12, unit: 'Month', rate: 52000000 },
                { item: '1.2', description: 'Laundry movement and linen support', qty: 12, unit: 'Month', rate: 11500000 },
                { item: '1.3', description: 'Consumables and PPE provision', qty: 12, unit: 'Month', rate: 9800000 },
                { item: '1.4', description: 'Mobilization, training, and quality baseline', qty: 1, unit: 'Lot', rate: 40000000 }
            ],
            deliverables: ['Daily cleaning logs', 'Monthly KPI reports', 'Staff training records', 'Incident and corrective action reports'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Buyer can update area schedule before closing.' }],
            interestedSuppliers: [
                { name: 'Hospital CleanCare Ltd', status: 'Downloaded documents', lastActivity: 'Today' },
                { name: 'Usafi Professional Services', status: 'Watching tender', lastActivity: 'Yesterday' }
            ]
        },
        {
            id: 'PX-SVC-2026-003',
            title: 'Regional Student Meal Catering Services',
            type: 'Service',
            procurementTypeId: 'services',
            status: 'Open',
            budget: 1560000000,
            closingDate: '2026-07-02',
            organization: 'University of Dodoma',
            description: 'Provision of breakfast, lunch, dinner, special diet meals, food safety controls, and monthly reporting for student dining halls.',
            eligibility: 'Invited Tender / Catering services / Food handling permits, demonstrated institutional catering capacity, and hygiene compliance required.',
            category: 'Catering',
            categories: ['Catering', 'Food Beverage and Tobacco Products', 'Domestic kitchenware and kitchen supplies'],
            method: 'Invited Tender',
            visibility: 'Invited suppliers only',
            visibilityNote: 'Visible to invited catering suppliers and buyer users.',
            invitedUsers: [
                { name: 'ABC Construction Ltd', organization: 'ABC Construction Ltd', email: 'supplier@abc.test' },
                { name: 'Campus Meals Tanzania', organization: 'Campus Meals Tanzania Ltd', email: 'bids@campusmeals.test' }
            ],
            location: 'University of Dodoma student dining halls',
            commercialModel: 'Service Schedule',
            documents: ['Catering_TOR.pdf', 'Menu_and_Nutrition_Schedule.xlsx', 'Food_Safety_Requirements.pdf', 'Service_Level_Agreement.pdf'],
            regulatoryLicenses: [
                { group: 'Food, Drugs & Cosmetics', license: 'Food Business Permit / Food Handling License', body: 'Tanzania Medicines and Medical Devices Authority (TMDA)', mandatory: true },
                { group: 'Environmental & Safety', license: 'Occupational Safety and Health Compliance Certificate', body: 'Occupational Safety and Health Authority (OSHA)', mandatory: false }
            ],
            requirements: {
                fields: {
                    serviceCategory: 'Catering',
                    scopeOfServices: 'Prepare and serve daily meals, manage queue flow, maintain hygiene records, support special diets, and submit consumption and quality reports.',
                    serviceLocations: [
                        { text: 'Dining Hall A' },
                        { text: 'Dining Hall B' },
                        { text: 'Satellite serving points' }
                    ],
                    duration: 'Academic year 2026/2027',
                    fundingSource: 'Own source',
                    financialRequirementRows: [
                        { requirementType: 'Average Annual Turnover', minimumValue: 1800000000, currency: 'TZS', period: 'Last 3 Years', evidenceRequired: ['Audited accounts', 'Bank statement'], mandatory: true }
                    ],
                    personnelRequirementRows: [
                        { position: 'Catering Manager', minimumEducation: 'Diploma', minimumYearsExperience: 6, cvRequired: true, mandatory: true },
                        { position: 'Nutritionist', minimumEducation: 'Bachelor Degree', minimumYearsExperience: 3, cvRequired: true, mandatory: true },
                        { position: 'Food Safety Supervisor', minimumEducation: 'Professional Qualification', minimumYearsExperience: 4, cvRequired: true, mandatory: true }
                    ],
                    menuRequirements: 'Balanced rotating menu with breakfast, lunch, dinner, vegetarian option, and medically approved special diets.',
                    hygieneRequirements: 'HACCP-aligned food safety controls, daily temperature logs, staff hygiene checks, and pest control coordination.',
                    foodCertifications: [
                        { text: 'Food handling certificates for supervisors' },
                        { text: 'Kitchen inspection clearance' }
                    ],
                    equipmentRequirementRows: [
                        { equipmentName: 'Industrial cooking ranges', quantity: 8, ownershipRequirement: 'Either', technicalSpecification: 'Commercial grade cooking ranges for high volume service.', evidenceRequired: ['Photos', 'Inspection certificate'], mandatory: true, evaluationMethod: 'Compliance Review', supplierResponseType: 'Upload + Text' },
                        { equipmentName: 'Food transport warmers', quantity: 20, ownershipRequirement: 'Owned', technicalSpecification: 'Insulated warmers for satellite serving points.', evidenceRequired: ['Photos'], mandatory: true, evaluationMethod: 'Pass/Fail', supplierResponseType: 'Upload' }
                    ],
                    esRequirementCards: [
                        { category: 'Worker Safety', description: 'Food handling PPE and burn prevention procedure required.', evidenceRequired: ['Procedure manual'], mandatory: true },
                        { category: 'Environmental Protection', description: 'Food waste reduction and disposal plan required.', evidenceRequired: ['Environmental plan'], mandatory: true }
                    ],
                    supportingDocumentRows: [
                        { documentName: 'Menu and nutrition plan', mandatory: true },
                        { documentName: 'Food safety management plan', mandatory: true },
                        { documentName: 'Institutional catering references', mandatory: true }
                    ],
                    insuranceCovers: [
                        { text: 'Public liability insurance' },
                        { text: 'Food contamination liability cover' }
                    ],
                    riskAssessmentRequirement: 'Submit food safety and crowd management risk assessment.',
                    safetyPlanRequirement: 'Submit kitchen fire safety and first aid plan.',
                    ppeRequirements: 'Hairnets, aprons, gloves, closed shoes, and heat-resistant gloves.'
                },
                lists: {
                    mandatoryDeclarations: [
                        { text: 'Confirm buyer right to conduct kitchen inspections.' },
                        { text: 'Confirm acceptance of meal quality deductions under SLA.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Service methodology', weight: 30, subcriteria: ['Meal production plan', 'Food safety controls'] },
                    { name: 'Team capability', weight: 25, subcriteria: ['Catering manager', 'Nutritionist', 'Supervisors'] },
                    { name: 'SLA compliance plan', weight: 20, subcriteria: ['Queue time', 'Meal availability', 'Quality checks'] },
                    { name: 'Financial proposal', weight: 15, subcriteria: ['Meal rates', 'Cost realism'] },
                    { name: 'Compliance', weight: 10, subcriteria: ['Food permit', 'Insurance', 'References'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-24' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-18' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-07-02' },
                { id: 'milestone-opening', name: 'Bid opening', date: '2026-07-03' },
                { id: 'milestone-evaluation', name: 'Evaluation complete', date: '2026-07-17' },
                { id: 'milestone-award', name: 'Award target', date: '2026-07-31' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Student breakfast service', qty: 180000, unit: 'Unit', rate: 2500 },
                { item: '1.2', description: 'Student lunch service', qty: 220000, unit: 'Unit', rate: 3200 },
                { item: '1.3', description: 'Student dinner service', qty: 220000, unit: 'Unit', rate: 3000 },
                { item: '1.4', description: 'Mobilization and food safety setup', qty: 1, unit: 'Lot', rate: 48000000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Student breakfast service', qty: 180000, unit: 'Unit', rate: 2500 },
                { item: '1.2', description: 'Student lunch service', qty: 220000, unit: 'Unit', rate: 3200 },
                { item: '1.3', description: 'Student dinner service', qty: 220000, unit: 'Unit', rate: 3000 },
                { item: '1.4', description: 'Mobilization and food safety setup', qty: 1, unit: 'Lot', rate: 48000000 }
            ],
            deliverables: ['Daily meal service', 'Food safety records', 'Monthly consumption reports', 'Special diet register'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Menu or serving point changes can be issued as amendments.' }],
            interestedSuppliers: [
                { name: 'Campus Meals Tanzania', status: 'Downloaded documents', lastActivity: 'Today' },
                { name: 'Afya Catering Services', status: 'Watching tender', lastActivity: 'Yesterday' }
            ]
        },
        {
            id: 'PX-SVC-2026-004',
            title: 'Fleet Maintenance and Breakdown Recovery Services',
            type: 'Service',
            procurementTypeId: 'services',
            status: 'Open',
            budget: 760000000,
            closingDate: '2026-06-30',
            organization: 'Tanzania Electric Supply Company',
            description: 'Preventive maintenance, minor repairs, emergency breakdown recovery, spare parts management, and monthly fleet condition reporting for utility vehicles.',
            eligibility: 'Open Tender / Vehicle maintenance / Registered garage with qualified technicians, diagnostic equipment, and regional coverage.',
            category: 'Vehicle maintenance',
            categories: ['Vehicle maintenance', 'Motor Vehicles', 'Motor Vehicle Parts and Accessories'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'Dar es Salaam, Morogoro, Dodoma, and Coast region',
            commercialModel: 'Service Schedule',
            documents: ['Fleet_Maintenance_TOR.pdf', 'Vehicle_List.xlsx', 'SLA_Response_Times.pdf', 'Spare_Parts_Rules.pdf'],
            regulatoryLicenses: [
                { group: 'Specialized Services', license: 'Weights and Measures Inspection Certificate', body: 'Weights and Measures Agency (WMA)', mandatory: false },
                { group: 'Environmental & Safety', license: 'Occupational Safety and Health Compliance Certificate', body: 'Occupational Safety and Health Authority (OSHA)', mandatory: true }
            ],
            requirements: {
                fields: {
                    serviceCategory: 'Vehicle maintenance',
                    scopeOfServices: 'Provide scheduled preventive maintenance, corrective repairs, diagnostic services, towing coordination, tyre services, battery replacement, and monthly fleet health reporting.',
                    serviceLocations: [
                        { text: 'Dar es Salaam workshop' },
                        { text: 'Morogoro service point' },
                        { text: 'Dodoma service point' },
                        { text: 'Coast region mobile recovery' }
                    ],
                    duration: '18 months',
                    fundingSource: 'Own source',
                    financialRequirementRows: [
                        { requirementType: 'Minimum Annual Turnover', minimumValue: 900000000, currency: 'TZS', period: 'Annual', evidenceRequired: ['Audited accounts', 'Tax clearance'], mandatory: true }
                    ],
                    personnelRequirementRows: [
                        { position: 'Workshop Manager', minimumEducation: 'Diploma', minimumYearsExperience: 7, cvRequired: true, mandatory: true },
                        { position: 'Vehicle Diagnostic Technician', minimumEducation: 'Professional Qualification', minimumYearsExperience: 5, cvRequired: true, mandatory: true },
                        { position: 'Recovery Coordinator', minimumEducation: 'Certificate', minimumYearsExperience: 3, cvRequired: true, mandatory: true }
                    ],
                    maintenanceSchedule: 'Preventive maintenance by mileage and time intervals, with buyer-approved work orders before major repairs.',
                    sparePartsRequirement: 'Use genuine or OEM-equivalent parts with warranty and traceable invoices.',
                    technicianRequirements: 'Technicians must have experience with pickups, trucks, vans, and utility service vehicles.',
                    equipmentRequirementRows: [
                        { equipmentName: 'Vehicle diagnostic scanner', quantity: 4, ownershipRequirement: 'Owned', technicalSpecification: 'OBD and manufacturer-compatible diagnostic tools.', evidenceRequired: ['Photos', 'Purchase receipt'], mandatory: true, evaluationMethod: 'Compliance Review', supplierResponseType: 'Upload + Text' },
                        { equipmentName: 'Recovery tow truck access', quantity: 2, ownershipRequirement: 'Either', technicalSpecification: 'Tow truck or signed recovery partnership.', evidenceRequired: ['Logbook', 'Lease agreement'], mandatory: true, evaluationMethod: 'Pass/Fail', supplierResponseType: 'Upload' }
                    ],
                    supportingDocumentRows: [
                        { documentName: 'Workshop capability statement', mandatory: true },
                        { documentName: 'Technician CVs and certificates', mandatory: true },
                        { documentName: 'Spare parts sourcing plan', mandatory: true }
                    ],
                    insuranceCovers: [
                        { text: 'Garage keeper liability' },
                        { text: 'Public liability insurance' }
                    ],
                    riskAssessmentRequirement: 'Submit workshop risk assessment and recovery operation controls.',
                    safetyPlanRequirement: 'Submit safety plan for workshop operations, lifting equipment, and road recovery.',
                    ppeRequirements: 'Workshop PPE including boots, gloves, eye protection, and reflective wear.'
                },
                lists: {
                    mandatoryDeclarations: [
                        { text: 'Confirm no unauthorized replacement of major parts without buyer approval.' },
                        { text: 'Confirm monthly fleet condition reporting.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Service methodology', weight: 30, subcriteria: ['Maintenance workflow', 'Quality checks'] },
                    { name: 'Team capability', weight: 25, subcriteria: ['Technicians', 'Regional coverage'] },
                    { name: 'SLA compliance plan', weight: 20, subcriteria: ['Breakdown response', 'Repair turnaround'] },
                    { name: 'Financial proposal', weight: 15, subcriteria: ['Labor rates', 'Parts markup'] },
                    { name: 'Compliance', weight: 10, subcriteria: ['Insurance', 'Safety', 'References'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-22' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-14' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-06-30' },
                { id: 'milestone-opening', name: 'Bid opening', date: '2026-07-01' },
                { id: 'milestone-evaluation', name: 'Evaluation complete', date: '2026-07-15' },
                { id: 'milestone-award', name: 'Award target', date: '2026-07-29' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Preventive maintenance service', qty: 18, unit: 'Month', rate: 18000000 },
                { item: '1.2', description: 'Corrective repairs labor allowance', qty: 18, unit: 'Month', rate: 14500000 },
                { item: '1.3', description: 'Breakdown recovery retainer', qty: 18, unit: 'Month', rate: 7000000 },
                { item: '1.4', description: 'Spare parts management allowance', qty: 1, unit: 'Lot', rate: 49000000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Preventive maintenance service', qty: 18, unit: 'Month', rate: 18000000 },
                { item: '1.2', description: 'Corrective repairs labor allowance', qty: 18, unit: 'Month', rate: 14500000 },
                { item: '1.3', description: 'Breakdown recovery retainer', qty: 18, unit: 'Month', rate: 7000000 },
                { item: '1.4', description: 'Spare parts management allowance', qty: 1, unit: 'Lot', rate: 49000000 }
            ],
            deliverables: ['Monthly maintenance plan', 'Work order records', 'Breakdown response reports', 'Fleet condition dashboard'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Vehicle list addenda can be published here.' }],
            interestedSuppliers: [
                { name: 'AutoCare Tanzania Ltd', status: 'Downloaded documents', lastActivity: 'Today' },
                { name: 'FleetFix Services', status: 'Watching tender', lastActivity: '2 days ago' }
            ]
        },
        {
            id: 'PX-CNS-2026-001',
            title: 'Consultancy for National e-Procurement Change Management',
            type: 'Consultancy',
            procurementTypeId: 'consultancy',
            status: 'Open',
            budget: 1180000000,
            closingDate: '2026-07-15',
            organization: 'Public Procurement Regulatory Authority',
            description: 'Firm consultancy to design and implement change management, training materials, stakeholder engagement, and adoption monitoring for e-procurement rollout.',
            eligibility: 'Open Tender / Consultancy / Consulting firm with public sector digital transformation and procurement training experience.',
            category: 'Procurement Consultancy',
            categories: ['Procurement Consultancy', 'Training', 'ICT'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'Dar es Salaam with national stakeholder workshops',
            commercialModel: 'Financial Proposal',
            documents: ['Terms_of_Reference.pdf', 'Technical_Proposal_Template.docx', 'Key_Expert_CV_Template.docx', 'Financial_Proposal_Template.xlsx'],
            regulatoryLicenses: [
                { group: 'Finance & Banking', license: 'Investment Adviser License', body: 'Capital Markets and Securities Authority (CMSA)', mandatory: false }
            ],
            requirements: {
                fields: {
                    consultancyEntityBackground: [
                        { organizationBackground: 'PPRA is coordinating adoption of digital procurement workflows across public procuring entities.', departmentUnit: 'Procurement Management Unit', fundingSource: 'Government of Tanzania' }
                    ],
                    consultancyProjectBackground: {
                        projectName: 'National e-Procurement Change Management',
                        backgroundNarrative: 'The rollout requires consistent training, stakeholder engagement, and support for new digital procurement behaviors.',
                        existingChallenges: 'Variable digital readiness, inconsistent procurement documentation, and resistance to process change.',
                        currentSituation: 'Core platform workflows are available and need adoption acceleration.',
                        relatedInitiatives: 'Procurement reform, digital government, and supplier onboarding programs.'
                    },
                    consultancyProblemStatement: {
                        mainProblemDescription: 'Procuring entities need practical change support to adopt digital tender creation, evaluation, and contract workflows.',
                        expectedImpact: 'Higher adoption, better tender quality, faster supplier onboarding, and improved compliance.'
                    },
                    consultancyGeneralObjective: 'Design and deliver a structured change management program that enables public procuring entities and suppliers to use e-procurement workflows effectively.',
                    consultancySpecificObjectives: [
                        { objectiveTitle: 'Adoption readiness assessment', objectiveDescription: 'Assess readiness across selected procuring entities and supplier groups.', priorityLevel: 'High' },
                        { objectiveTitle: 'Training content design', objectiveDescription: 'Prepare role-based training materials and job aids.', priorityLevel: 'High' },
                        { objectiveTitle: 'Adoption monitoring', objectiveDescription: 'Define KPIs and feedback loops for rollout performance.', priorityLevel: 'Medium' }
                    ],
                    consultancyAssignmentActivities: [
                        { activityTitle: 'Stakeholder mapping and readiness assessment', detailedDescription: 'Map user groups, readiness gaps, and training needs.', expectedOutput: 'Readiness assessment report', location: 'National sample', duration: 25, mandatory: true },
                        { activityTitle: 'Training curriculum and facilitation toolkit', detailedDescription: 'Develop buyer, supplier, evaluator, and administrator materials.', expectedOutput: 'Training toolkit', location: 'Dar es Salaam', duration: 35, mandatory: true },
                        { activityTitle: 'Pilot workshops and feedback integration', detailedDescription: 'Run pilot sessions and refine materials.', expectedOutput: 'Pilot report', location: 'Four zones', duration: 30, mandatory: true }
                    ],
                    consultancyClientResponsibilities: [
                        { responsibilityTitle: 'Provide platform process documentation', description: 'Share workflow documentation and stakeholder contacts.', supportType: 'Document access' },
                        { responsibilityTitle: 'Coordinate workshop invitations', description: 'Invite selected procuring entities and suppliers.', supportType: 'Meeting coordination' }
                    ],
                    consultancyConsultantResponsibilities: [
                        { responsibility: 'Prepare change management plan', description: 'Develop detailed plan, communications, training approach, and adoption risks.', reportingFrequency: 'Monthly' },
                        { responsibility: 'Facilitate workshops', description: 'Deliver workshops and compile attendance and feedback records.', reportingFrequency: 'Weekly' }
                    ],
                    consultancyDeliverables: [
                        { deliverableName: 'Inception report', description: 'Detailed methodology, work plan, and stakeholder map.', submissionTimeline: '3 weeks from contract start', formatRequired: 'PDF', reviewer: 'Project Manager', mandatory: true },
                        { deliverableName: 'Training toolkit', description: 'Slides, facilitator guide, job aids, and participant exercises.', submissionTimeline: '8 weeks from contract start', formatRequired: 'PowerPoint', reviewer: 'User Department', mandatory: true },
                        { deliverableName: 'Final adoption report', description: 'Adoption results, lessons, and scale-up recommendations.', submissionTimeline: 'End of assignment', formatRequired: 'PDF', reviewer: 'Tender Board', mandatory: true }
                    ],
                    consultancyReportingRequirements: [
                        { reportType: 'Monthly report', frequency: 'Monthly', submissionFormat: 'PDF', submissionChannel: 'Procurement portal' },
                        { reportType: 'Weekly progress report', frequency: 'Weekly', submissionFormat: 'Excel', submissionChannel: 'Email' }
                    ],
                    consultancyIndividualQualifications: [
                        { professionalRegistrationsCertifications: ['Project Management Professional (PMP)'], cvRequired: 'Required', yearsOfExperience: 10, similarAssignmentsCount: 3, similarAssignmentsEvidenceRequired: 'Required' }
                    ],
                    consultancyFirmExperience: [
                        { minimumYearsExperience: 8, requiredSimilarAssignments: 3, sectorExperience: ['Public sector', 'ICT', 'Finance'], requiredEvidence: 'Required' }
                    ],
                    consultancyKeyExperts: [
                        { positionTitle: 'Change Management Lead', minimumQualification: 'Masters Degree', yearsOfExperience: 10, certifications: 'Prosci, PMP, or equivalent', quantityRequired: 1, mandatory: true },
                        { positionTitle: 'Procurement Training Specialist', minimumQualification: 'Bachelor Degree', yearsOfExperience: 8, certifications: 'Procurement professional certification', quantityRequired: 2, mandatory: true },
                        { positionTitle: 'Monitoring and Evaluation Specialist', minimumQualification: 'Bachelor Degree', yearsOfExperience: 6, certifications: 'M&E certification desirable', quantityRequired: 1, mandatory: true }
                    ],
                    consultancyReportingStructure: [
                        { consultantReportsTo: 'Project Manager', supervisingOfficer: 'Director', approvalAuthority: 'Tender Board' }
                    ]
                },
                lists: {
                    mandatoryDeclarations: [
                        { text: 'Separate technical and financial proposals are required.' },
                        { text: 'Consultant must transfer editable training materials to the buyer.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Understanding of TOR', weight: 25, subcriteria: ['Problem framing', 'Public procurement context'] },
                    { name: 'Methodology and work plan', weight: 30, subcriteria: ['Change approach', 'Training design', 'Adoption KPIs'] },
                    { name: 'Key expert qualifications', weight: 25, subcriteria: ['Lead consultant', 'Training specialists', 'M&E specialist'] },
                    { name: 'Financial proposal', weight: 10, subcriteria: ['Fee realism', 'Reimbursables'] },
                    { name: 'Knowledge transfer', weight: 10, subcriteria: ['Toolkit handover', 'Training of trainers'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-27' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-29' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-07-15' },
                { id: 'milestone-opening', name: 'Technical opening', date: '2026-07-16' },
                { id: 'milestone-evaluation', name: 'Technical evaluation complete', date: '2026-08-05' },
                { id: 'milestone-award', name: 'Award target', date: '2026-08-28' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Change management lead input', qty: 80, unit: 'Day', rate: 1800000 },
                { item: '1.2', description: 'Procurement training specialists', qty: 160, unit: 'Day', rate: 1250000 },
                { item: '1.3', description: 'M&E specialist input', qty: 60, unit: 'Day', rate: 1100000 },
                { item: '1.4', description: 'Workshops, travel, materials, and reimbursables', qty: 1, unit: 'Lot', rate: 770000000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Change management lead input', qty: 80, unit: 'Day', rate: 1800000 },
                { item: '1.2', description: 'Procurement training specialists', qty: 160, unit: 'Day', rate: 1250000 },
                { item: '1.3', description: 'M&E specialist input', qty: 60, unit: 'Day', rate: 1100000 },
                { item: '1.4', description: 'Workshops, travel, materials, and reimbursables', qty: 1, unit: 'Lot', rate: 770000000 }
            ],
            deliverables: ['Inception report', 'Training toolkit', 'Pilot workshop report', 'Final adoption report'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'TOR addenda can be issued if stakeholder list changes.' }],
            interestedSuppliers: [
                { name: 'GovTech Advisory Ltd', status: 'Downloaded TOR', lastActivity: 'Today' },
                { name: 'Procurement Reform Partners', status: 'Watching tender', lastActivity: 'Yesterday' }
            ]
        },
        {
            id: 'PX-CNS-2026-002',
            title: 'Environmental and Social Impact Assessment for Bus Rapid Transit Corridor',
            type: 'Consultancy',
            procurementTypeId: 'consultancy',
            status: 'Open',
            budget: 940000000,
            closingDate: '2026-07-08',
            organization: 'Dar Rapid Transit Agency',
            description: 'Consultancy services for ESIA, stakeholder consultations, resettlement screening, mitigation planning, and disclosure support for a proposed BRT corridor.',
            eligibility: 'Open Tender / Environmental consultancy / NEMC-registered experts and urban transport ESIA references required.',
            category: 'Environmental Consultancy',
            categories: ['Environmental Consultancy', 'Transport', 'Urban planning'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'Dar es Salaam',
            commercialModel: 'Financial Proposal',
            documents: ['ESIA_Terms_of_Reference.pdf', 'Corridor_Map.pdf', 'Stakeholder_Template.xlsx', 'Financial_Proposal_Template.xlsx'],
            regulatoryLicenses: [
                { group: 'Environmental & Safety', license: 'Environmental Impact Assessment Certificate', body: 'National Environment Management Council (NEMC)', mandatory: true },
                { group: 'Environmental & Safety', license: 'Environmental Compliance Certificate', body: 'National Environment Management Council (NEMC)', mandatory: false }
            ],
            requirements: {
                fields: {
                    consultancyEntityBackground: [
                        { organizationBackground: 'DART plans new BRT infrastructure to improve urban mobility and reduce congestion.', departmentUnit: 'Planning', fundingSource: 'Development Partner' }
                    ],
                    consultancyProjectBackground: {
                        projectName: 'BRT Corridor ESIA',
                        backgroundNarrative: 'The corridor will affect dense urban areas and requires robust environmental and social risk assessment.',
                        existingChallenges: 'Traffic congestion, informal trading impacts, drainage constraints, and construction disruption risks.',
                        currentSituation: 'Pre-feasibility alignment is available and detailed assessment is required.',
                        relatedInitiatives: 'Urban transport master plan and existing BRT phases.'
                    },
                    consultancyProblemStatement: {
                        mainProblemDescription: 'The project must identify, mitigate, and disclose environmental and social impacts before investment approval.',
                        expectedImpact: 'Compliant ESIA package, improved stakeholder confidence, and actionable mitigation measures.'
                    },
                    consultancyGeneralObjective: 'Prepare a compliant ESIA and related environmental and social management instruments for the proposed BRT corridor.',
                    consultancySpecificObjectives: [
                        { objectiveTitle: 'Baseline assessment', objectiveDescription: 'Collect environmental and social baseline data along the corridor.', priorityLevel: 'High' },
                        { objectiveTitle: 'Impact assessment', objectiveDescription: 'Assess construction and operational impacts and propose mitigations.', priorityLevel: 'High' },
                        { objectiveTitle: 'Stakeholder disclosure', objectiveDescription: 'Conduct consultations and document feedback.', priorityLevel: 'High' }
                    ],
                    consultancyAssignmentActivities: [
                        { activityTitle: 'Baseline field surveys', detailedDescription: 'Conduct air, noise, drainage, land use, traffic, and social baseline surveys.', expectedOutput: 'Baseline survey report', location: 'Corridor alignment', duration: 30, mandatory: true },
                        { activityTitle: 'Stakeholder consultations', detailedDescription: 'Plan and conduct consultations with communities, businesses, and institutions.', expectedOutput: 'Consultation report', location: 'Dar es Salaam', duration: 25, mandatory: true },
                        { activityTitle: 'ESMP and disclosure package', detailedDescription: 'Prepare ESMP, monitoring plan, and disclosure documents.', expectedOutput: 'ESMP and disclosure package', location: 'Dar es Salaam', duration: 35, mandatory: true }
                    ],
                    consultancyClientResponsibilities: [
                        { responsibilityTitle: 'Provide corridor design data', description: 'Share maps, design notes, and traffic studies.', supportType: 'Document access' },
                        { responsibilityTitle: 'Facilitate authority meetings', description: 'Coordinate meetings with municipal and environmental authorities.', supportType: 'Meeting coordination' }
                    ],
                    consultancyConsultantResponsibilities: [
                        { responsibility: 'Conduct ESIA fieldwork', description: 'Lead baseline surveys, consultations, and impact analysis.', reportingFrequency: 'Weekly' },
                        { responsibility: 'Prepare approval-ready documents', description: 'Submit ESIA, ESMP, and disclosure documents aligned to NEMC requirements.', reportingFrequency: 'Monthly' }
                    ],
                    consultancyDeliverables: [
                        { deliverableName: 'Inception report', description: 'Methodology, schedule, and stakeholder plan.', submissionTimeline: '2 weeks from contract start', formatRequired: 'PDF', reviewer: 'Project Manager', mandatory: true },
                        { deliverableName: 'Draft ESIA and ESMP', description: 'Full draft assessment and mitigation plan.', submissionTimeline: '10 weeks from contract start', formatRequired: 'PDF', reviewer: 'Evaluation Committee', mandatory: true },
                        { deliverableName: 'Final ESIA disclosure package', description: 'Final documents incorporating comments.', submissionTimeline: 'End of assignment', formatRequired: 'PDF', reviewer: 'Accounting Officer', mandatory: true }
                    ],
                    consultancyReportingRequirements: [
                        { reportType: 'Weekly progress report', frequency: 'Weekly', submissionFormat: 'PDF', submissionChannel: 'Email' },
                        { reportType: 'Monthly report', frequency: 'Monthly', submissionFormat: 'PDF', submissionChannel: 'Procurement portal' }
                    ],
                    consultancyFirmExperience: [
                        { minimumYearsExperience: 7, requiredSimilarAssignments: 3, sectorExperience: ['Environment', 'Transport', 'Public sector'], requiredEvidence: 'Required' }
                    ],
                    consultancyKeyExperts: [
                        { positionTitle: 'Lead Environmental Specialist', minimumQualification: 'Masters Degree', yearsOfExperience: 10, certifications: 'NEMC registration', quantityRequired: 1, mandatory: true },
                        { positionTitle: 'Social Safeguards Specialist', minimumQualification: 'Masters Degree', yearsOfExperience: 8, certifications: 'Resettlement planning experience', quantityRequired: 1, mandatory: true },
                        { positionTitle: 'Urban Transport Planner', minimumQualification: 'Bachelor Degree', yearsOfExperience: 7, certifications: 'Transport planning references', quantityRequired: 1, mandatory: true }
                    ],
                    consultancyReportingStructure: [
                        { consultantReportsTo: 'Project Manager', supervisingOfficer: 'Head of Department', approvalAuthority: 'Accounting Officer' }
                    ]
                },
                lists: {
                    mandatoryDeclarations: [
                        { text: 'Consultant must comply with NEMC review requirements.' },
                        { text: 'Consultation records must include attendance, issues raised, and response matrix.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Understanding of TOR', weight: 25, subcriteria: ['Environmental risks', 'Urban social impacts'] },
                    { name: 'Methodology and work plan', weight: 30, subcriteria: ['Baseline design', 'Consultation plan', 'ESMP quality'] },
                    { name: 'Key expert qualifications', weight: 25, subcriteria: ['Environmental lead', 'Social safeguards', 'Transport planner'] },
                    { name: 'Financial proposal', weight: 10, subcriteria: ['Fee realism', 'Survey costs'] },
                    { name: 'Knowledge transfer', weight: 10, subcriteria: ['Authority engagement', 'Disclosure support'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-23' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-22' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-07-08' },
                { id: 'milestone-opening', name: 'Technical opening', date: '2026-07-09' },
                { id: 'milestone-evaluation', name: 'Technical evaluation complete', date: '2026-07-29' },
                { id: 'milestone-award', name: 'Award target', date: '2026-08-19' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Lead environmental specialist input', qty: 70, unit: 'Day', rate: 1650000 },
                { item: '1.2', description: 'Social safeguards specialist input', qty: 70, unit: 'Day', rate: 1500000 },
                { item: '1.3', description: 'Urban transport planner input', qty: 50, unit: 'Day', rate: 1400000 },
                { item: '1.4', description: 'Field surveys, consultations, and disclosure logistics', qty: 1, unit: 'Lot', rate: 649500000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Lead environmental specialist input', qty: 70, unit: 'Day', rate: 1650000 },
                { item: '1.2', description: 'Social safeguards specialist input', qty: 70, unit: 'Day', rate: 1500000 },
                { item: '1.3', description: 'Urban transport planner input', qty: 50, unit: 'Day', rate: 1400000 },
                { item: '1.4', description: 'Field surveys, consultations, and disclosure logistics', qty: 1, unit: 'Lot', rate: 649500000 }
            ],
            deliverables: ['Inception report', 'Baseline survey report', 'Draft ESIA and ESMP', 'Final disclosure package'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Corridor map revisions can be issued as addenda.' }],
            interestedSuppliers: [
                { name: 'EcoPlan Consultants', status: 'Downloaded TOR', lastActivity: 'Today' },
                { name: 'UrbanSafeguards Africa', status: 'Watching tender', lastActivity: 'Yesterday' }
            ]
        },
        {
            id: 'PX-CNS-2026-003',
            title: 'Technical Audit of Regional Road Maintenance Program',
            type: 'Consultancy',
            procurementTypeId: 'consultancy',
            status: 'Open',
            budget: 720000000,
            closingDate: '2026-06-27',
            organization: 'Tanzania National Roads Agency',
            description: 'Independent technical audit of road maintenance contracts, quality controls, measurement records, payment certificates, and remedial action plans.',
            eligibility: 'Open Tender / Engineering audit consultancy / Registered professional engineers and road maintenance audit experience required.',
            category: 'Engineering Consultancy',
            categories: ['Engineering Consultancy', 'Roads and Bridges', 'Procurement Consultancy'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'Mwanza, Geita, Shinyanga, and Simiyu',
            commercialModel: 'Financial Proposal',
            documents: ['Road_Audit_TOR.pdf', 'Contract_Sample_List.xlsx', 'Audit_Report_Template.docx', 'Financial_Proposal_Template.xlsx'],
            regulatoryLicenses: [
                { group: 'Specialized Services', license: 'Calibration Certificate', body: 'Weights and Measures Agency (WMA)', mandatory: false },
                { group: 'Construction & Real Estate', license: 'Building Permit', body: 'Contractors Registration Board (CRB) and Local Government Authorities', mandatory: false }
            ],
            requirements: {
                fields: {
                    consultancyEntityBackground: [
                        { organizationBackground: 'TANROADS manages maintenance and rehabilitation of trunk and regional roads.', departmentUnit: 'Engineering', fundingSource: 'Road fund' }
                    ],
                    consultancyProjectBackground: {
                        projectName: 'Regional Road Maintenance Technical Audit',
                        backgroundNarrative: 'The agency requires independent verification of maintenance quality and payment measurement accuracy.',
                        existingChallenges: 'Variation in quality documentation, measurement records, and remedial follow-up across regions.',
                        currentSituation: 'Maintenance contracts are active and audit sampling is required.',
                        relatedInitiatives: 'Road asset management improvement program.'
                    },
                    consultancyProblemStatement: {
                        mainProblemDescription: 'The buyer needs assurance that road maintenance works meet specifications and payments are supported by verified quantities.',
                        expectedImpact: 'Improved quality control, payment assurance, and corrective action tracking.'
                    },
                    consultancyGeneralObjective: 'Carry out an independent technical audit of selected regional road maintenance contracts.',
                    consultancySpecificObjectives: [
                        { objectiveTitle: 'Quality verification', objectiveDescription: 'Inspect sampled works against specifications.', priorityLevel: 'High' },
                        { objectiveTitle: 'Measurement review', objectiveDescription: 'Review BOQ measurements, site records, and payment certificates.', priorityLevel: 'High' },
                        { objectiveTitle: 'Corrective action planning', objectiveDescription: 'Recommend remedial actions and monitoring controls.', priorityLevel: 'Medium' }
                    ],
                    consultancyAssignmentActivities: [
                        { activityTitle: 'Document and payment review', detailedDescription: 'Review contracts, BOQs, measurement sheets, and certificates.', expectedOutput: 'Document review memo', location: 'Regional offices', duration: 20, mandatory: true },
                        { activityTitle: 'Field inspection and sampling', detailedDescription: 'Inspect roads, structures, drainage, and material quality evidence.', expectedOutput: 'Inspection records', location: 'Four regions', duration: 35, mandatory: true },
                        { activityTitle: 'Audit report and action plan', detailedDescription: 'Prepare findings, risk ratings, and remedial action plan.', expectedOutput: 'Final audit report', location: 'Dar es Salaam', duration: 20, mandatory: true }
                    ],
                    consultancyClientResponsibilities: [
                        { responsibilityTitle: 'Provide contract records', description: 'Share contract files, payment certificates, and site instructions.', supportType: 'Document access' },
                        { responsibilityTitle: 'Facilitate site access', description: 'Coordinate regional engineers and site access.', supportType: 'Logistics' }
                    ],
                    consultancyConsultantResponsibilities: [
                        { responsibility: 'Conduct independent inspections', description: 'Inspect works, collect evidence, and document nonconformities.', reportingFrequency: 'Weekly' },
                        { responsibility: 'Submit audit recommendations', description: 'Prepare prioritized corrective action plan.', reportingFrequency: 'Monthly' }
                    ],
                    consultancyDeliverables: [
                        { deliverableName: 'Inception and sampling plan', description: 'Audit methodology and sampled contracts.', submissionTimeline: '2 weeks from start', formatRequired: 'PDF', reviewer: 'Project Manager', mandatory: true },
                        { deliverableName: 'Draft audit report', description: 'Preliminary findings and evidence annexes.', submissionTimeline: '10 weeks from start', formatRequired: 'PDF', reviewer: 'Engineering', mandatory: true },
                        { deliverableName: 'Final audit and action plan', description: 'Final report with corrective actions and monitoring indicators.', submissionTimeline: 'End of assignment', formatRequired: 'PDF', reviewer: 'Accounting Officer', mandatory: true }
                    ],
                    consultancyReportingRequirements: [
                        { reportType: 'Weekly progress report', frequency: 'Weekly', submissionFormat: 'PDF', submissionChannel: 'Email' },
                        { reportType: 'Final report', frequency: 'On demand', submissionFormat: 'PDF', submissionChannel: 'Procurement portal' }
                    ],
                    consultancyFirmExperience: [
                        { minimumYearsExperience: 8, requiredSimilarAssignments: 4, sectorExperience: ['Infrastructure', 'Transport', 'Public sector'], requiredEvidence: 'Required' }
                    ],
                    consultancyKeyExperts: [
                        { positionTitle: 'Team Leader / Highway Engineer', minimumQualification: 'Masters Degree', yearsOfExperience: 12, certifications: 'Professional Engineer', quantityRequired: 1, mandatory: true },
                        { positionTitle: 'Quantity Surveyor', minimumQualification: 'Bachelor Degree', yearsOfExperience: 8, certifications: 'AQRB or equivalent', quantityRequired: 1, mandatory: true },
                        { positionTitle: 'Materials Engineer', minimumQualification: 'Bachelor Degree', yearsOfExperience: 8, certifications: 'Materials testing experience', quantityRequired: 1, mandatory: true }
                    ],
                    consultancyReportingStructure: [
                        { consultantReportsTo: 'Project Manager', supervisingOfficer: 'Director', approvalAuthority: 'Accounting Officer' }
                    ]
                },
                lists: {
                    mandatoryDeclarations: [
                        { text: 'Consultant must disclose any past involvement in audited contracts.' },
                        { text: 'All field evidence must be geo-tagged where possible.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Understanding of TOR', weight: 25, subcriteria: ['Audit risks', 'Road maintenance context'] },
                    { name: 'Methodology and work plan', weight: 30, subcriteria: ['Sampling plan', 'Inspection methods', 'Reporting'] },
                    { name: 'Key expert qualifications', weight: 25, subcriteria: ['Highway engineer', 'Quantity surveyor', 'Materials engineer'] },
                    { name: 'Financial proposal', weight: 10, subcriteria: ['Fees', 'Field logistics'] },
                    { name: 'Knowledge transfer', weight: 10, subcriteria: ['Corrective action tools', 'Lessons learned'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-18' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-11' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-06-27' },
                { id: 'milestone-opening', name: 'Technical opening', date: '2026-06-29' },
                { id: 'milestone-evaluation', name: 'Technical evaluation complete', date: '2026-07-17' },
                { id: 'milestone-award', name: 'Award target', date: '2026-08-07' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Team leader / highway engineer input', qty: 65, unit: 'Day', rate: 1600000 },
                { item: '1.2', description: 'Quantity surveyor input', qty: 55, unit: 'Day', rate: 1200000 },
                { item: '1.3', description: 'Materials engineer input', qty: 55, unit: 'Day', rate: 1200000 },
                { item: '1.4', description: 'Field inspections, travel, testing, and reporting costs', qty: 1, unit: 'Lot', rate: 484000000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Team leader / highway engineer input', qty: 65, unit: 'Day', rate: 1600000 },
                { item: '1.2', description: 'Quantity surveyor input', qty: 55, unit: 'Day', rate: 1200000 },
                { item: '1.3', description: 'Materials engineer input', qty: 55, unit: 'Day', rate: 1200000 },
                { item: '1.4', description: 'Field inspections, travel, testing, and reporting costs', qty: 1, unit: 'Lot', rate: 484000000 }
            ],
            deliverables: ['Inception and sampling plan', 'Field inspection records', 'Draft audit report', 'Final corrective action plan'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Contract sample list can be updated before closing.' }],
            interestedSuppliers: [
                { name: 'RoadAudit Associates', status: 'Downloaded TOR', lastActivity: 'Today' },
                { name: 'InfraCheck Consulting', status: 'Watching tender', lastActivity: 'Yesterday' }
            ]
        },
        {
            id: 'PX-CNS-2026-004',
            title: 'Market Study for Pharmaceutical Supply Chain Optimization',
            type: 'Consultancy',
            procurementTypeId: 'consultancy',
            status: 'Open',
            budget: 560000000,
            closingDate: '2026-07-01',
            organization: 'Medical Stores Department',
            description: 'Research consultancy to map medicine demand patterns, warehouse capacity, distribution bottlenecks, and optimization options for public health supply chains.',
            eligibility: 'Open Tender / Research consultancy / Firm or consortium with pharmaceutical logistics, data analysis, and health supply chain experience.',
            category: 'Procurement Consultancy',
            categories: ['Procurement Consultancy', 'Health', 'Research'],
            method: 'Open Tender',
            visibility: 'Public marketplace',
            location: 'Dar es Salaam plus zonal warehouses',
            commercialModel: 'Financial Proposal',
            documents: ['Supply_Chain_Study_TOR.pdf', 'Data_Request_Template.xlsx', 'Report_Template.docx', 'Financial_Proposal_Template.xlsx'],
            regulatoryLicenses: [
                { group: 'Food, Drugs & Cosmetics', license: 'Pharmaceutical Business License', body: 'Tanzania Medicines and Medical Devices Authority (TMDA)', mandatory: false }
            ],
            requirements: {
                fields: {
                    consultancyEntityBackground: [
                        { organizationBackground: 'MSD manages procurement, storage, and distribution of medicines and medical supplies for public health facilities.', departmentUnit: 'Planning', fundingSource: 'Own Source' }
                    ],
                    consultancyProjectBackground: {
                        projectName: 'Pharmaceutical Supply Chain Optimization Study',
                        backgroundNarrative: 'Medicine demand and distribution performance vary by product group and region, creating stock-out and overstock risks.',
                        existingChallenges: 'Demand forecasting gaps, route inefficiencies, warehouse capacity constraints, and fragmented performance data.',
                        currentSituation: 'Historic transaction and warehouse data are available for analysis.',
                        relatedInitiatives: 'Digital inventory improvement and health commodity security initiatives.'
                    },
                    consultancyProblemStatement: {
                        mainProblemDescription: 'The buyer needs evidence-based options to improve forecasting, storage, and distribution of pharmaceutical commodities.',
                        expectedImpact: 'Reduced stock-outs, better inventory turnover, and improved distribution planning.'
                    },
                    consultancyGeneralObjective: 'Conduct a market and operational study that recommends practical optimization options for pharmaceutical supply chains.',
                    consultancySpecificObjectives: [
                        { objectiveTitle: 'Demand pattern analysis', objectiveDescription: 'Analyze historical medicine demand and seasonality.', priorityLevel: 'High' },
                        { objectiveTitle: 'Distribution bottleneck mapping', objectiveDescription: 'Identify warehouse and route constraints.', priorityLevel: 'High' },
                        { objectiveTitle: 'Optimization roadmap', objectiveDescription: 'Recommend actions, systems, and capacity improvements.', priorityLevel: 'Medium' }
                    ],
                    consultancyAssignmentActivities: [
                        { activityTitle: 'Data review and cleaning', detailedDescription: 'Review procurement, inventory, and distribution datasets.', expectedOutput: 'Data quality memo', location: 'Dar es Salaam', duration: 20, mandatory: true },
                        { activityTitle: 'Warehouse and route assessment', detailedDescription: 'Visit selected warehouses and review distribution routes.', expectedOutput: 'Operational assessment report', location: 'Zonal warehouses', duration: 25, mandatory: true },
                        { activityTitle: 'Optimization modeling', detailedDescription: 'Model demand patterns, reorder rules, and route options.', expectedOutput: 'Optimization options paper', location: 'Remote and Dar es Salaam', duration: 30, mandatory: true }
                    ],
                    consultancyClientResponsibilities: [
                        { responsibilityTitle: 'Provide datasets', description: 'Share anonymized inventory, procurement, and distribution records.', supportType: 'Data access' },
                        { responsibilityTitle: 'Coordinate warehouse visits', description: 'Arrange site visits and staff interviews.', supportType: 'Logistics' }
                    ],
                    consultancyConsultantResponsibilities: [
                        { responsibility: 'Protect confidential supply data', description: 'Maintain data confidentiality and secure analysis environment.', reportingFrequency: 'Monthly' },
                        { responsibility: 'Prepare optimization recommendations', description: 'Develop actionable roadmap with cost, risk, and implementation effort.', reportingFrequency: 'Monthly' }
                    ],
                    consultancyDeliverables: [
                        { deliverableName: 'Inception report', description: 'Methodology, work plan, and data request plan.', submissionTimeline: '2 weeks from start', formatRequired: 'PDF', reviewer: 'Project Manager', mandatory: true },
                        { deliverableName: 'Diagnostic report', description: 'Demand, warehouse, and route findings.', submissionTimeline: '8 weeks from start', formatRequired: 'PDF', reviewer: 'User Department', mandatory: true },
                        { deliverableName: 'Optimization roadmap', description: 'Recommendations, implementation plan, and KPIs.', submissionTimeline: 'End of assignment', formatRequired: 'PowerPoint', reviewer: 'Accounting Officer', mandatory: true }
                    ],
                    consultancyReportingRequirements: [
                        { reportType: 'Monthly report', frequency: 'Monthly', submissionFormat: 'PDF', submissionChannel: 'Procurement portal' },
                        { reportType: 'Ad hoc report', frequency: 'On demand', submissionFormat: 'Excel', submissionChannel: 'Email' }
                    ],
                    consultancyFirmExperience: [
                        { minimumYearsExperience: 5, requiredSimilarAssignments: 3, sectorExperience: ['Health', 'Research', 'Public sector'], requiredEvidence: 'Required' }
                    ],
                    consultancyKeyExperts: [
                        { positionTitle: 'Health Supply Chain Specialist', minimumQualification: 'Masters Degree', yearsOfExperience: 10, certifications: 'Supply chain professional certification', quantityRequired: 1, mandatory: true },
                        { positionTitle: 'Data Analyst', minimumQualification: 'Bachelor Degree', yearsOfExperience: 6, certifications: 'Analytics or statistics certification', quantityRequired: 1, mandatory: true },
                        { positionTitle: 'Pharmaceutical Logistics Expert', minimumQualification: 'Bachelor Degree', yearsOfExperience: 8, certifications: 'Pharmacy or logistics registration', quantityRequired: 1, mandatory: true }
                    ],
                    consultancyReportingStructure: [
                        { consultantReportsTo: 'Project Manager', supervisingOfficer: 'Head of Department', approvalAuthority: 'Accounting Officer' }
                    ]
                },
                lists: {
                    mandatoryDeclarations: [
                        { text: 'Consultant must sign data confidentiality undertaking.' },
                        { text: 'Final models and editable spreadsheets must be handed over.' }
                    ]
                }
            },
            evaluation: {
                criteria: [
                    { name: 'Understanding of TOR', weight: 25, subcriteria: ['Health supply chain', 'Data constraints'] },
                    { name: 'Methodology and work plan', weight: 30, subcriteria: ['Data approach', 'Field assessment', 'Optimization method'] },
                    { name: 'Key expert qualifications', weight: 25, subcriteria: ['Supply chain lead', 'Data analyst', 'Pharma logistics'] },
                    { name: 'Financial proposal', weight: 10, subcriteria: ['Fees', 'Travel cost realism'] },
                    { name: 'Knowledge transfer', weight: 10, subcriteria: ['Model handover', 'User training'] }
                ]
            },
            milestones: [
                { id: 'milestone-publication', name: 'Publication', date: '2026-05-20' },
                { id: 'milestone-clarification', name: 'Clarification deadline', date: '2026-06-15' },
                { id: 'milestone-closing', name: 'Bid closing', date: '2026-07-01' },
                { id: 'milestone-opening', name: 'Technical opening', date: '2026-07-02' },
                { id: 'milestone-evaluation', name: 'Technical evaluation complete', date: '2026-07-22' },
                { id: 'milestone-award', name: 'Award target', date: '2026-08-12' }
            ],
            commercialItems: [
                { item: '1.1', description: 'Health supply chain specialist input', qty: 55, unit: 'Day', rate: 1450000 },
                { item: '1.2', description: 'Data analyst input', qty: 70, unit: 'Day', rate: 950000 },
                { item: '1.3', description: 'Pharmaceutical logistics expert input', qty: 45, unit: 'Day', rate: 1300000 },
                { item: '1.4', description: 'Field visits, workshops, and analysis tools', qty: 1, unit: 'Lot', rate: 355250000 }
            ],
            boqItems: [
                { item: '1.1', description: 'Health supply chain specialist input', qty: 55, unit: 'Day', rate: 1450000 },
                { item: '1.2', description: 'Data analyst input', qty: 70, unit: 'Day', rate: 950000 },
                { item: '1.3', description: 'Pharmaceutical logistics expert input', qty: 45, unit: 'Day', rate: 1300000 },
                { item: '1.4', description: 'Field visits, workshops, and analysis tools', qty: 1, unit: 'Lot', rate: 355250000 }
            ],
            deliverables: ['Inception report', 'Diagnostic report', 'Optimization model', 'Final roadmap and training session'],
            clarifications: [],
            amendments: [{ title: 'No amendments published', status: 'Ready', detail: 'Dataset availability updates can be issued before closing.' }],
            interestedSuppliers: [
                { name: 'HealthChain Analytics', status: 'Downloaded TOR', lastActivity: 'Today' },
                { name: 'Supply Optima Consulting', status: 'Watching tender', lastActivity: 'Yesterday' }
            ]
        }
    ],

    // Procurement setup used by the create tender wizard.
    procurementSetup: {
        methods: ['Open Tender', 'Invited Tender'],
        types: [
            {
                id: 'goods',
                label: 'Goods',
                description: 'Physical items, equipment, stock, and supplies.',
                categories: [
                    'Telecommunication Equipment',
                    'Motor Vehicles',
                    'Water Meters and Spare Parts',
                    'Water Pumps and Spare Parts',
                    'Water Filters',
                    'Water Trucks',
                    'Water and Sewer Treatment Equipment and consumables',
                    'Water Survey Equipment',
                    'Water Well Drilling Equipment',
                    'Animal Feeds',
                    'Animals(Livestock) and Related Products',
                    'Animal Watering Machines',
                    'Veterinary Equipment and Supplies',
                    'Wagons and Coaches',
                    'Wagons and Coaches Spare parts',
                    'Locomotive Engines',
                    'Motor Trolleys',
                    'Rail, Sleepers and Clips',
                    'Railway Machinery',
                    'Railway Cranes',
                    'Rail on Truck Equipment (Tamping machinery, Truck Recording Cars, Railway Relaying Machines)',
                    'Furnaces and Incinerators Equipment',
                    'Mining and Quarrying Equipment',
                    'Abrasives and Smoothing Materials',
                    'Nuclear and Radioactive Products',
                    'Packaging Materials',
                    'Marine Vessels',
                    'Aircraft',
                    'Metal, Aluminium and Glass',
                    'Elevators and Escalators',
                    'Fire Fighting Equipment',
                    'Funeral Supplies',
                    'Land Survey Equipment',
                    'Land Cleaning Equipment',
                    'Land Leveling Equipment',
                    'Accommodation and Office furniture and accessories',
                    'Aerospace systems and components and equipment',
                    'Agents affecting water and electrolytes',
                    'Agricultural and forestry and landscape machinery and equipment',
                    'Anti infective drugs',
                    'Antineoplastic agents drugs/Anticancer drugs',
                    'Arts and crafts equipment and accessories and supplies',
                    'Audio and visual presentation and composing equipment',
                    'Autonomic nervous system drugs',
                    'Bank Notes Canceller/Punching Machines',
                    'Batteries and generators and kinetic power transmission',
                    'Bedclothes and table and kitchen linen and towels',
                    'Beehives and Accessories',
                    'Beverages',
                    'Bread and bakery products',
                    'Camping and outdoor equipment and accessories',
                    'Cardiac supplies and Accessories',
                    'Cardiovascular drugs',
                    'Central nervous system drugs',
                    'Cereal and pulse products',
                    'Chicken processing machinery and equipment',
                    'Chocolate and sugars and sweeteners and confectionary products',
                    'Classroom and instructional furniture and accessories',
                    'Classroom decoratives and supplies',
                    'Cleaning Equipment and Supplies',
                    'Clinical nutrition',
                    'Clothing and Uniforms',
                    'Collectibles and awards',
                    'Commercial and industrial furniture and accessories',
                    'Communications Devices and Accessories',
                    'Components for information technology or broadcasting or telecommunications',
                    'Computer Equipment and Accessories',
                    'Computer Software',
                    'Concrete and cement and plaster',
                    'Concrete poles',
                    'Construction and maintenance support equipment',
                    'Consumer electronics',
                    'Containers and storage',
                    'Dairy products',
                    'Data Voice or Multimedia Network Equipment or Platforms and Accessories',
                    'Dental equipment and supplies',
                    'Developmental and professional teaching aids and materials and accessories and supplies',
                    'Dialysis equipment and supplies',
                    'Domestic Gas',
                    'Domestic appliances',
                    'Domestic kitchenware and kitchen supplies',
                    'Domestic wall treatments',
                    'Doors and windows and glass',
                    'Drugs affecting the ears, eye, nose and skin',
                    'Drugs affecting the gastrointestinal system',
                    'Drugs affecting the respiratory tract',
                    'Earth and stone (Mchanga, Vifusi na Kokoto)',
                    'Edible oils and fats',
                    'Electrical Testing Equipment',
                    'Electrical equipment and components and supplies',
                    'Electrical wire and cable and harness',
                    'Electronic hardware and component parts and accessories',
                    'Electronic manufacturing machinery and equipment and accessories',
                    'Electronic reference material',
                    'Emergency and field medical services products',
                    'Exterior finishing materials',
                    'Fertilizers, Plants Nutrients and herbicides',
                    'Fishing and aquaculture equipment',
                    'Fishing and hunting equipment',
                    'Fitness equipment',
                    'Floor coverings',
                    'Footwear',
                    'Foundry machines and equipment and supplies',
                    'Fruits (Fresh, Organic, Dried, Frozen, Pured, Canned or Jarred)',
                    'Fuels',
                    'Gymnastics and boxing equipment',
                    'Heavy construction machinery and equipment',
                    'Hematolic drugs',
                    'Hormones and hormone antagonists',
                    'Hospital beds and Furnitures',
                    'Immunomodulating drugs',
                    'Independent living aids for the physically challenged',
                    'Industrial food and beverage equipment',
                    'Industrial machine tools',
                    'Industrial process machinery and equipment and supplies',
                    'Industrial refrigeration',
                    'Building Insulation Materials',
                    'Interior finishing materials',
                    'Intravenous and arterial administration products',
                    'Laboratory and scientific equipment',
                    'Laboratory supplies and fixtures',
                    'Lapidary machinery and equipment',
                    'Leatherworking repairing machinery and equipment',
                    'Lighting Fixtures and Accessories',
                    'Lubricants',
                    'Luggage and handbags and packs and cases',
                    'Mass transfer equipment',
                    'Material handling machinery and equipment',
                    'Meat and Poultry Products',
                    'Medical apparel and textiles',
                    'Radiology products',
                    'Medical facility products',
                    'Medical sterilization products',
                    'Medical training and education supplies',
                    'Merchandising furniture and accessories',
                    'Metal cutting machinery and accessories',
                    'Metal forming machinery and accessories',
                    'Metal treatment machinery',
                    'Minerals and ores and metals',
                    'Miscellaneous drug categories',
                    'Mixers and their parts and accessories',
                    'Motor Vehicle Components and Accessories',
                    'Motor vehicle Diagnostic Machines and Working Tools',
                    'Musical Instruments and parts and accessories',
                    'Newspaper',
                    'Non motorized cycles',
                    'Nuts and seeds',
                    'Office Supplies and accessories',
                    'Office machines their supplies and accessories',
                    'Oil and gas drilling and exploration equipment',
                    'Oil and gas drilling and operation materials',
                    'Oil and gas operating and production equipment',
                    'Orthopedic and prosthetic and sports medicine products',
                    'Orthopedic surgical implants',
                    'Packing supplies',
                    'Patient care and treatment products and supplies',
                    'Patient exam and monitoring products',
                    'Permanent structures',
                    'Personal care products',
                    'Safety and security equipment',
                    'Pest control products',
                    'Petroleum processing machinery',
                    'Photographic or filming or video equipment and supplies',
                    'Physical and occupational therapy and rehabilitation products',
                    'Plumbing fixtures',
                    'Portable Structure Building Components',
                    'Portable Structures',
                    'Postmortem and mortuary equipment and supplies',
                    'Power plants and equipment',
                    'Prefabricated structures',
                    'Prepared and preserved foods',
                    'Printed Books, Textbooks and Reading Materials',
                    'Printing and publishing machinery/equipment and accessories',
                    'Railway and tramway machinery and equipment',
                    'Rapid prototyping machinery and accessories',
                    'Raw materials processing machinery',
                    'Recreation and playground and swimming and spa equipment and supplies',
                    'Respiratory and anesthesia and resuscitation products',
                    'Road Testing Kits',
                    'Roads and landscape architecture and construction materials',
                    'Sawmilling and lumber processing machinery and equipment',
                    'Seafood',
                    'Seasonings and preservatives',
                    'Security and surveillance Equipment',
                    'Seeds and Seedlings',
                    'Sewing supplies and accessories',
                    'Spacecraft',
                    'Specimen collection and storage supplies',
                    'Sports equipment and accessories',
                    'Stationery',
                    'Structural building products (Blocks, Bricks, Tiles and Flagstones)',
                    'Structural components and basic shapes',
                    'Structural Metals, Bars and Sheets',
                    'Suptum screening drugs',
                    'Surgical products',
                    'Fabrics and Leather Materials',
                    'Textile and fabric machinery and accessories',
                    'Timber',
                    'Timepieces, Jewellery and Gemstones',
                    'Tobacco and smoking products and substitutes',
                    'Toys and games',
                    'Transportation components and systems',
                    'Transportation services equipment',
                    'Underground mining structures and materials',
                    'Urine Screening Drugs',
                    'Vegetables (Fresh, Organic, Dried, Frozen, Canned or Jarred)',
                    'Vehicle bodies and trailers',
                    'Veterinary nutritional supplement',
                    'Waste collection bags',
                    'Water Pipes and Fittings',
                    'Water Supply Equipment',
                    'Water Treatment Chemicals',
                    'Water Treatment Equipment',
                    'Welding and soldering and brazing machinery and accessories and supplies',
                    'Well drilling and operation equipment',
                    'Window treatments',
                    'Wire machinery and equipment',
                    'Wood Briquette',
                    'Wooden poles',
                    'Wound care products',
                    'Measuring , observing and testing instruments',
                    'Heating, ventilation, air circulation and condition Equipment and Accessories',
                    'Veterinary Pharmaceutical and Vaccines',
                    'Painting Products',
                    'Banknotes and Coins Processing',
                    'Signage and accessories',
                    'Motorized cycles',
                    'Marine Vessels Equipment, Spareparts and Accessories',
                    'Pharmaceuticals',
                    'Laboratory equipment and reagents',
                    'Medical Supplies and Equipment',
                    'Vision correction or cosmetic eyewear (eye glasses/spectacles) and related products',
                    'Floriculture and silviculture products',
                    'Mattresses and Sleep Sets',
                    'Aviation Fuel',
                    'Forensic equipment, supplies and accessories',
                    'Live fish',
                    'Live insects',
                    'Decoration Equipment and Accessories',
                    'Natural Gas Distribution Accessories and Equipment/Machineries',
                    'Firearms, Ammunitions and Accessories',
                    'Heavy Duty Gas Cooking Stoves (for Mass Cooking)',
                    'Sisal and sisal fibers',
                    'Fuel Additives',
                    'Coal',
                    'Fuel pumps and spare parts'
                ]
            },
            {
                id: 'works',
                label: 'Works',
                description: 'Construction, rehabilitation, infrastructure, and civil works.',
                categories: [
                    'Building Contractors',
                    'Civil Contractors',
                    'Mechanical Contractors',
                    'Electrical Contractors',
                    'Specialist Building - Carpentry and Joinery',
                    'Specialist Building - Concreting Works',
                    'Specialist Building - Interior Decoration',
                    'Specialist Building - Concrete Treatment and Repairs',
                    'Specialist Building - Water Proofing Installations',
                    'Specialist Building - Paving',
                    'Specialist Building - Pre Fabricated Buildings',
                    'Specialist Building - Demolition',
                    'Specialist Building - Conservation of Old Building',
                    'Specialist Civil - Pilling',
                    'Specialist Civil - Drilling Works',
                    'Specialist Civil - Labour Based Road Works',
                    'Specialist Civil - Land Scaping and Slope Protections',
                    'Specialist Civil - Treatments Plants and Water Works',
                    'Specialist Civil - Marine Works',
                    'Specialist Civil - Tunneling and Underpinning',
                    'Specialist Civil - Tunneling and Mining Works',
                    'Specialist Electrical - Telecommunications ICT and Security Systems Installations',
                    'Specialist Electrical - Power Generation Equipment Installations and Maintenance',
                    'Specialist Electrical - Electric Power lines and Systems',
                    'Specialist Electrical - Air Conditioning and Refrigeration',
                    'Specialist Mechanical - Heating Ventilation and Air Conditioning',
                    'Specialist Mechanical - Fabrication and Installation of Tanks',
                    'Specialist Mechanical - Repair and Installation of Motor Vehicle',
                    'Specialist Mechanical - Scaffolding and Formwork',
                    'Specialist Mechanical - Marine Vessels - Fabrication and Maintenance',
                    'Specialist Mechanical - Pre Fabrication and Erection of Steel Structures',
                    'Specialist Mechanical - Elevators and Escalators Installation and Maintenance',
                    'Specialist Mechanical - Plumbing and Sanitations',
                    'Specialist Mechanical - Metal, Aluminium and Glass Works',
                    'Specialist Mechanical - Fabrication, Installation and Maintenance of Oil and Gas Infrastructure',
                    'Specialist Civil - Road Marking and Furniture',
                    'Specialist Electrical - Renewable Energy Installation - Solar',
                    'Specialist Mechanical - Air Conditioning and Refrigeration',
                    'Specialist Mechanical - Fire Prevention and Protections',
                    'Specialist Mechanical - Installations and Maintenance of Industrial Plant',
                    'Specialist Mechanical - Marine Structure, Ferries and Boat Building',
                    'Specialist Mechanical- installation of biomedical equipment',
                    'Specialist-Maintenance and Repair of Hospital Equipment'
                ]
            },
            {
                id: 'services',
                label: 'Service',
                description: 'Operational services where advisory expertise is not the main component.',
                categories: [
                    'Auction Services',
                    'Printing Services (Business Stationery, Books, Booklets, Brochures, Leaflets, Cards, Forms, Labels, Manuals and Maps)',
                    'Desktop publishing services',
                    'Digital Printing Services',
                    'Engraving Services',
                    'Mailing Services',
                    'Warehousing and Storage Services',
                    'Catering Services',
                    'Building and Compound Cleaning Services',
                    'Fumigation Services',
                    'Security Services',
                    'Service and Maintenance of ICT Equipment',
                    'Service and Maintenance of Fire Fighting Equipment',
                    'Agricultural products Grinding and Milling Services',
                    'Service and Maintenance of Fire Security System',
                    'Internet Services',
                    'Insurance and Brokerage Services',
                    'Conference and Related Services',
                    'Repair and Maintenance of Air conditioners',
                    'Repair and Maintenance of Gymnastic equipment',
                    'Repair and Maintenance of Electrical equipment',
                    'Repair and Maintenance of Jet Machines',
                    'Repair and Maintenance of Backhoe and Excavator Machines',
                    'Repair and Maintenance of Water Pumps and Water Tanks',
                    'Repair and Maintenance of Gas Export Compressors',
                    'Repair and Maintenance of Mining and Quarrying Equipment',
                    'Repair and Maintenance of Power generation plants and equipment',
                    'Advertising Services',
                    'Real Estate Management Services',
                    'Car hiring services',
                    'Documentary and documentation Services',
                    'Events management',
                    'Graphics design services',
                    'Hiring of Printing and Photocopying Services',
                    'Hiring of equipment and plants',
                    'Hospitality services',
                    'Hotel Reservation Services',
                    'Labour services (Repair and Construction Activities)',
                    'Laundry services',
                    'Material packing and handling services',
                    'Packaging Services',
                    'Repair and Maintenance of Furniture and Fittings',
                    'Repair and Maintenance of Locomotives',
                    'Repair and Maintenance of Motor Vehicles (vehicles and motor cycle)',
                    'Repair and Maintenance of Plumbing systems',
                    'Repair and Maintenance of aircrafts and aviation equipment',
                    'Repair and Maintenance of marine equipment',
                    'Repair and Maintenance of other Office Equipment,',
                    'Service and Maintenance of Elevators, escalators and conveyors',
                    'Tailoring services',
                    'Transportation and Handling Services',
                    'Travel facilitation (Ticketing, Visa, Tours, Hotel bookings)',
                    'Veterinary services',
                    'Clearing and Forwarding Services',
                    'Finance and Banking Services',
                    'Network Services',
                    'Voice and Data Services',
                    'Revenue Collection Agency Services',
                    'Video Production Services',
                    'Audio Production Services',
                    'Radio Broadcasting Services',
                    'Television Broadcasting Services',
                    'Online Media Broadcasting Services',
                    'Agricultural seeds treatment, preservation and processing',
                    'Calibration Services',
                    'Machining Services',
                    'ICT System Maintenance and Support',
                    'Water and Sewer treatment Services',
                    'Non Hazardous Waste Management Services',
                    'Hazardous Waste Management Services',
                    'Metal smelting and refining and forming processes',
                    'Metal finishing services',
                    'Repair and maintenance of Medical Equipment',
                    'Material and/ or  product testing and inspection services',
                    'Geological samples testing services',
                    'Vehicle Tracking and Fleet Management Services',
                    'Labour services (General human resources provision)',
                    'Ground Handling Services for Air Transport',
                    'Operation of Government Recreational Buildings or Facilities (Clubs, stadiums, events venues)',
                    'Operation of Government Food Services Buildings or Facilities (Canteens, Cafeteria)',
                    'Operation of Government Commercial Buildings (Shops, Malls, Marketplaces)',
                    'Operation of Government Accommodation Buildings (Housing Complex, Dormitories or Residential Facilities)',
                    'Operation of Government Office Buildings',
                    'Operation of Government Transportation Buildings or Facilities (Terminals, Parking)',
                    'Operation of Government Power/Energy Buildings or Facilities (Plants, Substations)',
                    'Operation of Government Communication Buildings or Facilities (Broadcasting Towers/Facilities)',
                    'Venues Decoration Services',
                    'Passenger transportation services',
                    'Material treatment Services',
                    'Motor vehicles conversion or modification services',
                    'Forest products harvesting and processing',
                    'Forestry Services',
                    'Land Regularization Services',
                    'Miscellaneous Port Services',
                    'Passenger Air Transportation Services',
                    'Cargo Air Transportation Services',
                    'Aerobics and fitness services',
                    'Vehicle cleaning services',
                    'Crop Cultivation Services',
                    'Flight Data Monitoring Services',
                    'Management and Operation of Airline and Aviation Systems',
                    'Motorcycle hiring services',
                    'Repair and Maintenance of Security and Surveillance Equipment',
                    'Repair and Maintenance of Laboratory Equipment',
                    'Wildlife conservation and protection services',
                    'Wildlife control and monitoring services',
                    'Wildlife products harvesting and processing/taxidermy',
                    'Manual Water Meter Reading Services and Related Services',
                    'Underwater Diving Services',
                    'Medical Laboratory Services'
                ]
            },
            {
                id: 'consultancy',
                label: 'Consultancy',
                description: 'Professional advisory, research, design, audit, and expert assignments.',
                categories: [
                    'Information Technology Consultancy',
                    'Business Process Consultancy',
                    'Software Development',
                    'Systems Operations',
                    'Systems Supports and Administration',
                    'Management Consultancy',
                    'Human Resources Consultancy',
                    'Educational Consultancy',
                    'Legal Services Consultancy',
                    'Environmental Consultancy',
                    'Energy Consultancy',
                    'Health Care Consultancy',
                    'Public Relations Consultancy',
                    'Marketing Consultancy',
                    'Organisation and Change Management Consultancy',
                    'Procurement Consultancy',
                    'Tax Consultancy',
                    'Accountancy and auditing',
                    'Financial and audit Services Consultancy',
                    'Oil and Gas Consultancy',
                    'Research, survey and Development Consultancy',
                    'Structural Design',
                    'Transcription',
                    'Translation',
                    'Strategic Planning Consultancy',
                    'Marine Environment Consultancy',
                    'Quality Management Consultancy',
                    'Maritime Management Consultancy',
                    'Proofreading Services',
                    'Careers Development Services',
                    'Personnel Skills Training Services',
                    'Recreational Development Services',
                    'Adult Education Services',
                    'Child Education Services',
                    'Special Needs Education Services',
                    'Vocational Training Services',
                    'Construction Management Services',
                    'Food and Nutrition Services',
                    'Medical Services',
                    'Programme and Project Management Services',
                    'Architectural services',
                    'Forensic and investigation consultancy services',
                    'Health and safety audit services',
                    'Intelligence security and surveillance services',
                    'Land surveying services',
                    'Urban/Town Planning Services',
                    'Civil Engineering Services',
                    'Building Engineering Services',
                    'Mechanical Engineering Services',
                    'Electrical Engineering Services',
                    'Quantity and Building Surveying Services',
                    'Actuarial Services',
                    'Valuation Consultancy Services',
                    'Geoscience Consultancy Services',
                    'Irrigation Engineering Services'
                ]
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

    // Communication Center seed data. Runtime workflow events append to localStorage.
    communicationCenter: {
        categories: [
            'General Message',
            'Tender Clarification',
            'System Notification',
            'System Alert',
            'Evaluation Update',
            'Tender Publication',
            'Tender Rejection',
            'Bid Submission',
            'Supplier Invitation',
            'Award Notification',
            'Deadline Reminder',
            'Admin Announcement'
        ],
        senderTypes: ['Buyer', 'Supplier', 'System', 'Admin', 'Evaluator'],
        clarificationCategories: [
            'Technical Specification',
            'BOQ / Pricing',
            'Eligibility Requirement',
            'Submission Document',
            'Tender Deadline',
            'Site Visit / Pre-Bid Meeting',
            'Contract Terms',
            'Other'
        ],
        statuses: ['Unread', 'Read', 'Replied', 'Pending Response', 'Resolved', 'Archived', 'Deleted'],
        clarificationStatuses: ['Submitted', 'Pending Buyer Response', 'Answered', 'Published to All Bidders', 'Resolved', 'Closed'],
        notificationStatuses: ['Unread', 'Read', 'Action Required', 'Completed'],
        priorities: ['Low', 'Normal', 'High', 'Urgent'],
        replyVisibilityOptions: [
            'Reply to this supplier only',
            'Publish answer to all bidders for this tender',
            'Issue addendum'
        ],
        items: [
            {
                id: 'msg-001',
                kind: 'clarification',
                folder: 'inbox',
                category: 'BOQ / Pricing',
                subject: 'Clarification on BOQ Item 4',
                body: 'Please clarify whether the electrical installation item includes wiring accessories or only labor.',
                senderType: 'Supplier',
                senderName: 'ABC Contractors Ltd',
                recipientType: 'Buyer',
                recipientName: 'Ministry of Health',
                tenderId: 'PX-WRK-2026-001',
                tenderReference: 'PX-WRK-2026-001',
                tenderTitle: 'Construction of District Maternal Health Wing',
                priority: 'Normal',
                status: 'Pending Buyer Response',
                read: false,
                visibility: 'Private',
                attachments: [{ id: 'att-001', name: 'BOQ-question.pdf', fileType: 'pdf' }],
                thread: [
                    { senderType: 'Supplier', senderName: 'ABC Contractors Ltd', body: 'Please clarify whether BOQ Item 4 includes wiring accessories.', createdAt: '2026-05-15T10:30:00' }
                ],
                actions: ['Reply', 'Publish Answer', 'Mark Resolved'],
                createdAt: '2026-05-15T10:30:00',
                updatedAt: '2026-05-15T10:30:00',
                audience: ['buyer', 'admin', 'all']
            },
            {
                id: 'not-001',
                kind: 'notification',
                folder: 'inbox',
                category: 'Tender Publication',
                subject: 'Tender Published Successfully',
                body: 'Your tender Construction of Health Facility has passed evaluation and has been published to the marketplace.',
                senderType: 'System',
                senderName: 'ProcureX System',
                recipientType: 'Buyer',
                recipientName: 'Ministry of Health',
                tenderId: 'PX-WRK-2026-001',
                tenderReference: 'PX-WRK-2026-001',
                tenderTitle: 'Construction of District Maternal Health Wing',
                priority: 'Normal',
                status: 'Read',
                read: true,
                actionRequired: false,
                actionLabel: 'View Tender',
                actionPage: 'tender-details',
                createdAt: '2026-05-15T11:00:00',
                updatedAt: '2026-05-15T11:00:00',
                audience: ['buyer', 'all']
            },
            {
                id: 'alert-001',
                kind: 'alert',
                folder: 'inbox',
                category: 'Tender Rejection',
                subject: 'Tender Returned for Correction',
                body: 'Your tender has been reviewed and returned for correction. Please review evaluator comments and update the required sections before resubmission.',
                senderType: 'Evaluator',
                senderName: 'Evaluation Panel',
                recipientType: 'Buyer',
                recipientName: 'Ministry of Health',
                tenderId: 'PX-WRK-2026-002',
                tenderReference: 'PX-WRK-2026-002',
                tenderTitle: 'Rehabilitation of Rural Water Supply Network',
                priority: 'High',
                status: 'Action Required',
                read: false,
                actionRequired: true,
                actionLabel: 'Edit Tender',
                actionPage: 'create-tender',
                createdAt: '2026-05-15T12:00:00',
                updatedAt: '2026-05-15T12:00:00',
                audience: ['buyer', 'admin', 'all']
            },
            {
                id: 'not-002',
                kind: 'notification',
                folder: 'inbox',
                category: 'Supplier Invitation',
                subject: 'New Tender Invitation',
                body: 'You have been invited to participate in tender PX-WRK-2026-001: Construction of District Maternal Health Wing.',
                senderType: 'Buyer',
                senderName: 'Ministry of Health',
                recipientType: 'Supplier',
                recipientName: 'ABC Construction Ltd',
                tenderId: 'PX-WRK-2026-001',
                tenderReference: 'PX-WRK-2026-001',
                tenderTitle: 'Construction of District Maternal Health Wing',
                priority: 'Normal',
                status: 'Unread',
                read: false,
                actionRequired: true,
                actionLabel: 'Start Submission',
                actionPage: 'bidding-workspace',
                createdAt: '2026-05-15T13:30:00',
                updatedAt: '2026-05-15T13:30:00',
                audience: ['supplier', 'all']
            },
            {
                id: 'alert-002',
                kind: 'alert',
                folder: 'inbox',
                category: 'Deadline Reminder',
                subject: 'Tender Closing Soon',
                body: 'Tender PX-WRK-2026-002 will close soon. Complete bid submission before the deadline.',
                senderType: 'System',
                senderName: 'ProcureX System',
                recipientType: 'Supplier',
                recipientName: 'ABC Construction Ltd',
                tenderId: 'PX-WRK-2026-002',
                tenderReference: 'PX-WRK-2026-002',
                tenderTitle: 'Rehabilitation of Rural Water Supply Network',
                priority: 'Urgent',
                status: 'Unread',
                read: false,
                actionRequired: true,
                actionLabel: 'View Tender',
                actionPage: 'supplier-tender-detail',
                createdAt: '2026-05-15T14:00:00',
                updatedAt: '2026-05-15T14:00:00',
                audience: ['supplier', 'all']
            }
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
            { type: 'Messages requiring reply', count: 5, urgency: 84, due: '1 day', nav: 'communication-center', audience: ['buyer', 'supplier', 'all'] }
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
            { title: 'Reply to messages', detail: 'Clarifications, alerts, and tender workflow messages', nav: 'communication-center', audience: ['buyer', 'supplier', 'all'], signal: 'messages' },
            { title: 'Find opportunities', detail: 'Open matching tenders and tenders near close', nav: 'supplier-marketplace', audience: ['supplier', 'all'], signal: 'opportunities' },
            { title: 'Create tender', detail: 'Start a new buyer procurement', nav: 'create-tender', audience: ['buyer', 'all'], signal: 'drafts' }
        ],
        appShortcuts: [
            { app: 'Procurement', detail: 'Marketplace, create tender, bid', usage: 96, nav: 'supplier-marketplace', audience: ['buyer', 'supplier', 'all'] },
            { app: 'Communication Center', detail: 'Inbox, clarifications, notifications, alerts', usage: 95, nav: 'communication-center', audience: ['buyer', 'supplier', 'all'] },
            { app: 'Evaluation', detail: 'Bid opening, scoring, review', usage: 94, nav: 'bid-evaluation', audience: ['buyer', 'all'] },
            { app: 'Awarding and Contract', detail: 'Awards, approvals, signatures', usage: 92, nav: 'award-recommendation', audience: ['buyer', 'supplier', 'all'] },
            { app: 'Records & History', detail: 'Past tenders, bids, awards, cancellations', usage: 90, nav: 'records-history', audience: ['buyer', 'supplier', 'all'] },
            { app: 'IAM', detail: 'Registration and eKYC review', usage: 88, nav: 'verification-status', audience: ['buyer', 'supplier', 'all'] },
            { app: 'Dashboard', detail: 'Your work, spend, and insights', usage: 84, nav: 'workspace-dashboard', audience: ['buyer', 'supplier', 'all'] }
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
