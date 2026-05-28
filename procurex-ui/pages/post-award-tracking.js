// Post-award execution workspace for delivery, payments, issues, variations, closure, and performance.

function escapePostAwardHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatPostAwardMoney(value, currency = 'TZS') {
    const amount = Number(value || 0);
    return Number.isFinite(amount) ? `${currency} ${amount.toLocaleString()}` : escapePostAwardHtml(value || '-');
}

function renderPostAwardBadge(value = '') {
    const text = String(value || '');
    const lower = text.toLowerCase();
    const tone = lower.includes('accepted') || lower.includes('paid') || lower.includes('resolved') || lower.includes('complete')
        ? 'badge-success'
        : lower.includes('pending') || lower.includes('review') || lower.includes('required') || lower.includes('progress') || lower.includes('draft')
            ? 'badge-warning'
            : lower.includes('blocked') || lower.includes('high')
                ? 'badge-error'
                : 'badge-info';
    return `<span class="badge ${tone}">${escapePostAwardHtml(text)}</span>`;
}

function renderPostAwardTable(headers = [], rows = []) {
    return `
        <div class="data-table evaluation-table-scroll">
            <table>
                <thead><tr>${headers.map(header => `<th>${escapePostAwardHtml(header)}</th>`).join('')}</tr></thead>
                <tbody>${rows.join('')}</tbody>
            </table>
        </div>
    `;
}

function renderPostAwardTracking() {
    const context = typeof getAwardContractLifecycleContext === 'function' ? getAwardContractLifecycleContext() : null;
    const draft = context?.draft || {};
    const contract = context?.contract || {};
    const execution = {
        ...(mockData.awardingContracts?.execution || {}),
        contractId: contract.contractId || mockData.awardingContracts?.execution?.contractId,
        title: contract.title || mockData.awardingContracts?.execution?.title,
        supplier: contract.supplier || mockData.awardingContracts?.execution?.supplier,
        buyer: contract.buyer || mockData.awardingContracts?.execution?.buyer,
        contractValue: contract.value || mockData.awardingContracts?.execution?.contractValue,
        currency: contract.currency || mockData.awardingContracts?.execution?.currency,
        status: draft.currentStep === 'execution' ? 'In Progress' : (mockData.awardingContracts?.execution?.status || 'In Progress')
    };
    const paid = (execution.invoices || []).filter(invoice => /paid/i.test(invoice.status || '')).reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const invoiced = (execution.invoices || []).reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const averagePerformance = (execution.performance || []).length
        ? ((execution.performance || []).reduce((sum, row) => sum + Number(row.rating || 0), 0) / execution.performance.length).toFixed(1)
        : '0.0';

    return `
        <div class="main-layout procurement-layout evaluation-app-layout post-award-page" data-award-contract-workspace data-award-current-step="execution" data-award-tender-id="${escapePostAwardHtml(draft.tenderId || '')}">
            <aside class="sidebar evaluation-sidebar">
                <div class="evaluation-sidebar-head">
                    <h3>Post-Award Tracking</h3>
                    <span>Contract #${escapePostAwardHtml(execution.contractId || 'Active')}</span>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-award-guard-navigate data-navigate="awarding-contracts">Awarding Dashboard</a></li>
                    <li><a href="#" data-award-guard-navigate data-navigate="contract-negotiation">Back to Contract</a></li>
                    <li><a href="#" data-award-guard-navigate data-navigate="post-award-tracking" class="active">Execution</a></li>
                    <li><a href="#" data-award-guard-navigate data-navigate="workspace-dashboard">Workspace Dashboard</a></li>
                    <li><a href="#" data-award-guard-navigate data-navigate="welcome">Logout</a></li>
                </ul>
            </aside>

            <main class="main-content procurement-content post-award-workspace">
                <section class="procurement-hero evaluation-hero-panel award-hero-panel">
                    <div>
                        <span class="section-kicker">Contract execution and monitoring</span>
                        <h1>${escapePostAwardHtml(execution.title || 'Active contract')}</h1>
                        <p>After signing, delivery, inspection, invoices, issues, variations, closure, and supplier performance are managed here.</p>
                    </div>
                    <div class="evaluation-hero-stats">
                        <div><strong>${execution.progress || 0}%</strong><span>Delivery progress</span></div>
                        <div><strong>${formatPostAwardMoney(paid, execution.currency)}</strong><span>Paid</span></div>
                        <div><strong>${averagePerformance}/5</strong><span>Performance</span></div>
                    </div>
                </section>

                <section class="evaluation-top-summary">
                    <div><span>Buyer</span><strong>${escapePostAwardHtml(execution.buyer)}</strong></div>
                    <div><span>Supplier</span><strong>${escapePostAwardHtml(execution.supplier)}</strong></div>
                    <div><span>Value</span><strong>${formatPostAwardMoney(execution.contractValue, execution.currency)}</strong></div>
                    <div><span>Status</span>${renderPostAwardBadge(execution.status)}</div>
                    <div><span>Balance</span><strong>${formatPostAwardMoney(Number(execution.contractValue || 0) - paid, execution.currency)}</strong></div>
                </section>

                <section class="procurement-panel evaluation-panel award-draft-control-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Execution draft</span>
                            <h2>Leave execution tracking and return to another tender</h2>
                        </div>
                        ${renderPostAwardBadge(draft.draftSaved ? 'Draft saved' : 'Execution active')}
                    </div>
                    <div class="inline-actions">
                        <button class="btn btn-secondary" type="button" data-award-save-draft data-award-step="execution">Save Draft</button>
                        <button class="btn btn-secondary" type="button" data-award-save-exit data-award-step="execution">Save Draft & Exit</button>
                        <button class="btn btn-secondary" type="button" data-award-guard-navigate data-navigate="awarding-contracts">Open Another Tender</button>
                    </div>
                </section>

                <section class="procurement-panel evaluation-panel post-award-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Execution workspace</span>
                            <h2>Milestones, payments, issues, variations, closure, and performance</h2>
                        </div>
                        ${renderPostAwardBadge(`${execution.progress || 0}% complete`)}
                    </div>

                    <div class="tabs post-award-tabs">
                        <div class="tab active" data-tab="milestones">Delivery / Milestones</div>
                        <div class="tab" data-tab="payments">Invoices & Payments</div>
                        <div class="tab" data-tab="issues">Issues</div>
                        <div class="tab" data-tab="variations">Variations</div>
                        <div class="tab" data-tab="closure">Closure</div>
                        <div class="tab" data-tab="performance">Performance</div>
                    </div>

                    <div class="post-award-tab-content">
                        <div class="tab-content" data-tab="milestones" style="display: block;">
                            <div class="post-award-progress-card">
                                <div><strong>Overall Progress</strong><span>${execution.progress || 0}%</span></div>
                                <div class="progress-bar"><div class="progress-fill" style="width: ${Number(execution.progress || 0)}%"></div></div>
                            </div>
                            ${renderPostAwardTable(
                                ['Milestone', 'Description', 'Scheduled', 'Actual', 'Status', 'Evidence', 'Payment %', 'Action'],
                                (execution.milestones || []).map(row => `
                                    <tr>
                                        <td><strong>${escapePostAwardHtml(row.name)}</strong></td>
                                        <td>${escapePostAwardHtml(row.description)}</td>
                                        <td>${escapePostAwardHtml(row.scheduled)}</td>
                                        <td>${escapePostAwardHtml(row.actual)}</td>
                                        <td>${renderPostAwardBadge(row.status)}</td>
                                        <td>${escapePostAwardHtml(row.evidence)}</td>
                                        <td>${escapePostAwardHtml(row.paymentPercent)}%</td>
                                        <td><button class="btn btn-secondary btn-sm" type="button">${/pending/i.test(row.status) ? 'Schedule' : 'Review'}</button></td>
                                    </tr>
                                `)
                            )}
                        </div>

                        <div class="tab-content" data-tab="payments" style="display: none;">
                            <section class="post-award-metric-grid">
                                <article><span>Contract amount</span><strong>${formatPostAwardMoney(execution.contractValue, execution.currency)}</strong></article>
                                <article><span>Amount invoiced</span><strong>${formatPostAwardMoney(invoiced, execution.currency)}</strong></article>
                                <article><span>Amount paid</span><strong>${formatPostAwardMoney(paid, execution.currency)}</strong></article>
                                <article><span>Balance remaining</span><strong>${formatPostAwardMoney(Number(execution.contractValue || 0) - paid, execution.currency)}</strong></article>
                            </section>
                            ${renderPostAwardTable(
                                ['Invoice', 'Milestone', 'Amount', 'Status', 'Matching Result', 'Action'],
                                (execution.invoices || []).map(row => `
                                    <tr>
                                        <td><strong>${escapePostAwardHtml(row.invoice)}</strong></td>
                                        <td>${escapePostAwardHtml(row.milestone)}</td>
                                        <td>${formatPostAwardMoney(row.amount, execution.currency)}</td>
                                        <td>${renderPostAwardBadge(row.status)}</td>
                                        <td>${escapePostAwardHtml(row.match)}</td>
                                        <td><button class="btn btn-secondary btn-sm" type="button">${/pending/i.test(row.status) ? 'Approve' : 'View'}</button></td>
                                    </tr>
                                `)
                            )}
                        </div>

                        <div class="tab-content" data-tab="issues" style="display: none;">
                            ${renderPostAwardTable(
                                ['Issue', 'Raised By', 'Priority', 'Responsible Party', 'Status', 'Required Action'],
                                (execution.issues || []).map(row => `
                                    <tr>
                                        <td><strong>${escapePostAwardHtml(row.id)}: ${escapePostAwardHtml(row.title)}</strong></td>
                                        <td>${escapePostAwardHtml(row.raisedBy)}</td>
                                        <td>${renderPostAwardBadge(row.priority)}</td>
                                        <td>${escapePostAwardHtml(row.responsibleParty)}</td>
                                        <td>${renderPostAwardBadge(row.status)}</td>
                                        <td>${escapePostAwardHtml(row.requiredAction)}</td>
                                    </tr>
                                `)
                            )}
                            <div class="inline-actions"><button class="btn btn-primary" type="button">Raise Issue</button><button class="btn btn-secondary" type="button">Upload Evidence</button></div>
                        </div>

                        <div class="tab-content" data-tab="variations" style="display: none;">
                            <div class="evaluation-notice warning">After signing, changes are managed as formal amendments, variation requests, extensions of time, or change orders.</div>
                            ${renderPostAwardTable(
                                ['Variation', 'Requested By', 'Price Impact', 'Timeline Impact', 'Status', 'Supporting Document'],
                                (execution.variations || []).map(row => `
                                    <tr>
                                        <td><strong>${escapePostAwardHtml(row.title)}</strong></td>
                                        <td>${escapePostAwardHtml(row.requestedBy)}</td>
                                        <td>${escapePostAwardHtml(row.priceImpact)}</td>
                                        <td>${escapePostAwardHtml(row.timelineImpact)}</td>
                                        <td>${renderPostAwardBadge(row.status)}</td>
                                        <td>${escapePostAwardHtml(row.document)}</td>
                                    </tr>
                                `)
                            )}
                        </div>

                        <div class="tab-content" data-tab="closure" style="display: none;">
                            <div class="closure-checklist">
                                ${(execution.closureChecklist || []).map(row => `
                                    <article>
                                        <strong>${escapePostAwardHtml(row.item)}</strong>
                                        ${renderPostAwardBadge(row.status)}
                                    </article>
                                `).join('')}
                            </div>
                            <div class="inline-actions"><button class="btn btn-primary" type="button">Submit Completion Request</button><button class="btn btn-secondary" type="button">Issue Completion Certificate</button></div>
                        </div>

                        <div class="tab-content" data-tab="performance" style="display: none;">
                            <div class="post-award-performance-grid">
                                ${(execution.performance || []).map(row => `
                                    <article>
                                        <div><strong>${escapePostAwardHtml(row.criteria)}</strong><span>${escapePostAwardHtml(row.rating)}/5</span></div>
                                        <div class="progress-bar"><div class="progress-fill" style="width: ${Number(row.rating || 0) * 20}%"></div></div>
                                    </article>
                                `).join('')}
                            </div>
                            ${renderPostAwardTable(
                                ['Date', 'Contract History'],
                                (execution.history || []).map(row => `<tr><td>${escapePostAwardHtml(row.date)}</td><td>${escapePostAwardHtml(row.event)}</td></tr>`)
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    `;
}

if (window.app) {
    window.app.renderPostAwardTracking = renderPostAwardTracking;
}
