import { useEffect, useMemo, useState } from 'react';
import { adminApi, type DataStoreEntry, type DataStoreEntryVersion, type DataStoreNamespace, type DataStoreScope } from '@/features/admin/api';
import { useBodyPageMetadata } from '@/shared/hooks/useBodyPageMetadata';
import { AdminCommandDrawer, AdminError, AdminHero, AdminPanel, AdminShell, EmptyRow, Pager, badgeClass, displayLabel, exportCsv, formatDate, useAdminCommand } from './AdminShared';

type EditorMode = 'code' | 'tree';

const emptyEntry = {
  scope: 'GLOBAL' as DataStoreScope,
  ownerUserId: '',
  namespace: '',
  key: '',
  encrypted: false,
  value: '{\n  \n}'
};

export function AdminDatastoreProcurexPage() {
  const [namespaces, setNamespaces] = useState<DataStoreNamespace[]>([]);
  const [entries, setEntries] = useState<{ items: DataStoreEntry[]; total: number; page: number; pageSize: number }>({ items: [], total: 0, page: 1, pageSize: 12 });
  const [selected, setSelected] = useState<DataStoreEntry | null>(null);
  const [scope, setScope] = useState<DataStoreScope | ''>('');
  const [namespace, setNamespace] = useState('');
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState(emptyEntry);
  const [editorMode, setEditorMode] = useState<EditorMode>('code');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [jsonError, setJsonError] = useState('');
  const [versions, setVersions] = useState<DataStoreEntryVersion[]>([]);
  const { command, openCommand, closeCommand } = useAdminCommand();

  useBodyPageMetadata('admin-datastore');

  async function load(page = entries.page) {
    setLoading(true);
    setError(null);
    try {
      const [namespaceResponse, entryResponse] = await Promise.all([
        adminApi.listDataStoreNamespaces({ scope: scope || undefined, q: query.trim() || undefined }),
        adminApi.listDataStoreEntries({
          scope: scope || undefined,
          namespace: namespace || undefined,
          q: query.trim() || undefined,
          page,
          pageSize: entries.pageSize
        })
      ]);
      setNamespaces(namespaceResponse.items);
      setEntries(entryResponse);
      const nextSelected = entryResponse.items.find((item) => item.id === selected?.id) ?? entryResponse.items[0] ?? null;
      setSelected(nextSelected);
      if (nextSelected) loadIntoEditor(nextSelected);
      if (nextSelected) {
        const versionResponse = await adminApi.listDataStoreEntryVersions(nextSelected.id);
        setVersions(versionResponse.items);
      } else {
        setVersions([]);
      }
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(1);
  }, [scope, namespace]);

  function loadIntoEditor(entry: DataStoreEntry) {
    setJsonError('');
    setEditor({
      scope: entry.scope,
      ownerUserId: entry.ownerUser?.id ?? '',
      namespace: entry.namespace,
      key: entry.key,
      encrypted: entry.encrypted,
      value: JSON.stringify(entry.value, null, 2)
    });
    void adminApi.listDataStoreEntryVersions(entry.id).then((response) => setVersions(response.items)).catch(() => setVersions([]));
  }

  function startNew() {
    setSelected(null);
    setJsonError('');
    setEditor({ ...emptyEntry, scope: scope || 'GLOBAL', namespace });
  }

  function parseEditorValue() {
    try {
      setJsonError('');
      return JSON.parse(editor.value || 'null') as unknown;
    } catch (caught) {
      setJsonError(caught instanceof Error ? caught.message : 'Invalid JSON');
      return undefined;
    }
  }

  async function saveEntry() {
    const value = parseEditorValue();
    if (value === undefined) return;
    setSaving(true);
    setError(null);
    try {
      const saved = selected
        ? await adminApi.updateDataStoreEntry(selected.id, {
            namespace: editor.namespace,
            key: editor.key,
            value,
            encrypted: editor.encrypted
          })
        : await adminApi.createDataStoreEntry({
            scope: editor.scope,
            ownerUserId: editor.scope === 'USER' ? editor.ownerUserId : null,
            namespace: editor.namespace,
            key: editor.key,
            value,
            encrypted: editor.encrypted
          });
      setSelected(saved);
      loadIntoEditor(saved);
      await load(entries.page);
    } catch (caught) {
      setError(caught);
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntry() {
    if (!selected) return;
    openCommand({
      title: `Delete ${selected.namespace}#${selected.key}`,
      summary: 'This soft deletes the key. It remains visible in history and can be restored.',
      confirmLabel: 'Delete Key',
      confirmText: 'DELETE',
      dangerous: true,
      run: async () => {
        const deleted = await adminApi.deleteDataStoreEntry(selected.id);
        setSelected(deleted);
        loadIntoEditor(deleted);
        await load(entries.page);
        return deleted;
      }
    });
  }

  async function restoreEntry() {
    if (!selected) return;
    const restored = await adminApi.restoreDataStoreEntry(selected.id);
    setSelected(restored);
    loadIntoEditor(restored);
    await load(entries.page);
  }

  async function restoreVersion(version: DataStoreEntryVersion) {
    const restored = await adminApi.restoreDataStoreVersion(version.id);
    setSelected(restored);
    loadIntoEditor(restored);
    await load(entries.page);
  }

  async function exportEntries() {
    const response = await adminApi.exportDataStoreEntries({
      scope: scope || undefined,
      namespace: namespace || undefined,
      q: query.trim() || undefined,
      pageSize: 100
    });
    exportCsv('admin-datastore.csv', response.items.map((item) => ({
      scope: item.scope,
      namespace: item.namespace,
      key: item.key,
      encrypted: item.encrypted ? 'true' : 'false',
      updatedAt: item.updatedAt,
      value: JSON.stringify(item.value)
    })));
  }

  async function copyJson() {
    await navigator.clipboard?.writeText(editor.value);
  }

  const selectedJson = useMemo(() => {
    try {
      return JSON.parse(editor.value || 'null');
    } catch {
      return null;
    }
  }, [editor.value]);

  return (
    <AdminShell currentPath="/admin/datastore" title="Admin Data Store">
      <AdminHero
        badge={loading ? 'Loading' : 'DHIS2-style JSON store'}
        heading="Admin Data Store"
        body="Manage global and user-scoped namespaces, keys, and JSON values used by platform modules and configuration workflows."
        actions={
          <>
            <button className="btn btn-secondary" type="button" disabled={loading} onClick={() => void load(1)}>Refresh</button>
            <button className="btn btn-secondary" type="button" onClick={() => void exportEntries()}>Export</button>
            <button className="btn btn-primary" type="button" onClick={startNew}>New Key</button>
          </>
        }
      />

      {error ? <AdminError error={error} title="Data store could not load" /> : null}

      <section className="journey-grid datastore-workspace">
        <AdminPanel kicker="Namespaces" title="Data store namespaces" badge={`${namespaces.length} namespaces`}>
          <div className="admin-quick-row">
            <input className="form-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search namespace#key or #key" />
            <select className="form-input" value={scope} onChange={(event) => setScope(event.target.value as DataStoreScope | '')}>
              <option value="">All scopes</option>
              <option value="GLOBAL">Global</option>
              <option value="USER">User</option>
            </select>
            <button className="btn btn-secondary" type="button" disabled={loading} onClick={() => void load(1)}>Search</button>
          </div>
          <div className="datastore-namespace-list">
            <button className={!namespace ? 'active' : ''} type="button" onClick={() => setNamespace('')}>
              <strong>All namespaces</strong>
              <span>{entries.total} keys</span>
            </button>
            {namespaces.map((item) => (
              <button className={namespace === item.namespace ? 'active' : ''} type="button" key={`${item.scope}:${item.namespace}`} onClick={() => setNamespace(item.namespace)}>
                <strong>{item.namespace}</strong>
                <span>{item.scope} / {item.total} keys / {formatDate(item.updatedAt)}</span>
              </button>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel kicker="Keys" title="Namespace keys" badge={`${entries.total} entries`}>
          <div className="data-table evaluation-table-scroll admin-data-table">
            <table>
              <thead>
                <tr>
                  <th>Namespace</th>
                  <th>Key</th>
                  <th>Scope</th>
                  <th>Updated</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {entries.items.map((item) => (
                  <tr key={item.id} onClick={() => { setSelected(item); loadIntoEditor(item); }}>
                    <td><strong>{item.namespace}</strong><em>{item.ownerUser?.email ?? 'Global'}</em></td>
                    <td>{item.key}</td>
                    <td><span className={badgeClass(item.scope)}>{displayLabel(item.scope)}</span></td>
                    <td>{formatDate(item.updatedAt)}</td>
                    <td><span className={badgeClass(item.deletedAt ? 'DELETED' : 'ACTIVE')}>{item.deletedAt ? 'Deleted' : 'Active'}</span></td>
                  </tr>
                ))}
                {!entries.items.length ? <EmptyRow colSpan={5} label="No data store entries match the current filters." /> : null}
              </tbody>
            </table>
          </div>
          <Pager page={entries.page} total={entries.total} pageSize={entries.pageSize} onPage={(nextPage) => void load(nextPage)} />
        </AdminPanel>

        <AdminPanel kicker="JSON Editor" title={selected ? `${selected.namespace}#${selected.key}` : 'New datastore key'} badge={editorMode}>
          <div className="admin-quick-row">
            <select className="form-input" value={editor.scope} disabled={Boolean(selected)} onChange={(event) => setEditor((current) => ({ ...current, scope: event.target.value as DataStoreScope }))}>
              <option value="GLOBAL">Global</option>
              <option value="USER">User</option>
            </select>
            {editor.scope === 'USER' ? <input className="form-input" value={editor.ownerUserId} disabled={Boolean(selected)} onChange={(event) => setEditor((current) => ({ ...current, ownerUserId: event.target.value }))} placeholder="Owner user UUID" /> : null}
            <input className="form-input" value={editor.namespace} onChange={(event) => setEditor((current) => ({ ...current, namespace: event.target.value }))} placeholder="Namespace" />
            <input className="form-input" value={editor.key} onChange={(event) => setEditor((current) => ({ ...current, key: event.target.value }))} placeholder="Key" />
          </div>
          <div className="admin-quick-row">
            <button className={editorMode === 'code' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'} type="button" onClick={() => setEditorMode('code')}>Code</button>
            <button className={editorMode === 'tree' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'} type="button" onClick={() => setEditorMode('tree')}>Tree</button>
            <label className="admin-inline-check"><input type="checkbox" checked={editor.encrypted} onChange={(event) => setEditor((current) => ({ ...current, encrypted: event.target.checked }))} /> Encrypted</label>
            <button className="btn btn-secondary btn-sm" type="button" onClick={() => void copyJson()}>Copy JSON</button>
          </div>
          {editorMode === 'code' ? (
            <textarea className="form-input datastore-json-editor" value={editor.value} onChange={(event) => setEditor((current) => ({ ...current, value: event.target.value }))} spellCheck={false} />
          ) : (
            <pre className="datastore-tree-view">{renderJsonTree(selectedJson)}</pre>
          )}
          {jsonError ? <div className="badge badge-error">{jsonError}</div> : null}
          {selected?.deletedAt ? <div className="badge badge-warning">Deleted {formatDate(selected.deletedAt)}</div> : null}
          <div className="admin-table-actions">
            <button className="btn btn-primary" type="button" disabled={saving || Boolean(selected?.deletedAt)} onClick={() => void saveEntry()}>{saving ? 'Saving' : selected ? 'Update Key' : 'Create Key'}</button>
            <button className="btn btn-secondary" type="button" onClick={startNew}>Clear</button>
            {selected?.deletedAt ? (
              <button className="btn btn-secondary" type="button" disabled={!selected || saving} onClick={() => void restoreEntry()}>Restore</button>
            ) : (
              <button className="btn btn-secondary" type="button" disabled={!selected || saving} onClick={() => void deleteEntry()}>Delete</button>
            )}
          </div>
        </AdminPanel>

        <AdminPanel kicker="History" title="Version history" badge={`${versions.length} versions`}>
          <div className="admin-mini-list">
            {versions.map((version) => (
              <article className="admin-mini-record" key={version.id}>
                <div>
                  <strong>{displayLabel(version.action)}</strong>
                  <em>{version.actorUser?.displayName ?? 'System'} / {formatDate(version.createdAt)}</em>
                </div>
                <button className="btn btn-secondary btn-sm" type="button" onClick={() => void restoreVersion(version)}>
                  Restore
                </button>
              </article>
            ))}
            {!versions.length ? <article className="admin-mini-record"><strong>No versions yet</strong><em>Changes will appear after create, update, delete, or restore.</em></article> : null}
          </div>
        </AdminPanel>
      </section>
      <AdminCommandDrawer command={command} onClose={closeCommand} />
    </AdminShell>
  );
}

function renderJsonTree(value: unknown, depth = 0): string {
  const indent = '  '.repeat(depth);
  if (Array.isArray(value)) {
    return value.map((item, index) => `${indent}[${index}]\n${renderJsonTree(item, depth + 1)}`).join('\n') || `${indent}[]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    return entries.map(([key, item]) => `${indent}${key}: ${typeof item === 'object' && item !== null ? `\n${renderJsonTree(item, depth + 1)}` : JSON.stringify(item)}`).join('\n') || `${indent}{}`;
  }
  return `${indent}${JSON.stringify(value)}`;
}
