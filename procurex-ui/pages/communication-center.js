// Communication Center Page Component

const communicationCenterStorageKey = 'procurex.communicationCenter.v1.items';

function escapeCommunicationHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getCommunicationState() {
    if (!mockData.communicationCenterState) {
        mockData.communicationCenterState = {
            tab: 'Inbox',
            folder: 'Inbox',
            selectedId: null,
            query: '',
            category: 'All categories',
            priority: 'All priorities',
            sort: 'newest',
            composeOpen: false
        };
    }
    return mockData.communicationCenterState;
}

function getCommunicationAudience() {
    if (mockData.currentRole === 'buyer' || mockData.currentRole === 'supplier' || mockData.currentRole === 'admin') {
        return mockData.currentRole;
    }
    const entityType = String(mockData.eKycProfile?.entityType || '').toLowerCase();
    if (entityType === 'company' || entityType === 'business') return 'supplier';
    return 'all';
}

function readCommunicationStoredItems() {
    try {
        const parsed = JSON.parse(localStorage.getItem(communicationCenterStorageKey) || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        localStorage.removeItem(communicationCenterStorageKey);
        return [];
    }
}

function saveCommunicationStoredItems(items = []) {
    localStorage.setItem(communicationCenterStorageKey, JSON.stringify(items));
}

function normalizeCommunicationItem(item = {}) {
    const createdAt = item.createdAt || new Date().toISOString();
    const kind = item.kind || item.type || 'message';
    return {
        id: item.id || `comm-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        kind,
        folder: item.folder || 'inbox',
        category: item.category || (kind === 'alert' ? 'System Alert' : kind === 'notification' ? 'System Notification' : 'General Message'),
        subject: item.subject || item.title || 'Procurement message',
        body: item.body || item.message || '',
        senderType: item.senderType || 'System',
        senderName: item.senderName || item.sender || 'ProcureX System',
        recipientType: item.recipientType || 'User',
        recipientName: item.recipientName || 'Current user',
        tenderId: item.tenderId || '',
        tenderReference: item.tenderReference || item.tenderId || 'Not linked',
        tenderTitle: item.tenderTitle || 'No tender linked',
        priority: item.priority || (kind === 'alert' ? 'High' : 'Normal'),
        status: item.status || 'Unread',
        read: item.read ?? !/unread|pending|action required/i.test(item.status || ''),
        visibility: item.visibility || 'Private',
        actionRequired: Boolean(item.actionRequired),
        actionLabel: item.actionLabel || '',
        actionPage: item.actionPage || '',
        attachments: Array.isArray(item.attachments) ? item.attachments : [],
        thread: Array.isArray(item.thread) ? item.thread : [],
        actions: Array.isArray(item.actions) ? item.actions : [],
        createdAt,
        updatedAt: item.updatedAt || createdAt,
        audience: Array.isArray(item.audience) ? item.audience : ['all']
    };
}

function getCommunicationItems() {
    return [
        ...(mockData.communicationCenter?.items || []),
        ...readCommunicationStoredItems()
    ].map(normalizeCommunicationItem);
}

function addProcurexCommunicationItem(item = {}) {
    const nextItem = normalizeCommunicationItem(item);
    const stored = readCommunicationStoredItems();
    saveCommunicationStoredItems([nextItem, ...stored.filter(existing => existing.id !== nextItem.id)]);
    return nextItem;
}

function patchCommunicationItem(itemId, patch = {}) {
    const seed = mockData.communicationCenter?.items?.find(item => item.id === itemId);
    if (seed) Object.assign(seed, patch, { updatedAt: new Date().toISOString() });

    const stored = readCommunicationStoredItems();
    const nextStored = stored.map(item => item.id === itemId ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item);
    saveCommunicationStoredItems(nextStored);
}

function formatCommunicationDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Recently';
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getCommunicationBadgeClass(value = '') {
    const raw = String(value).toLowerCase();
    if (raw.includes('urgent') || raw.includes('action') || raw.includes('rejected') || raw.includes('returned') || raw.includes('high')) return 'badge-error';
    if (raw.includes('pending') || raw.includes('unread') || raw.includes('normal')) return 'badge-warning';
    if (raw.includes('resolved') || raw.includes('completed') || raw.includes('answered') || raw.includes('read')) return 'badge-success';
    return 'badge-info';
}

function isCommunicationAudienceItem(item, audience) {
    return item.audience?.includes('all') || item.audience?.includes(audience);
}

function filterCommunicationItems(items, state) {
    const query = state.query.trim().toLowerCase();
    return items.filter(item => {
        if (state.tab === 'Clarifications' && item.kind !== 'clarification') return false;
        if (state.tab === 'Notifications' && item.kind !== 'notification') return false;
        if (state.tab === 'Alerts' && item.kind !== 'alert') return false;
        if (state.tab === 'Sent' && item.folder !== 'sent') return false;
        if (state.tab === 'Archived' && item.folder !== 'archived' && item.status !== 'Archived') return false;
        if (state.tab === 'Unread' && item.read) return false;
        if (state.tab === 'Inbox' && (item.folder === 'sent' || item.folder === 'archived' || item.status === 'Deleted')) return false;
        if (state.category !== 'All categories' && item.category !== state.category) return false;
        if (state.priority !== 'All priorities' && item.priority !== state.priority) return false;
        if (!query) return true;
        return [item.senderName, item.subject, item.tenderReference, item.tenderTitle, item.body, item.category]
            .some(value => String(value || '').toLowerCase().includes(query));
    }).sort((first, second) => {
        const firstTime = Date.parse(first.createdAt) || 0;
        const secondTime = Date.parse(second.createdAt) || 0;
        return state.sort === 'oldest' ? firstTime - secondTime : secondTime - firstTime;
    });
}

function renderCommunicationOptions(values = [], selected = '', firstLabel = '') {
    const options = firstLabel ? [`<option>${escapeCommunicationHtml(firstLabel)}</option>`] : [];
    values.forEach(value => options.push(`<option ${value === selected ? 'selected' : ''}>${escapeCommunicationHtml(value)}</option>`));
    return options.join('');
}

function renderCommunicationSidebar(state, counts) {
    const folders = [
        ['Inbox', counts.inbox],
        ['Clarifications', counts.clarifications],
        ['Notifications', counts.notifications],
        ['Alerts', counts.alerts],
        ['Sent', counts.sent],
        ['Drafts', counts.drafts],
        ['Archived', counts.archived],
        ['Trash', counts.trash]
    ];
    return `
        <aside class="communication-folders">
            <div class="communication-folder-title">
                <strong>Communication Center</strong>
                <span>Tender inbox</span>
            </div>
            <div class="communication-folder-list">
                ${folders.map(([folder, count]) => `
                    <button type="button" class="${state.tab === folder ? 'active' : ''}" data-communication-tab="${escapeCommunicationHtml(folder)}">
                        <span>${escapeCommunicationHtml(folder)}</span>
                        <em>${count}</em>
                    </button>
                `).join('')}
            </div>
        </aside>
    `;
}

function renderCommunicationRow(item, selectedId) {
    return `
        <button class="communication-row ${item.read ? '' : 'unread'} ${item.id === selectedId ? 'active' : ''}" type="button" data-communication-select="${escapeCommunicationHtml(item.id)}">
            <span class="communication-unread-dot" aria-hidden="true"></span>
            <div class="communication-row-main">
                <div class="communication-row-top">
                    <strong>${escapeCommunicationHtml(item.senderName)}</strong>
                    <time>${escapeCommunicationHtml(formatCommunicationDate(item.createdAt))}</time>
                </div>
                <h3>${escapeCommunicationHtml(item.subject)}</h3>
                <p>${escapeCommunicationHtml(item.body)}</p>
                <div class="communication-row-meta">
                    <span>Tender: ${escapeCommunicationHtml(item.tenderReference)}</span>
                    <span>${escapeCommunicationHtml(item.category)}</span>
                </div>
            </div>
            <div class="communication-row-badges">
                <span class="badge ${getCommunicationBadgeClass(item.status)}">${escapeCommunicationHtml(item.status)}</span>
                <span class="badge ${getCommunicationBadgeClass(item.priority)}">${escapeCommunicationHtml(item.priority)}</span>
            </div>
        </button>
    `;
}

function renderCommunicationThread(item) {
    const thread = item.thread?.length ? item.thread : [
        { senderType: item.senderType, senderName: item.senderName, body: item.body, createdAt: item.createdAt }
    ];
    return `
        <div class="communication-thread">
            ${thread.map(entry => `
                <article>
                    <div>
                        <strong>${escapeCommunicationHtml(entry.senderName || entry.senderType || 'User')}</strong>
                        <time>${escapeCommunicationHtml(formatCommunicationDate(entry.createdAt || item.createdAt))}</time>
                    </div>
                    <p>${escapeCommunicationHtml(entry.body || '')}</p>
                    ${entry.notice ? `<span class="badge badge-info">${escapeCommunicationHtml(entry.notice)}</span>` : ''}
                </article>
            `).join('')}
        </div>
    `;
}

function renderCommunicationReplyBox(item) {
    if (item.kind !== 'clarification') return '';
    return `
        <form class="communication-reply-box" data-communication-reply="${escapeCommunicationHtml(item.id)}">
            <label>
                <span>Reply visibility</span>
                <select class="form-input" name="visibility">
                    ${renderCommunicationOptions(mockData.communicationCenter?.replyVisibilityOptions || [], 'Publish answer to all bidders for this tender')}
                </select>
            </label>
            <label>
                <span>Response message</span>
                <textarea class="form-input" name="body" rows="4" placeholder="Write the buyer response"></textarea>
            </label>
            <div class="communication-reply-actions">
                <label class="communication-check"><input type="checkbox" name="resolved" checked> Mark as resolved</label>
                <button class="btn btn-secondary" type="button">Attach</button>
                <button class="btn btn-primary" type="submit">Send Response</button>
            </div>
        </form>
    `;
}

function renderCommunicationDetail(item) {
    if (!item) {
        return `
            <aside class="communication-detail empty">
                <strong>Select a message</strong>
                <span>Open an inbox item to view its tender context, thread, attachments, and available actions.</span>
            </aside>
        `;
    }
    return `
        <aside class="communication-detail">
            <header>
                <div>
                    <span class="section-kicker">${escapeCommunicationHtml(item.category)}</span>
                    <h2>${escapeCommunicationHtml(item.subject)}</h2>
                </div>
                <div class="communication-detail-badges">
                    <span class="badge ${getCommunicationBadgeClass(item.status)}">${escapeCommunicationHtml(item.status)}</span>
                    <span class="badge ${getCommunicationBadgeClass(item.priority)}">${escapeCommunicationHtml(item.priority)}</span>
                </div>
            </header>
            <div class="record-summary compact">
                <div><span>Sender</span><strong>${escapeCommunicationHtml(item.senderName)} (${escapeCommunicationHtml(item.senderType)})</strong></div>
                <div><span>Recipient</span><strong>${escapeCommunicationHtml(item.recipientName)} (${escapeCommunicationHtml(item.recipientType)})</strong></div>
                <div><span>Tender reference</span><strong>${escapeCommunicationHtml(item.tenderReference)}</strong></div>
                <div><span>Date</span><strong>${escapeCommunicationHtml(formatCommunicationDate(item.createdAt))}</strong></div>
            </div>
            <section class="communication-message-body">
                <p>${escapeCommunicationHtml(item.body)}</p>
                ${item.attachments.length ? `
                    <div class="communication-attachments">
                        ${item.attachments.map(attachment => `<button type="button">${escapeCommunicationHtml(attachment.name || 'Attachment')}</button>`).join('')}
                    </div>
                ` : ''}
            </section>
            ${renderCommunicationThread(item)}
            ${renderCommunicationReplyBox(item)}
            <section class="communication-context-panel">
                <span class="section-kicker">Tender context</span>
                <strong>${escapeCommunicationHtml(item.tenderTitle)}</strong>
                <div class="record-summary compact">
                    <div><span>Reference</span><strong>${escapeCommunicationHtml(item.tenderReference)}</strong></div>
                    <div><span>Current status</span><strong>${item.kind === 'alert' ? 'Correction required' : 'Workflow active'}</strong></div>
                    <div><span>Visibility</span><strong>${escapeCommunicationHtml(item.visibility)}</strong></div>
                </div>
                <div class="inline-actions">
                    ${item.actionPage ? `<button class="btn btn-primary" type="button" data-navigate="${escapeCommunicationHtml(item.actionPage)}">${escapeCommunicationHtml(item.actionLabel || 'Open')}</button>` : ''}
                    <button class="btn btn-secondary" type="button" data-communication-mark-read="${escapeCommunicationHtml(item.id)}">Mark as Read</button>
                    <button class="btn btn-secondary" type="button" data-communication-archive="${escapeCommunicationHtml(item.id)}">Archive</button>
                </div>
            </section>
        </aside>
    `;
}

function renderCommunicationCompose(state) {
    if (!state.composeOpen) return '';
    const categories = mockData.communicationCenter?.categories || [];
    const senderTypes = mockData.communicationCenter?.senderTypes || [];
    return `
        <form class="communication-compose-panel" data-communication-compose>
            <div class="panel-heading">
                <div><span class="section-kicker">New message</span><h2>Send procurement communication</h2></div>
                <button class="btn btn-secondary" type="button" data-communication-compose-close>Close</button>
            </div>
            <div class="communication-compose-grid">
                <label><span>Sender type</span><select class="form-input" name="senderType">${renderCommunicationOptions(senderTypes, 'Buyer')}</select></label>
                <label><span>Category</span><select class="form-input" name="category">${renderCommunicationOptions(categories, 'General Message')}</select></label>
                <label><span>Recipient</span><input class="form-input" name="recipientName" value="${getCommunicationAudience() === 'supplier' ? 'Ministry of Health' : 'ABC Contractors Ltd'}"></label>
                <label><span>Tender reference</span><input class="form-input" name="tenderReference" value="PX-WRK-2026-001"></label>
                <label class="span-2"><span>Subject</span><input class="form-input" name="subject" placeholder="Subject"></label>
                <label class="span-2"><span>Message</span><textarea class="form-input" name="body" rows="4" placeholder="Write your message"></textarea></label>
            </div>
            <div class="inline-actions">
                <button class="btn btn-secondary" type="button">Attach File</button>
                <button class="btn btn-primary" type="submit">Send Message</button>
            </div>
        </form>
    `;
}

function renderCommunicationCenterInner(root) {
    const state = getCommunicationState();
    const audience = getCommunicationAudience();
    const allItems = getCommunicationItems().filter(item => isCommunicationAudienceItem(item, audience));
    const counts = {
        inbox: allItems.filter(item => item.folder !== 'sent' && item.folder !== 'archived' && item.status !== 'Deleted').length,
        clarifications: allItems.filter(item => item.kind === 'clarification').length,
        notifications: allItems.filter(item => item.kind === 'notification').length,
        alerts: allItems.filter(item => item.kind === 'alert').length,
        sent: allItems.filter(item => item.folder === 'sent').length,
        drafts: 0,
        archived: allItems.filter(item => item.folder === 'archived' || item.status === 'Archived').length,
        trash: allItems.filter(item => item.status === 'Deleted').length
    };
    const filtered = filterCommunicationItems(allItems, state);
    const selected = filtered.find(item => item.id === state.selectedId) || filtered[0] || null;
    if (selected && state.selectedId !== selected.id) state.selectedId = selected.id;
    const unreadCount = allItems.filter(item => !item.read).length;
    const actionCount = allItems.filter(item => item.actionRequired || /pending|action required/i.test(item.status)).length;

    root.innerHTML = `
        <main class="communication-center-page">
            <section class="communication-hero">
                <div>
                    <span class="section-kicker">${escapeCommunicationHtml(audience === 'all' ? 'Unified user' : `${audience} view`)}</span>
                    <h1>Communication Center</h1>
                    <p>Messages, clarifications, tender notifications, alerts, and system updates connected to procurement workflow events.</p>
                </div>
                <div class="communication-summary">
                    <div><strong>${unreadCount}</strong><span>Unread</span></div>
                    <div><strong>${counts.clarifications}</strong><span>Clarifications</span></div>
                    <div><strong>${actionCount}</strong><span>Action required</span></div>
                </div>
            </section>

            ${renderCommunicationCompose(state)}

            <section class="communication-shell">
                ${renderCommunicationSidebar(state, counts)}
                <div class="communication-main">
                    <div class="communication-toolbar">
                        <input class="form-input" data-communication-search value="${escapeCommunicationHtml(state.query)}" placeholder="Search sender, tender, subject">
                        <select class="form-input" data-communication-category>
                            ${renderCommunicationOptions(mockData.communicationCenter?.categories || [], state.category, 'All categories')}
                        </select>
                        <select class="form-input" data-communication-priority>
                            ${renderCommunicationOptions(mockData.communicationCenter?.priorities || [], state.priority, 'All priorities')}
                        </select>
                        <select class="form-input" data-communication-sort>
                            <option value="newest" ${state.sort === 'newest' ? 'selected' : ''}>Newest first</option>
                            <option value="oldest" ${state.sort === 'oldest' ? 'selected' : ''}>Oldest first</option>
                        </select>
                        <button class="btn btn-secondary" type="button" data-communication-mark-visible>Mark as Read</button>
                        <button class="btn btn-secondary" type="button" data-communication-archive-selected>Archive</button>
                        <button class="btn btn-primary" type="button" data-communication-compose-open>New Message</button>
                    </div>
                    <div class="communication-tabs">
                        ${['Inbox', 'Clarifications', 'Notifications', 'Alerts', 'Sent', 'Archived', 'Unread'].map(tab => `
                            <button type="button" class="${state.tab === tab ? 'active' : ''}" data-communication-tab="${tab}">${tab}</button>
                        `).join('')}
                    </div>
                    <div class="communication-list">
                        ${filtered.length ? filtered.map(item => renderCommunicationRow(item, selected?.id)).join('') : '<div class="scope-empty">No communication items match this view.</div>'}
                    </div>
                </div>
                ${renderCommunicationDetail(selected)}
            </section>
        </main>
    `;
}

function renderCommunicationCenter() {
    return '<div class="workspace-home"><div class="workspace-shell" data-communication-center></div></div>';
}

function initializeCommunicationCenter() {
    const root = document.querySelector('[data-communication-center]');
    if (!root || root.dataset.ready === 'true') return;

    const render = () => renderCommunicationCenterInner(root);
    render();

    root.addEventListener('click', (event) => {
        const state = getCommunicationState();
        const selectButton = event.target.closest('[data-communication-select]');
        if (selectButton) {
            state.selectedId = selectButton.dataset.communicationSelect;
            patchCommunicationItem(state.selectedId, { read: true, status: 'Read' });
            render();
            return;
        }

        const tabButton = event.target.closest('[data-communication-tab]');
        if (tabButton) {
            state.tab = tabButton.dataset.communicationTab;
            state.folder = state.tab;
            render();
            return;
        }

        if (event.target.closest('[data-communication-compose-open]')) {
            state.composeOpen = true;
            render();
            return;
        }

        if (event.target.closest('[data-communication-compose-close]')) {
            state.composeOpen = false;
            render();
            return;
        }

        const markReadButton = event.target.closest('[data-communication-mark-read]');
        if (markReadButton) {
            patchCommunicationItem(markReadButton.dataset.communicationMarkRead, { read: true, status: 'Read' });
            render();
            return;
        }

        const archiveButton = event.target.closest('[data-communication-archive]');
        if (archiveButton) {
            patchCommunicationItem(archiveButton.dataset.communicationArchive, { folder: 'archived', status: 'Archived', read: true });
            render();
            return;
        }

        if (event.target.closest('[data-communication-mark-visible]')) {
            filterCommunicationItems(getCommunicationItems(), state).forEach(item => patchCommunicationItem(item.id, { read: true, status: item.status === 'Unread' ? 'Read' : item.status }));
            render();
            return;
        }

        if (event.target.closest('[data-communication-archive-selected]') && state.selectedId) {
            patchCommunicationItem(state.selectedId, { folder: 'archived', status: 'Archived', read: true });
            render();
        }
    });

    root.addEventListener('input', (event) => {
        const state = getCommunicationState();
        if (event.target.matches('[data-communication-search]')) {
            state.query = event.target.value;
            render();
        }
    });

    root.addEventListener('change', (event) => {
        const state = getCommunicationState();
        if (event.target.matches('[data-communication-category]')) state.category = event.target.value;
        if (event.target.matches('[data-communication-priority]')) state.priority = event.target.value;
        if (event.target.matches('[data-communication-sort]')) state.sort = event.target.value;
        render();
    });

    root.addEventListener('submit', (event) => {
        const composeForm = event.target.closest('[data-communication-compose]');
        const replyForm = event.target.closest('[data-communication-reply]');
        if (!composeForm && !replyForm) return;
        event.preventDefault();
        const state = getCommunicationState();

        if (composeForm) {
            const form = new FormData(composeForm);
            const item = addProcurexCommunicationItem({
                kind: 'message',
                folder: 'sent',
                category: form.get('category'),
                subject: form.get('subject') || 'Procurement message',
                body: form.get('body') || '',
                senderType: form.get('senderType'),
                senderName: mockData.users?.buyer?.organization || 'Current user',
                recipientName: form.get('recipientName') || 'Recipient',
                tenderReference: form.get('tenderReference') || 'Not linked',
                tenderTitle: form.get('tenderReference') || 'Tender communication',
                status: 'Read',
                read: true,
                audience: ['all']
            });
            state.composeOpen = false;
            state.tab = 'Sent';
            state.selectedId = item.id;
            render();
            return;
        }

        if (replyForm) {
            const itemId = replyForm.dataset.communicationReply;
            const form = new FormData(replyForm);
            const body = String(form.get('body') || '').trim();
            if (!body) {
                alert('Write a response before sending.');
                return;
            }
            const item = getCommunicationItems().find(entry => entry.id === itemId);
            const visibility = String(form.get('visibility') || 'Reply to this supplier only');
            const thread = [
                ...(item?.thread || []),
                {
                    senderType: 'Buyer',
                    senderName: mockData.users?.buyer?.organization || 'Buyer',
                    body,
                    notice: visibility,
                    createdAt: new Date().toISOString()
                }
            ];
            patchCommunicationItem(itemId, {
                thread,
                status: form.get('resolved') ? (visibility.includes('all bidders') ? 'Published to All Bidders' : 'Resolved') : 'Replied',
                read: true,
                visibility: visibility.includes('all bidders') ? 'Public to all bidders' : 'Private'
            });
            addProcurexCommunicationItem({
                kind: 'notification',
                category: 'Tender Clarification',
                subject: `Re: ${item?.subject || 'Clarification response'}`,
                body,
                senderType: 'Buyer',
                senderName: mockData.users?.buyer?.organization || 'Buyer',
                recipientType: 'Supplier',
                recipientName: item?.senderName || 'Supplier',
                tenderId: item?.tenderId,
                tenderReference: item?.tenderReference,
                tenderTitle: item?.tenderTitle,
                priority: 'Normal',
                status: 'Unread',
                read: false,
                actionLabel: 'View Response',
                actionPage: 'communication-center',
                audience: ['supplier', 'all']
            });
            render();
        }
    });

    root.dataset.ready = 'true';
}

if (window.app) {
    window.app.renderCommunicationCenter = renderCommunicationCenter;
}

window.renderCommunicationCenter = renderCommunicationCenter;
window.initializeCommunicationCenter = initializeCommunicationCenter;
window.addProcurexCommunicationItem = addProcurexCommunicationItem;
