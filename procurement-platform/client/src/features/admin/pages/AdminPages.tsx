import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/store';
import { ChartCard, DataTable, KpiCard, PageHeader, StatusBadge } from '@/shared/components';

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const metrics = useAppSelector((state) => state.admin.metrics);
  return (
    <section>
      <PageHeader title={t('pages.adminDashboard.title')} subtitle={t('pages.adminDashboard.subtitle')} />
      <div className="px-kpi-grid">
        {metrics.map((metric) => <KpiCard key={metric.label} {...metric} />)}
      </div>
      <ChartCard title={t('pages.adminAnalytics.title')} />
    </section>
  );
}

export function AdminSearchPage() {
  const { t } = useTranslation();
  const rows = useAppSelector((state) => state.admin.auditRows);
  return (
    <section>
      <PageHeader title={t('pages.adminSearch.title')} subtitle={t('pages.adminSearch.subtitle')} />
      <article className="px-card">
        <TextField label={t('common.search')} defaultValue="PX-" fullWidth />
      </article>
      <AdminRows rows={rows} />
    </section>
  );
}

export function AdminUsersPage() {
  const { t } = useTranslation();
  return (
    <section>
      <PageHeader title={t('pages.adminUsers.title')} subtitle={t('pages.adminUsers.subtitle')} />
      <div className="px-grid">
        {['Kilimanjaro Supplies Limited', 'Admin User', 'Prime Facilities Tanzania'].map((name) => (
          <article className="px-card" key={name}>
            <StatusBadge value={name === 'Admin User' ? 'ADMIN' : 'USER'} />
            <h3>{name}</h3>
            <p>Capabilities are stored as organization settings, not login roles.</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AdminCompliancePage() {
  const { t } = useTranslation();
  return <AdminRulePage title={t('pages.adminCompliance.title')} subtitle={t('pages.adminCompliance.subtitle')} />;
}

export function AdminAnalyticsPage() {
  const { t } = useTranslation();
  return (
    <section>
      <PageHeader title={t('pages.adminAnalytics.title')} subtitle={t('pages.adminAnalytics.subtitle')} />
      <ChartCard title="Tender, bid, and award trend" />
    </section>
  );
}

export function AdminAuditPage() {
  const { t } = useTranslation();
  const rows = useAppSelector((state) => state.admin.auditRows);
  return (
    <section>
      <PageHeader title={t('pages.adminAudit.title')} subtitle={t('pages.adminAudit.subtitle')} />
      <AdminRows rows={rows} />
    </section>
  );
}

function AdminRulePage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="px-grid">
        {['Open tender threshold', 'Mandatory document checklist', 'Evaluation approval routing', 'Audit retention policy'].map((rule) => (
          <article className="px-card" key={rule}>
            <StatusBadge value="Active" />
            <h3>{rule}</h3>
            <p>Configured rule with review workflow and admin action history.</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminRows({ rows }: { rows: Array<{ id: string; entityType: string; reference: string; title: string; owner: string; status: string }> }) {
  const { t } = useTranslation();
  return (
    <DataTable
      rows={rows}
      getRowKey={(row) => row.id}
      columns={[
        { key: 'type', label: 'Type', render: (row) => row.entityType },
        { key: 'reference', label: t('common.reference'), render: (row) => <strong>{row.reference}</strong> },
        { key: 'title', label: 'Title', render: (row) => row.title },
        { key: 'owner', label: t('common.owner'), render: (row) => row.owner },
        { key: 'status', label: t('common.status'), render: (row) => <StatusBadge value={row.status} /> }
      ]}
    />
  );
}
