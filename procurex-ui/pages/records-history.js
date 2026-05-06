// Records & History app for completed, cancelled, awarded, and expired procurement records.

function getRecordsHistoryRows() {
    if (typeof getProcurexTenderHistoryRecords === 'function') {
        return getProcurexTenderHistoryRecords();
    }
    return (mockData.tenders || []).filter(tender => tender.status !== 'Open');
}

function getRecordsStatusBadge(status) {
    if (status === 'Closed by timeline') return 'badge-info';
    if (status === 'Awarded') return 'badge-success';
    if (status === 'Cancelled') return 'badge-error';
    if (status === 'Evaluation') return 'badge-warning';
    return 'badge-info';
}

function renderRecordsHistory() {
    const records = getRecordsHistoryRows();
    const awarded = records.filter(record => record.status === 'Awarded').length;
    const cancelled = records.filter(record => record.status === 'Cancelled').length;
    const closed = records.length - awarded - cancelled;

    return `
        <div class="main-layout">
            <aside class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Records & History</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Past tenders, bids, awards, and cancellations</div>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="records-history" class="active">Records</a></li>
                    <li><a href="#" data-navigate="supplier-marketplace">Marketplace</a></li>
                    <li><a href="#" data-navigate="procurement-dashboard">Procurement Dashboard</a></li>
                    <li><a href="#" data-navigate="workspace-dashboard">User Dashboard</a></li>
                </ul>
            </aside>

            <main class="main-content">
                <div class="journey-page">
                    <section class="journey-hero compact">
                        <div>
                            <span class="badge badge-info">Records app</span>
                            <h1>Records & History</h1>
                            <p>Expired timelines, awarded bids, cancelled tenders, opening reports, amendments, and supplier activity stay archived here for the current user.</p>
                        </div>
                        <div class="hero-action-stack">
                            <button class="btn btn-secondary" data-navigate="supplier-marketplace">Active Marketplace</button>
                            <button class="btn btn-primary" data-navigate="create-tender">Create Tender</button>
                        </div>
                    </section>

                    <section class="journey-grid three-col">
                        <div class="kpi-card"><div class="kpi-value">${records.length}</div><div class="kpi-label">Total records</div></div>
                        <div class="kpi-card"><div class="kpi-value">${awarded}</div><div class="kpi-label">Awarded bids</div></div>
                        <div class="kpi-card"><div class="kpi-value">${closed + cancelled}</div><div class="kpi-label">Closed or cancelled</div></div>
                    </section>

                    <section class="journey-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Archive</span>
                                <h2>Past tender records</h2>
                            </div>
                            <span class="badge badge-info">${records.length} records</span>
                        </div>

                        <div class="data-table">
                            <table>
                                <thead>
                                    <tr><th>Tender</th><th>Status</th><th>Closing date</th><th>Value</th><th>Record contents</th><th></th></tr>
                                </thead>
                                <tbody>
                                    ${records.map(record => {
                                        const recordStatus = record.status === 'Open' ? 'Closed by timeline' : record.status;
                                        return `
                                        <tr>
                                            <td><strong>${record.title}</strong><br><span>${record.id} / ${record.organization}</span></td>
                                            <td><span class="badge ${getRecordsStatusBadge(recordStatus)}">${recordStatus}</span></td>
                                            <td>${record.closingDate}</td>
                                            <td>TZS ${(record.budget || 0).toLocaleString()}</td>
                                            <td>Details, amendments, clarifications, bids, opening report, award/cancel notes</td>
                                            <td><button class="btn btn-secondary" data-select-tender="${record.id}" data-navigate="tender-details">View</button></td>
                                        </tr>
                                    `}).join('') || '<tr><td colspan="6">No records yet. Active tenders move here when the timeline closes or when they are awarded/cancelled.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    `;
}

if (window.app) {
    window.app.renderRecordsHistory = renderRecordsHistory;
}
