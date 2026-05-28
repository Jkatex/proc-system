// Admin compliance dashboard. System Admin oversees procedures, search, audit, and platform controls.

function escapeAdminDashboardHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getAdminDashboardTenders() {
    if (typeof getProcurexAllTenders === 'function') return getProcurexAllTenders();
    return mockData.tenders || [];
}

function getAdminDashboardRows() {
    if (typeof buildProcurexAdminSearchRows === 'function') return buildProcurexAdminSearchRows();
    return [];
}

function getAdminComplianceQueue() {
    const tenders = getAdminDashboardTenders();
    const queue = [
        ...tenders.slice(0, 5).map((tender, index) => ({
            id: tender.reference || tender.id,
            title: tender.title,
            stage: index % 3 === 0 ? 'Tender publication' : index % 3 === 1 ? 'Evaluation report' : 'Award readiness',
            status: tender.complianceStatus || (index === 1 ? 'Returned for correction' : 'Awaiting review'),
            owner: tender.organization,
            value: tender.budget || 0,
            type: tender.type,
            urgency: 96 - (index * 6),
            issue: index === 1 ? 'Evaluation criteria weights need evidence notes.' : 'Confirm method, budget, requirements, and minimum bidding period.'
        })),
        {
            id: 'AWD-PX-2026-004',
            title: 'Award recommendation for Road Maintenance Framework',
            stage: 'Award',
            status: 'Awaiting review',
            owner: 'Dodoma City Council',
            value: 1280000000,
            type: 'Services',
            urgency: 82,
            issue: 'Confirm award follows ranked bidder and standstill period.'
        }
    ];
    return queue.sort((a, b) => b.urgency - a.urgency);
}

function getAdminEvaluationQueue() {
    return getAdminDashboardRows()
        .filter(row => row.type === 'Evaluation' || /evaluation|draft/i.test(`${row.lifecycleStage} ${row.status}`))
        .slice(0, 5);
}

function getAdminExceptionQueue() {
    return getAdminDashboardRows()
        .filter(row => /return|hold|issue|risk|blocked|clarification|pending/i.test(`${row.status} ${row.summary}`))
        .slice(0, 5);
}

function getAdminDashboardStats() {
    const rows = getAdminDashboardRows();
    const searchStats = typeof getAdminSearchStats === 'function' ? getAdminSearchStats(rows) : {};
    const queue = getAdminComplianceQueue();
    return {
        activeTenders: getAdminDashboardTenders().filter(tender => /open|published/i.test(tender.status || '')).length,
        pendingReviews: queue.length,
        evaluationDrafts: searchStats.evaluations || getAdminEvaluationQueue().length,
        flagged: searchStats.flagged || getAdminExceptionQueue().length,
        documents: searchStats.documents || rows.filter(row => row.type === 'Document').length,
        auditEvents: searchStats.audits || rows.filter(row => row.type === 'Audit').length,
        complianceRate: Math.max(84, 98 - (searchStats.flagged || 0))
    };
}

function renderAdminQueueItem(item) {
    const badge = /return|issue|flag/i.test(item.status) ? 'badge-error' : /hold|await|pending/i.test(item.status) ? 'badge-warning' : 'badge-success';
    return `
        <article class="admin-review-card">
            <div>
                <span class="section-kicker">${escapeAdminDashboardHtml(item.stage)}</span>
                <h3>${escapeAdminDashboardHtml(item.title)}</h3>
                <p>${escapeAdminDashboardHtml(item.owner)} / ${escapeAdminDashboardHtml(item.type)} / TZS ${Number(item.value || 0).toLocaleString()}</p>
                <small>${escapeAdminDashboardHtml(item.issue)}</small>
            </div>
            <div class="admin-review-actions">
                <span class="badge ${badge}">${escapeAdminDashboardHtml(item.status)}</span>
                <button class="btn btn-secondary" type="button" data-select-tender="${escapeAdminDashboardHtml(item.id)}" data-navigate="tender-details">Review</button>
                <button class="btn btn-primary" type="button" data-admin-compliance-action="approve" data-admin-compliance-ref="${escapeAdminDashboardHtml(item.id)}">Approve</button>
                <button class="btn btn-secondary" type="button" data-admin-compliance-action="flag" data-admin-compliance-ref="${escapeAdminDashboardHtml(item.id)}">Flag Issue</button>
                <button class="btn btn-secondary" type="button" data-admin-compliance-action="hold" data-admin-compliance-ref="${escapeAdminDashboardHtml(item.id)}">Hold</button>
                <button class="btn btn-secondary" type="button" data-admin-compliance-action="return" data-admin-compliance-ref="${escapeAdminDashboardHtml(item.id)}">Return</button>
            </div>
        </article>
    `;
}

function renderAdminMonitoringRow(row = {}) {
    const badge = typeof getAdminSearchStatusBadge === 'function' ? getAdminSearchStatusBadge(row.status) : 'badge-info';
    const action = row.type === 'Evaluation'
        ? `<button class="btn btn-secondary btn-sm" type="button" data-evaluation-select="${escapeAdminDashboardHtml(row.reference)}">View Record</button>`
        : `<button class="btn btn-secondary btn-sm" type="button" data-select-tender="${escapeAdminDashboardHtml(row.reference)}" data-navigate="${escapeAdminDashboardHtml(row.nav || 'admin-search')}">Open</button>`;
    return `
        <article class="admin-monitor-row">
            <div>
                <span class="section-kicker">${escapeAdminDashboardHtml(row.type || 'Record')}</span>
                <h3>${escapeAdminDashboardHtml(row.title || 'Untitled record')}</h3>
                <p>${escapeAdminDashboardHtml(row.reference || '-')} / ${escapeAdminDashboardHtml(row.owner || '-')}</p>
            </div>
            <div>
                <span class="badge ${badge}">${escapeAdminDashboardHtml(row.status || 'Pending')}</span>
                ${action}
            </div>
        </article>
    `;
}

function renderAdminDashboard() {
    const queue = getAdminComplianceQueue();
    const stats = getAdminDashboardStats();
    const evaluationQueue = getAdminEvaluationQueue();
    const exceptionQueue = getAdminExceptionQueue();
    const auditTrail = typeof getProcurexAdminAuditTrail === 'function'
        ? getProcurexAdminAuditTrail()
        : (mockData.platformOps?.auditTrail || []);

    return `
        <div class="main-layout admin-compliance-page">
            ${typeof renderAdminSearchSidebar === 'function' ? renderAdminSearchSidebar('admin-dashboard') : `
                <aside class="sidebar">
                    <div class="sidebar-heading"><h3>Platform Admin</h3><div>System oversight</div></div>
                    <ul class="sidebar-nav">
                        <li><a href="#" data-navigate="admin-dashboard" class="active">Compliance Dashboard</a></li>
                        <li><a href="#" data-navigate="admin-search">Deep Search</a></li>
                        <li><a href="#" data-navigate="records-history">Audit Records</a></li>
                    </ul>
                </aside>
            `}

            <main class="main-content">
                <div class="journey-page">
                    <section class="journey-hero compact">
                        <div>
                            <span class="badge badge-info">System administrator</span>
                            <h1>Admin Command Center</h1>
                            <p>Monitor procurement compliance, search platform records, review audit events, and oversee buyer evaluation workflow without changing buyer scores, percentages, rankings, or award decisions.</p>
                        </div>
                        <div class="hero-action-stack">
                            <button class="btn btn-secondary" type="button" data-navigate="records-history">Audit Records</button>
                            <button class="btn btn-primary" type="button" data-navigate="admin-search">Deep Search</button>
                        </div>
                    </section>

                    <section class="journey-grid four-col">
                        <div class="kpi-card"><div class="kpi-value">${stats.activeTenders}</div><div class="kpi-label">Active tenders</div></div>
                        <div class="kpi-card"><div class="kpi-value">${stats.pendingReviews}</div><div class="kpi-label">Pending reviews</div></div>
                        <div class="kpi-card"><div class="kpi-value">${stats.evaluationDrafts}</div><div class="kpi-label">Buyer evaluation records</div></div>
                        <div class="kpi-card"><div class="kpi-value">${stats.complianceRate}%</div><div class="kpi-label">Compliance</div></div>
                    </section>

                    <section class="journey-panel admin-search-entry-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Deep search</span>
                                <h2>System-wide procurement index</h2>
                                <p>Search tenders, bids, submitted documents, evaluation drafts, users, awards, contracts, and audit events.</p>
                            </div>
                            <button class="btn btn-primary" type="button" data-navigate="admin-search">Open Deep Search</button>
                        </div>
                        <div class="record-summary compact">
                            <div><span>Documents</span><strong>${stats.documents}</strong></div>
                            <div><span>Audit events</span><strong>${stats.auditEvents}</strong></div>
                            <div><span>Flags and risks</span><strong>${stats.flagged}</strong></div>
                            <div><span>Role boundary</span><strong>Oversight only</strong></div>
                        </div>
                    </section>

                    <section class="journey-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Compliance queue</span>
                                <h2>Sorted by urgency</h2>
                            </div>
                            <span class="badge badge-warning">${queue.length} awaiting action</span>
                        </div>
                        <div class="admin-review-list">
                            ${queue.map(renderAdminQueueItem).join('')}
                        </div>
                    </section>

                    <section class="journey-grid two-col">
                        <div class="journey-panel">
                            <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Buyer evaluation oversight</span>
                                <h2>Buyer drafts and review stages</h2>
                            </div>
                            <button class="btn btn-secondary" type="button" data-navigate="bid-evaluation">View Buyer Records</button>
                            </div>
                            <div class="admin-monitor-list">
                                ${evaluationQueue.length ? evaluationQueue.map(renderAdminMonitoringRow).join('') : '<div class="scope-empty">No evaluation drafts are currently saved.</div>'}
                            </div>
                        </div>

                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Exceptions</span>
                                    <h2>Flags, holds, and risks</h2>
                                </div>
                                <button class="btn btn-secondary" type="button" data-navigate="admin-search">Search Exceptions</button>
                            </div>
                            <div class="admin-monitor-list">
                                ${exceptionQueue.length ? exceptionQueue.map(renderAdminMonitoringRow).join('') : '<div class="scope-empty">No platform exceptions are currently flagged.</div>'}
                            </div>
                        </div>
                    </section>

                    <section class="journey-grid two-col">
                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Checklist</span>
                                    <h2>Compliance controls</h2>
                                </div>
                                <span class="badge badge-info">Per procurement</span>
                            </div>
                            <div class="compliance-check-list">
                                <div class="status-section done"><strong>Procurement method matches threshold</strong><span>Method, budget, and approval path are checked before publication.</span></div>
                                <div class="status-section done"><strong>Minimum bidding period observed</strong><span>Publication-to-closing period is tracked against the tender method.</span></div>
                                <div class="status-section attention"><strong>Buyer evaluation criteria are traceable</strong><span>Buyer decisions must reference published criteria and submitted evidence.</span></div>
                                <div class="status-section attention"><strong>Conflict declarations complete</strong><span>Missing declarations are returned before award routing.</span></div>
                            </div>
                        </div>

                        <div class="journey-panel">
                            <div class="panel-heading">
                                <div>
                                    <span class="section-kicker">Audit trail</span>
                                    <h2>Recent admin actions</h2>
                                </div>
                                <button class="btn btn-secondary" type="button" data-navigate="records-history">Open Audit</button>
                            </div>
                            <div class="execution-lane">
                                ${auditTrail.slice(0, 6).map(item => `
                                    <div>
                                        <strong>${escapeAdminDashboardHtml(item.time || '')}</strong>
                                        <span>${escapeAdminDashboardHtml(item.event || item.action || '')} (${escapeAdminDashboardHtml(item.ref || item.entityRef || '')})</span>
                                    </div>
                                `).join('') || '<div><strong>No audit actions yet</strong><span>Admin actions will appear here with timestamps.</span></div>'}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    `;
}

if (window.app) {
    window.app.renderAdminDashboard = renderAdminDashboard;
}
