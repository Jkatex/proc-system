import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '@/features/admin/api';
import { communicationApi } from '@/features/communication/api';
import type { CommunicationListResponse, CommunicationMailboxMessage } from '@/features/communication/types';
import { useBodyPageMetadata } from '@/shared/hooks/useBodyPageMetadata';
import { AdminCommandDrawer, AdminError, AdminHero, AdminPanel, AdminShell, EmptyRow, Pager, badgeClass, displayLabel, formatDate, useAdminCommand } from './AdminShared';

const folders = ['all', 'inbox', 'sent', 'unread', 'archived', 'trash'] as const;

export function AdminCommunicationProcurexPage() {
  const [mailbox, setMailbox] = useState<CommunicationListResponse | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [folder, setFolder] = useState<(typeof folders)[number]>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const { command, openCommand, closeCommand } = useAdminCommand();

  useBodyPageMetadata('admin-communication');

  async function loadMailbox(nextPage = page) {
    setLoading(true);
    setError(null);
    try {
      const response = await communicationApi.listMailbox({
        folder,
        search: search.trim() || undefined,
        page: nextPage,
        pageSize: 12,
        sortBy: 'date',
        sortDirection: 'desc'
      });
      setMailbox(response);
      setPage(nextPage);
      setSelectedId((current) => current || response.messages[0]?.id || '');
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMailbox(1);
  }, [folder]);

  const selected = useMemo(
    () => mailbox?.messages.find((message) => message.id === selectedId) ?? mailbox?.messages[0] ?? null,
    [mailbox, selectedId]
  );

  async function messageAction(message: CommunicationMailboxMessage, action: 'read' | 'unread' | 'archive' | 'unarchive' | 'delete' | 'restore') {
    setLoading(true);
    setError(null);
    try {
      await adminApi.updateCommunicationState(message.id, action);
      await loadMailbox(page);
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }

  function openMessageAction(message: CommunicationMailboxMessage, action: 'read' | 'unread' | 'archive' | 'unarchive' | 'delete' | 'restore') {
    openCommand({
      title: `${displayLabel(action)} message`,
      summary: `${message.subject} will be marked ${displayLabel(action)} and audited.`,
      confirmLabel: displayLabel(action),
      confirmText: action === 'delete' ? 'DELETE' : undefined,
      dangerous: action === 'delete' || action === 'archive',
      run: async () => messageAction(message, action)
    });
  }

  function openReply(message: CommunicationMailboxMessage) {
    openCommand({
      title: `Reply to ${message.subject}`,
      summary: 'The reply will be added to the live communication thread.',
      confirmLabel: 'Send Reply',
      fields: [{ key: 'body', label: 'Reply message', required: true }],
      run: async (_note, fields) => {
        const body = fields.body.trim();
        await communicationApi.replyToMessage(message.id, { body });
        await loadMailbox(page);
      }
    });
  }

  function openCompose() {
    openCommand({
      title: 'Compose message',
      summary: 'Creates a live platform communication message.',
      confirmLabel: 'Send Message',
      fields: [
        { key: 'senderOrgId', label: 'Sender organization UUID', required: true },
        { key: 'recipientOrgId', label: 'Recipient organization UUID', required: true },
        { key: 'subject', label: 'Subject', required: true },
        { key: 'body', label: 'Message', required: true }
      ],
      run: async (_note, fields) => {
        await communicationApi.composeMessage({
          senderOrgId: fields.senderOrgId.trim(),
          recipientOrgId: fields.recipientOrgId.trim(),
          subject: fields.subject.trim(),
          body: fields.body.trim(),
          kind: 'MESSAGE',
          category: 'ADMIN'
        });
        await loadMailbox(1);
      }
    });
  }

  const counts = mailbox?.counts;

  return (
    <AdminShell currentPath="/admin/communication" title="Admin Communication Center">
      <AdminHero
        badge={loading ? 'Loading' : 'Live communication'}
        heading="Admin Communication Center"
        body="Monitor platform messages, clarifications, notices, and action-required communication without entering normal user workspaces."
        actions={
          <>
            <button className="btn btn-secondary" type="button" disabled={loading} onClick={() => void loadMailbox(1)}>
              Refresh
            </button>
            <button className="btn btn-primary" type="button" onClick={() => setFolder('unread')}>
              Unread
            </button>
            <button className="btn btn-secondary" type="button" onClick={openCompose}>
              Compose
            </button>
          </>
        }
      />

      {error ? <AdminError error={error} title="Admin communication could not load" /> : null}

      <section className="admin-kpi-grid four-col">
        <article className="admin-kpi-card">
          <span>Total Messages</span>
          <strong>{counts?.total ?? 0}</strong>
          <em>All visible communication</em>
        </article>
        <article className="admin-kpi-card">
          <span>Unread</span>
          <strong>{counts?.unread ?? 0}</strong>
          <em>Needs review</em>
        </article>
        <article className="admin-kpi-card">
          <span>Action Required</span>
          <strong>{counts?.actionRequired ?? 0}</strong>
          <em>Marked for response</em>
        </article>
        <article className="admin-kpi-card">
          <span>Archived</span>
          <strong>{counts?.archived ?? 0}</strong>
          <em>Closed communication</em>
        </article>
      </section>

      <section className="workspace-shell admin-communication-workspace">
        <aside className="workspace-panel">
          <span className="section-kicker">Folders</span>
          <h2>Admin mailbox</h2>
          <div className="datastore-namespace-list">
            {folders.map((item) => (
              <button className={folder === item ? 'active' : ''} type="button" key={item} onClick={() => setFolder(item)}>
                <strong>{displayLabel(item)}</strong>
                <span>{item === 'unread' ? counts?.unread ?? 0 : item === 'archived' ? counts?.archived ?? 0 : item === 'inbox' ? counts?.inbox ?? 0 : item === 'sent' ? counts?.sent ?? 0 : counts?.total ?? 0} messages</span>
              </button>
            ))}
          </div>
        </aside>

        <AdminPanel kicker="Mailbox" title="Messages" badge={mailbox ? `${mailbox.totalMessages} messages` : 'Loading'}>
          <div className="admin-quick-row">
            <input className="form-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search subject, sender, tender" />
            <button className="btn btn-secondary" type="button" disabled={loading} onClick={() => void loadMailbox(1)}>
              Search
            </button>
          </div>
          <div className="data-table evaluation-table-scroll admin-data-table">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Party</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {(mailbox?.messages ?? []).map((message) => (
                  <tr key={message.id} onClick={() => setSelectedId(message.id)}>
                    <td>
                      <strong>{message.subject}</strong>
                      <em>{message.tenderReference ?? message.category}</em>
                    </td>
                    <td>
                      <span>{message.senderName ?? 'Platform'}</span>
                      <em>to {message.recipientName ?? 'Platform'}</em>
                    </td>
                    <td><span className={badgeClass(message.status)}>{displayLabel(message.status)}</span></td>
                    <td>{displayLabel(message.priority)}</td>
                    <td>{formatDate(message.updatedAt)}</td>
                  </tr>
                ))}
                {!mailbox?.messages.length ? <EmptyRow colSpan={5} label="No communication matches the current filters." /> : null}
              </tbody>
            </table>
          </div>
          {mailbox ? <Pager page={page} total={mailbox.totalMessages} pageSize={mailbox.pageSize} onPage={(nextPage) => void loadMailbox(nextPage)} /> : null}
        </AdminPanel>

        <AdminPanel kicker="Thread" title={selected?.subject ?? 'Message detail'} badge={selected ? displayLabel(selected.kind) : 'No selection'}>
          {selected ? (
            <div className="admin-detail-drawer static">
              <dl className="admin-detail-list">
                <dt>Status</dt>
                <dd>{displayLabel(selected.status)}</dd>
                <dt>Priority</dt>
                <dd>{displayLabel(selected.priority)}</dd>
                <dt>Sender</dt>
                <dd>{selected.senderName ?? 'Platform'}</dd>
                <dt>Recipient</dt>
                <dd>{selected.recipientName ?? 'Platform'}</dd>
                <dt>Tender</dt>
                <dd>{selected.tenderReference ? `${selected.tenderReference} / ${selected.tenderTitle ?? 'Untitled tender'}` : 'Not linked'}</dd>
              </dl>
              <p>{selected.body}</p>
              <div className="admin-table-actions">
                <button className="btn btn-secondary btn-sm" type="button" disabled={loading || selected.read} onClick={() => openMessageAction(selected, 'read')}>
                  Mark Read
                </button>
                <button className="btn btn-secondary btn-sm" type="button" disabled={loading || !selected.read} onClick={() => openMessageAction(selected, 'unread')}>Mark Unread</button>
                {selected.folder === 'archived' ? (
                  <button className="btn btn-secondary btn-sm" type="button" disabled={loading} onClick={() => openMessageAction(selected, 'unarchive')}>Unarchive</button>
                ) : (
                  <button className="btn btn-secondary btn-sm" type="button" disabled={loading} onClick={() => openMessageAction(selected, 'archive')}>Archive</button>
                )}
                {selected.folder === 'trash' ? (
                  <button className="btn btn-secondary btn-sm" type="button" disabled={loading} onClick={() => openMessageAction(selected, 'restore')}>Restore</button>
                ) : (
                  <button className="btn btn-secondary btn-sm" type="button" disabled={loading} onClick={() => openMessageAction(selected, 'delete')}>Trash</button>
                )}
                <button className="btn btn-primary btn-sm" type="button" disabled={loading} onClick={() => openReply(selected)}>Reply</button>
              </div>
              <div className="admin-timeline compact">
                {selected.thread.map((entry) => (
                  <div key={`${entry.createdAt}:${entry.senderName}`}>
                    <strong>{entry.senderName ?? 'Platform'}</strong>
                    <span>{entry.body || entry.notice || 'Thread update'} / {formatDate(entry.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="admin-mini-record"><strong>No message selected</strong><em>Select a mailbox row to inspect the thread.</em></div>
          )}
        </AdminPanel>
      </section>
      <AdminCommandDrawer command={command} onClose={closeCommand} />
    </AdminShell>
  );
}
