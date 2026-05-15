// Main dashboard for the signed-in user. All numbers are scoped to the active account.

function dashboardSeed(value) {
    return String(value || 'procurex-user')
        .split('')
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function formatDashboardMoney(value) {
    if (value >= 1000000000) return `TZS ${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `TZS ${(value / 1000000).toFixed(0)}M`;
    return `TZS ${value.toLocaleString()}`;
}

function getCurrentDashboardUser() {
    const account = mockData.pendingAccount || {};
    const session = mockData.session || {};
    const profile = mockData.eKycProfile || {};
    const registryRecord = profile.registryRecord || {};
    const email = session.email || account.email || 'user@procurex.test';
    const displayName = profile.verifiedName || registryRecord.name || account.displayName || email.split('@')[0] || 'ProcureX User';

    return {
        displayName,
        email,
        phone: account.phone || mockData.registrationDraft?.phone || 'Not captured',
        accountType: account.accountType || (session.isNewUser ? 'new user' : 'existing user'),
        entityType: profile.entityType || 'Individual, company, or business',
        organization: registryRecord.name || account.displayName || displayName,
        iamStatus: profile.status === 'completed' || account.ekycCompleted || session.isNewUser === false ? 'Verified' : 'Pending verification',
        seed: dashboardSeed(email)
    };
}

function getDashboardInitials(name) {
    return String(name || 'ProcureX User')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join('') || 'PU';
}

function getDashboardGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function escapeWorkspaceDashboardHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getWorkspaceDashboardStoredObject(key, fallback = null) {
    try {
        const parsed = JSON.parse(localStorage.getItem(key) || 'null');
        return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (error) {
        return fallback;
    }
}

function formatWorkspaceDashboardDraftDate(value) {
    if (!value) return 'Saved recently';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Saved recently';
    return `Saved ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

function getWorkspaceDashboardSavedTenderDraft() {
    if (typeof getCreateTenderSavedDraft === 'function') return getCreateTenderSavedDraft();
    const draft = getWorkspaceDashboardStoredObject('procurex.createTender.v2.savedDraft', null);
    return draft?.status === 'Saved as draft' ? draft : null;
}

function getWorkspaceDashboardSavedBidDrafts() {
    const prefix = 'procurex.supplierBidDraft.v1.';
    const tenders = typeof getProcurexAllTenders === 'function' ? getProcurexAllTenders() : (mockData.tenders || []);
    const drafts = [];

    for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (!key || !key.startsWith(prefix)) continue;

        const draft = getWorkspaceDashboardStoredObject(key, null);
        if (!draft || !Object.keys(draft).length) continue;

        const tenderId = key.slice(prefix.length);
        const tender = tenders.find(item => item.id === tenderId);
        drafts.push({
            tenderId,
            title: tender?.title || draft.title || 'Supplier bid draft',
            detail: tender ? `${tender.organization || 'Marketplace tender'} / ${tender.type || 'Tender'}` : 'Supplier application',
            savedAt: draft.savedAt,
            nav: 'bidding-workspace'
        });
    }

    return drafts.sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0));
}

function getWorkspaceDashboardDrafts() {
    const savedTenderDraft = getWorkspaceDashboardSavedTenderDraft();
    const drafts = [];

    if (savedTenderDraft) {
        drafts.push({
            type: 'Buyer tender',
            title: savedTenderDraft.title || 'Untitled tender',
            detail: savedTenderDraft.visibility || 'Visibility not set',
            savedAt: savedTenderDraft.savedAt,
            nav: 'create-tender'
        });
    }

    getWorkspaceDashboardSavedBidDrafts().forEach(draft => {
        drafts.push({
            type: 'Supplier bid',
            title: draft.title,
            detail: draft.detail,
            savedAt: draft.savedAt,
            nav: draft.nav,
            tenderId: draft.tenderId
        });
    });

    return drafts;
}

function getDashboardAudience(user) {
    if (mockData.currentRole === 'buyer' || mockData.currentRole === 'supplier') return mockData.currentRole;
    if (user.entityType === 'company' || user.entityType === 'business') return 'supplier';
    return 'all';
}

function isRelevantDashboardItem(item, audience) {
    return item.audience?.includes('all') || item.audience?.includes(audience);
}

function getSignalScore(signal, urgentItems) {
    const signalMap = {
        approvals: 'Pending approvals',
        bids: 'New bids received',
        contracts: 'Contracts awaiting signature',
        payments: 'Payments overdue',
        messages: 'Messages requiring reply',
        opportunities: 'New bids received',
        drafts: 'Pending approvals'
    };
    const linkedItem = urgentItems.find(item => item.type === signalMap[signal]);
    return linkedItem ? linkedItem.urgency + linkedItem.count : 50;
}

function buildUserDashboardModel() {
    const user = getCurrentDashboardUser();
    const audience = getDashboardAudience(user);
    const workspace = mockData.userWorkspace || {};
    const offset = user.seed % 5;
    const baseValue = 420000000 + (offset * 85000000);
    const activeTenders = 2 + offset;
    const closingSoon = user.seed % 2;
    const completionRate = 68 + (user.seed % 22);
    const isSupplierContext = audience === 'supplier' || user.entityType === 'company' || user.entityType === 'business';
    const buyerActiveTenders = typeof getProcurexBuyerActiveTenders === 'function' ? getProcurexBuyerActiveTenders() : [];
    const drafts = getWorkspaceDashboardDrafts();
    const urgentItems = (workspace.urgentItems || [])
        .filter(item => isRelevantDashboardItem(item, audience))
        .map((item, index) => ({
            ...item,
            count: Math.max(0, item.count + ((user.seed + index) % 2)),
            urgency: item.urgency + ((offset + index) % 4)
        }))
        .filter(item => item.count > 0)
        .sort((a, b) => b.urgency - a.urgency);
    const publishedWorkflows = buyerActiveTenders.map((tender, index) => ({
        title: tender.title,
        status: `Active tender - closes ${tender.closingDate}`,
        updatedHours: Math.max(1, index + 1),
        urgency: 96 - index,
        nav: 'tender-details',
        tenderId: tender.id,
        audience: ['buyer', 'all']
    }));
    const workflows = [
        ...publishedWorkflows.filter(item => isRelevantDashboardItem(item, audience)),
        ...(workspace.workflows || []).filter(item => isRelevantDashboardItem(item, audience))
    ]
        .map((item, index) => ({
            ...item,
            urgency: item.urgency + ((offset + index) % 5),
            updatedHours: Math.max(1, item.updatedHours + (user.seed % 2))
        }))
        .sort((a, b) => b.urgency - a.urgency)
        .slice(0, 4);
    const quickActions = (workspace.quickActions || [])
        .filter(item => isRelevantDashboardItem(item, audience))
        .map(item => ({ ...item, score: getSignalScore(item.signal, urgentItems) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
    const appShortcuts = (workspace.appShortcuts || [])
        .filter(item => isRelevantDashboardItem(item, audience))
        .map((item, index) => ({ ...item, usage: item.usage + ((user.seed + index) % 8) }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 4);
    const insights = (workspace.insights || [])
        .filter(item => isRelevantDashboardItem(item, audience))
        .map((item, index) => ({ ...item, urgency: item.urgency + ((offset + index) % 6) }))
        .sort((a, b) => b.urgency - a.urgency)
        .slice(0, 5);
    const supplierPerformance = mockData.postAwardTracking?.supplierPerformance?.overall || (82 + offset);
    const revenue = (baseValue * (2 + (user.seed % 3)));

    return {
        user,
        audience,
        summary: [
            ['Active procurements', activeTenders + buyerActiveTenders.length, 'Buyer and supplier workflows in motion'],
            ['Total spend', formatDashboardMoney((baseValue * activeTenders) + buyerActiveTenders.reduce((sum, tender) => sum + (tender.budget || 0), 0)), 'Procurement value connected to this account'],
            ['Supplier performance', `${supplierPerformance}%`, 'Delivery, quality, and communication health'],
            [isSupplierContext ? 'Revenue pipeline' : 'Drafts', isSupplierContext ? formatDashboardMoney(revenue) : drafts.length, isSupplierContext ? 'Potential supplier revenue from active opportunities' : 'Incomplete tender or bid drafts for this user']
        ],
        drafts,
        urgentItems,
        workflows,
        quickActions,
        appShortcuts,
        insights,
        closingSoon,
        periods: {
            weekly: {
                label: 'Weekly',
                badge: '7 days',
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                activity: [2 + offset, 3 + offset, 1 + offset, 4 + offset, 3 + offset, 1, 2],
                value: [18, 24, 12, 30, 26, 8, 16].map(item => (item + offset * 4) * 1000000),
                completion: completionRate
            },
            monthly: {
                label: 'Monthly',
                badge: '6 months',
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                activity: [3, 4, 5, 4, 6, 5].map(item => item + offset),
                value: [120, 150, 175, 160, 210, 230].map(item => (item + offset * 18) * 1000000),
                completion: completionRate
            },
            yearly: {
                label: 'Yearly',
                badge: '4 years',
                labels: ['2023', '2024', '2025', '2026'],
                activity: [9, 14, 21, 18].map(item => item + offset),
                value: [620, 840, 1180, 960].map(item => (item + offset * 75) * 1000000),
                completion: completionRate
            }
        }
    };
}

function renderWorkspaceDashboard() {
    const iam = typeof getIamCompletionState === 'function' ? getIamCompletionState() : { isComplete: false, statusLabel: 'Registration required', badgeClass: 'badge-warning' };
    const dashboard = buildUserDashboardModel();
    const topUrgency = dashboard.urgentItems[0]?.urgency || 0;
    const userInitials = getDashboardInitials(dashboard.user.displayName);
    const greeting = getDashboardGreeting();

    window.currentWorkspaceDashboard = dashboard;

    return `
        <div class="workspace-home">
            <main class="workspace-shell dashboard-shell">
                <section class="dashboard-hero dashboard-welcome-card">
                    <div class="dashboard-welcome-copy">
                        <span class="section-kicker">User dashboard</span>
                        <h1>${greeting}!<br><strong>${dashboard.user.displayName}</strong></h1>
                        <p>${dashboard.user.email}</p>
                        <div class="dashboard-welcome-actions">
                            <button class="btn btn-primary" type="button" data-navigate="supplier-marketplace">View Marketplace</button>
                           
                        </div>
                    </div>
                    <div class="dashboard-welcome-visual" aria-hidden="true">
                        <div class="dashboard-user-avatar">${userInitials}</div>
                        <div class="dashboard-welcome-profile">
                            <span class="badge ${iam.badgeClass}">${dashboard.user.iamStatus}</span>
                            <strong>${dashboard.user.organization}</strong>
                            <span>${dashboard.user.entityType}</span>
                        </div>
                        <div class="dashboard-welcome-chips">
                            <span>${dashboard.urgentItems.length} urgent</span>
                            <span>${dashboard.workflows.length} workflows</span>
                            <span>${dashboard.appShortcuts.length} apps</span>
                        </div>
                    </div>
                </section>

                <section class="dashboard-command-grid">
                    <div class="dashboard-panel urgent-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Needs attention</span>
                                <h2>Sorted by urgency</h2>
                            </div>
                            <span class="badge ${topUrgency >= 90 ? 'badge-error' : 'badge-warning'}">${dashboard.urgentItems.length} active</span>
                        </div>
                        <div class="urgent-list">
                            ${dashboard.urgentItems.map(item => `
                                <button class="urgent-item" type="button" data-navigate="${item.nav}">
                                    <div>
                                        <strong>${item.type}</strong>
                                        <span>${item.count} ${item.count === 1 ? 'item' : 'items'} &middot; Due: ${item.due}</span>
                                    </div>
                                    <em>${item.urgency}</em>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <aside class="dashboard-panel quick-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Smart quick actions</span>
                                <h2>Adapted to you</h2>
                            </div>
                        </div>
                        <div class="quick-action-grid">
                            ${dashboard.quickActions.map(action => `
                                <button class="smart-action" type="button" data-navigate="${action.nav}">
                                    <strong>${action.title}</strong>
                                    <span>${action.detail}</span>
                                </button>
                            `).join('')}
                        </div>
                    </aside>
                </section>

                <section class="dashboard-panel dashboard-drafts-panel">
                    <div class="panel-heading">
                        <div>
                            <span class="section-kicker">Drafts</span>
                            <h2>Saved work</h2>
                        </div>
                        <span class="badge ${dashboard.drafts.length ? 'badge-warning' : 'badge-info'}">${dashboard.drafts.length} ${dashboard.drafts.length === 1 ? 'draft' : 'drafts'}</span>
                    </div>
                    <div class="draft-list">
                        ${dashboard.drafts.length ? dashboard.drafts.map(draft => `
                            <button class="draft-item" type="button" ${draft.tenderId ? `data-select-tender="${escapeWorkspaceDashboardHtml(draft.tenderId)}"` : ''} data-navigate="${draft.nav}">
                                <div>
                                    <span>${escapeWorkspaceDashboardHtml(draft.type)}</span>
                                    <strong>${escapeWorkspaceDashboardHtml(draft.title)}</strong>
                                    <p>${escapeWorkspaceDashboardHtml(draft.detail)}</p>
                                </div>
                                <em>${formatWorkspaceDashboardDraftDate(draft.savedAt)}</em>
                            </button>
                        `).join('') : `
                            <div class="draft-empty">
                                <strong>No saved drafts yet</strong>
                                <span>Saved tenders and bid applications will appear here.</span>
                                <button class="btn btn-secondary" type="button" data-navigate="create-tender">Create Tender</button>
                            </div>
                        `}
                    </div>
                </section>

                <section class="dashboard-grid-main">
                    <div class="dashboard-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Continue working</span>
                                <h2>Active workflows you touched</h2>
                            </div>
                        </div>
                        <div class="workflow-list">
                            ${dashboard.workflows.map(workflow => `
                                <button class="workflow-item" type="button" ${workflow.tenderId ? `data-select-tender="${workflow.tenderId}"` : ''} data-navigate="${workflow.nav}">
                                    <div>
                                        <strong>${workflow.title}</strong>
                                        <span>${workflow.status}</span>
                                    </div>
                                    <em>${workflow.updatedHours}h ago</em>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <aside class="dashboard-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Personalized apps</span>
                                <h2>Most used first</h2>
                            </div>
                        </div>
                        <div class="app-shortcut-list">
                            ${dashboard.appShortcuts.map(app => `
                                <button class="app-shortcut" type="button" data-navigate="${app.nav}">
                                    <div>
                                        <strong>${app.app}</strong>
                                        <span>${app.detail}</span>
                                    </div>
                                </button>
                            `).join('')}
                        </div>
                    </aside>
                </section>

                <section class="analytics-grid">
                    ${dashboard.summary.map(item => `
                        <article class="analytics-card">
                            <span>${item[0]}</span>
                            <strong>${item[1]}</strong>
                            <p>${item[2]}</p>
                        </article>
                    `).join('')}
                </section>

                <section class="dashboard-grid-main">
                    <div class="dashboard-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Opportunity and insight feed</span>
                                <h2>Live recommendations</h2>
                            </div>
                            <span class="badge badge-info">${dashboard.audience === 'supplier' ? 'Supplier' : dashboard.audience === 'buyer' ? 'Buyer' : 'Mixed'} view</span>
                        </div>
                        <div class="insight-feed">
                            ${dashboard.insights.map(insight => `
                                <button class="insight-item" type="button" data-navigate="${insight.nav}">
                                    <div>
                                        <span>${insight.type}</span>
                                        <strong>${insight.title}</strong>
                                        <p>${insight.detail}</p>
                                    </div>
                                    <em>${insight.urgency}</em>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <aside class="dashboard-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="section-kicker">Current user</span>
                                <h2>Account information</h2>
                            </div>
                        </div>
                        <div class="status-section-list">
                            <div class="status-section ${iam.isComplete ? 'done' : 'attention'}">
                                <strong>IAM</strong>
                                <span>${iam.statusLabel}</span>
                                <button class="btn btn-secondary" data-navigate="verification-status">Review</button>
                            </div>
                            <div class="status-section">
                                <strong>Account type</strong>
                                <span>${dashboard.user.accountType}</span>
                            </div>
                            <div class="status-section">
                                <strong>Organization / entity</strong>
                                <span>${dashboard.user.organization}</span>
                            </div>
                            <div class="status-section ${dashboard.closingSoon ? 'attention' : ''}">
                                <strong>Deadline watch</strong>
                                <span>${dashboard.closingSoon ? 'One user-tracked item closes this week.' : 'No tracked item closes this week.'}</span>
                                <button class="btn btn-secondary" data-navigate="supplier-marketplace">Open</button>
                            </div>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    `;
}

window.getWorkspaceDashboardModel = buildUserDashboardModel;

if (window.app) {
    window.app.renderWorkspaceDashboard = renderWorkspaceDashboard;
}
