import { useEffect, useMemo, useState } from 'react';
import { adminApi, type ComplianceCase, type ComplianceRule, type PageDto } from '@/features/admin/api';
import { useBodyPageMetadata } from '@/shared/hooks/useBodyPageMetadata';
import { AdminCommandDrawer, AdminError, AdminHero, AdminPanel, AdminShell, EmptyRow, Pager, badgeClass, displayLabel, formatDate, useAdminCommand } from './AdminShared';

const caseStatuses = ['OPEN', 'INVESTIGATION', 'FALSE_POSITIVE', 'RESOLVED', 'ESCALATED'];
const severities = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];

export function AdminComplianceProcurexPage() {
  const [cases, setCases] = useState<PageDto<ComplianceCase> | null>(null);
  const [rules, setRules] = useState<PageDto<ComplianceRule> | null>(null);
  const [casePage, setCasePage] = useState(1);
  const [rulePage, setRulePage] = useState(1);
  const [caseStatus, setCaseStatus] = useState('');
  const [ruleStatus, setRuleStatus] = useState('');
  const [ruleDraft, setRuleDraft] = useState({ code: '', title: '', severity: 'WARNING', status: 'ACTIVE', description: '' });
  const [thresholdDraft, setThresholdDraft] = useState({ method: 'OPEN_TENDER', ceiling: '50000000', biddingDays: '21', approvals: 'Procurement committee' });
  const [checklistDraft, setChecklistDraft] = useState({ title: 'Conflict of interest declaration', stage: 'EVALUATION' });
  const [standstillDays, setStandstillDays] = useState('7');
  const [alertDraft, setAlertDraft] = useState({ event: 'High risk supplier screening', enabled: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { command, openCommand, closeCommand } = useAdminCommand();

  useBodyPageMetadata('admin-compliance');

  const openCases = useMemo(() => (cases?.items ?? []).filter((item) => ['OPEN', 'INVESTIGATION', 'ESCALATED'].includes(item.status)).length, [cases]);

  async function load(nextCasePage = casePage, nextRulePage = rulePage) {
    setLoading(true);
    setError(null);
    try {
      const [caseResponse, ruleResponse] = await Promise.all([
        adminApi.listComplianceCases({ status: caseStatus || undefined, page: nextCasePage, pageSize: 10 }),
        adminApi.listComplianceRules({ status: ruleStatus || undefined, page: nextRulePage, pageSize: 10 })
      ]);
      setCases(caseResponse);
      setRules(ruleResponse);
      setCasePage(nextCasePage);
      setRulePage(nextRulePage);
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(1, 1);
  }, []);

  async function updateCaseStatus(item: ComplianceCase, status: string) {
    setSaving(true);
    setError(null);
    try {
      const updated = await adminApi.updateComplianceCase(item.id, { status });
      setCases((current) => current ? { ...current, items: current.items.map((row) => (row.id === updated.id ? updated : row)) } : current);
    } catch (caught) {
      setError(caught);
    } finally {
      setSaving(false);
    }
  }

  function openCaseStatus(item: ComplianceCase, status: string) {
    openCommand({
      title: `${displayLabel(status)} case`,
      summary: `Update ${item.title} from ${displayLabel(item.status)} to ${displayLabel(status)}.`,
      confirmLabel: 'Update Case',
      dangerous: ['ESCALATED', 'INVESTIGATION'].includes(status),
      run: async () => updateCaseStatus(item, status)
    });
  }

  async function saveRule() {
    setSaving(true);
    setError(null);
    try {
      await adminApi.createComplianceRule({
        code: ruleDraft.code.trim(),
        title: ruleDraft.title.trim(),
        severity: ruleDraft.severity,
        status: ruleDraft.status,
        description: ruleDraft.description.trim() || null,
        condition: {}
      });
      setRuleDraft({ code: '', title: '', severity: 'WARNING', status: 'ACTIVE', description: '' });
      await load(casePage, 1);
    } catch (caught) {
      setError(caught);
    } finally {
      setSaving(false);
    }
  }

  async function toggleRule(item: ComplianceRule) {
    setSaving(true);
    setError(null);
    try {
      const updated = await adminApi.updateComplianceRule(item.id, { status: item.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' });
      setRules((current) => current ? { ...current, items: current.items.map((row) => (row.id === updated.id ? updated : row)) } : current);
    } catch (caught) {
      setError(caught);
    } finally {
      setSaving(false);
    }
  }

  function openRuleToggle(item: ComplianceRule) {
    openCommand({
      title: `${item.status === 'ACTIVE' ? 'Disable' : 'Enable'} ${item.code}`,
      summary: `${item.title} will be ${item.status === 'ACTIVE' ? 'disabled' : 'enabled'} and audited.`,
      confirmLabel: item.status === 'ACTIVE' ? 'Disable Rule' : 'Enable Rule',
      dangerous: item.status === 'ACTIVE',
      run: async () => toggleRule(item)
    });
  }

  async function createSetting(kind: string, title: string, payload: Record<string, unknown>) {
    setSaving(true);
    setError(null);
    try {
      await adminApi.createComplianceRule({
        code: `SETTINGS.${kind}.${Date.now()}`,
        title,
        severity: kind === 'ALERT' ? 'WARNING' : 'INFO',
        status: payload.enabled === false ? 'DISABLED' : 'ACTIVE',
        description: `${displayLabel(kind)} setting managed from admin compliance controls.`,
        condition: { kind },
        payload: { kind, ...payload }
      });
      await load(casePage, 1);
    } catch (caught) {
      setError(caught);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell currentPath="/admin/compliance" title="Admin Compliance">
      <AdminHero
        badge={loading ? 'Loading' : `${openCases} open`}
        heading="Compliance Rules"
        body="Review compliance cases, maintain platform rules, and record admin decisions against live compliance data."
        actions={<button className="btn btn-primary" type="button" disabled={loading || saving} onClick={() => void load(1, 1)}>Refresh</button>}
      />

      {error ? <AdminError error={error} title="Compliance data could not load" /> : null}

      <section className="journey-grid two-column">
        <AdminPanel kicker="Cases" title="Compliance case queue" badge={`${cases?.total ?? 0} total`}>
          <div className="admin-filter-bar">
            <select className="form-input" value={caseStatus} onChange={(event) => setCaseStatus(event.target.value)}>
              <option value="">All case statuses</option>
              {caseStatuses.map((status) => <option value={status} key={status}>{displayLabel(status)}</option>)}
            </select>
            <button className="btn btn-secondary" type="button" disabled={loading} onClick={() => void load(1, rulePage)}>
              Apply
            </button>
          </div>
          <div className="data-table evaluation-table-scroll admin-data-table">
            <table>
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Created</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {(cases?.items ?? []).map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.title}</strong><em>{item.ownerOrg?.name ?? 'Platform case'}</em></td>
                    <td><span className={badgeClass(item.severity)}>{displayLabel(item.severity)}</span></td>
                    <td><span className={badgeClass(item.status)}>{displayLabel(item.status)}</span></td>
                    <td>{item.owner ?? 'Unassigned'}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      <select className="form-input" value={item.status} disabled={saving} onChange={(event) => openCaseStatus(item, event.target.value)}>
                        {caseStatuses.map((status) => <option value={status} key={status}>{displayLabel(status)}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {!cases?.items.length ? <EmptyRow colSpan={6} label={loading ? 'Loading cases.' : 'No compliance cases found.'} /> : null}
              </tbody>
            </table>
          </div>
          <Pager page={casePage} total={cases?.total ?? 0} pageSize={cases?.pageSize ?? 10} onPage={(next) => void load(next, rulePage)} />
        </AdminPanel>

        <AdminPanel kicker="Rules" title="Create compliance rule" badge={saving ? 'Saving' : 'Ready'}>
          <div className="admin-settings-grid">
            <label className="form-group">
              <span className="form-label">Rule code</span>
              <input className="form-input" value={ruleDraft.code} onChange={(event) => setRuleDraft((draft) => ({ ...draft, code: event.target.value.toUpperCase() }))} placeholder="KYC.DUPLICATE_REGISTRY" />
            </label>
            <label className="form-group">
              <span className="form-label">Title</span>
              <input className="form-input" value={ruleDraft.title} onChange={(event) => setRuleDraft((draft) => ({ ...draft, title: event.target.value }))} placeholder="Duplicate registry number" />
            </label>
            <label className="form-group">
              <span className="form-label">Description</span>
              <textarea className="form-input" rows={3} value={ruleDraft.description} onChange={(event) => setRuleDraft((draft) => ({ ...draft, description: event.target.value }))} />
            </label>
            <div className="admin-filter-bar">
              <select className="form-input" value={ruleDraft.severity} onChange={(event) => setRuleDraft((draft) => ({ ...draft, severity: event.target.value }))}>
                {severities.map((severity) => <option value={severity} key={severity}>{displayLabel(severity)}</option>)}
              </select>
              <select className="form-input" value={ruleDraft.status} onChange={(event) => setRuleDraft((draft) => ({ ...draft, status: event.target.value }))}>
                <option value="ACTIVE">Active</option>
                <option value="DISABLED">Disabled</option>
              </select>
              <button className="btn btn-primary" type="button" disabled={saving || !ruleDraft.code.trim() || !ruleDraft.title.trim()} onClick={() => void saveRule()}>
                Create Rule
              </button>
            </div>
          </div>
        </AdminPanel>
      </section>

      <section className="journey-grid two-column">
        <AdminPanel kicker="Settings" title="Procurement method limits" badge="Live rules">
          <div className="admin-settings-grid">
            <label className="form-group">
              <span className="form-label">Method</span>
              <select className="form-input" value={thresholdDraft.method} onChange={(event) => setThresholdDraft((draft) => ({ ...draft, method: event.target.value }))}>
                <option value="OPEN_TENDER">Open tender</option>
                <option value="INVITED_TENDER">Invited tender</option>
              </select>
            </label>
            <label className="form-group">
              <span className="form-label">Budget ceiling</span>
              <input className="form-input" type="number" value={thresholdDraft.ceiling} onChange={(event) => setThresholdDraft((draft) => ({ ...draft, ceiling: event.target.value }))} />
            </label>
            <label className="form-group">
              <span className="form-label">Minimum bidding days</span>
              <input className="form-input" type="number" value={thresholdDraft.biddingDays} onChange={(event) => setThresholdDraft((draft) => ({ ...draft, biddingDays: event.target.value }))} />
            </label>
            <label className="form-group">
              <span className="form-label">Approvals</span>
              <input className="form-input" value={thresholdDraft.approvals} onChange={(event) => setThresholdDraft((draft) => ({ ...draft, approvals: event.target.value }))} />
            </label>
            <button className="btn btn-primary" type="button" disabled={saving} onClick={() => void createSetting('THRESHOLD', `${displayLabel(thresholdDraft.method)} limit`, thresholdDraft)}>
              Save Limit
            </button>
          </div>
        </AdminPanel>

        <AdminPanel kicker="Templates" title="Compliance checklist templates" badge="Reusable checks">
          <div className="admin-settings-grid">
            <label className="form-group">
              <span className="form-label">Checklist item</span>
              <input className="form-input" value={checklistDraft.title} onChange={(event) => setChecklistDraft((draft) => ({ ...draft, title: event.target.value }))} />
            </label>
            <label className="form-group">
              <span className="form-label">Stage</span>
              <input className="form-input" value={checklistDraft.stage} onChange={(event) => setChecklistDraft((draft) => ({ ...draft, stage: event.target.value.toUpperCase() }))} />
            </label>
            <button className="btn btn-primary" type="button" disabled={saving || !checklistDraft.title.trim()} onClick={() => void createSetting('CHECKLIST', checklistDraft.title, checklistDraft)}>
              Add Item
            </button>
          </div>
        </AdminPanel>

        <AdminPanel kicker="Standstill" title="Standstill period settings" badge={`${standstillDays} days`}>
          <div className="admin-settings-grid">
            <label className="form-group">
              <span className="form-label">Required standstill days</span>
              <input className="form-input" type="number" min="0" value={standstillDays} onChange={(event) => setStandstillDays(event.target.value)} />
            </label>
            <button className="btn btn-primary" type="button" disabled={saving} onClick={() => void createSetting('STANDSTILL', 'Award standstill period', { days: Number(standstillDays) })}>
              Save Standstill
            </button>
          </div>
        </AdminPanel>

        <AdminPanel kicker="Alerts" title="Admin alert events" badge={alertDraft.enabled ? 'Enabled' : 'Disabled'}>
          <div className="admin-settings-grid">
            <label className="form-group">
              <span className="form-label">Event</span>
              <input className="form-input" value={alertDraft.event} onChange={(event) => setAlertDraft((draft) => ({ ...draft, event: event.target.value }))} />
            </label>
            <label className="admin-inline-toggle">
              <input type="checkbox" checked={alertDraft.enabled} onChange={(event) => setAlertDraft((draft) => ({ ...draft, enabled: event.target.checked }))} />
              <span>Enabled</span>
            </label>
            <button className="btn btn-primary" type="button" disabled={saving || !alertDraft.event.trim()} onClick={() => void createSetting('ALERT', alertDraft.event, alertDraft)}>
              Save Alert
            </button>
          </div>
        </AdminPanel>
      </section>

      <AdminPanel kicker="Rules register" title="Compliance rules" badge={`${rules?.total ?? 0} rules`}>
        <div className="admin-filter-bar">
          <select className="form-input" value={ruleStatus} onChange={(event) => setRuleStatus(event.target.value)}>
            <option value="">All rule statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
          </select>
          <button className="btn btn-secondary" type="button" disabled={loading} onClick={() => void load(casePage, 1)}>
            Apply
          </button>
        </div>
        <div className="admin-rule-list">
          {(rules?.items ?? []).map((rule) => (
            <article key={rule.id}>
              <div>
                <span className={badgeClass(rule.severity)}>{displayLabel(rule.severity)}</span>
                <strong>{rule.code} / {rule.title}</strong>
                <em>{rule.description ?? 'No description'}</em>
              </div>
              <div className="admin-table-actions">
                <span className={badgeClass(rule.status)}>{displayLabel(rule.status)}</span>
                <button className="btn btn-secondary btn-sm" type="button" disabled={saving} onClick={() => openRuleToggle(rule)}>
                  {rule.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                </button>
              </div>
            </article>
          ))}
          {!rules?.items.length ? <article><strong>No compliance rules</strong><em>Create a rule to begin the register.</em></article> : null}
        </div>
        <Pager page={rulePage} total={rules?.total ?? 0} pageSize={rules?.pageSize ?? 10} onPage={(next) => void load(casePage, next)} />
      </AdminPanel>
      <AdminCommandDrawer command={command} onClose={closeCommand} />
    </AdminShell>
  );
}
