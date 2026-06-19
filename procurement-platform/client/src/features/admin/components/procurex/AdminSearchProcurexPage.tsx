import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, type PageDto, type SearchResult } from '@/features/admin/api';
import { useBodyPageMetadata } from '@/shared/hooks/useBodyPageMetadata';
import { AdminError, AdminHero, AdminPanel, AdminShell, EmptyRow, Pager, badgeClass, compactNumber, displayLabel, exportCsv, formatDate, printAdminPage } from './AdminShared';

const searchTypes = [
  ['', 'All records'],
  ['users', 'Users'],
  ['organizations', 'Organizations'],
  ['tenders', 'Tenders'],
  ['bids', 'Bids'],
  ['contracts', 'Contracts'],
  ['documents', 'Documents'],
  ['evaluations', 'Evaluations'],
  ['awards', 'Awards'],
  ['compliance', 'Compliance'],
  ['audit-events', 'Audit events'],
  ['records', 'Records']
] as const;

export function AdminSearchProcurexPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [stage, setStage] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<PageDto<SearchResult> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useBodyPageMetadata('admin-search');

  async function runSearch(nextPage = page) {
    setLoading(true);
    setError(null);
    try {
      setResults(
        await adminApi.search({
          q: query,
          type: type || undefined,
          status: status || undefined,
          stage: stage || undefined,
          from: from || undefined,
          to: to || undefined,
          minAmount: minAmount ? Number(minAmount) : undefined,
          maxAmount: maxAmount ? Number(maxAmount) : undefined,
          flaggedOnly,
          page: nextPage,
          pageSize: 20
        })
      );
      setPage(nextPage);
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void runSearch(1);
  }, []);

  const typeCounts = (results?.items ?? []).reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {});

  async function applyQuickFilter(nextType: string, nextFlagged = false) {
    setType(nextType);
    setFlaggedOnly(nextFlagged);
    setLoading(true);
    setError(null);
    try {
      setResults(await adminApi.search({ q: query, type: nextType || undefined, flaggedOnly: nextFlagged, page: 1, pageSize: 20 }));
      setPage(1);
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }

  async function clearFilters() {
    setQuery('');
    setType('');
    setStatus('');
    setStage('');
    setFrom('');
    setTo('');
    setMinAmount('');
    setMaxAmount('');
    setFlaggedOnly(false);
    setLoading(true);
    setError(null);
    try {
      setResults(await adminApi.search({ page: 1, pageSize: 20 }));
      setPage(1);
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }

  function exportResults() {
    exportCsv(
      'admin-search-results.csv',
      (results?.items ?? []).map((item) => ({
        type: displayLabel(item.type),
        record: item.title,
        reference: item.subtitle,
        status: item.status ? displayLabel(item.status) : '',
        stage: item.stage ? displayLabel(item.stage) : '',
        party: item.party ?? '',
        amount: item.amount ?? '',
        summary: item.summary ?? ''
      }))
    );
    void adminApi.recordAction({ actionType: 'EXPORT', entityType: 'admin_search', summary: `Exported ${results?.items.length ?? 0} search results.` });
  }

  return (
    <AdminShell currentPath="/admin/search" title="Admin Deep Search">
      <AdminHero
        badge={loading ? 'Searching' : `${results?.total ?? 0} results`}
        heading="Deep Search"
        body="Search platform users, organizations, procurement records, audit evidence, and archive entries from one admin workspace."
        actions={
          <>
            <button className="btn btn-secondary" type="button" disabled={loading || !results?.items.length} onClick={exportResults}>
              Export CSV
            </button>
            <button className="btn btn-secondary" type="button" onClick={printAdminPage}>
              Print PDF
            </button>
            <button className="btn btn-primary" type="button" disabled={loading} onClick={() => void runSearch(1)}>
              Search
            </button>
          </>
        }
      />

      {error ? <AdminError error={error} title="Search could not load" /> : null}

      <section className="admin-kpi-grid six-col">
        {[
          ['Tenders', typeCounts.tender],
          ['Bids', typeCounts.bid],
          ['Evaluations', typeCounts.evaluation],
          ['Flags', (results?.items ?? []).filter((item) => ['WARNING', 'ERROR', 'CRITICAL', 'ESCALATED'].includes(item.status ?? item.stage ?? '')).length],
          ['Documents', typeCounts.document],
          ['Audits', typeCounts['audit-event']]
        ].map(([label, value]) => (
          <article className="admin-kpi-card" key={label}>
            <span>{label}</span>
            <strong>{compactNumber(Number(value ?? 0))}</strong>
            <em>Current filtered page</em>
          </article>
        ))}
      </section>

      <AdminPanel kicker="Filters" title="Search criteria" badge={loading ? 'Loading' : 'Ready'}>
        <div className="admin-filter-bar">
          <input className="form-input" type="search" placeholder="Search records" value={query} onChange={(event) => setQuery(event.target.value)} />
          <select className="form-input" value={type} onChange={(event) => setType(event.target.value)}>
            {searchTypes.map(([value, label]) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input className="form-input" placeholder="Status" value={status} onChange={(event) => setStatus(event.target.value.toUpperCase())} />
          <input className="form-input" placeholder="Stage or method" value={stage} onChange={(event) => setStage(event.target.value.toUpperCase())} />
          <input className="form-input" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          <input className="form-input" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          <input className="form-input" type="number" min="0" placeholder="Min amount" value={minAmount} onChange={(event) => setMinAmount(event.target.value)} />
          <input className="form-input" type="number" min="0" placeholder="Max amount" value={maxAmount} onChange={(event) => setMaxAmount(event.target.value)} />
          <label className="admin-inline-toggle">
            <input type="checkbox" checked={flaggedOnly} onChange={(event) => setFlaggedOnly(event.target.checked)} />
            <span>Flagged</span>
          </label>
          <button className="btn btn-secondary" type="button" disabled={loading} onClick={() => void runSearch(1)}>
            Apply
          </button>
        </div>
        <div className="admin-quick-row">
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => void applyQuickFilter('', true)}>Flagged</button>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => void applyQuickFilter('evaluations')}>Evaluations</button>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => void applyQuickFilter('documents')}>Documents</button>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => void applyQuickFilter('audit-events')}>Audit</button>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => void clearFilters()}>Clear</button>
        </div>
      </AdminPanel>

      <AdminPanel kicker="Results" title="Platform records" badge={`${results?.items.length ?? 0} visible`}>
        <div className="data-table evaluation-table-scroll admin-data-table admin-search-table">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Record</th>
                <th>Status</th>
                <th>Stage</th>
                <th>Party</th>
                <th>Amount</th>
                <th>Summary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(results?.items ?? []).map((item) => (
                <tr key={`${item.type}:${item.id}`}>
                  <td><span className="badge badge-info">{displayLabel(item.type)}</span></td>
                  <td><strong>{item.title}</strong><em>{item.subtitle}</em></td>
                  <td>{item.status ? <span className={badgeClass(item.status)}>{displayLabel(item.status)}</span> : 'Not set'}</td>
                  <td>{item.stage ? displayLabel(item.stage) : formatDate(item.updatedAt ?? item.createdAt)}</td>
                  <td>{item.party ?? 'Platform'}</td>
                  <td>{item.amount ?? 'Not set'}</td>
                  <td>{item.summary ?? 'No summary'}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" type="button" disabled={!item.routeHint} onClick={() => item.routeHint && navigate(item.routeHint)}>
                      Open
                    </button>
                  </td>
                </tr>
              ))}
              {!results?.items.length ? <EmptyRow colSpan={8} label={loading ? 'Loading records.' : 'No matching records.'} /> : null}
            </tbody>
          </table>
        </div>
        <Pager page={page} total={results?.total ?? 0} pageSize={results?.pageSize ?? 20} onPage={(next) => void runSearch(next)} />
      </AdminPanel>
    </AdminShell>
  );
}
