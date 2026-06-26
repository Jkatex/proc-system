import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  awardQueueLabels,
  summaryCards,
} from '../../fixtures';
import { awardsContractsApi } from '../../api';
import type { AwardContractDashboard, AwardQueueId, LifecycleAction } from '../../types';
import {
  AwardHero,
  AwardSidebar,
  LifecycleActionCard,
  ProcurexAwardFrame,
  StatusBadge
} from './AwardsContractsProcurexShared';

const queueIds = Object.keys(awardQueueLabels) as AwardQueueId[];
const emptyQueues: AwardContractDashboard['queues'] = {
  'my-urgent-actions': [],
  'awarding-in-progress': [],
  'awards-received': [],
  'contracts-in-progress': [],
  'active-contracts': [],
  'closed-contracts': []
};

function QueueCards({ rows, emptyMessage, actionLabel, onAction }: { rows: LifecycleAction[]; emptyMessage: string; actionLabel?: string; onAction: (row: LifecycleAction) => void }) {
  if (rows.length === 0) return <div className="scope-empty award-card-empty">{emptyMessage}</div>;
  return (
    <div className="award-lifecycle-card-grid">
      {rows.map((row) => (
        <LifecycleActionCard row={row} actionLabel={actionLabel} onAction={onAction} key={row.id} />
      ))}
    </div>
  );
}

function getQueueFromSearch(search: string): AwardQueueId {
  const queue = new URLSearchParams(search).get('queue') as AwardQueueId | null;
  return queue && queueIds.includes(queue) ? queue : 'my-urgent-actions';
}

export function AwardingContractsProcurexPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeQueue = useMemo(() => getQueueFromSearch(location.search), [location.search]);
  const [dashboard, setDashboard] = useState<AwardContractDashboard | null>(null);
  const [selectedAction, setSelectedAction] = useState<LifecycleAction | null>(null);

  useEffect(() => {
    let active = true;
    awardsContractsApi.dashboard()
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch(() => {
        if (active) setDashboard(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const queues = dashboard?.queues ?? emptyQueues;
  const summary = dashboard?.summary ?? {
    urgentActions: queues['my-urgent-actions'].length,
    awardQueues: queues['awarding-in-progress'].length + queues['awards-received'].length,
    contractActions: queues['contracts-in-progress'].length + queues['active-contracts'].length
  };

  function jumpToQueue(queue: AwardQueueId) {
    navigate(`/awards-contracts?queue=${queue}`);
  }

  function followAction(row: LifecycleAction) {
    if (row.nextAction && !row.nextAction.canAct) return;
    setSelectedAction(row);
  }

  function continueAction(row: LifecycleAction) {
    navigate(row.nextAction?.url || row.nextRoute || '/awards-contracts');
  }

  return (
    <ProcurexAwardFrame pageKey="awarding-contracts">
      <div className="main-layout procurement-layout awarding-contracts-page">
        <AwardSidebar title="Awarding and Contracts" subtitle="Relationship based workspace" activeQueue={activeQueue} />

        <main className="main-content procurement-content awarding-contracts-workspace">
          <AwardHero
            kicker="Awarding and Contracts"
            title="Your awarding and contracts — in every role you play"
            copy="Your company can be a buyer on tenders you created and a supplier on tenders you won. Both roles are shown below with clear next actions."
            stats={[
              { value: summary.urgentActions, label: 'Urgent actions' },
              { value: summary.awardQueues, label: 'Award queues' },
              { value: summary.contractActions, label: 'Contract actions' }
            ]}
          />

          <div className="award-info-banner">
            <strong>Role context</strong>
            <span>Buyer rows are tenders your organization created. Supplier rows are awards your organization won from another buyer.</span>
          </div>

          <section className="awarding-summary-grid">
            {summaryCards.map((item) => (
              <button
                className="awarding-summary-card"
                type="button"
                data-awarding-tab-jump={item.queue}
                data-route-search={`queue=${item.queue}`}
                aria-label={`Go to ${awardQueueLabels[item.queue]} tab`}
                onClick={() => jumpToQueue(item.queue)}
                key={item.queue}
              >
                <span className="summary-trend" aria-hidden="true">{item.trend}</span>
                <strong>{queues[item.queue].length}</strong>
                <span>{item.label} <em className="summary-view">View</em></span>
                <em>{item.detail}</em>
              </button>
            ))}
          </section>

          <section className="procurement-panel evaluation-panel awarding-tabs-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">Lifecycle queues</span>
                <h2>Work is sorted by required action, with role shown inside each row</h2>
                <p className="panel-note">The dashboard keeps buyer and supplier responsibilities visible without forcing separate accounts.</p>
              </div>
            </div>

            <div className="supplier-detail-tabs awarding-contract-tabs" role="tablist" aria-label="Awarding and contract queues">
              {queueIds.map((queue) => (
                <button
                  className={`supplier-detail-tab${queue === activeQueue ? ' active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={queue === activeQueue}
                  data-tab={queue}
                  onClick={() => jumpToQueue(queue)}
                  key={queue}
                >
                  {awardQueueLabels[queue]}
                </button>
              ))}
            </div>

            <div className="awarding-tab-content">
              <div className={`tab-content ${activeQueue === 'my-urgent-actions' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="my-urgent-actions">
                <p className="awarding-tab-note">This queue aggregates buyer and supplier work that needs attention across awards, contracts, invoices, variations, and closure.</p>
                <QueueCards rows={queues['my-urgent-actions']} emptyMessage="No urgent award or contract actions yet." onAction={followAction} />
              </div>

              <div className={`tab-content ${activeQueue === 'awarding-in-progress' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="awarding-in-progress">
                <div className="queue-toolbar">
                  <label>Search <input className="form-input" placeholder="Tender name or reference" aria-label="Search pending awarding tenders" /></label>
                  <span>Showing {queues['awarding-in-progress'].length} of {queues['awarding-in-progress'].length}</span>
                </div>
                <QueueCards rows={queues['awarding-in-progress']} emptyMessage="No buyer-side awards are in progress yet." onAction={followAction} />
              </div>

              <div className={`tab-content ${activeQueue === 'awards-received' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="awards-received">
                <QueueCards rows={queues['awards-received']} emptyMessage="No supplier awards have been received yet." onAction={followAction} />
              </div>

              <div className={`tab-content ${activeQueue === 'contracts-in-progress' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="contracts-in-progress">
                <QueueCards rows={queues['contracts-in-progress']} emptyMessage="No contracts are in progress yet." onAction={followAction} />
              </div>

              <div className={`tab-content ${activeQueue === 'active-contracts' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="active-contracts">
                <QueueCards rows={queues['active-contracts']} emptyMessage="No active contracts are available yet." actionLabel="Track" onAction={followAction} />
              </div>

              <div className={`tab-content ${activeQueue === 'closed-contracts' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="closed-contracts">
                <QueueCards rows={queues['closed-contracts']} emptyMessage="No closed contracts are archived yet." actionLabel="View Closure" onAction={followAction} />
              </div>
            </div>
          </section>
        </main>
        {selectedAction ? (
          <div className="award-action-drawer-backdrop" role="presentation">
            <aside className="award-action-drawer" role="dialog" aria-modal="true" aria-label={selectedAction.requiredAction}>
              <section className="award-action-form award-action-form-drawer">
                <div className="award-drawer-heading">
                  <div>
                    <span className="section-kicker">Lifecycle action</span>
                    <h2>{selectedAction.requiredAction}</h2>
                    <p>{selectedAction.title}</p>
                  </div>
                  <div className="award-drawer-heading-actions">
                    <StatusBadge value={selectedAction.roleContext === 'BUYER' ? 'Buyer' : 'Supplier'} />
                    <button className="btn btn-secondary btn-sm" type="button" onClick={() => setSelectedAction(null)}>Close</button>
                  </div>
                </div>
                <section className="contract-overview-grid">
                  <article><span>Stage</span><strong>{selectedAction.currentStage}</strong></article>
                  <article><span>Status</span><strong>{selectedAction.status}</strong></article>
                  <article><span>Other party</span><strong>{selectedAction.otherParty}</strong></article>
                  <article><span>Due date</span><strong>{selectedAction.dueDate ? new Date(selectedAction.dueDate).toLocaleDateString() : 'Not dated'}</strong></article>
                </section>
                <div className="scope-empty">
                  Open the focused workspace for this action. The full production form will appear in the right-side action drawer there, with linked record pickers and role-aware controls.
                </div>
                {selectedAction.nextAction?.canAct === false ? (
                  <p className="panel-note">{selectedAction.nextAction.disabledReason ?? 'This action is not available for your role.'}</p>
                ) : null}
                <div className="inline-actions award-drawer-footer">
                  <button className="btn btn-primary btn-sm" type="button" disabled={selectedAction.nextAction?.canAct === false} onClick={() => continueAction(selectedAction)}>
                    Continue
                  </button>
                  <button className="btn btn-secondary btn-sm" type="button" onClick={() => setSelectedAction(null)}>Cancel</button>
                </div>
              </section>
            </aside>
          </div>
        ) : null}
      </div>
    </ProcurexAwardFrame>
  );
}
