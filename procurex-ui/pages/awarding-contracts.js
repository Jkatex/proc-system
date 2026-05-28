// Awarding and Contracts dashboard. The page groups work by the company's
// relationship to each tender instead of a fixed buyer or supplier account type.

function escapeAwardingContractsHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatAwardingContractsMoney(value, currency = 'TZS') {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount)) return escapeAwardingContractsHtml(value || '-');
    return `${currency} ${amount.toLocaleString()}`;
}

function renderAwardingContractsBadge(value = '') {
    const text = String(value || '');
    const lower = text.toLowerCase();
    const tone = lower.includes('active') || lower.includes('accepted') || lower.includes('complete') || lower.includes('paid') || lower.includes('verified')
        ? 'badge-success'
        : lower.includes('pending') || lower.includes('review') || lower.includes('awaiting') || lower.includes('required')
            ? 'badge-warning'
            : lower.includes('closed') || lower.includes('terminated') || lower.includes('blocked')
                ? 'badge-error'
                : 'badge-info';
    return `<span class="badge ${tone}">${escapeAwardingContractsHtml(text)}</span>`;
}

function renderAwardingContractsAction(label, nav, tenderId = '') {
    return `<button class="btn btn-primary btn-sm" type="button" ${tenderId ? `data-select-tender="${escapeAwardingContractsHtml(tenderId)}"` : ''} data-navigate="${escapeAwardingContractsHtml(nav || 'award-recommendation')}">${escapeAwardingContractsHtml(label || 'Open')}</button>`;
}

function renderAwardingContractsTable(headers = [], rows = []) {
    return `
        <div class="data-table awarding-contracts-table">
            <table>
                <thead>
                    <tr>${headers.map(header => `<th>${escapeAwardingContractsHtml(header)}</th>`).join('')}</tr>
                </thead>
                <tbody>${rows.join('')}</tbody>
            </table>
        </div>
    `;
}

function formatAwardingContractsDate(value = '') {
    if (!value) return 'Not saved';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return escapeAwardingContractsHtml(value);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getAwardingContractsDraftForTender(tender = {}) {
    if (typeof loadAwardContractDraft !== 'function') return null;
    const tenderId = typeof getAwardContractTenderId === 'function' ? getAwardContractTenderId(tender) : (tender.id || tender.reference);
    return loadAwardContractDraft(tenderId, tender);
}

function buildAwardingContractsBuyerRows(lifecycle = {}) {
    const tenders = typeof getAwardContractTenders === 'function' ? getAwardContractTenders() : [];
    const buyerTenders = tenders.filter(tender => tender.createdByCurrentUser).slice(0, 8);
    if (!buyerTenders.length) return lifecycle.pendingAwarding || [];
    return buyerTenders.map(tender => {
        const draft = getAwardingContractsDraftForTender(tender);
        const tenderId = typeof getAwardContractTenderId === 'function' ? getAwardContractTenderId(tender) : tender.id;
        return {
            tenderId,
            title: tender.title,
            reference: tender.reference || tender.id,
            procurementType: draft?.procurementType || tender.type || tender.procurementTypeId || 'Tender',
            evaluationStatus: /evaluation|award/i.test(tender.status || '') ? 'Completed' : 'Ready',
            recommendedSupplier: draft?.awardDecision?.selectedSupplier || lifecycle.award?.selectedSupplier || 'Recommended supplier',
            awardStatus: draft?.awardStatus || 'Pending Award Decision',
            contractStatus: draft?.contract?.status || draft?.contractStatus || 'Not Created',
            currentStep: draft?.currentStep || 'evaluation-result',
            requiredAction: draft?.requiredAction || 'Continue Award',
            draftSaved: draft?.draftSaved,
            lastEditedAt: draft?.lastEditedAt,
            action: draft?.requiredAction || 'Continue Award',
            nav: 'award-recommendation'
        };
    });
}

function buildAwardingContractsSupplierRows(lifecycle = {}) {
    const baseRows = lifecycle.awardedToUs || [];
    return baseRows.map((row, index) => {
        const tenderId = row.tenderId || `supplier-award-${index + 1}`;
        const draft = typeof loadAwardContractDraft === 'function' ? loadAwardContractDraft(tenderId, {
            id: tenderId,
            title: row.title,
            type: row.procurementType || 'services',
            organization: row.buyer,
            createdByCurrentUser: false,
            budget: row.awardValue,
            currency: row.currency
        }) : null;
        return {
            ...row,
            tenderId,
            procurementType: draft?.procurementType || row.procurementType || 'Tender',
            currentStep: draft?.currentStep || 'award-notification',
            requiredAction: draft?.requiredAction || row.requiredAction,
            draftSaved: draft?.draftSaved,
            lastEditedAt: draft?.lastEditedAt,
            contractStatus: draft?.contract?.status || row.contractStatus
        };
    });
}

function renderAwardingContracts() {
    const lifecycle = mockData.awardingContracts || {};
    const pendingAwarding = buildAwardingContractsBuyerRows(lifecycle);
    const awardedToUs = buildAwardingContractsSupplierRows(lifecycle);
    const pendingActions = lifecycle.pendingActions || [];
    const activeContracts = lifecycle.activeContracts || [];
    const closedContracts = lifecycle.closedContracts || [];
    const summary = [
        { label: 'Pending Awarding', value: pendingAwarding.length, detail: 'Buyer-side tenders ready for award or contract action', tab: 'pending-awarding' },
        { label: 'Awarded to you', value: awardedToUs.length, detail: 'Supplier-side awards awaiting response, review, or signature', tab: 'awarded-to-us' },
        { label: 'Pending Action', value: pendingActions.length, detail: 'Contracts needing buyer or supplier action', tab: 'pending-action' },
        { label: 'Active Contracts', value: activeContracts.length, detail: 'Signed contracts under delivery and payment tracking', tab: 'active-contracts' },
        { label: 'Closed Contracts', value: closedContracts.length, detail: 'Completed, terminated, or archived contract records', tab: 'closed-contracts' }
    ];

    return `
        <div class="main-layout procurement-layout awarding-contracts-page">
            <aside class="sidebar evaluation-sidebar">
                <div class="evaluation-sidebar-head">
                    <h3>Awarding and Contracts</h3>
                    <span>Relationship based workspace</span>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="awarding-contracts" class="active">Dashboard</a></li>
                    <li><a href="#" data-navigate="award-recommendation">Award Decision</a></li>
                    <li><a href="#" data-navigate="contract-negotiation">Contract Workspace</a></li>
                    <li><a href="#" data-navigate="post-award-tracking">Post-Award Tracking</a></li>
                    <li><a href="#" data-navigate="workspace-dashboard">Workspace Dashboard</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </aside>

            <main class="main-content procurement-content awarding-contracts-workspace">
                <section class="procurement-hero evaluation-hero-panel award-hero-panel">
                    <div>
                        <span class="section-kicker">Awarding and Contracts</span>
                        <h1>Buyer and supplier work in one place</h1>
                        <p>The workspace checks your relationship to each tender. Tenders you created appear as buyer actions, while tenders awarded to your company appear as supplier actions.</p>
                    </div>
                    <div class="evaluation-hero-stats">
                        <div><strong>${pendingAwarding.length}</strong><span>Pending awards</span></div>
                        <div><strong>${awardedToUs.length}</strong><span>Awarded to you</span></div>
                        <div><strong>${pendingActions.length}</strong><span>Contract actions</span></div>
                    </div>
                </section>

                <section class="awarding-summary-grid">
                    ${summary.map(item => `
                        <button class="awarding-summary-card" type="button" data-awarding-tab-jump="${escapeAwardingContractsHtml(item.tab)}">
                            <strong>${escapeAwardingContractsHtml(item.value)}</strong>
                            <span>${escapeAwardingContractsHtml(item.label)}</span>
                            <em>${escapeAwardingContractsHtml(item.detail)}</em>
                        </button>
                    `).join('')}
                </section>

                <section class="procurement-panel evaluation-panel awarding-tabs-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Lifecycle queues</span>
                            <h2>Work is sorted by tender relationship and required action</h2>
                        </div>
                        ${renderAwardingContractsBadge('No fixed buyer/supplier account split')}
                    </div>

                    <div class="tabs awarding-contract-tabs">
                        <div class="tab active" data-tab="pending-awarding">Pending Awarding</div>
                        <div class="tab" data-tab="awarded-to-us">Awarded to you</div>
                        <div class="tab" data-tab="pending-action">Contracts Pending Action</div>
                        <div class="tab" data-tab="active-contracts">Active Contracts</div>
                        <div class="tab" data-tab="closed-contracts">Closed Contracts</div>
                    </div>

                    <div class="awarding-tab-content">
                        <div class="tab-content" data-tab="pending-awarding" style="display: block;">
                            <p class="awarding-tab-note">These are tenders created by your company that are ready for award decision, supplier notification, or contract creation.</p>
                            ${renderAwardingContractsTable(
                                ['Tender Title', 'Type', 'Evaluation', 'Recommended Supplier', 'Award Status', 'Contract Status', 'Progress', 'Action'],
                                pendingAwarding.map(row => `
                                    <tr>
                                        <td><strong>${escapeAwardingContractsHtml(row.title)}</strong><span>${escapeAwardingContractsHtml(row.reference)}</span></td>
                                        <td>${escapeAwardingContractsHtml(row.procurementType)}</td>
                                        <td>${renderAwardingContractsBadge(row.evaluationStatus)}</td>
                                        <td>${escapeAwardingContractsHtml(row.recommendedSupplier)}</td>
                                        <td>${renderAwardingContractsBadge(row.awardStatus)}</td>
                                        <td>${renderAwardingContractsBadge(row.contractStatus)}</td>
                                        <td>
                                            ${renderAwardingContractsBadge(row.draftSaved ? 'Draft saved' : 'Not saved')}
                                            <span>${escapeAwardingContractsHtml(row.currentStep)}</span>
                                            <small>${formatAwardingContractsDate(row.lastEditedAt)}</small>
                                        </td>
                                        <td>${renderAwardingContractsAction(row.action, row.nav, row.tenderId)}</td>
                                    </tr>
                                `)
                            )}
                        </div>

                        <div class="tab-content" data-tab="awarded-to-us" style="display: none;">
                            <p class="awarding-tab-note">These are tenders where your company has been selected as the awarded supplier. Review the award, accept it, and proceed to contract signing.</p>
                            ${renderAwardingContractsTable(
                                ['Tender Title', 'Buyer', 'Type', 'Award Value', 'Award Status', 'Contract Status', 'Progress', 'Required Action'],
                                awardedToUs.map(row => `
                                    <tr>
                                        <td><strong>${escapeAwardingContractsHtml(row.title)}</strong></td>
                                        <td>${escapeAwardingContractsHtml(row.buyer)}</td>
                                        <td>${escapeAwardingContractsHtml(row.procurementType)}</td>
                                        <td>${formatAwardingContractsMoney(row.awardValue, row.currency)}</td>
                                        <td>${renderAwardingContractsBadge(row.awardStatus)}</td>
                                        <td>${renderAwardingContractsBadge(row.contractStatus)}</td>
                                        <td>
                                            ${renderAwardingContractsBadge(row.draftSaved ? 'Draft saved' : 'Not saved')}
                                            <span>${escapeAwardingContractsHtml(row.currentStep)}</span>
                                            <small>${formatAwardingContractsDate(row.lastEditedAt)}</small>
                                        </td>
                                        <td>${renderAwardingContractsAction(row.requiredAction, row.nav, row.tenderId)}</td>
                                    </tr>
                                `)
                            )}
                        </div>

                        <div class="tab-content" data-tab="pending-action" style="display: none;">
                            <p class="awarding-tab-note">These contracts require action from your company, either as buyer or supplier.</p>
                            ${renderAwardingContractsTable(
                                ['Contract', 'Your Role', 'Other Party', 'Current Status', 'Required Action', 'Due Date'],
                                pendingActions.map(row => `
                                    <tr>
                                        <td><strong>${escapeAwardingContractsHtml(row.contract)}</strong></td>
                                        <td>${renderAwardingContractsBadge(row.role)}</td>
                                        <td>${escapeAwardingContractsHtml(row.otherParty)}</td>
                                        <td>${renderAwardingContractsBadge(row.status)}</td>
                                        <td>${renderAwardingContractsAction(row.requiredAction, row.nav)}</td>
                                        <td>${escapeAwardingContractsHtml(row.dueDate)}</td>
                                    </tr>
                                `)
                            )}
                        </div>

                        <div class="tab-content" data-tab="active-contracts" style="display: none;">
                            <p class="awarding-tab-note">Signed contracts where your company is either buyer or supplier.</p>
                            ${renderAwardingContractsTable(
                                ['Contract', 'Your Role', 'Other Party', 'Progress', 'Next Milestone', 'Payment Status', 'Action'],
                                activeContracts.map(row => `
                                    <tr>
                                        <td><strong>${escapeAwardingContractsHtml(row.title)}</strong></td>
                                        <td>${renderAwardingContractsBadge(row.role)}</td>
                                        <td>${escapeAwardingContractsHtml(row.otherParty)}</td>
                                        <td>
                                            <div class="awarding-mini-progress"><span style="width: ${Number(row.progress || 0)}%"></span></div>
                                            <small>${escapeAwardingContractsHtml(row.progress)}% ${escapeAwardingContractsHtml(row.status)}</small>
                                        </td>
                                        <td>${escapeAwardingContractsHtml(row.nextMilestone)}</td>
                                        <td>${renderAwardingContractsBadge(row.paymentStatus)}</td>
                                        <td>${renderAwardingContractsAction('Track', row.nav)}</td>
                                    </tr>
                                `)
                            )}
                        </div>

                        <div class="tab-content" data-tab="closed-contracts" style="display: none;">
                            <p class="awarding-tab-note">Completed, cancelled, terminated, or archived contract records.</p>
                            ${renderAwardingContractsTable(
                                ['Contract', 'Your Role', 'Other Party', 'Final Value', 'Completion Date', 'Performance', 'Status'],
                                closedContracts.map(row => `
                                    <tr>
                                        <td><strong>${escapeAwardingContractsHtml(row.title)}</strong></td>
                                        <td>${renderAwardingContractsBadge(row.role)}</td>
                                        <td>${escapeAwardingContractsHtml(row.otherParty)}</td>
                                        <td>${formatAwardingContractsMoney(row.finalValue, row.currency)}</td>
                                        <td>${escapeAwardingContractsHtml(row.completionDate)}</td>
                                        <td>${escapeAwardingContractsHtml(row.performanceRating)}</td>
                                        <td>${renderAwardingContractsBadge(row.status)}</td>
                                    </tr>
                                `)
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    `;
}

function initializeAwardingContracts() {
    document.querySelectorAll('[data-awarding-tab-jump]').forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-awarding-tab-jump');
            const tab = document.querySelector(`.awarding-contract-tabs .tab[data-tab="${target}"]`);
            if (tab) tab.click();
        });
    });
}

if (window.app) {
    window.app.renderAwardingContracts = renderAwardingContracts;
}

window.initializeAwardingContracts = initializeAwardingContracts;
