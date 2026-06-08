import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import DraftsRoundedIcon from '@mui/icons-material/DraftsRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import LockClockRoundedIcon from '@mui/icons-material/LockClockRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PlanningTopBar } from '@/features/tenderPlanning/components/procurex/PlanningTopBar';
import { evaluationApi } from '@/features/evaluation/api';
import type {
  EvaluationDashboard,
  EvaluationDraft,
  EvaluationRecord,
  EvaluationStatusFilter,
  ProcurementTypeFilter,
  ReadyEvaluationTender
} from '@/features/evaluation/types';
import { useBodyPageMetadata } from '@/shared/hooks/useBodyPageMetadata';

export function BidEvaluationProcurexPage() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<EvaluationDashboard>(emptyDashboard);
  const [records, setRecords] = useState<EvaluationRecord[]>([]);
  const [drafts, setDrafts] = useState<EvaluationDraft[]>([]);
  const [readyTenders, setReadyTenders] = useState<ReadyEvaluationTender[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EvaluationStatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<ProcurementTypeFilter>('all');
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useBodyPageMetadata('bid-evaluation');

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language === 'sw' ? 'sw-TZ' : 'en-TZ', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      }),
    [i18n.language]
  );

  const stats = useMemo(
    () => [
      {
        label: t('evaluationApp.stats.publishedTenders'),
        value: dashboard.publishedTenders,
        icon: <FactCheckRoundedIcon fontSize="small" aria-hidden="true" />
      },
      {
        label: t('evaluationApp.stats.readyToEvaluate'),
        value: dashboard.readyToEvaluate,
        icon: <AssignmentTurnedInRoundedIcon fontSize="small" aria-hidden="true" />
      },
      {
        label: t('evaluationApp.stats.draftedEvaluations'),
        value: dashboard.draftedEvaluations,
        icon: <DraftsRoundedIcon fontSize="small" aria-hidden="true" />
      },
      {
        label: t('evaluationApp.stats.lockedUntilClosing'),
        value: dashboard.lockedUntilClosing,
        icon: <LockClockRoundedIcon fontSize="small" aria-hidden="true" />
      }
    ],
    [dashboard, t]
  );

  useEffect(() => {
    let mounted = true;

    async function loadOverview() {
      setLoading(true);
      setLoadError('');

      try {
        const [dashboardData, draftData, readyData] = await Promise.all([
          evaluationApi.getDashboard(),
          evaluationApi.listDrafts(),
          evaluationApi.listReady()
        ]);

        if (!mounted) return;
        setDashboard(dashboardData);
        setDrafts(draftData.drafts);
        setReadyTenders(readyData.tenders);
      } catch {
        if (!mounted) return;
        setDashboard(emptyDashboard);
        setDrafts([]);
        setReadyTenders([]);
        setLoadError(t('evaluationApp.errors.load'));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadOverview();

    return () => {
      mounted = false;
    };
  }, [t]);

  useEffect(() => {
    let mounted = true;
    const timer = window.setTimeout(() => {
      async function loadRecords() {
        setRecordsLoading(true);
        setLoadError('');

        try {
          const data = await evaluationApi.listRecords({
            search,
            status: statusFilter,
            type: typeFilter
          });

          if (!mounted) return;
          setRecords(data.records);
          setTotalRecords(data.totalRecords);
        } catch {
          if (!mounted) return;
          setRecords([]);
          setTotalRecords(0);
          setLoadError(t('evaluationApp.errors.load'));
        } finally {
          if (mounted) setRecordsLoading(false);
        }
      }

      void loadRecords();
    }, 180);

    return () => {
      mounted = false;
      window.clearTimeout(timer);
    };
  }, [search, statusFilter, t, typeFilter]);

  function navigateToPage(pageKey: string) {
    navigate(pageToRoute[pageKey as AppRouteKey] ?? '/dashboard');
  }

  function formatDate(value: string | null) {
    if (!value) return t('evaluationApp.labels.notScheduled');
    return dateFormatter.format(new Date(value));
  }

  function statusLabel(value: string | null) {
    if (!value) return t('evaluationApp.status.NOT_STARTED');
    return t(`evaluationApp.status.${value}`, { defaultValue: humanizeEnum(value) });
  }

  function typeLabel(value: string) {
    return t(`evaluationApp.types.${value}`, { defaultValue: humanizeEnum(value) });
  }

  function stageLabel(value: string | null) {
    if (!value) return t('evaluationApp.labels.notStarted');
    return t(`evaluationApp.stages.${value}`, { defaultValue: humanizeEnum(value) });
  }

  return (
    <>
      <PlanningTopBar title={t('evaluationApp.shell.title')} onNavigate={navigateToPage} />
      <div className="main-layout dashboard-command-center evaluation-empty-app">
        <aside className="sidebar dashboard-sidebar evaluation-empty-sidebar">
          <div className="sidebar-heading">
            <h3>{t('evaluationApp.shell.sidebarTitle')}</h3>
            <div>{t('evaluationApp.shell.sidebarNote')}</div>
          </div>
          <ul className="sidebar-nav">
            {appNavItems.map((item) => (
              <li key={item.page}>
                <button
                  type="button"
                  className={item.page === 'bid-evaluation' ? 'active' : ''}
                  onClick={() => navigateToPage(item.page)}
                >
                  {t(item.labelKey)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="main-content">
          <div className="workspace-home evaluation-empty-workspace">
            <section className="evaluation-empty-hero evaluation-hero-panel">
              <div className="evaluation-empty-hero-copy">
                <span className="section-kicker">{t('evaluationApp.hero.kicker')}</span>
                <h1>{t('evaluationApp.hero.title')}</h1>
                <p>{t('evaluationApp.hero.subtitle')}</p>
                <div className="inline-actions evaluation-empty-actions">
                  <button className="btn btn-primary" type="button" onClick={() => navigateToPage('create-tender')}>
                    <AddRoundedIcon fontSize="small" aria-hidden="true" />
                    <span>{t('evaluationApp.actions.createTender')}</span>
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={() => navigateToPage('tender-planning')}>
                    <EventNoteRoundedIcon fontSize="small" aria-hidden="true" />
                    <span>{t('evaluationApp.actions.viewTenderPlanning')}</span>
                  </button>
                </div>
              </div>

              <div className="evaluation-empty-stat-grid" aria-label={t('evaluationApp.stats.ariaLabel')}>
                {stats.map((stat) => (
                  <article className="evaluation-empty-stat-card" key={stat.label}>
                    <span className="evaluation-empty-stat-icon">{stat.icon}</span>
                    <strong>{loading ? '0' : stat.value.toLocaleString()}</strong>
                    <span>{stat.label}</span>
                  </article>
                ))}
              </div>
            </section>

            {loadError ? <div className="evaluation-empty-alert" role="alert">{loadError}</div> : null}

            <section className="evaluation-panel evaluation-empty-panel">
              <div className="panel-heading evaluation-empty-heading">
                <div>
                  <span className="section-kicker">{t('evaluationApp.records.kicker')}</span>
                  <h2>{t('evaluationApp.records.title')}</h2>
                </div>
                <span className="badge badge-info">{t('evaluationApp.records.countBadge', { count: totalRecords })}</span>
              </div>

              <div className="evaluation-empty-filter-grid">
                <label className="evaluation-empty-field evaluation-empty-search">
                  <span>{t('evaluationApp.filters.search')}</span>
                  <span className="evaluation-empty-input-shell">
                    <SearchRoundedIcon fontSize="small" aria-hidden="true" />
                    <input
                      className="form-input"
                      type="search"
                      value={search}
                      placeholder={t('evaluationApp.filters.searchPlaceholder')}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </span>
                </label>
                <label className="evaluation-empty-field">
                  <span>{t('evaluationApp.filters.status')}</span>
                  <select
                    className="form-input"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as EvaluationStatusFilter)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="evaluation-empty-field">
                  <span>{t('evaluationApp.filters.type')}</span>
                  <select
                    className="form-input"
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value as ProcurementTypeFilter)}
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {records.length > 0 ? (
                <div className="evaluation-table-scroll evaluation-empty-table" aria-busy={recordsLoading}>
                  <table>
                    <thead>
                      <tr>
                        <th>{t('evaluationApp.table.tender')}</th>
                        <th>{t('evaluationApp.table.type')}</th>
                        <th>{t('evaluationApp.table.status')}</th>
                        <th>{t('evaluationApp.table.stage')}</th>
                        <th>{t('evaluationApp.table.progress')}</th>
                        <th>{t('evaluationApp.table.submittedBids')}</th>
                        <th>{t('evaluationApp.table.updated')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record) => (
                        <tr key={record.id}>
                          <td>
                            <strong>{record.title}</strong>
                            <span>{record.reference}</span>
                          </td>
                          <td>{typeLabel(record.procurementType)}</td>
                          <td><span className="badge badge-info">{statusLabel(record.status)}</span></td>
                          <td>{stageLabel(record.currentStage)}</td>
                          <td>{record.progressPercentage}%</td>
                          <td>{record.submittedBidCount}</td>
                          <td>{formatDate(record.updatedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EvaluationEmptyMessage
                  icon={<FolderOpenRoundedIcon fontSize="small" aria-hidden="true" />}
                  message={t('evaluationApp.records.empty')}
                />
              )}
            </section>

            <div className="evaluation-empty-section-grid">
              <section className="evaluation-panel evaluation-empty-panel">
                <div className="panel-heading evaluation-empty-heading">
                  <div>
                    <span className="section-kicker">{t('evaluationApp.drafts.kicker')}</span>
                    <h2>{t('evaluationApp.drafts.title')}</h2>
                  </div>
                  <span className="badge badge-info">{drafts.length}</span>
                </div>

                {drafts.length > 0 ? (
                  <div className="evaluation-empty-card-list">
                    {drafts.map((draft) => (
                      <article className="evaluation-ready-card evaluation-draft-card" key={draft.id}>
                        <span className="badge badge-warning">{t('evaluationApp.status.IN_PROGRESS')}</span>
                        <h3>{draft.title}</h3>
                        <p>{draft.reference}</p>
                        <div className="evaluation-progress-track" aria-label={t('evaluationApp.table.progress')}>
                          <span style={{ width: `${Math.min(100, Math.max(0, draft.progressPercentage))}%` }} />
                        </div>
                        <dl className="evaluation-empty-meta">
                          <div>
                            <dt>{t('evaluationApp.table.stage')}</dt>
                            <dd>{stageLabel(draft.currentStage)}</dd>
                          </div>
                          <div>
                            <dt>{t('evaluationApp.table.submittedBids')}</dt>
                            <dd>{draft.submittedBidCount}</dd>
                          </div>
                          <div>
                            <dt>{t('evaluationApp.table.updated')}</dt>
                            <dd>{formatDate(draft.updatedAt)}</dd>
                          </div>
                        </dl>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EvaluationEmptyMessage
                    icon={<DraftsRoundedIcon fontSize="small" aria-hidden="true" />}
                    message={t('evaluationApp.drafts.empty')}
                  />
                )}
              </section>

              <section className="evaluation-panel evaluation-empty-panel">
                <div className="panel-heading evaluation-empty-heading">
                  <div>
                    <span className="section-kicker">{t('evaluationApp.ready.kicker')}</span>
                    <h2>{t('evaluationApp.ready.title')}</h2>
                  </div>
                  <span className="badge badge-info">{readyTenders.length}</span>
                </div>

                {readyTenders.length > 0 ? (
                  <div className="evaluation-empty-card-list">
                    {readyTenders.map((tender) => (
                      <article className="evaluation-ready-card" key={tender.tenderId}>
                        <span className="badge badge-success">{t('evaluationApp.ready.readyBadge')}</span>
                        <h3>{tender.title}</h3>
                        <p>{tender.reference}</p>
                        <dl className="evaluation-empty-meta">
                          <div>
                            <dt>{t('evaluationApp.table.type')}</dt>
                            <dd>{typeLabel(tender.procurementType)}</dd>
                          </div>
                          <div>
                            <dt>{t('evaluationApp.table.submittedBids')}</dt>
                            <dd>{tender.submittedBidCount}</dd>
                          </div>
                          <div>
                            <dt>{t('evaluationApp.table.closingDate')}</dt>
                            <dd>{formatDate(tender.closingDate || null)}</dd>
                          </div>
                        </dl>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EvaluationEmptyMessage
                    icon={<AssignmentTurnedInRoundedIcon fontSize="small" aria-hidden="true" />}
                    message={t('evaluationApp.ready.empty')}
                  />
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

type AppRouteKey =
  | 'workspace-dashboard'
  | 'tender-planning'
  | 'marketplace'
  | 'create-tender'
  | 'bidding-workspace'
  | 'bid-evaluation'
  | 'awarding-contracts'
  | 'records-history'
  | 'communication-center';

const pageToRoute: Record<AppRouteKey, string> = {
  'workspace-dashboard': '/dashboard',
  'tender-planning': '/tender-planning',
  marketplace: '/procurement/marketplace',
  'create-tender': '/procurement/create-tender',
  'bidding-workspace': '/bidding',
  'bid-evaluation': '/evaluation',
  'awarding-contracts': '/awards-contracts',
  'records-history': '/records',
  'communication-center': '/communication'
};

const appNavItems: Array<{ labelKey: string; page: AppRouteKey }> = [
  { labelKey: 'nav.dashboard', page: 'workspace-dashboard' },
  { labelKey: 'nav.tenderPlanning', page: 'tender-planning' },
  { labelKey: 'nav.procurement', page: 'marketplace' },
  { labelKey: 'evaluationApp.nav.createTender', page: 'create-tender' },
  { labelKey: 'nav.bidding', page: 'bidding-workspace' },
  { labelKey: 'nav.evaluation', page: 'bid-evaluation' },
  { labelKey: 'nav.awards', page: 'awarding-contracts' },
  { labelKey: 'nav.records', page: 'records-history' },
  { labelKey: 'nav.communication', page: 'communication-center' }
];

const emptyDashboard: EvaluationDashboard = {
  publishedTenders: 0,
  readyToEvaluate: 0,
  draftedEvaluations: 0,
  lockedUntilClosing: 0,
  totalRecords: 0
};

const statusOptions: Array<{ value: EvaluationStatusFilter; labelKey: string }> = [
  { value: 'all', labelKey: 'evaluationApp.filters.allStatuses' },
  { value: 'NOT_STARTED', labelKey: 'evaluationApp.status.NOT_STARTED' },
  { value: 'IN_PROGRESS', labelKey: 'evaluationApp.status.IN_PROGRESS' },
  { value: 'LOCKED', labelKey: 'evaluationApp.status.LOCKED' },
  { value: 'COMPLETED', labelKey: 'evaluationApp.status.COMPLETED' },
  { value: 'RETURNED', labelKey: 'evaluationApp.status.RETURNED' }
];

const typeOptions: Array<{ value: ProcurementTypeFilter; labelKey: string }> = [
  { value: 'all', labelKey: 'evaluationApp.filters.allTypes' },
  { value: 'GOODS', labelKey: 'evaluationApp.types.GOODS' },
  { value: 'WORKS', labelKey: 'evaluationApp.types.WORKS' },
  { value: 'SERVICE', labelKey: 'evaluationApp.types.SERVICE' },
  { value: 'CONSULTANCY', labelKey: 'evaluationApp.types.CONSULTANCY' }
];

function EvaluationEmptyMessage({ icon, message }: { icon: ReactNode; message: string }) {
  return (
    <div className="evaluation-empty-state">
      <span>{icon}</span>
      <p>{message}</p>
    </div>
  );
}

function humanizeEnum(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
