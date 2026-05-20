// Contract Negotiation Page Component

const contractNegotiationClauseCatalog = {
    goods: {
        label: 'Goods',
        clauses: [
            ['Delivery Clause', 'Delivery location, timeline, and partial vs full delivery allowed.'],
            ['Payment Terms', 'Payment after delivery or inspection, invoice requirements, and payment timeline.'],
            ['Inspection and Acceptance', 'Inspection process, rejection conditions, replacement rules, and acceptance certificate.'],
            ['Warranty Clause', 'Warranty period, repair or replacement obligations, and defect handling.'],
            ['Penalty for Delay', 'Liquidated damages per day or week and maximum penalty cap.'],
            ['Risk and Ownership Transfer', 'When risk passes to the buyer, usually upon delivery or acceptance.'],
            ['Packaging and Transport', 'Packaging standards, transport responsibility, and Incoterms where applicable.'],
            ['Termination Clause', 'Breach conditions, cancellation rights, and notice period.']
        ]
    },
    works: {
        label: 'Works',
        clauses: [
            ['Scope of Works Clause', 'Project scope, drawings reference, specifications, and BOQ reference.'],
            ['Contract Price and Payment Schedule', 'Milestone payments, interim certificates, and retention money percentage.'],
            ['Time for Completion', 'Project duration, start date, completion deadline, and extension process.'],
            ['Liquidated Damages', 'Penalty per delay day or week and maximum cap, often 10% of contract value.'],
            ['Defects Liability', 'Post-completion defect period, usually 12-24 months, and repair obligations.'],
            ['Variation Clause', 'How scope changes are approved and price adjustments are handled.'],
            ['Site and Access Clause', 'Site handover rules, access rights, and utility responsibilities.'],
            ['Health, Safety and Environment', 'Safety compliance, environmental protection, and worker safety obligations.'],
            ['Performance Security', 'Bank guarantee requirement and percentage such as 5-10% before signing or effectiveness.']
        ]
    },
    services: {
        label: 'Services',
        clauses: [
            ['Service Scope Clause', 'Detailed service description, boundaries, and exclusions.'],
            ['Service Level Agreement', 'Performance standards, uptime, response times, and quality metrics.'],
            ['KPI and Performance Monitoring', 'KPIs, measurement method, reporting mechanism, and remedies.'],
            ['Payment Terms', 'Monthly or periodic payments and deductions for poor performance.'],
            ['Penalty Clause', 'SLA breach penalties, service credit deductions, and escalation rules.'],
            ['Staffing and Personnel', 'Required staff roles, qualifications, and replacement approval.'],
            ['Equipment and Resources', 'Tools or equipment required and ownership responsibilities.'],
            ['Reporting Requirements', 'Reporting frequency, format, and submission channels.'],
            ['Termination Clause', 'Poor performance termination triggers and notice period.'],
            ['Renewal Clause', 'Extension conditions and performance-based renewal.']
        ]
    },
    consultancy: {
        label: 'Consultancy',
        clauses: [
            ['Scope of Services', 'Deliverables, methodology boundaries, reports, studies, or designs.'],
            ['Deliverables and Milestones', 'Outputs required, submission timeline, approval, and revision process.'],
            ['Payment Terms', 'Milestone-based and acceptance-linked payments.'],
            ['Personnel Clause', 'Key experts named, CV approval, and substitution restrictions.'],
            ['Performance and Evaluation', 'Quality evaluation of deliverables and acceptance criteria.'],
            ['Intellectual Property', 'Ownership of reports, data, designs, usage rights, and reproduction limits.'],
            ['Time Schedule', 'Assignment duration and submission deadlines per deliverable.'],
            ['Termination Clause', 'Termination for unsatisfactory performance and withdrawal rules.'],
            ['Conflict of Interest', 'Disclosure obligations and restrictions on engaging competing parties.'],
            ['Knowledge Transfer', 'Training, mentorship, manuals, and handover documentation.'],
            ['Data Ownership', 'Client data usage limits, return obligations, and confidential data handling.']
        ]
    }
};

const contractNegotiationEthicalClauses = [
    ['Conflict of Interest Clause', 'Disclosure duties, restrictions, and remediation steps.'],
    ['Confidentiality Clause', 'Non-disclosure of procurement, technical, commercial, and personal data.'],
    ['Anti-Corruption Clause', 'Prohibits bribery, collusion, coercion, and fraudulent conduct during execution.'],
    ['Data Protection Clause', 'Data handling, access control, retention, and incident reporting obligations.']
];

function escapeContractNegotiationHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatContractNegotiationMoney(value, currency = 'TZS') {
    if (typeof formatEvaluationMoney === 'function') return formatEvaluationMoney(value, currency);
    const amount = Number(value);
    return Number.isFinite(amount) ? `${currency} ${amount.toLocaleString()}` : escapeContractNegotiationHtml(value || '-');
}

function renderContractNegotiationBadge(value = '') {
    if (typeof renderEvaluationStatusBadge === 'function') return renderEvaluationStatusBadge(value);
    return `<span class="badge badge-info">${escapeContractNegotiationHtml(value)}</span>`;
}

function getContractNegotiationTender() {
    if (typeof getProcurexSelectedTender === 'function') return getProcurexSelectedTender();
    return mockData.tenders?.[0] || {};
}

function getContractNegotiationTypeId(tender = {}) {
    const raw = String(tender.procurementTypeId || tender.type || tender.label || 'works').toLowerCase();
    if (raw.includes('good')) return 'goods';
    if (raw.includes('consult')) return 'consultancy';
    if (raw.includes('service')) return 'services';
    return 'works';
}

function getContractNegotiationRecommendation() {
    return mockData.bidEvaluation?.recommendation || {};
}

function getContractNegotiationWinner() {
    const recommendation = getContractNegotiationRecommendation();
    const bids = mockData.bidEvaluation?.bids || [];
    return bids.find(bid => bid.supplier === recommendation.supplier)
        || bids.slice().sort((a, b) => (a.financial?.ranking || 99) - (b.financial?.ranking || 99))[0]
        || {};
}

function getContractNegotiationClauseStatus(index = 0) {
    return index % 7 === 2 ? 'Disputed' : index % 3 === 0 ? 'Agreed' : 'Pending';
}

function renderContractNegotiationClauseGroup(title, kicker, clauses = [], options = {}) {
    return `
        <section class="contract-clause-category active">
            <div class="contract-clause-category-heading">
                <div>
                    <span class="section-kicker">${escapeContractNegotiationHtml(kicker)}</span>
                    <h4>${escapeContractNegotiationHtml(title)}</h4>
                </div>
                <span class="badge badge-info">${escapeContractNegotiationHtml(options.badge || `${clauses.length} clauses`)}</span>
            </div>
            <div class="contract-clause-grid">
                ${clauses.map(([clauseTitle, detail], index) => {
                    const status = options.fixedStatus || getContractNegotiationClauseStatus(index);
                    return `
                        <article class="contract-clause-card">
                            <div class="contract-clause-card-head">
                                <strong>${escapeContractNegotiationHtml(clauseTitle)}</strong>
                                ${renderContractNegotiationBadge(status)}
                            </div>
                            <span>${escapeContractNegotiationHtml(detail)}</span>
                        </article>
                    `;
                }).join('')}
            </div>
        </section>
    `;
}

function renderContractNegotiationClauseLibrary(tender = {}) {
    const activeTypeId = getContractNegotiationTypeId(tender);
    const category = contractNegotiationClauseCatalog[activeTypeId] || contractNegotiationClauseCatalog.works;

    return `
        <section class="procurement-panel evaluation-panel contract-clause-library">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Contract clause definition</span>
                    <h2>${escapeContractNegotiationHtml(category.label)} contract clauses</h2>
                </div>
                ${renderContractNegotiationBadge(`${category.clauses.length + contractNegotiationEthicalClauses.length} clauses`)}
            </div>
            <p class="contract-clause-note">Buyer-defined contract clauses are managed after award. They do not reopen tender evaluation or supplier responsiveness.</p>
            <div class="contract-clause-library-stack">
                ${renderContractNegotiationClauseGroup('Ethical Clauses', 'Mandatory for all procurement types', contractNegotiationEthicalClauses, { fixedStatus: 'Mandatory' })}
                ${renderContractNegotiationClauseGroup(`${category.label} Clauses`, 'Selected procurement type', category.clauses)}
            </div>
        </section>
    `;
}

function renderContractNegotiationFlow() {
    const steps = [
        ['01', 'Internal approval confirmed', 'Award package is approved before negotiation.'],
        ['02', 'Standstill satisfied', 'Complaints and debrief requests are closed.'],
        ['03', 'Supplier accepts award', 'Winner confirms willingness to proceed.'],
        ['04', 'Buyer shares draft v1', 'Clause catalog and contract body are issued.'],
        ['05', 'Supplier counter-proposal v2', 'Supplier proposes clause amendments in chat.'],
        ['06', 'Buyer revised draft v3', 'Buyer accepts, rejects, or counter-proposes.'],
        ['07', 'Final agreed version', 'All clauses marked agreed before signing.'],
        ['08', 'Signed hash and activation', 'Dual signature creates immutable audit record.']
    ];

    return `
        <section class="award-workflow-map contract-workflow-map">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Contracting workflow</span>
                    <h2>Negotiation opens only after award controls are satisfied</h2>
                </div>
                ${renderContractNegotiationBadge('Controlled sequence')}
            </div>
            <div class="award-workflow-grid">
                ${steps.map(([step, title, note]) => `
                    <article>
                        <strong>${step}</strong>
                        <span>${escapeContractNegotiationHtml(title)}</span>
                        <em>${escapeContractNegotiationHtml(note)}</em>
                    </article>
                `).join('')}
            </div>
        </section>
    `;
}

function renderContractVersionHistory() {
    const versions = [
        ['Draft v1', 'Buyer initial contract draft', '2026-07-01 09:00', 'Issued'],
        ['Counter v2', 'Supplier payment schedule clarification', '2026-07-02 11:15', 'Reviewed'],
        ['Revised v3', 'Buyer revised milestone wording', '2026-07-02 14:20', 'Current'],
        ['Final agreed version', 'All clauses agreed, pending signatures', 'Pending', 'Next'],
        ['Final signed version hash', 'SHA-256 stored after digital signing', 'Pending', 'Locked after signing']
    ];

    return `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Contract version history</span>
                    <h2>Every negotiation round is auditable</h2>
                </div>
                ${renderContractNegotiationBadge('Version controlled')}
            </div>
            <div class="data-table evaluation-table-scroll">
                <table>
                    <thead><tr><th>Version</th><th>Change</th><th>Timestamp</th><th>Status</th></tr></thead>
                    <tbody>
                        ${versions.map(row => `
                            <tr>
                                <td><strong>${escapeContractNegotiationHtml(row[0])}</strong></td>
                                <td>${escapeContractNegotiationHtml(row[1])}</td>
                                <td>${escapeContractNegotiationHtml(row[2])}</td>
                                <td>${renderContractNegotiationBadge(row[3])}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>
    `;
}

function renderNegotiationRules() {
    const canNegotiate = [
        ['Payment schedule / milestone dates', 'Allowed when it does not alter evaluated value or scope.'],
        ['Minor delivery or mobilization dates', 'Allowed within evaluated delivery period.'],
        ['Clause wording', 'Allowed when risk allocation remains lawful and transparent.'],
        ['Penalty rates', 'Limited and capped by procurement standards.'],
        ['Staffing confirmation', 'Allowed for mobilization, named personnel, and substitutions under approval.'],
        ['Warranty / defects period', 'Limited; cannot fall below tender minimum standard.']
    ];
    const cannotNegotiate = [
        ['Evaluated bid price', 'No material change; only approved arithmetic corrections, tax clarification, or lawful method-specific adjustments.'],
        ['Technical scope or deliverables', 'Changing scope after award would create a new bid.'],
        ['Evaluation criteria or result', 'Fixed, audited, and outside negotiation.'],
        ['Supplier identity', 'Award cannot be transferred to another entity.']
    ];

    return `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Negotiation boundaries</span>
                    <h2>Contract negotiation must not reopen competition</h2>
                </div>
                ${renderContractNegotiationBadge('No material change')}
            </div>
            <div class="contract-rules-grid">
                <article>
                    <h3>Can be negotiated</h3>
                    ${canNegotiate.map(([title, note]) => `<div><strong>${escapeContractNegotiationHtml(title)}</strong><span>${escapeContractNegotiationHtml(note)}</span></div>`).join('')}
                </article>
                <article>
                    <h3>Cannot be negotiated</h3>
                    ${cannotNegotiate.map(([title, note]) => `<div><strong>${escapeContractNegotiationHtml(title)}</strong><span>${escapeContractNegotiationHtml(note)}</span></div>`).join('')}
                </article>
            </div>
        </section>
    `;
}

function renderDigitalSignaturePanel(typeId = 'works') {
    const securityRequired = typeId === 'works';
    return `
        <section class="procurement-panel evaluation-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Digital contract signing</span>
                    <h2>Signatures, security verification, and activation</h2>
                </div>
                ${renderContractNegotiationBadge('Signature pending')}
            </div>
            <div class="contract-prerequisite-grid">
                <article>
                    <strong>Performance security</strong>
                    <span>${securityRequired ? 'Required before signing/effectiveness for this works contract.' : 'Not required for this procurement type unless buyer configured it.'}</span>
                    ${renderContractNegotiationBadge(securityRequired ? 'Verify before signing' : 'Conditional')}
                </article>
                <article>
                    <strong>Signing order</strong>
                    <span>Configurable: buyer first, supplier first, or parallel signing.</span>
                    ${renderContractNegotiationBadge('Configurable')}
                </article>
                <article>
                    <strong>Activation rule</strong>
                    <span>Contract activates only after agreed clauses, required security, and both signatures.</span>
                    ${renderContractNegotiationBadge('Controlled')}
                </article>
            </div>
            <div class="contract-signature-grid">
                ${[
                    ['Buyer Signature Block', 'Procurement Officer', 'Full name, title, digital signature, timestamp.'],
                    ['Supplier Signature Block', 'Managing Director', 'Full name, title, digital signature, timestamp.']
                ].map(([title, role, note]) => `
                    <article class="contract-signature-card">
                        <h3>${escapeContractNegotiationHtml(title)}</h3>
                        <div class="signature-preview"><strong>Signature Area</strong><span>Click to sign digitally</span></div>
                        <input class="form-input" placeholder="Full Name">
                        <input class="form-input" value="${escapeContractNegotiationHtml(role)}" placeholder="Position / Title">
                        <button class="btn btn-secondary" type="button">Apply Digital Signature</button>
                        <small>${escapeContractNegotiationHtml(note)}</small>
                    </article>
                `).join('')}
            </div>
            <div class="evaluation-notice success">Signature audit records signer identity, document hash, timestamp, certificate metadata, and final signed version hash. The audit record is permanent and cannot be modified.</div>
            <div class="inline-actions">
                <button class="btn btn-secondary" type="button" data-navigate="award-recommendation">Back to Award</button>
                <button class="btn btn-primary" type="button" data-navigate="post-award-tracking">Activate Contract Tracking</button>
            </div>
        </section>
    `;
}

function renderNegotiationChat(negotiation = {}) {
    return `
        <aside class="contract-chat-panel">
            <div class="panel-heading">
                <div>
                    <span class="section-kicker">Negotiation chat</span>
                    <h3>Clause positions</h3>
                </div>
                ${renderContractNegotiationBadge('Round 3')}
            </div>
            <div class="chat-messages">
                ${(negotiation.messages || []).map(msg => `
                    <article class="contract-chat-message ${msg.from === 'buyer' ? 'buyer' : 'supplier'}">
                        <div>
                            <strong>${msg.from === 'buyer' ? 'Procurement Officer' : 'Winning Supplier'}</strong>
                            <span>${escapeContractNegotiationHtml(msg.timestamp)}</span>
                        </div>
                        <p>${escapeContractNegotiationHtml(msg.message)}</p>
                    </article>
                `).join('')}
            </div>
            <div class="chat-input">
                <input class="form-input" type="text" placeholder="Type your message...">
                <button class="btn btn-primary" type="button">Send</button>
            </div>
            <div class="contract-quick-actions">
                <h4>Quick actions</h4>
                <button class="btn btn-secondary" type="button">Request Clarification</button>
                <button class="btn btn-secondary" type="button">Counter Proposal</button>
                <button class="btn btn-secondary" type="button">Accept Terms</button>
            </div>
        </aside>
    `;
}

function renderContractNegotiation() {
    const negotiation = mockData.contractNegotiation || {};
    const tender = getContractNegotiationTender();
    const typeId = getContractNegotiationTypeId(tender);
    const recommendation = getContractNegotiationRecommendation();
    const winner = getContractNegotiationWinner();
    const contractAmount = recommendation.amount || winner.financial?.correctedPrice || winner.price || 0;
    const supplier = recommendation.supplier || winner.supplier || 'Winning Supplier';
    const activeType = contractNegotiationClauseCatalog[typeId] || contractNegotiationClauseCatalog.works;

    return `
        <div class="main-layout procurement-layout evaluation-app-layout contract-page">
            <aside class="sidebar evaluation-sidebar">
                <div class="evaluation-sidebar-head">
                    <h3>Contracting</h3>
                    <span>Contract #${escapeContractNegotiationHtml(negotiation.contractId || 'Draft')}</span>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="award-recommendation">Back to Award</a></li>
                    <li><a href="#" data-navigate="post-award-tracking">Post-Award Tracking</a></li>
                    <li><a href="#" data-navigate="workspace-dashboard">Workspace Dashboard</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </aside>

            <main class="main-content procurement-content contract-negotiation-workspace">
                <section class="procurement-hero evaluation-hero-panel award-hero-panel">
                    <div>
                        <span class="section-kicker">Contract negotiation</span>
                        <h1>${escapeContractNegotiationHtml(tender.title || 'Contract finalization')}</h1>
                        <p>Finalize the ${escapeContractNegotiationHtml(activeType.label.toLowerCase())} contract after internal approval, standstill completion, and supplier acceptance. Negotiation is clause-level and cannot materially change the evaluated bid.</p>
                    </div>
                    <div class="evaluation-hero-stats">
                        <div><strong>${formatContractNegotiationMoney(contractAmount, recommendation.currency || winner.financial?.currency || 'TZS')}</strong><span>Contract value</span></div>
                        <div><strong>${escapeContractNegotiationHtml(recommendation.contractDuration || 'To confirm')}</strong><span>Duration</span></div>
                        <div><strong>${escapeContractNegotiationHtml(negotiation.status || 'Negotiation')}</strong><span>Status</span></div>
                    </div>
                </section>

                <section class="evaluation-top-summary">
                    <div><span>Buyer</span><strong>${escapeContractNegotiationHtml(tender.organization || 'Procuring Entity')}</strong></div>
                    <div><span>Supplier</span><strong>${escapeContractNegotiationHtml(supplier)}</strong></div>
                    <div><span>Contract type</span><strong>${escapeContractNegotiationHtml(activeType.label)}</strong></div>
                    <div><span>PO Matched</span>${renderContractNegotiationBadge(negotiation.poMatched ? 'Verified' : 'Pending')}</div>
                    <div><span>Budget</span>${renderContractNegotiationBadge(negotiation.budgetVerified ? 'Verified' : 'Pending')}</div>
                    <div><span>Signature</span>${renderContractNegotiationBadge(negotiation.signaturePending ? 'Pending' : 'Complete')}</div>
                </section>

                ${renderContractNegotiationFlow()}

                <div class="contract-negotiation-grid">
                    <div class="contract-main-column">
                        <section class="procurement-panel evaluation-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Contract document</span>
                                    <h2>Formal agreement draft</h2>
                                </div>
                                ${renderContractNegotiationBadge('Draft v3')}
                            </div>
                            <div class="contract-document-grid">
                                <article>
                                    <strong>Parties to the Agreement</strong>
                                    <span>Employer: ${escapeContractNegotiationHtml(tender.organization || 'Procuring Entity')}</span>
                                    <span>Supplier: ${escapeContractNegotiationHtml(supplier)}</span>
                                    <span>Contract price: ${formatContractNegotiationMoney(contractAmount, recommendation.currency || winner.financial?.currency || 'TZS')}</span>
                                    <span>Duration: ${escapeContractNegotiationHtml(recommendation.contractDuration || 'To confirm')}</span>
                                </article>
                                <article>
                                    <strong>Scope / Deliverables</strong>
                                    <span>${escapeContractNegotiationHtml(tender.description || 'Scope follows the evaluated tender and accepted bid. Scope cannot be materially changed during negotiation.')}</span>
                                </article>
                                <article>
                                    <strong>Payment Terms</strong>
                                    <span>Milestone or acceptance-linked payment schedule is agreed here without changing the evaluated contract value.</span>
                                    ${renderContractNegotiationBadge('Negotiable timing')}
                                </article>
                            </div>
                        </section>

                        ${renderNegotiationRules()}
                        ${renderContractNegotiationClauseLibrary(tender)}
                        ${renderContractVersionHistory()}
                        ${renderDigitalSignaturePanel(typeId)}
                    </div>

                    ${renderNegotiationChat(negotiation)}
                </div>
            </main>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderContractNegotiation = renderContractNegotiation;
}
