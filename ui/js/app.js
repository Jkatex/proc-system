// ══════════════════════════════════════════
// ProcureIQ — SPA Router & Page Renderers
// ══════════════════════════════════════════

const pages = {};
let currentPage = 'dashboard';

// ── ROUTER ──────────────────────────────────
function navigate(page) {
    currentPage = page;
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.page === page);
    });
    const titles = {
        dashboard: 'Dashboard', tenders: 'Tenders', bids: 'Bids',
        evaluations: 'Evaluations', awards: 'Awards', contracts: 'Contracts',
        invoices: 'Invoices', suppliers: 'Suppliers', disputes: 'Disputes',
        risk: 'Risk & Compliance', intelligence: 'Market Intelligence', audit: 'Audit Trail'
    };
    document.getElementById('bcCurrent').textContent = titles[page] || page;
    const container = document.getElementById('pageContainer');
    container.innerHTML = '';
    container.className = 'page-container fade-in';
    const fn = pages[page];
    if (fn) container.innerHTML = fn();
    else container.innerHTML = `<div class="empty-state"><div class="empty-icon">🚧</div><div class="empty-text">Page coming soon</div></div>`;
    bindPageEvents(page);
}

function bindPageEvents(page) {
    // Tabs
    document.querySelectorAll('.tab').forEach(t => {
        t.addEventListener('click', () => {
            t.closest('.tabs').querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
            t.classList.add('active');
        });
    });
    // Filter pills
    document.querySelectorAll('.filter-pill').forEach(p => {
        p.addEventListener('click', () => {
            p.closest('.filter-bar').querySelectorAll('.filter-pill').forEach(x => x.classList.remove('active'));
            p.classList.add('active');
        });
    });
}

// ── HELPERS ─────────────────────────────────
function statusBadge(s) {
    const map = {
        'Open': 'badge-green', 'Evaluation': 'badge-blue', 'Evaluation ': 'badge-blue',
        'Awarded': 'badge-purple', 'Closed': 'badge-gray', 'Draft': 'badge-amber',
        'Active': 'badge-green', 'Completed': 'badge-teal', 'Pending': 'badge-amber',
        'Under Evaluation': 'badge-blue', 'Ranked #1': 'badge-green', 'Ranked #2': 'badge-blue',
        'Under Review': 'badge-amber', 'Paid': 'badge-teal', 'Approved': 'badge-green',
        'Disputed': 'badge-rose', 'Pending Matching': 'badge-amber',
        'Under Review ': 'badge-amber', 'Escalated': 'badge-rose', 'Resolved': 'badge-teal',
        'Success': 'badge-green', 'Alert': 'badge-rose', 'Blocked': 'badge-rose',
        'Critical': 'badge-rose', 'High': 'badge-amber', 'Medium': 'badge-blue', 'Low': 'badge-green',
    };
    return `<span class="badge ${map[s] || 'badge-gray'}">${s}</span>`;
}

function tierBadge(t) {
    const map = { 'Tier-1': 'badge-green', 'Tier-2': 'badge-blue', 'Open': 'badge-gray' };
    return `<span class="badge ${map[t] || 'badge-gray'}">${t}</span>`;
}

function progressBar(pct, color = 'var(--primary)') {
    return `<div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:${color}"></div></div>`;
}

function sparklineSVG(vals, color) {
    const max = Math.max(...vals), min = Math.min(...vals);
    const norm = v => 35 - ((v - min) / (max - min || 1)) * 30;
    const step = 80 / (vals.length - 1);
    const pts = vals.map((v, i) => `${i * step},${norm(v)}`).join(' ');
    return `<svg viewBox="0 0 80 40" preserveAspectRatio="none">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ── DASHBOARD PAGE ───────────────────────────
pages.dashboard = () => `
<div class="page-header">
  <div><div class="page-title">Dashboard</div><div class="page-subtitle">Procurement intelligence overview — Feb 19, 2026</div></div>
  <div class="page-actions">
    <button class="btn btn-secondary">📊 Export Report</button>
    <button class="btn btn-primary">＋ New Tender</button>
  </div>
</div>

<div class="alert-banner alert-danger">
  <span>🚨</span>
  <span><strong>Collusion Alert:</strong> Bid pricing correlation detected on TND-2026-005 — 3 suppliers flagged. <a href="#" style="color:inherit;text-decoration:underline">Review now →</a></span>
</div>

<!-- KPIs -->
<div class="kpi-grid">
  <div class="kpi-card" style="--kpi-color:var(--primary)">
    <div class="kpi-top">
      <div class="kpi-icon" style="background:var(--primary-glow)">📋</div>
      <span class="kpi-trend trend-up">↑ 12%</span>
    </div>
    <div class="kpi-value">42</div>
    <div class="kpi-label">Active Tenders</div>
    <div class="sparkline">${sparklineSVG([28, 32, 35, 38, 40, 41, 42], 'var(--primary)')}</div>
  </div>
  <div class="kpi-card" style="--kpi-color:var(--accent-teal)">
    <div class="kpi-top">
      <div class="kpi-icon" style="background:rgba(20,184,166,.12)">💼</div>
      <span class="kpi-trend trend-up">↑ 8%</span>
    </div>
    <div class="kpi-value">187</div>
    <div class="kpi-label">Bids Received (MTD)</div>
    <div class="sparkline">${sparklineSVG([120, 145, 155, 160, 172, 180, 187], 'var(--accent-teal)')}</div>
  </div>
  <div class="kpi-card" style="--kpi-color:var(--accent-amber)">
    <div class="kpi-top">
      <div class="kpi-icon" style="background:rgba(245,158,11,.12)">💰</div>
      <span class="kpi-trend trend-up">↑ 5%</span>
    </div>
    <div class="kpi-value">$24.6M</div>
    <div class="kpi-label">Contract Value (Active)</div>
    <div class="sparkline">${sparklineSVG([18, 20, 21, 22, 23, 24, 24.6], 'var(--accent-amber)')}</div>
  </div>
  <div class="kpi-card" style="--kpi-color:var(--accent-green)">
    <div class="kpi-top">
      <div class="kpi-icon" style="background:rgba(34,197,94,.12)">🏢</div>
      <span class="kpi-trend trend-up">↑ 3%</span>
    </div>
    <div class="kpi-value">312</div>
    <div class="kpi-label">Registered Suppliers</div>
    <div class="sparkline">${sparklineSVG([280, 290, 295, 300, 305, 309, 312], 'var(--accent-green)')}</div>
  </div>
  <div class="kpi-card" style="--kpi-color:var(--accent-rose)">
    <div class="kpi-top">
      <div class="kpi-icon" style="background:rgba(244,63,94,.12)">🛡️</div>
      <span class="kpi-trend trend-down">↓ 2</span>
    </div>
    <div class="kpi-value">3</div>
    <div class="kpi-label">Open Risk Alerts</div>
    <div class="sparkline">${sparklineSVG([8, 6, 5, 4, 5, 4, 3], 'var(--accent-rose)')}</div>
  </div>
  <div class="kpi-card" style="--kpi-color:var(--accent-sky)">
    <div class="kpi-top">
      <div class="kpi-icon" style="background:rgba(14,165,233,.12)">⚖️</div>
      <span class="kpi-trend trend-up">92%</span>
    </div>
    <div class="kpi-value">96.4%</div>
    <div class="kpi-label">Compliance Score</div>
    <div class="sparkline">${sparklineSVG([91, 92, 93, 94, 95, 96, 96.4], 'var(--accent-sky)')}</div>
  </div>
</div>

<!-- Main grid -->
<div class="grid-3-1" style="margin-bottom:20px">
  <!-- Tender Activity -->
  <div class="card">
    <div class="card-header">
      <div><div class="card-title">Tender Activity — by Category</div><div class="card-subtitle">Current active tenders</div></div>
      <button class="btn btn-secondary btn-sm">View All</button>
    </div>
    <div class="bar-chart">
      ${[['Construction', 78], ['ICT', 94], ['Healthcare', 62], ['Transport', 55], ['Security', 83], ['Consulting', 48]]
        .map(([l, h]) => `<div class="bar-col"><div class="bar" style="height:${h}px;background:linear-gradient(180deg,var(--primary),var(--accent-teal))" title="${l}: ${h}"></div><div class="bar-lbl">${l}</div></div>`).join('')}
    </div>
  </div>

  <!-- Liquidity Index -->
  <div class="card">
    <div class="card-header"><div class="card-title">Market Liquidity</div></div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${['Construction', 'ICT', 'Healthcare', 'Transport', 'Security'].map((c, i) => {
            const vals = [82, 94, 71, 65, 88]; const cols = ['var(--primary)', 'var(--accent-teal)', 'var(--accent-amber)', 'var(--accent-rose)', 'var(--accent-green)'];
            return `<div><div class="flex justify-between mb-4"><span class="text-sm">${c}</span><span class="text-sm font-bold" style="color:${cols[i]}">${vals[i]}%</span></div>${progressBar(vals[i], cols[i])}</div>`;
        }).join('')}
    </div>
  </div>
</div>

<!-- Recent Tenders + Activity -->
<div class="grid-3-1">
  <div class="card">
    <div class="card-header">
      <div><div class="card-title">Recent Tenders</div></div>
      <button class="btn btn-secondary btn-sm" onclick="navigate('tenders')">View All</button>
    </div>
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr><th>ID</th><th>Title</th><th>Budget</th><th>Status</th><th>Bids</th></tr></thead>
        <tbody>
          ${DATA.tenders.slice(0, 5).map(t => `<tr onclick="navigate('tenders')">
            <td><span class="text-accent text-xs">${t.id}</span></td>
            <td><div class="font-semi" style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.title}</div></td>
            <td>${t.budget}</td>
            <td>${statusBadge(t.status)}</td>
            <td><span class="badge badge-gray">${t.bids}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Timeline -->
  <div class="card">
    <div class="card-header"><div class="card-title">Recent Activity</div></div>
    <div class="timeline">
      ${[
        { t: 'Award Decision Made', sub: 'TND-2026-004 awarded to Securitas Ltd', time: '2h ago', color: 'var(--accent-green)' },
        { t: 'Collusion Alert Raised', sub: '3 suppliers flagged on TND-2026-005', time: '6h ago', color: 'var(--accent-rose)' },
        { t: 'Bid Evaluation Locked', sub: 'TND-2026-002 — 12 bids scored', time: '1d ago', color: 'var(--primary)' },
        { t: 'Contract Signed', sub: 'CON-2025-038 — Digital signature applied', time: '2d ago', color: 'var(--accent-teal)' },
        { t: 'New Tender Published', sub: 'TND-2026-007 — Catering Services', time: '3d ago', color: 'var(--accent-amber)' },
    ].map(e => `<div class="tl-item">
        <div class="tl-dot-wrap"><div class="tl-dot" style="border-color:${e.color}"></div><div class="tl-line"></div></div>
        <div class="tl-body"><div class="tl-title">${e.t}</div><div class="tl-meta">${e.sub} · ${e.time}</div></div>
      </div>`).join('')}
    </div>
  </div>
</div>`;

// ── TENDERS PAGE ─────────────────────────────
pages.tenders = () => `
<div class="page-header">
  <div><div class="page-title">Tenders</div><div class="page-subtitle">${DATA.tenders.length} tenders found</div></div>
  <div class="page-actions">
    <button class="btn btn-secondary">⬇ Export</button>
    <button class="btn btn-primary">＋ Create Tender</button>
  </div>
</div>

<div class="filter-bar">
  <button class="filter-pill active">All (${DATA.tenders.length})</button>
  <button class="filter-pill">Open (4)</button>
  <button class="filter-pill">Evaluation (2)</button>
  <button class="filter-pill">Awarded (1)</button>
  <button class="filter-pill">Draft (1)</button>
  <button class="filter-pill">Closed (1)</button>
  <div style="margin-left:auto;display:flex;gap:8px">
    <div class="topbar-search" style="width:200px"><span class="search-icon">🔍</span><input type="text" placeholder="Search tenders…"></div>
    <select class="form-select" style="width:140px"><option>All Categories</option><option>Construction</option><option>ICT</option><option>Healthcare</option></select>
  </div>
</div>

<div class="card" style="padding:0">
  <div class="table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th>Tender ID</th><th>Title</th><th>Category</th><th>Budget</th>
          <th>Deadline</th><th>Bids</th><th>Trust</th><th>Risk</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${DATA.tenders.map(t => `<tr>
          <td><span class="text-accent text-xs font-semi">${t.id}</span></td>
          <td><div style="font-weight:600;max-width:230px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${t.title}">${t.title}</div><div class="text-xs text-muted">${t.region}</div></td>
          <td><span class="badge badge-gray">${t.category}</span></td>
          <td style="font-weight:600">${t.budget}</td>
          <td class="text-muted text-sm">${t.deadline}</td>
          <td><div class="flex items-center gap-8"><span class="badge badge-purple">${t.bids}</span></div></td>
          <td>${tierBadge(t.trust)}</td>
          <td>${statusBadge(t.risk)}</td>
          <td>${statusBadge(t.status)}</td>
          <td><div class="flex gap-8">
            <button class="btn btn-secondary btn-sm">View</button>
            ${t.status === 'Open' ? '<button class="btn btn-primary btn-sm">Bids</button>' : ''}
          </div></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`;

// ── BIDS PAGE ─────────────────────────────────
pages.bids = () => `
<div class="page-header">
  <div><div class="page-title">Bids</div><div class="page-subtitle">Track and manage all submitted bids</div></div>
  <div class="page-actions">
    <button class="btn btn-secondary">⬇ Export</button>
  </div>
</div>

<div class="filter-bar">
  <button class="filter-pill active">All Bids</button>
  <button class="filter-pill">Under Evaluation</button>
  <button class="filter-pill">Ranked</button>
  <button class="filter-pill">Rejected</button>
</div>

<div class="card" style="padding:0">
  <div class="table-wrapper">
    <table class="data-table">
      <thead>
        <tr><th>Bid ID</th><th>Tender</th><th>Supplier</th><th>Amount</th><th>Tech Score</th><th>Trust Tier</th><th>Risk</th><th>Submitted</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${DATA.bids.map(b => `<tr>
          <td><span class="text-accent text-xs font-semi">${b.id}</span></td>
          <td><span class="text-xs text-muted">${b.tender}</span></td>
          <td style="font-weight:600">${b.supplier}</td>
          <td style="font-weight:700">${b.amount}</td>
          <td>
            <div class="flex items-center gap-8">
              <div class="prog-bar" style="width:70px"><div class="prog-fill" style="width:${b.techScore}%;background:${b.techScore > 85 ? 'var(--accent-green)' : b.techScore > 70 ? 'var(--accent-amber)' : 'var(--accent-rose)'}"></div></div>
              <span class="text-sm font-bold">${b.techScore}</span>
            </div>
          </td>
          <td>${tierBadge(b.trustTier)}</td>
          <td>${statusBadge(b.risk)}</td>
          <td class="text-muted text-sm">${b.submitted}</td>
          <td>${statusBadge(b.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`;

// ── EVALUATIONS PAGE ──────────────────────────
pages.evaluations = () => `
<div class="page-header">
  <div><div class="page-title">Evaluations</div><div class="page-subtitle">Score, compare, and rank bids</div></div>
  <div class="page-actions">
    <button class="btn btn-secondary">📤 Export Evaluation</button>
    <button class="btn btn-primary">🔒 Lock All Scores</button>
  </div>
</div>

<div class="alert-banner alert-warning">
  <span>⏳</span>
  <span><strong>TND-2026-008 (Road Rehabilitation)</strong> evaluation deadline in <strong>48 hours</strong>. 3 of 4 evaluators have submitted scores.</span>
</div>

<div class="tabs">
  <div class="tab active">TND-2026-002 — ICT Equipment</div>
  <div class="tab">TND-2026-008 — Road Rehab</div>
</div>

<div class="grid-3-1" style="margin-bottom:20px">
  <div class="card">
    <div class="card-header">
      <div><div class="card-title">Bid Rankings — TND-2026-002</div><div class="card-subtitle">Technical + Financial weighted scores</div></div>
    </div>
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr><th>Rank</th><th>Supplier</th><th>Technical</th><th>Financial</th><th>Composite</th><th>Status</th></tr></thead>
        <tbody>
          ${[
        { rank: 1, sup: 'TechPoint Solutions', tech: 95, fin: 88, comp: 92.6, status: 'Ranked #1' },
        { rank: 2, sup: 'Digital Frontier Inc', tech: 88, fin: 84, comp: 86.8, status: 'Ranked #2' },
        { rank: 3, sup: 'InfoSys East Africa', tech: 79, fin: 91, comp: 83.5, status: 'Ranked #3' },
        { rank: 4, sup: 'ComputerHub Ltd', tech: 72, fin: 77, comp: 74.0, status: 'Under Evaluation' },
    ].map(r => `<tr>
            <td><span style="font-weight:800;color:${r.rank === 1 ? 'var(--accent-amber)' : r.rank === 2 ? 'var(--text-secondary)' : 'var(--text-muted)'}">#${r.rank}</span></td>
            <td style="font-weight:600">${r.sup}</td>
            <td><div class="flex items-center gap-8"><div class="prog-bar" style="width:60px"><div class="prog-fill" style="width:${r.tech}%;background:var(--primary)"></div></div><span class="text-sm">${r.tech}</span></div></td>
            <td><div class="flex items-center gap-8"><div class="prog-bar" style="width:60px"><div class="prog-fill" style="width:${r.fin}%;background:var(--accent-teal)"></div></div><span class="text-sm">${r.fin}</span></div></td>
            <td><span style="font-weight:800;font-size:15px;color:${r.comp > 90 ? 'var(--accent-green)' : r.comp > 80 ? 'var(--primary-light)' : 'var(--text-secondary)'}">${r.comp}</span></td>
            <td>${statusBadge(r.status)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="card">
    <div class="card-header"><div class="card-title">Scoring Criteria</div></div>
    <div class="score-bars">
      ${[['Technical Expertise', 40, 'var(--primary)'], ['Past Performance', 25, 'var(--accent-teal)'], ['Financial Score', 20, 'var(--accent-amber)'], ['Delivery Capacity', 15, 'var(--accent-sky)']].map(([l, w, c]) => `
        <div class="score-row">
          <div class="score-lbl">${l}</div>
          <div class="score-track"><div class="score-fill" style="width:${w * 2.5}%;background:${c}"></div></div>
          <div class="score-num" style="color:${c}">${w}%</div>
        </div>`).join('')}
    </div>
    <div style="margin-top:20px;border-top:1px solid var(--border);padding-top:16px">
      <div class="card-title mb-8">Evaluator Progress</div>
      ${[['Sarah M.', 'Complete'], ['James K.', 'Complete'], ['Rita O.', 'In Progress'], ['Dr. M. Hassan', 'Pending']].map(([n, s]) => `
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-8"><div class="avatar-sm" style="background:var(--primary-glow);color:var(--primary-light)">${n[0]}</div><span class="text-sm">${n}</span></div>
          ${statusBadge(s === 'Complete' ? 'Active' : s === 'In Progress' ? 'Evaluation' : 'Draft')}
        </div>`).join('')}
    </div>
  </div>
</div>`;

// ── SUPPLIERS PAGE ────────────────────────────
pages.suppliers = () => `
<div class="page-header">
  <div><div class="page-title">Suppliers</div><div class="page-subtitle">${DATA.suppliers.length} registered suppliers</div></div>
  <div class="page-actions">
    <button class="btn btn-secondary">⬇ Export</button>
    <button class="btn btn-primary">＋ Onboard Supplier</button>
  </div>
</div>

<div class="filter-bar">
  <button class="filter-pill active">All Categories</button>
  <button class="filter-pill">Construction</button>
  <button class="filter-pill">ICT</button>
  <button class="filter-pill">Healthcare</button>
  <button class="filter-pill">Transport</button>
  <div style="margin-left:auto">
    <div class="topbar-search" style="width:200px"><span class="search-icon">🔍</span><input type="text" placeholder="Search suppliers…"></div>
  </div>
</div>

<div class="card" style="padding:0">
  <div class="table-wrapper">
    <table class="data-table">
      <thead><tr><th>Supplier</th><th>Category</th><th>Trust Tier</th><th>Trust Score</th><th>Contracts</th><th>Performance</th><th>Region</th><th>Status</th><th>Flags</th><th>Action</th></tr></thead>
      <tbody>
        ${DATA.suppliers.map(s => `<tr>
          <td><div style="font-weight:600">${s.name}</div><div class="text-xs text-muted">${s.id} · Since ${s.since}</div></td>
          <td><span class="badge badge-gray">${s.category}</span></td>
          <td>${tierBadge(s.trustTier)}</td>
          <td>
            <div class="flex items-center gap-8">
              <div class="trust-ring" style="width:40px;height:40px">
                <svg viewBox="0 0 40 40" width="40" height="40">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="var(--bg-elevated)" stroke-width="3"/>
                  <circle cx="20" cy="20" r="16" fill="none" stroke="${s.trustScore > 85 ? 'var(--accent-green)' : s.trustScore > 70 ? 'var(--primary)' : 'var(--accent-amber)'}"
                    stroke-width="3" stroke-dasharray="${(s.trustScore / 100) * 100.5} 100.5" stroke-linecap="round"/>
                </svg>
                <div class="trust-val" style="font-size:10px">${s.trustScore}</div>
              </div>
            </div>
          </td>
          <td><span class="badge badge-purple">${s.contracts}</span></td>
          <td>
            <div class="flex items-center gap-8">
              ${progressBar(s.performance, s.performance > 90 ? 'var(--accent-green)' : s.performance > 75 ? 'var(--primary)' : 'var(--accent-amber)')}
              <span class="text-sm font-bold">${s.performance}%</span>
            </div>
          </td>
          <td class="text-muted text-sm">${s.region}</td>
          <td>${statusBadge(s.status)}</td>
          <td>${s.flags > 0 ? `<span class="badge badge-rose">⚠ ${s.flags}</span>` : '<span class="badge badge-green">✓ Clear</span>'}</td>
          <td><button class="btn btn-secondary btn-sm">View</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`;

// ── CONTRACTS PAGE ────────────────────────────
pages.contracts = () => `
<div class="page-header">
  <div><div class="page-title">Contracts</div><div class="page-subtitle">Active and historical contracts</div></div>
  <div class="page-actions">
    <button class="btn btn-secondary">⬇ Export</button>
  </div>
</div>

<div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
  ${[['Active', '3', 'badge-green'], ['Completed', '1', 'badge-teal'], ['Pending', '1', 'badge-amber'], ['Total Value', '$9.5M', 'badge-purple']].map(([l, v, b]) => `
    <div class="kpi-card">
      <div class="kpi-value" style="font-size:22px">${v}</div>
      <div class="kpi-label">${l}</div>
    </div>`).join('')}
</div>

<div class="card" style="padding:0">
  <div class="table-wrapper">
    <table class="data-table">
      <thead><tr><th>Contract ID</th><th>Title</th><th>Supplier</th><th>Value</th><th>Period</th><th>Progress</th><th>Milestones</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${DATA.contracts.map(c => `<tr>
          <td><span class="text-accent text-xs font-semi">${c.id}</span></td>
          <td style="font-weight:600">${c.title}</td>
          <td class="text-muted text-sm">${c.supplier}</td>
          <td style="font-weight:700">${c.amount}</td>
          <td class="text-xs text-muted">${c.start} → ${c.end}</td>
          <td>
            <div class="flex items-center gap-8" style="min-width:120px">
              ${progressBar(c.progress, c.progress === 100 ? 'var(--accent-green)' : c.progress > 60 ? 'var(--primary)' : 'var(--accent-amber)')}
              <span class="text-sm font-bold">${c.progress}%</span>
            </div>
          </td>
          <td><span class="text-sm">${c.done}/${c.milestones} done</span></td>
          <td>${statusBadge(c.status)}</td>
          <td><button class="btn btn-secondary btn-sm">View</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`;

// ── INVOICES PAGE ─────────────────────────────
pages.invoices = () => `
<div class="page-header">
  <div><div class="page-title">Invoices</div><div class="page-subtitle">Payment tracking and three-way matching</div></div>
  <div class="page-actions">
    <button class="btn btn-secondary">⬇ Export</button>
  </div>
</div>

<div class="alert-banner alert-warning">
  ⚠ <strong>INV-2026-0185</strong> is under dispute. FleetPro Transport Services has raised a billing discrepancy.
</div>

<div class="card" style="padding:0">
  <div class="table-wrapper">
    <table class="data-table">
      <thead><tr><th>Invoice ID</th><th>Supplier</th><th>Contract</th><th>Amount</th><th>Submitted</th><th>Due Date</th><th>3-Way Match</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${DATA.invoices.map(inv => `<tr>
          <td><span class="text-accent text-xs font-semi">${inv.id}</span></td>
          <td style="font-weight:600">${inv.supplier}</td>
          <td class="text-xs text-muted">${inv.contract}</td>
          <td style="font-weight:700">${inv.amount}</td>
          <td class="text-muted text-sm">${inv.submitted}</td>
          <td class="text-muted text-sm">${inv.dueDate}</td>
          <td>${inv.matched ? '<span class="badge badge-green">✓ Matched</span>' : '<span class="badge badge-amber">⏳ Pending</span>'}</td>
          <td>${statusBadge(inv.status)}</td>
          <td><div class="flex gap-8">
            <button class="btn btn-secondary btn-sm">View</button>
            ${inv.status === 'Pending Matching' ? '<button class="btn btn-primary btn-sm">Approve</button>' : ''}
          </div></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`;

// ── RISK PAGE ──────────────────────────────────
pages.risk = () => `
<div class="page-header">
  <div><div class="page-title">Risk & Compliance</div><div class="page-subtitle">Monitoring, alerts, and enforcement</div></div>
  <div class="page-actions">
    <button class="btn btn-secondary">📋 Compliance Report</button>
  </div>
</div>

<div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
  ${[
        ['Collusion Alerts', '1', 'var(--accent-rose)', 'Critical'],
        ['Trust Violations', '2', 'var(--accent-amber)', 'Active'],
        ['Open Reviews', '3', 'var(--primary)', 'Pending'],
        ['Compliance Score', '96.4%', 'var(--accent-green)', ''],
    ].map(([l, v, c, s]) => `<div class="kpi-card" style="--kpi-color:${c}">
    <div class="kpi-icon" style="background:rgba(255,255,255,.05);font-size:22px">${v}</div>
    <div class="kpi-value" style="font-size:20px;color:${c}">${v}</div>
    <div class="kpi-label">${l}</div>
    ${s ? `<div style="margin-top:4px">${statusBadge(s === 'Critical' ? 'Critical' : s === 'Active' ? 'High' : 'Evaluation')}</div>` : ''}
  </div>`).join('')}
</div>

<div class="card">
  <div class="card-header"><div class="card-title">Risk Alerts</div><button class="btn btn-secondary btn-sm">Filter</button></div>
  <div style="display:flex;flex-direction:column;gap:12px">
    ${DATA.riskAlerts.map(r => `
      <div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;display:flex;gap:16px;align-items:flex-start">
        <div style="padding-top:2px">${r.severity === 'Critical' ? '🔴' : r.severity === 'High' ? '🟠' : '🟡'}</div>
        <div style="flex:1">
          <div class="flex items-center gap-8 mb-4">
            <span style="font-weight:700">${r.type}</span>
            ${statusBadge(r.severity)}
            ${statusBadge(r.status)}
          </div>
          <div class="text-sm text-muted mb-4">Tender: <span class="text-accent">${r.tender}</span></div>
          <div class="text-sm">${r.description}</div>
        </div>
        <div class="text-xs text-muted flex-shrink-0">${r.time}</div>
        <button class="btn btn-secondary btn-sm flex-shrink-0">Review</button>
      </div>`).join('')}
  </div>
</div>`;

// ── INTELLIGENCE PAGE ─────────────────────────
pages.intelligence = () => `
<div class="page-header">
  <div><div class="page-title">Market Intelligence</div><div class="page-subtitle">Benchmarks, trends, and procurement insights</div></div>
  <div class="page-actions">
    <button class="btn btn-secondary">📊 Full Report</button>
  </div>
</div>

<div class="kpi-grid" style="margin-bottom:20px">
  ${[['Average Bid Competitiveness', '73%', 'var(--primary)'], ['Price Advantage vs Market', '-3.2%', 'var(--accent-green)'], ['Active Categories', '6', 'var(--accent-teal)'], ['ML Model Accuracy', '91.4%', 'var(--accent-amber)']].map(([l, v, c]) => `
    <div class="kpi-card" style="--kpi-color:${c}"><div class="kpi-value" style="color:${c}">${v}</div><div class="kpi-label">${l}</div></div>`).join('')}
</div>

<div class="grid-2">
  <div class="card">
    <div class="card-header"><div class="card-title">Category Benchmarks</div></div>
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr><th>Category</th><th>Market Median</th><th>Platform Avg</th><th>Delta</th><th>Trend</th></tr></thead>
        <tbody>
          ${DATA.marketIntel.benchmarks.map(b => `<tr>
            <td style="font-weight:600">${b.category}</td>
            <td class="text-muted">${b.marketMedian}</td>
            <td style="font-weight:600">${b.platformAvg}</td>
            <td style="color:${b.delta.startsWith('-') ? 'var(--accent-green)' : 'var(--accent-rose)'};font-weight:700">${b.delta}</td>
            <td>${statusBadge(b.trend === 'Stable' ? 'Active' : b.trend === 'Rising' ? 'High' : 'Low')}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><div class="card-title">Market Liquidity by Category</div></div>
    <div class="bar-chart" style="height:150px">
      ${DATA.marketIntel.categories.map((c, i) => {
    const h = DATA.marketIntel.liquidity[i];
    const cols = ['var(--primary)', 'var(--accent-teal)', 'var(--accent-amber)', 'var(--accent-rose)', 'var(--accent-green)', 'var(--accent-sky)'];
    return `<div class="bar-col"><div class="bar" style="height:${h * 1.3}px;background:${cols[i % cols.length]}" title="${c}: ${h}%"></div><div class="bar-lbl">${c.slice(0, 4)}</div></div>`;
}).join('')}
    </div>
  </div>
</div>`;

// ── AUDIT PAGE ────────────────────────────────
pages.audit = () => `
<div class="page-header">
  <div><div class="page-title">Audit Trail</div><div class="page-subtitle">Immutable system activity log</div></div>
  <div class="page-actions">
    <button class="btn btn-secondary">⬇ Export CSV</button>
    <button class="btn btn-secondary">🔍 Advanced Filter</button>
  </div>
</div>

<div class="filter-bar">
  <button class="filter-pill active">All Events</button>
  <button class="filter-pill">Awards</button>
  <button class="filter-pill">Evaluations</button>
  <button class="filter-pill">Risk Events</button>
  <button class="filter-pill">Auth</button>
  <div style="margin-left:auto">
    <div class="topbar-search" style="width:200px"><span class="search-icon">🔍</span><input type="text" placeholder="Search audit log…"></div>
  </div>
</div>

<div class="card" style="padding:0">
  <div class="table-wrapper">
    <table class="data-table">
      <thead><tr><th>Event ID</th><th>Action</th><th>Actor</th><th>Role</th><th>Resource</th><th>Timestamp</th><th>IP Address</th><th>Result</th></tr></thead>
      <tbody>
        ${DATA.auditLog.map(a => `<tr>
          <td><span class="text-xs font-semi" style="color:var(--text-muted)">${a.id}</span></td>
          <td style="font-weight:600">${a.action}</td>
          <td>
            <div class="flex items-center gap-8">
              <div class="avatar-sm" style="background:var(--primary-glow);color:var(--primary-light)">${a.actor[0]}</div>
              <span>${a.actor}</span>
            </div>
          </td>
          <td><span class="badge badge-gray">${a.role}</span></td>
          <td><span class="text-accent text-xs">${a.resource}</span></td>
          <td class="text-muted text-xs">${a.time}</td>
          <td class="text-xs" style="font-family:monospace;color:var(--text-muted)">${a.ip}</td>
          <td>${statusBadge(a.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-top:1px solid var(--border);color:var(--text-muted);font-size:12px">
    <span>Showing 7 of 5,041 events</span>
    <div class="flex gap-8">
      <button class="btn btn-secondary btn-sm">← Prev</button>
      <button class="btn btn-secondary btn-sm">Next →</button>
    </div>
  </div>
</div>`;

// ── AWARDS PAGE ───────────────────────────────
pages.awards = () => `
<div class="page-header">
  <div><div class="page-title">Awards</div><div class="page-subtitle">Pending and completed award decisions</div></div>
  <div class="page-actions">
    <button class="btn btn-primary">✓ Make Award Decision</button>
  </div>
</div>

<div class="alert-banner alert-info">
  ℹ <strong>3 tenders</strong> are awaiting award decision after completed evaluation.
</div>

<div class="card">
  <div class="card-header"><div class="card-title">Pending Award Decisions</div></div>
  <div style="display:flex;flex-direction:column;gap:14px">
    ${[
        { tender: 'TND-2026-002', title: 'ICT Equipment Supply', winner: 'TechPoint Solutions', score: 92.6, budget: '$380K', status: 'Awaiting Approval' },
        { tender: 'TND-2026-008', title: 'Road Rehabilitation — Northern Corridor', winner: 'Apex Infrastructure Group', score: 88.1, budget: '$8.2M', status: 'Under Review' },
    ].map(a => `
      <div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:18px;display:flex;gap:20px;align-items:center">
        <div style="flex:1">
          <div class="flex items-center gap-8 mb-4">
            <span class="text-accent text-xs font-semi">${a.tender}</span>
            ${statusBadge(a.status === 'Awaiting Approval' ? 'Pending' : 'Under Review')}
          </div>
          <div style="font-weight:700;font-size:15px;margin-bottom:6px">${a.title}</div>
          <div class="text-sm text-muted">Recommended Winner: <strong style="color:var(--text-primary)">${a.winner}</strong> · Composite Score: <strong style="color:var(--accent-green)">${a.score}</strong></div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:20px;font-weight:800">${a.budget}</div>
          <div class="text-xs text-muted">Contract Value</div>
          <div class="flex gap-8" style="margin-top:10px">
            <button class="btn btn-success btn-sm">✓ Award</button>
            <button class="btn btn-secondary btn-sm">Review</button>
          </div>
        </div>
      </div>`).join('')}
  </div>
</div>`;

// ── DISPUTES PAGE ─────────────────────────────
pages.disputes = () => `
<div class="page-header">
  <div><div class="page-title">Disputes</div><div class="page-subtitle">Invoice and award dispute management</div></div>
</div>
<div class="card">
  <div class="card-header"><div class="card-title">Open Disputes</div></div>
  <div style="display:flex;flex-direction:column;gap:12px">
    ${[
        { id: 'DSP-2026-004', type: 'Invoice Dispute', party: 'FleetPro Transport Services', amount: '$35,833', reason: 'Delivered goods qty mismatch (claimed 48, received 42)', status: 'Under Review', raised: 'Feb 10, 2026' },
        { id: 'DSP-2026-003', type: 'Award Standstill Challenge', party: 'NovaBuild Partners', amount: '$2.18M', reason: 'Alleges evaluator conflict of interest — Evaluator 3', status: 'Escalated', raised: 'Feb 08, 2026' },
    ].map(d => `
      <div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-8">
            <span class="text-accent text-xs font-semi">${d.id}</span>
            <span class="badge badge-gray">${d.type}</span>
            ${statusBadge(d.status)}
          </div>
          <span class="text-xs text-muted">${d.raised}</span>
        </div>
        <div style="font-weight:600;margin-bottom:4px">${d.party} · <span style="color:var(--accent-amber)">${d.amount}</span></div>
        <div class="text-sm text-muted mb-8">${d.reason}</div>
        <div class="flex gap-8">
          <button class="btn btn-secondary btn-sm">View Details</button>
          <button class="btn btn-primary btn-sm">Add Evidence</button>
          <button class="btn btn-success btn-sm">Resolve</button>
        </div>
      </div>`).join('')}
  </div>
</div>`;

// ── INIT ─────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.page));
});
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').style.width =
        document.getElementById('sidebar').style.width === '0px' ? 'var(--sidebar-w)' : '0px';
});

navigate('dashboard');
