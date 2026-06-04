import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { contractTabs } from '../../fixtures';
import type { ContractTabId } from '../../types';
import {
  AwardHero,
  AwardSidebar,
  formatMoney,
  ProcurexAwardFrame,
  SimpleTable,
  StatusBadge,
  TopSummary
} from './AwardsContractsProcurexShared';

const contractTabIds = contractTabs.map((tab) => tab.id);

function getTab(search: string): ContractTabId {
  const tab = new URLSearchParams(search).get('tab') as ContractTabId | null;
  return tab && contractTabIds.includes(tab) ? tab : 'overview';
}

export function ContractNegotiationProcurexPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = useMemo(() => getTab(location.search), [location.search]);

  function setTab(tab: ContractTabId) {
    navigate(`/awards-contracts/negotiation?tab=${tab}`);
  }

  return (
    <ProcurexAwardFrame pageKey="contract-negotiation">
      <div className="main-layout procurement-layout evaluation-app-layout contract-page" data-award-contract-workspace data-award-current-step={activeTab}>
        <AwardSidebar
          title="Contracts in Progress"
          subtitle="Contract #PX-2026-0892"
          activeQueue="contracts-in-progress"
          extraItems={<li><a href="#" data-navigate="awarding-contracts" data-route-search="queue=contracts-in-progress">Back to Contract Queue</a></li>}
        />

        <main className="main-content procurement-content evaluation-workspace contract-workspace">
          <AwardHero
            kicker="Contract preparation"
            title="Construction of District Maternal Health Wing"
            copy="Draft contract, party review, negotiation, legal review, approval, and digital signing happen in one controlled workspace."
            stats={[
              { value: formatMoney(6850000000), label: 'Contract value' },
              { value: 'Draft', label: 'Current status' },
              { value: '2 parties', label: 'Review path' }
            ]}
          />

          <TopSummary
            items={[
              { label: 'Buyer', value: 'Kilimanjaro Supplies Limited' },
              { label: 'Supplier', value: 'ABC Construction Ltd' },
              { label: 'Contract value', value: formatMoney(6850000000) },
              { label: 'Status', value: <StatusBadge value="Draft Contract" /> },
              { label: 'Next action', value: 'Review and sign' }
            ]}
          />

          <section className="procurement-panel evaluation-panel post-award-panel">
            <div className="panel-heading">
              <div><span className="section-kicker">Contract workflow</span><h2>Draft, negotiate, approve, and sign the contract</h2></div>
              <StatusBadge value="Change Requested" />
            </div>

            <div className="tabs post-award-tabs">
              {contractTabs.map((tab) => (
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
              <div className={`tab-content ${activeTab === 'overview' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="overview">
                <section className="contract-overview-grid">
                  <article><span>Source tender</span><strong>PX-WRK-2026-001</strong></article>
                  <article><span>Approved supplier</span><strong>ABC Construction Ltd</strong></article>
                  <article><span>Payment terms</span><strong>Milestone based</strong></article>
                  <article><span>Performance security</span><strong>Required before activation</strong></article>
                </section>
                <div className="evaluation-notice warning">Contract generation is controlled by award approval, notice, standstill, supplier acceptance, and document checks.</div>
              </div>

              <div className={`tab-content ${activeTab === 'buyer-review' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="buyer-review">
                <div className="evaluation-form-grid recommendation-form">
                  <label>Buyer reviewer <input className="form-input" defaultValue="Authorized Representative" /></label>
                  <label>Scope confirmation <textarea className="form-input" rows={4} defaultValue="Tender scope, BOQ, drawings, specifications, and evaluated amount confirmed." /></label>
                  <label>Review status <select className="form-input" defaultValue="Pending review"><option>Pending review</option><option>Approved</option><option>Change requested</option></select></label>
                </div>
              </div>

              <div className={`tab-content ${activeTab === 'supplier-review' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="supplier-review">
                <div className="evaluation-form-grid recommendation-form">
                  <label>Supplier reviewer <input className="form-input" defaultValue="ABC Construction Ltd" /></label>
                  <label>Supplier comment <textarea className="form-input" rows={4} defaultValue="Request weekly reporting during mobilization and monthly after stabilization." /></label>
                  <label>Supplier status <select className="form-input" defaultValue="Change requested"><option>Accepted</option><option>Change requested</option><option>Clarification requested</option></select></label>
                </div>
              </div>

              <div className={`tab-content ${activeTab === 'negotiation' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="negotiation">
                <SimpleTable headers={['Clause', 'Requested By', 'Current Text', 'Proposed Change', 'Status', 'Action']}>
                  <tr>
                    <td><strong>Reporting frequency</strong></td>
                    <td>Supplier</td>
                    <td>Monthly progress reports</td>
                    <td>Weekly during mobilization, monthly after stabilization</td>
                    <td><StatusBadge value="Under Review" /></td>
                    <td><button className="btn btn-primary btn-sm" type="button">Respond</button></td>
                  </tr>
                  <tr>
                    <td><strong>Payment certificate timing</strong></td>
                    <td>Buyer</td>
                    <td>Within 30 days</td>
                    <td>After accepted milestone certificate and 3-way match</td>
                    <td><StatusBadge value="Draft" /></td>
                    <td><button className="btn btn-secondary btn-sm" type="button">Edit</button></td>
                  </tr>
                </SimpleTable>
              </div>

              <div className={`tab-content ${activeTab === 'legal-review' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="legal-review">
                <div className="award-control-grid">
                  {['Dispute resolution', 'Penalty clauses', 'Termination rights', 'Insurance obligations'].map((item) => (
                    <article key={item}><strong>{item}</strong><span>Legal review checklist item.</span><StatusBadge value="Pending Review" /></article>
                  ))}
                </div>
              </div>

              <div className={`tab-content ${activeTab === 'final-approval' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="final-approval">
                <div className="status-pipeline horizontal">
                  <div className="done"><strong>Draft Contract</strong><span>Generated from approved award</span></div>
                  <div className="current"><strong>Review</strong><span>Buyer and supplier review</span></div>
                  <div><strong>Final Approval</strong><span>Authorized approval before signing</span></div>
                  <div><strong>Signing</strong><span>Digital signature workflow</span></div>
                </div>
                <div className="inline-actions">
                  <button className="btn btn-secondary" type="button">Save Draft</button>
                  <button className="btn btn-primary" type="button">Submit Final Approval</button>
                </div>
              </div>

              <div className={`tab-content ${activeTab === 'signatures' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="signatures">
                <div className="contract-signature-grid">
                  <article className="contract-signature-card">
                    <h3>Supplier Signature</h3>
                    <div className="signature-preview"><strong>Supplier</strong><span>ABC Construction Ltd</span></div>
                    <input className="form-input" defaultValue="Authorized Supplier Signatory" aria-label="Supplier representative" />
                    <span><StatusBadge value="Supplier signs first" /></span>
                    <small>Timestamp: Pending</small>
                    <button className="btn btn-primary" type="button" disabled aria-disabled="true">Apply Digital Signature</button>
                  </article>
                  <article className="contract-signature-card">
                    <h3>Buyer Signature</h3>
                    <div className="signature-preview"><strong>Buyer</strong><span>Countersign after supplier</span></div>
                    <input className="form-input" defaultValue="Authorized Representative" aria-label="Buyer representative" />
                    <span><StatusBadge value="Buyer countersigns" /></span>
                    <small>Timestamp: Pending</small>
                    <button className="btn btn-secondary" type="button" disabled aria-disabled="true">Waiting for supplier signature</button>
                  </article>
                </div>
                <div className="status-pipeline horizontal contract-signature-pipeline">
                  <div className="current"><strong>Terms Agreed</strong><span>Both parties confirm contract terms</span></div>
                  <div><strong>Supplier Signs</strong><span>Supplier signature is first</span></div>
                  <div><strong>Buyer Signs</strong><span>Buyer countersigns</span></div>
                  <div><strong>Contract Active</strong><span>Execution workspace opens</span></div>
                </div>
                <div className="evaluation-notice success">Signature audit records signer identity, document hash, timestamp, certificate metadata, and final signed version hash.</div>
                <div className="inline-actions">
                  <button className="btn btn-secondary" type="button">Save Draft</button>
                  <button className="btn btn-secondary" type="button">Save Draft & Exit</button>
                  <button className="btn btn-primary" type="button" data-navigate="post-award-tracking" data-route-search="mode=active&tab=milestones">Activate Contract Tracking</button>
                </div>
              </div>

              <div className={`tab-content ${activeTab === 'activity' ? 'tab-content--visible' : 'tab-content--hidden'}`} data-tab="activity">
                <SimpleTable headers={['Time', 'Actor', 'Event', 'Status']}>
                  <tr>
                    <td>2026-06-03 13:22</td>
                    <td>System</td>
                    <td>Awarding and contract draft created</td>
                    <td><StatusBadge value="Draft" /></td>
                  </tr>
                </SimpleTable>
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProcurexAwardFrame>
  );
}
