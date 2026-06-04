import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { closedContracts, postAwardTabs } from '../../fixtures';
import type { PostAwardMode, PostAwardTabId } from '../../types';
import {
  AwardHero,
  AwardSidebar,
  formatMoney,
  ProcurexAwardFrame,
  SimpleTable,
  StatusBadge,
  TopSummary
} from './AwardsContractsProcurexShared';

const postAwardTabIds = postAwardTabs.map((tab) => tab.id);

function getMode(search: string): PostAwardMode {
  const mode = new URLSearchParams(search).get('mode');
  return mode === 'closed' ? 'closed' : 'active';
}

function getTab(search: string): PostAwardTabId {
  const tab = new URLSearchParams(search).get('tab') as PostAwardTabId | null;
  return tab && postAwardTabIds.includes(tab) ? tab : 'milestones';
}

function getContract(search: string) {
  return new URLSearchParams(search).get('contract') || closedContracts[0].id;
}

export function PostAwardTrackingProcurexPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = useMemo(() => getMode(location.search), [location.search]);
  const activeTab = useMemo(() => getTab(location.search), [location.search]);
  const selectedContract = useMemo(() => getContract(location.search), [location.search]);

  function setTab(tab: PostAwardTabId) {
    navigate(`/awards-contracts/post-award?mode=active&tab=${tab}`);
  }

  function selectClosedContract(contract: string) {
    navigate(`/awards-contracts/post-award?mode=closed&contract=${contract}&tab=closure`);
  }

  return (
    <ProcurexAwardFrame pageKey="post-award-tracking">
      <div className="main-layout procurement-layout evaluation-app-layout post-award-page" data-award-contract-workspace data-award-current-step="execution">
        <AwardSidebar
          title="Post-Award Tracking"
          subtitle="Contract #PX-2026-0892"
          activeQueue={mode === 'closed' ? 'closed-contracts' : 'active-contracts'}
          extraItems={<li><a href="#" data-navigate="contract-negotiation" data-route-search="tab=signatures">Back to Contract</a></li>}
        />

        <main className="main-content procurement-content post-award-workspace">
          <AwardHero
            kicker="Contract execution and monitoring"
            title="Construction of District Maternal Health Wing"
            copy="After signing, delivery, inspection, invoices, issues, variations, closure, and supplier performance are managed here."
            stats={[
              { value: '65%', label: 'Delivery progress' },
              { value: formatMoney(467000000), label: 'Paid' },
              { value: '4.4/5', label: 'Performance' }
            ]}
          />

          <TopSummary
            items={[
              { label: 'Buyer', value: 'Kilimanjaro Supplies Limited' },
              { label: 'Supplier', value: 'ABC Construction Ltd' },
              { label: 'Value', value: formatMoney(6850000000) },
              { label: 'Status', value: <StatusBadge value={mode === 'closed' ? 'Closed' : 'In Progress'} /> },
              { label: 'Balance', value: formatMoney(6383000000) }
            ]}
          />

          <section className="procurement-panel evaluation-panel award-draft-control-panel" data-post-award-mode-panel="active" style={{ display: mode === 'active' ? '' : 'none' }}>
            <div className="panel-heading">
              <div><span className="section-kicker">Execution draft</span><h2>Leave execution tracking and return to another tender</h2></div>
              <StatusBadge value="Execution active" />
            </div>
            <div className="inline-actions">
              <button className="btn btn-secondary" type="button">Save Draft</button>
              <button className="btn btn-secondary" type="button">Save Draft & Exit</button>
              <button className="btn btn-secondary" type="button" data-navigate="awarding-contracts">Open Another Tender</button>
            </div>
          </section>

          <section className="procurement-panel evaluation-panel post-award-panel" data-post-award-mode-panel="active" style={{ display: mode === 'active' ? '' : 'none' }}>
            <div className="panel-heading">
              <div><span className="section-kicker">Execution workspace</span><h2>Milestones, payments, issues, variations, closure, and performance</h2></div>
              <StatusBadge value="65% complete" />
            </div>

            <div className="tabs post-award-tabs">
              {postAwardTabs.map((tab) => (
                <div
                  className={`tab${tab.id === activeTab ? ' active' : ''}`}
                  data-tab={tab.id}
                  onClick={() => setTab(tab.id)}
                  role="button"
                  tabIndex={0}
                  key={tab.id}
                >
                  {tab.label}
                </div>
              ))}
            </div>

            <div className="post-award-tab-content">
              <div className={`tab-content ${activeTab === 'milestones' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="milestones">
                <div className="post-award-progress-card">
                  <div><strong>Overall Progress</strong><span>65%</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: '65%' }} /></div>
                </div>
                <SimpleTable headers={['Milestone', 'Description', 'Scheduled', 'Actual', 'Status', 'Evidence', 'Payment %', 'Action']}>
                  <tr>
                    <td><strong>Mobilization</strong></td>
                    <td>Site handover, work program, and performance security verification.</td>
                    <td>2026-07-20</td>
                    <td>2026-07-18</td>
                    <td><StatusBadge value="Accepted" /></td>
                    <td>Site handover memo</td>
                    <td>10%</td>
                    <td><button className="btn btn-secondary btn-sm" type="button">Review</button></td>
                  </tr>
                  <tr>
                    <td><strong>MEP Installations</strong></td>
                    <td>Mechanical, electrical, and plumbing installations.</td>
                    <td>2026-08-20</td>
                    <td>2026-08-23</td>
                    <td><StatusBadge value="Under Review" /></td>
                    <td>Inspection request GRN-2026-002</td>
                    <td>40%</td>
                    <td><button className="btn btn-secondary btn-sm" type="button">Review</button></td>
                  </tr>
                  <tr>
                    <td><strong>Final Handover</strong></td>
                    <td>Finishing works, completion certificate, and defect list.</td>
                    <td>2026-09-30</td>
                    <td>-</td>
                    <td><StatusBadge value="Pending" /></td>
                    <td>Not submitted</td>
                    <td>50%</td>
                    <td><button className="btn btn-secondary btn-sm" type="button">Schedule</button></td>
                  </tr>
                </SimpleTable>
              </div>

              <div className={`tab-content ${activeTab === 'payments' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="payments">
                <section className="post-award-metric-grid">
                  <article><span>Contract amount</span><strong>{formatMoney(6850000000)}</strong></article>
                  <article><span>Amount invoiced</span><strong>{formatMoney(4670000000)}</strong></article>
                  <article><span>Amount paid</span><strong>{formatMoney(467000000)}</strong></article>
                  <article><span>Balance remaining</span><strong>{formatMoney(6383000000)}</strong></article>
                </section>
                <SimpleTable headers={['Invoice', 'Milestone', 'Amount', 'Status', '3-way Match', 'Action']}>
                  <tr>
                    <td><strong>INV-2026-001</strong><span>PO, certificate, and invoice align.</span></td>
                    <td>Mobilization</td>
                    <td>{formatMoney(467000000)}</td>
                    <td><StatusBadge value="Paid" /></td>
                    <td><div className="match-status"><span className="matched">PO OK</span><span className="matched">Certificate OK</span><span className="matched">Invoice OK</span></div></td>
                    <td><button className="btn btn-secondary btn-sm" type="button">View</button></td>
                  </tr>
                  <tr>
                    <td><strong>INV-2026-002</strong><span>Finance review required.</span></td>
                    <td>MEP Installations</td>
                    <td>{formatMoney(1868000000)}</td>
                    <td><StatusBadge value="Pending Approval" /></td>
                    <td><div className="match-status"><span className="matched">PO OK</span><span className="mismatch">Certificate !</span><span className="matched">Invoice OK</span></div></td>
                    <td><button className="btn btn-secondary btn-sm" type="button" disabled aria-disabled="true">Approve</button></td>
                  </tr>
                </SimpleTable>
              </div>

              <div className={`tab-content ${activeTab === 'issues' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="issues">
                <SimpleTable headers={['Issue', 'Raised By', 'Priority', 'Responsible Party', 'Status', 'Required Action']}>
                  <tr><td><strong>ISS-001: Delivery delay for Item #5</strong></td><td>Buyer</td><td><StatusBadge value="Medium" /></td><td>Supplier</td><td><StatusBadge value="Resolved" /></td><td>Record accepted revised schedule.</td></tr>
                  <tr><td><strong>ISS-002: Missing updated insurance document</strong></td><td>Buyer</td><td><StatusBadge value="High" /></td><td>Supplier</td><td><StatusBadge value="Action Required" /></td><td>Upload valid insurance certificate.</td></tr>
                </SimpleTable>
                <div className="inline-actions"><button className="btn btn-primary" type="button">Raise Issue</button><button className="btn btn-secondary" type="button">Upload Evidence</button></div>
              </div>

              <div className={`tab-content ${activeTab === 'variations' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="variations">
                <section className="post-award-metric-grid">
                  <article><span>Total price impact</span><strong>{formatMoney(42000000)}</strong></article>
                  <article><span>Total timeline impact</span><strong>10 days</strong></article>
                  <article><span>Open variations</span><strong>2</strong></article>
                </section>
                <SimpleTable headers={['Variation', 'Requested By', 'Impact', 'Status', 'Awaiting', 'Actions']}>
                  <tr><td><strong>Extension of Time for Imported Equipment</strong><span>Courier notice and customs letter</span></td><td>Supplier</td><td>None / 4 days</td><td><StatusBadge value="Under Review" /></td><td><strong>Buyer</strong><span>Buyer decision required</span></td><td><button className="btn btn-primary btn-sm" type="button">Request More Info</button></td></tr>
                  <tr><td><strong>Additional Drainage Works</strong><span>Site instruction draft</span></td><td>Buyer</td><td>{formatMoney(42000000)} / 6 days</td><td><StatusBadge value="Draft Variation" /></td><td><strong>Supplier</strong><span>Supplier review required</span></td><td><button className="btn btn-primary btn-sm" type="button">Request More Info</button></td></tr>
                </SimpleTable>
              </div>

              <div className={`tab-content ${activeTab === 'closure' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="closure">
                <div className="closure-counter">0 of 6 mandatory items complete</div>
                <ul className="closure-checklist" role="list">
                  {['All deliverables completed', 'All invoices reconciled', 'Performance security release decision', 'No unresolved disputes', 'Final performance rating', 'Archive approval'].map((item) => (
                    <li key={item}>
                      <label><input type="checkbox" required /> <span><strong>{item}</strong><StatusBadge value="Pending" /></span></label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`tab-content ${activeTab === 'performance' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="performance">
                <section className="post-award-performance-grid">
                  <article><div><strong>Quality</strong><span>4.5/5</span></div><p>Inspections accepted with minor corrective works.</p></article>
                  <article><div><strong>Timeliness</strong><span>4.1/5</span></div><p>One delivery delay resolved through approved schedule revision.</p></article>
                  <article><div><strong>Communication</strong><span>4.6/5</span></div><p>Supplier responses and evidence uploads remain timely.</p></article>
                </section>
              </div>
            </div>
          </section>

          <section className="procurement-panel evaluation-panel post-award-panel closed-contracts-panel" data-post-award-mode-panel="closed" style={{ display: mode === 'closed' ? '' : 'none' }}>
            <div className="panel-heading">
              <div><span className="section-kicker">Closed contracts</span><h2>Read-only closure and performance records</h2></div>
              <StatusBadge value="Read-only archive" />
            </div>
            <div className="supplier-detail-tabs awarding-contract-tabs" role="tablist" aria-label="Closed contract records">
              {closedContracts.map((contract) => (
                <button
                  className={`supplier-detail-tab${contract.id === selectedContract ? ' active' : ''}`}
                  type="button"
                  data-closed-contract-jump={contract.id}
                  onClick={() => selectClosedContract(contract.id)}
                  key={contract.id}
                >
                  {contract.title}
                </button>
              ))}
            </div>
            <div className="closed-contract-detail-list">
              {closedContracts.map((contract) => (
                <article
                  className={`closed-contract-detail${contract.id === selectedContract ? ' active' : ''}`}
                  data-closed-contract-panel={contract.id}
                  style={{ display: contract.id === selectedContract ? '' : 'none' }}
                  key={contract.id}
                >
                  <div className="panel-heading">
                    <div><span className="section-kicker">Closure detail</span><h3>{contract.title}</h3></div>
                    <StatusBadge value={contract.status} />
                  </div>
                  <section className="contract-overview-grid">
                    <article><span>Final value</span><strong>{formatMoney(contract.finalValue, contract.currency)}</strong></article>
                    <article><span>Completion date</span><strong>{contract.completionDate}</strong></article>
                    <article><span>Performance</span><strong>{contract.performanceRating}</strong></article>
                    <article><span>Record state</span><strong>Read-only archive</strong></article>
                  </section>
                  <div className="award-control-grid">
                    <article><strong>Deliverables</strong><span>Completed and accepted</span></article>
                    <article><strong>Inspections</strong><span>Final inspection recorded</span></article>
                    <article><strong>Invoices</strong><span>Processed or reconciled</span></article>
                    <article><strong>Disputes</strong><span>Resolved before closure</span></article>
                    <article><strong>Performance security</strong><span>Release decision recorded</span></article>
                    <article><strong>Supplier rating</strong><span>{contract.performanceRating}</span></article>
                  </div>
                  <div className="evaluation-notice success">This closure record is archived. Changes require a formal reopening or amendment workflow.</div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </ProcurexAwardFrame>
  );
}
