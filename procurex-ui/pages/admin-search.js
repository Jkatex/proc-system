// Admin deep search and oversight workspace.

const procurexAdminAuditStorageKey = 'procurex.adminAuditTrail.v1';

function escapeAdminSearchHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getAdminSearchAllTenders() {
    if (typeof getProcurexAllTenders === 'function') return getProcurexAllTenders();
    return mockData.tenders || [];
}

function getAdminSearchStoredSubmittedBids() {
    const keys = ['procurex.bidWorkspaceSubmitted.v1', 'procurex.supplierSubmittedBids.v1'];
    return keys.flatMap(key => {
        try {
            const parsed = JSON.parse(localStorage.getItem(key) || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    });
}

function getProcurexAdminAuditTrail() {
    let stored = [];
    try {
        stored = JSON.parse(localStorage.getItem(procurexAdminAuditStorageKey) || '[]');
    } catch (error) {
        stored = [];
    }
    const seeded = mockData.platformOps?.auditTrail || [];
    return [...stored, ...seeded].sort((a, b) => Date.parse(b.time || 0) - Date.parse(a.time || 0));
}

function appendProcurexAdminAudit(action = {}) {
    const actor = mockData.session?.email || mockData.pendingAccount?.email || mockData.users?.admin?.name || 'Platform Admin';
    const isAdminActor = mockData.session?.accountType === 'admin' || mockData.pendingAccount?.accountType === 'admin';
    const actorRole = action.actorRole || (isAdminActor ? 'System Admin' : /evaluation/i.test(`${action.entityType || ''} ${action.action || ''}`) ? 'Buyer' : 'User');
    const item = {
        id: action.id || `AUD-${Date.now()}`,
        time: new Date().toISOString(),
        actor,
        actorRole,
        action: action.action || action.event || 'Admin action',
        event: action.event || action.action || 'Admin action',
        entityType: action.entityType || 'Record',
        entityRef: action.entityRef || action.ref || '',
        ref: action.ref || action.entityRef || '',
        summary: action.summary || action.event || action.action || '',
        severity: action.severity || 'info'
    };
    let stored = [];
    try {
        stored = JSON.parse(localStorage.getItem(procurexAdminAuditStorageKey) || '[]');
    } catch (error) {
        stored = [];
    }
    localStorage.setItem(procurexAdminAuditStorageKey, JSON.stringify([item, ...stored].slice(0, 200)));
    return item;
}

function getAdminSearchEvaluationDraftRows() {
    if (typeof getEvaluationDraftTenderRows === 'function') return getEvaluationDraftTenderRows();
    const rows = [];
    for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index) || '';
        if (!key.startsWith('procurex.evaluationDraft.')) continue;
        const reference = key.replace('procurex.evaluationDraft.', '');
        try {
            const draft = JSON.parse(localStorage.getItem(key) || 'null');
            const tender = getAdminSearchAllTenders().find(item => item.reference === reference || item.id === reference) || { reference, title: reference };
            rows.push({ tender, draft, progress: draft?.progress || 0, stageLabel: draft?.status || 'Buyer evaluation draft saved', savedAt: draft?.savedAt || '' });
        } catch (error) {
            // Ignore damaged local draft records.
        }
    }
    return rows;
}

function getAdminSearchStatusBadge(status = '') {
    const text = String(status || 'Pending');
    const raw = text.toLowerCase();
    if (/fail|reject|return|cancel|hold|issue|risk|blocked/.test(raw)) return 'badge-error';
    if (/pending|review|draft|open|evaluation|await|clarification/.test(raw)) return 'badge-warning';
    if (/active|approved|complete|completed|submitted|ready|awarded|cleared/.test(raw)) return 'badge-success';
    return 'badge-info';
}

function getAdminSearchTenderStage(tender = {}) {
    const status = String(tender.status || '').toLowerCase();
    if (/award/.test(status)) return 'Award';
    if (/evaluation|closed/.test(status)) return 'Evaluation';
    if (/open|published/.test(status)) return 'Published';
    if (/draft/.test(status)) return 'Draft';
    return tender.status || 'Tender';
}

function createAdminSearchRow(input = {}) {
    const searchableText = [
        input.type,
        input.title,
        input.reference,
        input.status,
        input.owner,
        input.counterparty,
        input.procurementType,
        input.lifecycleStage,
        input.summary,
        input.metadata && Object.values(input.metadata).join(' ')
    ].filter(Boolean).join(' ').toLowerCase();
    return {
        id: input.id || `${input.type || 'record'}-${input.reference || Math.random()}`,
        type: input.type || 'Record',
        title: input.title || 'Untitled record',
        reference: input.reference || '-',
        status: input.status || 'Pending',
        owner: input.owner || 'Not recorded',
        counterparty: input.counterparty || '',
        amount: Number(input.amount || 0),
        date: input.date || new Date().toISOString(),
        procurementType: input.procurementType || '',
        lifecycleStage: input.lifecycleStage || input.status || '',
        summary: input.summary || '',
        metadata: input.metadata || {},
        nav: input.nav || '',
        action: input.action || '',
        searchableText
    };
}

function buildProcurexAdminSearchRows() {
    const tenders = getAdminSearchAllTenders();
    const tenderRows = tenders.map(tender => createAdminSearchRow({
        id: `tender-${tender.reference || tender.id}`,
        type: 'Tender',
        title: tender.title,
        reference: tender.reference || tender.id,
        status: tender.status || 'Published',
        owner: tender.organization || tender.buyer || 'Buyer',
        amount: tender.budget || tender.estimatedValue || 0,
        date: tender.publishedAt || tender.createdAt || tender.closingDate || new Date().toISOString(),
        procurementType: tender.type || tender.procurementTypeId || tender.category || '',
        lifecycleStage: getAdminSearchTenderStage(tender),
        summary: 'Tender configuration, requirements, publication status, amendments, clarifications, and lifecycle controls.',
        nav: 'tender-details',
        metadata: { closingDate: tender.closingDate || '', method: tender.procurementMethod || tender.method || '' }
    }));

    const bidRows = getAdminSearchStoredSubmittedBids().map((bid, index) => createAdminSearchRow({
        id: `bid-${bid.receiptId || bid.tenderId || index}`,
        type: 'Bid',
        title: bid.title || bid.tenderTitle || bid.draft?.title || 'Submitted bid',
        reference: bid.tenderId || bid.reference || `BID-${index + 1}`,
        status: bid.status || 'Submitted',
        owner: bid.buyer || bid.organization || 'Buyer tender',
        counterparty: bid.supplier || bid.draft?.supplier || bid.draft?.supplierName || mockData.users?.current?.organization || 'Supplier',
        amount: bid.amount || bid.total || bid.draft?.total || 0,
        date: bid.submittedAt || bid.savedAt || bid.draft?.submittedAt || new Date().toISOString(),
        procurementType: bid.procurementType || bid.type || '',
        lifecycleStage: 'Bid submission',
        summary: `Submitted package with ${Object.keys(bid.draft?.uploadedFiles || {}).length} uploaded file(s), receipt data, responses, and financial offer metadata.`,
        nav: 'bidding-workspace',
        metadata: { receipt: bid.receiptId || bid.receiptHash || '', documents: Object.values(bid.draft?.uploadedFiles || {}).map(file => file?.name || file).join(' ') }
    }));

    const documentRows = getAdminSearchStoredSubmittedBids().flatMap((bid, bidIndex) => (
        Object.entries(bid.draft?.uploadedFiles || {}).map(([key, file], fileIndex) => createAdminSearchRow({
            id: `document-${bidIndex}-${fileIndex}`,
            type: 'Document',
            title: file?.name || String(file || key),
            reference: bid.tenderId || bid.reference || `BID-${bidIndex + 1}`,
            status: 'Uploaded',
            owner: bid.supplier || bid.draft?.supplier || bid.draft?.supplierName || 'Supplier',
            counterparty: bid.buyer || '',
            amount: 0,
            date: file?.uploadedAt || bid.submittedAt || new Date().toISOString(),
            procurementType: bid.procurementType || '',
            lifecycleStage: 'Bid evidence',
            summary: `${key} / ${file?.type || 'Document evidence'} / ${file?.sha256 || file?.hash || 'No hash recorded'}`,
            nav: 'records-history',
            metadata: { fileKey: key, fileType: file?.type || '', hash: file?.sha256 || file?.hash || '' }
        }))
    ));

    const evaluationRows = getAdminSearchEvaluationDraftRows().map((item, index) => {
        const tender = item.tender || {};
        const draft = item.draft || {};
        return createAdminSearchRow({
            id: `evaluation-${tender.reference || index}`,
            type: 'Evaluation',
            title: tender.title || 'Evaluation draft',
            reference: tender.reference || tender.id || `EVAL-${index + 1}`,
            status: draft.status || 'Saved as draft',
            owner: tender.organization || 'Buyer',
            counterparty: draft.currentSupplierIndex !== undefined ? `Supplier position ${Number(draft.currentSupplierIndex || 0) + 1}` : '',
            amount: tender.budget || 0,
            date: draft.savedAt || item.savedAt || new Date().toISOString(),
            procurementType: tender.type || '',
            lifecycleStage: item.stageLabel || 'Evaluation',
            summary: `${item.progress || 0}% complete. Current stage: ${item.stageLabel || draft.currentSectionId || 'Evaluation'}.`,
            nav: 'bid-evaluation',
            action: 'evaluation',
            metadata: { progress: item.progress || 0 }
        });
    });

    const awardRows = [
        mockData.bidEvaluation?.recommendation && createAdminSearchRow({
            id: 'award-current-recommendation',
            type: 'Award',
            title: `Award recommendation - ${mockData.bidEvaluation.recommendation.supplier || 'Pending supplier'}`,
            reference: mockData.bidEvaluation.recommendation.reference || 'AWD-PX-2026-001',
            status: mockData.bidEvaluation.recommendation.status || 'Recommended',
            owner: mockData.users?.buyer?.organization || 'Buyer',
            counterparty: mockData.bidEvaluation.recommendation.supplier || '',
            amount: mockData.bidEvaluation.recommendation.amount || 0,
            date: mockData.bidEvaluation.recommendation.date || new Date().toISOString(),
            procurementType: 'Award',
            lifecycleStage: 'Recommendation',
            summary: mockData.bidEvaluation.recommendation.reason || 'Recommended bidder and award basis.',
            nav: 'award-recommendation'
        })
    ].filter(Boolean);

    const accountRows = [
        ...(mockData.mockAuth?.accounts || []),
        ...Object.entries(mockData.users || {}).map(([role, user]) => ({ ...user, role, email: user.email || `${role}@procurex.local` }))
    ].map((account, index) => createAdminSearchRow({
        id: `account-${index}`,
        type: 'User',
        title: account.displayName || account.name || account.organization || account.email || `Account ${index + 1}`,
        reference: account.email || account.phone || `USR-${index + 1}`,
        status: account.ekycCompleted === false ? 'Verification pending' : 'Active',
        owner: account.organization || account.displayName || account.name || 'ProcureX account',
        counterparty: account.role || account.accountType || '',
        amount: 0,
        date: new Date().toISOString(),
        procurementType: account.accountType || account.role || 'user',
        lifecycleStage: 'Account',
        summary: `Role: ${account.role || account.accountType || 'user'} / Permissions: ${(account.permissions || []).join(', ') || 'standard access'}`,
        nav: 'account-profile'
    }));

    const auditRows = getProcurexAdminAuditTrail().map((item, index) => createAdminSearchRow({
        id: item.id || `audit-${index}`,
        type: 'Audit',
        title: item.event || item.action || 'Audit event',
        reference: item.ref || item.entityRef || `AUD-${index + 1}`,
        status: item.severity || 'Recorded',
        owner: item.actor || 'System',
        counterparty: item.actorRole || '',
        amount: 0,
        date: item.time || new Date().toISOString(),
        procurementType: 'Audit',
        lifecycleStage: item.entityType || 'Audit trail',
        summary: item.summary || item.event || item.action || '',
        nav: 'records-history'
    }));

    const contractRows = [{
        id: 'contract-demo-active',
        type: 'Contract',
        title: 'Construction of District Maternal Health Wing',
        reference: 'CTR-PX-2026-001',
        status: 'Active',
        owner: 'Ministry of Health',
        counterparty: 'BuildRight Ltd',
        amount: 6420000000,
        date: '2026-07-02',
        procurementType: 'Works contract',
        lifecycleStage: 'Contract management',
        summary: 'Signed contract, milestones, invoices, performance notes, and post-award tracking.',
        nav: 'post-award-tracking'
    }].map(createAdminSearchRow);

    return [...tenderRows, ...bidRows, ...documentRows, ...evaluationRows, ...awardRows, ...accountRows, ...auditRows, ...contractRows]
        .sort((a, b) => Date.parse(b.date || 0) - Date.parse(a.date || 0));
}

function getAdminSearchStats(rows = buildProcurexAdminSearchRows()) {
    return {
        tenders: rows.filter(row => row.type === 'Tender').length,
        bids: rows.filter(row => row.type === 'Bid').length,
        evaluations: rows.filter(row => row.type === 'Evaluation').length,
        flagged: rows.filter(row => /return|hold|issue|risk|blocked|clarification/i.test(`${row.status} ${row.summary}`)).length,
        documents: rows.filter(row => row.type === 'Document').length,
        audits: rows.filter(row => row.type === 'Audit').length
    };
}

function renderAdminSearchSidebar(active = 'admin-search') {
    return `
        <aside class="sidebar">
            <div class="sidebar-heading">
                <h3>Platform Admin</h3>
                <div>System search and oversight</div>
            </div>
            <ul class="sidebar-nav">
                <li><a href="#" data-navigate="admin-dashboard" class="${active === 'admin-dashboard' ? 'active' : ''}">Compliance Dashboard</a></li>
                <li><a href="#" data-navigate="admin-search" class="${active === 'admin-search' ? 'active' : ''}">Deep Search</a></li>
                <li><a href="#" data-navigate="bid-evaluation">Buyer Evaluation Oversight</a></li>
                <li><a href="#" data-navigate="records-history">Audit Records</a></li>
                <li><a href="#" data-navigate="account-profile">Admin Profile</a></li>
            </ul>
        </aside>
    `;
}

function renderAdminSearchResultRow(row = {}) {
    const action = row.action === 'evaluation'
        ? `<button class="btn btn-secondary btn-sm" type="button" data-evaluation-select="${escapeAdminSearchHtml(row.reference)}">View Buyer Evaluation Record</button>`
        : row.nav
            ? `<button class="btn btn-secondary btn-sm" type="button" data-select-tender="${escapeAdminSearchHtml(row.reference)}" data-navigate="${escapeAdminSearchHtml(row.nav)}">Open</button>`
            : '';
    return `
        <tr data-admin-search-row
            data-type="${escapeAdminSearchHtml(row.type)}"
            data-status="${escapeAdminSearchHtml(row.status)}"
            data-stage="${escapeAdminSearchHtml(row.lifecycleStage)}"
            data-procurement-type="${escapeAdminSearchHtml(row.procurementType)}"
            data-owner="${escapeAdminSearchHtml(row.owner)}"
            data-date="${escapeAdminSearchHtml(row.date)}"
            data-amount="${escapeAdminSearchHtml(row.amount)}"
            data-search="${escapeAdminSearchHtml(row.searchableText)}">
            <td><span class="badge badge-info">${escapeAdminSearchHtml(row.type)}</span></td>
            <td>
                <strong>${escapeAdminSearchHtml(row.title)}</strong>
                <span>${escapeAdminSearchHtml(row.reference)} / ${escapeAdminSearchHtml(row.owner)}</span>
            </td>
            <td><span class="badge ${getAdminSearchStatusBadge(row.status)}">${escapeAdminSearchHtml(row.status)}</span></td>
            <td>${escapeAdminSearchHtml(row.lifecycleStage || '-')}</td>
            <td>${escapeAdminSearchHtml(row.counterparty || row.procurementType || '-')}</td>
            <td>${row.amount ? `TZS ${Number(row.amount || 0).toLocaleString()}` : '-'}</td>
            <td>${escapeAdminSearchHtml(row.summary || '-')}</td>
            <td>${action}</td>
        </tr>
    `;
}

function renderAdminSearch() {
    const rows = buildProcurexAdminSearchRows();
    const stats = getAdminSearchStats(rows);
    const types = [...new Set(rows.map(row => row.type))].sort();
    const statuses = [...new Set(rows.map(row => row.status).filter(Boolean))].sort();
    const stages = [...new Set(rows.map(row => row.lifecycleStage).filter(Boolean))].sort();
    return `
        <div class="main-layout admin-search-page" data-admin-search-root>
            ${renderAdminSearchSidebar('admin-search')}
            <main class="main-content">
                <div class="journey-page">
                    <section class="journey-hero compact">
                        <div>
                            <span class="badge badge-info">System administrator</span>
                            <h1>Admin Deep Search</h1>
                            <p>Search procurement records, bid evidence, buyer evaluation drafts, awards, contracts, users, and audit events from one controlled oversight workspace. Admin reviews compliance and cannot change buyer scoring or selection.</p>
                        </div>
                        <div class="hero-action-stack">
                            <button class="btn btn-secondary" type="button" data-admin-search-export="csv">Export CSV</button>
                            <button class="btn btn-primary" type="button" data-admin-search-export="pdf">Export PDF</button>
                        </div>
                    </section>

                    <section class="journey-grid four-col">
                        <div class="kpi-card"><div class="kpi-value">${stats.tenders}</div><div class="kpi-label">Tenders</div></div>
                        <div class="kpi-card"><div class="kpi-value">${stats.bids}</div><div class="kpi-label">Submitted bids</div></div>
                        <div class="kpi-card"><div class="kpi-value">${stats.evaluations}</div><div class="kpi-label">Buyer evaluation records</div></div>
                        <div class="kpi-card"><div class="kpi-value">${stats.flagged}</div><div class="kpi-label">Flags and risks</div></div>
                    </section>

                    <section class="journey-panel records-filter-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Deep search</span>
                                <h2>Procurement oversight index</h2>
                            </div>
                            <span class="badge badge-info" data-admin-search-count>${rows.length} records</span>
                        </div>
                        <div class="records-filter-grid admin-search-filter-grid">
                            <input class="form-input" type="search" data-admin-search-query placeholder="Search reference, supplier, buyer, file, buyer evaluation note, compliance action">
                            <select class="form-input" data-admin-search-type>
                                <option value="">All record types</option>
                                ${types.map(type => `<option>${escapeAdminSearchHtml(type)}</option>`).join('')}
                            </select>
                            <select class="form-input" data-admin-search-status>
                                <option value="">All statuses</option>
                                ${statuses.map(status => `<option>${escapeAdminSearchHtml(status)}</option>`).join('')}
                            </select>
                            <select class="form-input" data-admin-search-stage>
                                <option value="">All stages</option>
                                ${stages.map(stage => `<option>${escapeAdminSearchHtml(stage)}</option>`).join('')}
                            </select>
                            <input class="form-input" type="date" data-admin-search-from>
                            <input class="form-input" type="date" data-admin-search-to>
                            <input class="form-input" type="number" min="0" step="1000000" data-admin-search-min placeholder="Minimum amount">
                            <input class="form-input" type="number" min="0" step="1000000" data-admin-search-max placeholder="Maximum amount">
                        </div>
                        <div class="admin-search-quick-filters">
                            <button class="btn btn-secondary btn-sm" type="button" data-admin-search-preset="flagged">Flagged</button>
                            <button class="btn btn-secondary btn-sm" type="button" data-admin-search-preset="evaluation">Evaluations</button>
                            <button class="btn btn-secondary btn-sm" type="button" data-admin-search-preset="documents">Documents</button>
                            <button class="btn btn-secondary btn-sm" type="button" data-admin-search-preset="audit">Audit</button>
                            <button class="btn btn-secondary btn-sm" type="button" data-admin-search-preset="clear">Clear</button>
                        </div>
                    </section>

                    <section class="journey-panel">
                        <div class="data-table admin-search-table">
                            <table>
                                <thead>
                                    <tr><th>Type</th><th>Record</th><th>Status</th><th>Stage</th><th>Party</th><th>Amount</th><th>Summary</th><th></th></tr>
                                </thead>
                                <tbody data-admin-search-body>
                                    ${rows.map(renderAdminSearchResultRow).join('')}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    `;
}

function initializeAdminSearch() {
    const root = document.querySelector('[data-admin-search-root]');
    if (!root || root.dataset.ready === 'true') return;
    const rows = Array.from(root.querySelectorAll('[data-admin-search-row]'));
    const count = root.querySelector('[data-admin-search-count]');
    const query = root.querySelector('[data-admin-search-query]');
    const type = root.querySelector('[data-admin-search-type]');
    const status = root.querySelector('[data-admin-search-status]');
    const stage = root.querySelector('[data-admin-search-stage]');
    const from = root.querySelector('[data-admin-search-from]');
    const to = root.querySelector('[data-admin-search-to]');
    const min = root.querySelector('[data-admin-search-min]');
    const max = root.querySelector('[data-admin-search-max]');

    const applyFilters = () => {
        const text = String(query?.value || '').trim().toLowerCase();
        const tokens = text.split(/\s+/).filter(Boolean);
        const fromTime = from?.value ? Date.parse(from.value) : null;
        const toTime = to?.value ? Date.parse(`${to.value}T23:59:59`) : null;
        const minAmount = min?.value ? Number(min.value) : null;
        const maxAmount = max?.value ? Number(max.value) : null;
        let visibleCount = 0;
        rows.forEach(row => {
            const rowTime = Date.parse(row.dataset.date || '');
            const amount = Number(row.dataset.amount || 0);
            const visible = (!tokens.length || tokens.some(token => row.dataset.search.includes(token)))
                && (!type?.value || row.dataset.type === type.value)
                && (!status?.value || row.dataset.status === status.value)
                && (!stage?.value || row.dataset.stage === stage.value)
                && (!fromTime || rowTime >= fromTime)
                && (!toTime || rowTime <= toTime)
                && (minAmount === null || amount >= minAmount)
                && (maxAmount === null || amount <= maxAmount);
            row.hidden = !visible;
            if (visible) visibleCount += 1;
        });
        if (count) count.textContent = `${visibleCount} records`;
    };

    const exportCsv = () => {
        const header = ['Type', 'Record', 'Status', 'Stage', 'Party', 'Amount', 'Summary'];
        const lines = rows.filter(row => !row.hidden).map(row => Array.from(row.children).slice(0, 7)
            .map(cell => `"${cell.textContent.replace(/\s+/g, ' ').trim().replace(/"/g, '""')}"`).join(','));
        const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'procurex-admin-search.csv';
        link.click();
        URL.revokeObjectURL(link.href);
        appendProcurexAdminAudit({ action: 'Exported admin search CSV', entityType: 'Admin Search', summary: `${lines.length} visible records exported` });
    };

    root.addEventListener('input', event => {
        if (event.target.matches('[data-admin-search-query], [data-admin-search-min], [data-admin-search-max]')) applyFilters();
    });
    root.addEventListener('change', event => {
        if (event.target.matches('select, input[type="date"]')) applyFilters();
    });
    root.addEventListener('click', event => {
        const exportButton = event.target.closest('[data-admin-search-export]');
        const presetButton = event.target.closest('[data-admin-search-preset]');
        if (presetButton) {
            const preset = presetButton.dataset.adminSearchPreset || '';
            if (query) query.value = '';
            if (type) type.value = '';
            if (status) status.value = '';
            if (stage) stage.value = '';
            if (preset === 'flagged' && query) query.value = 'flag risk issue return hold clarification';
            if (preset === 'evaluation' && type) type.value = 'Evaluation';
            if (preset === 'documents' && type) type.value = 'Document';
            if (preset === 'audit' && type) type.value = 'Audit';
            applyFilters();
        }
        if (!exportButton) return;
        if (exportButton.dataset.adminSearchExport === 'csv') exportCsv();
        if (exportButton.dataset.adminSearchExport === 'pdf') {
            appendProcurexAdminAudit({ action: 'Exported admin search PDF', entityType: 'Admin Search', summary: 'Printed filtered admin search results' });
            window.print();
        }
    });
    applyFilters();
    root.dataset.ready = 'true';
}

if (typeof document !== 'undefined' && !window.procurexAdminActionListenerReady) {
    window.procurexAdminActionListenerReady = true;
    document.addEventListener('click', event => {
        const actionButton = event.target.closest('[data-admin-compliance-action]');
        if (!actionButton) return;
        const action = actionButton.dataset.adminComplianceAction || 'review';
        const reference = actionButton.dataset.adminComplianceRef || '';
        appendProcurexAdminAudit({
            action: `Compliance ${action}`,
            event: `Compliance ${action}`,
            entityType: 'Compliance Review',
            entityRef: reference,
            ref: reference,
            severity: /return|hold|flag/i.test(action) ? 'warning' : 'info',
            summary: `System administrator selected ${action} for ${reference || 'a procurement record'}.`
        });
        const card = actionButton.closest('.admin-review-card');
        const badge = card?.querySelector('.admin-review-actions .badge');
        if (badge) {
            badge.textContent = action === 'approve' ? 'Approved' : action === 'return' ? 'Returned' : action === 'hold' ? 'On hold' : action === 'flag' ? 'Flagged' : 'Reviewed';
            badge.className = `badge ${/return|hold|flag/i.test(action) ? 'badge-warning' : 'badge-success'}`;
        }
    });
}

window.buildProcurexAdminSearchRows = buildProcurexAdminSearchRows;
window.getAdminSearchStats = getAdminSearchStats;
window.renderAdminSearchSidebar = renderAdminSearchSidebar;
window.getProcurexAdminAuditTrail = getProcurexAdminAuditTrail;
window.appendProcurexAdminAudit = appendProcurexAdminAudit;
window.initializeAdminSearch = initializeAdminSearch;

if (window.app) {
    window.app.renderAdminSearch = renderAdminSearch;
}
