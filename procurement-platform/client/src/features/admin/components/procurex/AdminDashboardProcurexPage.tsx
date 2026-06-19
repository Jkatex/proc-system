import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, type AdminApp, type AdminDashboard } from '@/features/admin/api';
import { useBodyPageMetadata } from '@/shared/hooks/useBodyPageMetadata';
import { AdminCommandDrawer, AdminError, AdminHero, AdminPanel, AdminShell, AdminUndoBanner, adminAppRegistry, badgeClass, compactNumber, displayLabel, formatDate, useAdminCommand } from './AdminShared';

export function AdminDashboardProcurexPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [apps, setApps] = useState<AdminApp[]>(adminAppRegistry);
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState('');
  const [error, setError] = useState<unknown>(null);
  const { command, openCommand, closeCommand, undoAction, setUndoAction } = useAdminCommand();

  useBodyPageMetadata('admin-dashboard');

  async function loadDashboard() {
    setLoading(true);
    setError(null);
    try {
      const [dashboardResponse, appsResponse] = await Promise.all([adminApi.dashboard(), adminApi.apps()]);
      setDashboard(dashboardResponse);
      setApps(appsResponse.items);
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  const counts = dashboard?.counts ?? {};
  const riskEntries = Object.entries(dashboard?.riskSummary ?? {});
  const appList = apps.length ? apps : adminAppRegistry;

  async function recordQueueAction(actionType: string, item: NonNullable<AdminDashboard['adminActionQueue']>[number], note: string) {
    setSavingAction(`${actionType}:${item.id}`);
    setError(null);
    try {
      const action = await adminApi.recordAction({
        ownerOrgId: item.ownerOrgId,
        actionType,
        entityType: item.entityType,
        entityRef: item.entityRef,
        summary: note || `${displayLabel(actionType)}: ${item.title}`
      });
      await loadDashboard();
      return action;
    } catch (caught) {
      setError(caught);
      throw caught;
    } finally {
      setSavingAction('');
    }
  }

  function openQueueAction(actionType: string, item: NonNullable<AdminDashboard['adminActionQueue']>[number]) {
    openCommand({
      title: `${displayLabel(actionType)} ${item.title}`,
      summary: `${displayLabel(actionType)} updates the target record and writes an audit entry.`,
      confirmLabel: displayLabel(actionType),
      dangerous: actionType === 'HOLD' || actionType === 'FLAG',
      run: (note) => recordQueueAction(actionType, item, note)
    });
  }

  return (
    <AdminShell currentPath="/admin" title="Admin Command Center">
      <AdminHero
        badge={loading ? 'Loading' : 'Live platform'}
        heading="Admin Command Center"
        body="Platform-wide oversight for accounts, compliance, audit evidence, and procurement activity."
        actions={
          <button className="btn btn-primary" type="button" disabled={loading} onClick={() => void loadDashboard()}>
            Refresh
          </button>
        }
      />

      {error ? <AdminError error={error} /> : null}
      <AdminUndoBanner action={undoAction} onDismiss={() => setUndoAction(null)} onUndo={async (id) => {
        await adminApi.undoAction(id, { note: 'Undone from command center.' });
        await loadDashboard();
      }} />

      <section className="admin-kpi-grid six-col">
        {(dashboard?.metrics ?? [
          { label: 'Active Tenders', value: counts.activeTenders ?? 0, detail: 'Current database count' },
          { label: 'Pending Compliance Reviews', value: counts.pendingReviews ?? 0, detail: 'Current database count' },
          { label: 'Flagged Issues', value: counts.flaggedIssues ?? 0, detail: 'Current database count' },
          { label: 'Compliance Rate', value: counts.complianceRate ?? 0, detail: 'Percent' },
          { label: 'Evaluation Drafts', value: counts.evaluationDrafts ?? 0, detail: 'Current database count' },
          { label: 'Audit Events Today', value: counts.auditEventsToday ?? 0, detail: 'Current database count' }
        ]).map((metric) => (
          <article className="admin-kpi-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.label === 'Compliance Rate' ? `${metric.value}%` : compactNumber(metric.value)}</strong>
            <em>{loading ? 'Loading' : metric.detail}</em>
          </article>
        ))}
      </section>

      <AdminPanel kicker="Apps" title="Admin app list" badge={`${appList.length} tools`}>
        <div className="admin-rule-list">
          {appList.map((app) => (
            <article key={app.route}>
              <div>
                <span className={badgeClass(app.backend.status)}>{displayLabel(app.backend.status)}</span>
                <strong>{app.title}</strong>
                <em>{app.description} / {appBackendHint(app, counts)}</em>
              </div>
              <button className="btn btn-primary btn-sm" type="button" onClick={() => navigate(app.route)}>
                Open
              </button>
            </article>
          ))}
        </div>
      </AdminPanel>

      <section className="journey-grid two-column">
        <AdminPanel kicker="Actions" title="Prioritized admin actions" badge={`${dashboard?.adminActionQueue.length ?? 0} items`}>
          <div className="admin-queue-list">
            {(dashboard?.adminActionQueue ?? []).map((item) => (
              <article className={`admin-urgency-card ${item.severity === 'CRITICAL' || item.severity === 'ERROR' ? 'urgency-high' : 'urgency-medium'}`} key={item.id}>
                <div>
                  <span className={badgeClass(item.severity)}>{displayLabel(item.severity)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <small>{item.owner} / {displayLabel(item.status)} / {formatDate(item.createdAt)}</small>
                  <div className="admin-table-actions">
                    {(['APPROVE', 'FLAG', 'HOLD', 'RETURN'] as const).map((action) => (
                      <button
                        className={action === 'APPROVE' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                        type="button"
                        key={action}
                        disabled={loading || Boolean(savingAction)}
                        onClick={() => openQueueAction(action, item)}
                      >
                        {savingAction === `${action}:${item.id}` ? 'Saving' : displayLabel(action)}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="admin-urgency-dot" aria-hidden="true"></span>
              </article>
            ))}
            {!dashboard?.adminActionQueue.length ? <div className="admin-mini-record"><strong>No prioritized actions</strong><em>Queue is clear</em></div> : null}
          </div>
        </AdminPanel>

        <AdminPanel kicker="Risk" title="Risk signal distribution" badge={`${riskEntries.length} levels`}>
          <div className="admin-horizontal-bars">
            {riskEntries.map(([level, count]) => (
              <div key={level}>
                <strong>{displayLabel(level)}</strong>
                <span>{count}</span>
                <i style={{ width: `${Math.max(8, (count / Math.max(1, ...riskEntries.map(([, value]) => value))) * 100)}%` }}></i>
              </div>
            ))}
            {!riskEntries.length ? <div className="admin-mini-record"><strong>No risk signals</strong><em>Risk monitor is empty</em></div> : null}
          </div>
        </AdminPanel>
      </section>

      <section className="journey-grid two-column">
        <AdminPanel kicker="Compliance" title="Compliance actions this week" badge={`${dashboard?.weeklyComplianceActions.reduce((sum, item) => sum + item.count, 0) ?? 0} actions`}>
          <div className="admin-horizontal-bars">
            {(dashboard?.weeklyComplianceActions ?? []).map((item) => (
              <div key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.count}</span>
                <i style={{ width: `${Math.max(8, (item.count / Math.max(1, ...(dashboard?.weeklyComplianceActions ?? []).map((row) => row.count))) * 100)}%` }}></i>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel kicker="Evaluation" title="Evaluation oversight" badge={`${dashboard?.evaluationOversight.length ?? 0} drafts`}>
          <div className="admin-mini-list">
            {(dashboard?.evaluationOversight ?? []).map((item) => (
              <article className="admin-mini-record" key={item.id}>
                <div>
                  <strong>{item.reference} / {item.tenderTitle}</strong>
                  <em>{item.buyer} / {displayLabel(item.status)} / {displayLabel(item.stage)}</em>
                </div>
                <span>{item.progress}%</span>
              </article>
            ))}
            {!dashboard?.evaluationOversight.length ? <article className="admin-mini-record"><strong>No evaluation drafts</strong><em>Oversight queue is clear</em></article> : null}
          </div>
        </AdminPanel>
      </section>

      <section className="journey-grid two-column">
        <AdminPanel kicker="Exceptions" title="Exception log" badge={`${dashboard?.exceptionLog.length ?? 0} flags`}>
          <div className="admin-mini-list">
            {(dashboard?.exceptionLog ?? []).map((item) => (
              <article className="admin-mini-record" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <em>{item.owner} / {item.summary}</em>
                </div>
                <span className={badgeClass(item.severity)}>{displayLabel(item.severity)}</span>
              </article>
            ))}
            {!dashboard?.exceptionLog.length ? <article className="admin-mini-record"><strong>No exceptions</strong><em>No flagged issues found</em></article> : null}
          </div>
        </AdminPanel>

        <AdminPanel kicker="Controls" title="Compliance controls" badge={`${dashboard?.checklistPreview.length ?? 0} checks`}>
          <div className="admin-rule-list">
            {(dashboard?.checklistPreview ?? []).map((item) => (
              <article key={item.id}>
                <div>
                  <span className={badgeClass(item.severity)}>{displayLabel(item.severity)}</span>
                  <strong>{item.code}</strong>
                  <em>{item.title}</em>
                </div>
                <span className={badgeClass(item.status)}>{displayLabel(item.status)}</span>
              </article>
            ))}
            {!dashboard?.checklistPreview.length ? <article><strong>No active controls</strong><em>Create compliance rules to populate this checklist.</em></article> : null}
          </div>
        </AdminPanel>
      </section>

      <AdminPanel kicker="Activity" title="Recent admin actions" badge={dashboard ? formatDate(dashboard.generatedAt) : 'Loading'}>
        <div className="admin-mini-list">
          {(dashboard?.recentActions ?? []).map((item) => (
            <article className="admin-mini-record" key={item.id}>
              <div>
                <strong>{displayLabel(item.actionType)} / {displayLabel(item.entityType)}</strong>
                <em>{item.summary ?? item.actorUser?.displayName ?? 'Recorded admin action'}</em>
              </div>
              <span>{formatDate(item.createdAt)}</span>
            </article>
          ))}
          {!dashboard?.recentActions.length ? <article className="admin-mini-record"><strong>No admin actions</strong><em>Actions will appear after reviews</em></article> : null}
        </div>
      </AdminPanel>
      <AdminCommandDrawer command={command} onClose={closeCommand} onUndoAvailable={setUndoAction} />
    </AdminShell>
  );
}

function appBackendHint(app: AdminApp, counts: Record<string, number>) {
  if (app.route === '/admin') return `${compactNumber(counts.openCases ?? 0)} open cases`;
  if (app.route === '/admin/search') return `${compactNumber((counts.tenders ?? 0) + (counts.bids ?? 0) + (counts.contracts ?? 0))} searchable procurement records`;
  if (app.route === '/admin/users') return `${compactNumber(counts.users ?? 0)} users`;
  if (app.route === '/admin/compliance') return `${compactNumber(counts.rules ?? 0)} rules`;
  if (app.route === '/admin/analytics') return `${compactNumber(counts.auditEvents ?? 0)} audit events in analytics`;
  if (app.route === '/admin/audit') return `${compactNumber(counts.auditEvents ?? 0)} audit events`;
  if (app.route === '/admin/datastore') return 'Global and user-scoped JSON keys';
  return app.backend.endpoint;
}
