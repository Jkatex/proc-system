import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { store } from '@/app/store';
import '@/i18n';
import { summaryCards } from './fixtures';
import { awardsContractsApi } from './api';
import { AwardingContractsProcurexPage } from './components/procurex/AwardingContractsProcurexPage';
import { AwardRecommendationProcurexPage } from './components/procurex/AwardRecommendationProcurexPage';
import { AwardResponseProcurexPage } from './components/procurex/AwardResponseProcurexPage';
import { ActionFormPanel } from './components/procurex/AwardContractActionForms';
import { AwardContractAccessProvider } from './components/procurex/AwardContractRoleAccess';
import { ContractNegotiationProcurexPage } from './components/procurex/ContractNegotiationProcurexPage';
import { PostAwardTrackingProcurexPage } from './components/procurex/PostAwardTrackingProcurexPage';

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
}

function renderFlow(page: ReactNode, initialEntry: string) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialEntry]}>
        {page}
        <LocationProbe />
      </MemoryRouter>
    </Provider>
  );
}

describe('awards and contracts empty lifecycle flow', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('opens the requested dashboard queue from the URL with an empty state', async () => {
    const { container } = renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts?queue=awards-received');

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Awards Received' })).toHaveClass('active'));

    const panel = container.querySelector<HTMLElement>('[data-tab="awards-received"].tab-content--visible');
    expect(panel).toBeInTheDocument();
    expect(within(panel!).getByText('No supplier awards have been received yet.')).toBeInTheDocument();
  });

  it('updates dashboard queue URLs from summary cards and side navigation', async () => {
    const user = userEvent.setup();
    const { container } = renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts');

    await user.click(screen.getByRole('button', { name: 'Go to Closed Contracts tab' }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/awards-contracts?queue=closed-contracts'));
    expect(screen.getByRole('tab', { name: 'Closed Contracts' })).toHaveClass('active');

    const sideNavAwardsReceived = container.querySelector<HTMLElement>(
      '.sidebar-nav [data-awarding-tab-jump="awards-received"]'
    );
    expect(sideNavAwardsReceived).toBeInTheDocument();
    await user.click(sideNavAwardsReceived!);
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/awards-contracts?queue=awards-received'));
    expect(screen.getByRole('tab', { name: 'Awards Received' })).toHaveClass('active');
  });

  it('renders dashboard summary counts as zero', async () => {
    renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts');

    await waitFor(() => expect(screen.getByRole('tab', { name: 'My Urgent Actions' })).toBeInTheDocument());
    for (const card of summaryCards) {
      const summary = screen.getByRole('button', { name: `Go to ${card.label} tab` });
      expect(within(summary).getByText('0')).toBeInTheDocument();
    }
  });

  it('shows an empty urgent actions queue', async () => {
    const { container } = renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts?queue=my-urgent-actions');
    const panel = container.querySelector<HTMLElement>('[data-tab="my-urgent-actions"].tab-content--visible');

    await waitFor(() => expect(panel).toBeInTheDocument());
    expect(within(panel!).getByText('No urgent award or contract actions yet.')).toBeInTheDocument();
  });

  it('renders empty child workspaces without selected records', async () => {
    renderFlow(<AwardRecommendationProcurexPage />, '/awards-contracts/recommendation');
    await waitFor(() => expect(screen.getByText('No evaluation result is ready for awarding.')).toBeInTheDocument());

    renderFlow(<AwardResponseProcurexPage />, '/awards-contracts/award-response');
    await waitFor(() => expect(screen.getAllByText('No award selected').length).toBeGreaterThan(0));

    renderFlow(<ContractNegotiationProcurexPage />, '/awards-contracts/negotiation');
    expect(screen.getByText('No contract is in progress.')).toBeInTheDocument();

    renderFlow(<PostAwardTrackingProcurexPage />, '/awards-contracts/post-award');
    expect(screen.getByText('No post-award records are available yet.')).toBeInTheDocument();
  });

  it('groups populated award recommendation controls into readable workflow sections', async () => {
    const user = userEvent.setup();
    const awardAction = {
      id: 'award-rec-1',
      roleContext: 'BUYER' as const,
      sourceType: 'TENDER_CREATED' as const,
      tenderId: 'tender-1',
      awardId: 'rec-1',
      noticeId: 'notice-1',
      contractId: 'contract-1',
      title: 'Medical supplies tender',
      otherParty: 'Kilimanjaro Supplies',
      currentStage: 'Award approval',
      requiredAction: 'Approve award',
      dueDate: new Date().toISOString(),
      riskLevel: 'Medium' as const,
      status: 'RECOMMENDED',
      amount: 140000000,
      currency: 'TZS',
      nextRoute: '/awards-contracts/recommendation?recommendation=rec-1'
    };
    vi.spyOn(awardsContractsApi, 'dashboard').mockResolvedValue({
      summary: { urgentActions: 0, awardQueues: 1, contractActions: 0 },
      queues: {
        'my-urgent-actions': [],
        'awarding-in-progress': [awardAction],
        'awards-received': [],
        'contracts-in-progress': [],
        'active-contracts': [],
        'closed-contracts': []
      }
    });
    vi.spyOn(awardsContractsApi, 'recommendation').mockResolvedValue({
      ...awardAction,
      approvalRoutes: [{ id: 'bd822b04-54c0-4c89-a4f2-32c8db2cf72f', title: 'Single-user award approval', status: 'APPROVED', note: 'Seeded single-user approval.' }],
      tieBreakers: [{ id: 'tie-1', title: 'Delivery tie-breaker', status: 'RESOLVED', note: 'Tie-breaker resolved.' }],
      feasibilityChecks: [{ id: 'feasibility-1', title: 'Delivery feasibility', status: 'APPROVED', note: 'Feasibility approved.' }],
      standstillPeriods: [],
      awardNotifications: [],
      budgetCommitments: [{ id: 'budget-1', budgetCode: 'PROCUREMENT.AWARD', status: 'PENDING', note: 'Budget reserved.' }],
      audit: []
    });

    renderFlow(<AwardRecommendationProcurexPage />, '/awards-contracts/recommendation?recommendation=rec-1');

    await waitFor(() => expect(screen.getByRole('tab', { name: /Readiness/i })).toHaveClass('active'));
    expect(screen.getByText('Evaluation handoff checks')).toBeInTheDocument();
    expect(screen.queryByText(/committee/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Actor user ID/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /Registers/i }));
    expect(screen.getByText('Single-user approval history')).toBeInTheDocument();
    expect(screen.getByText('Single-user award approval')).toBeInTheDocument();
    expect(screen.getByText(/ID bd822b04/)).toBeInTheDocument();
    expect(screen.getByText('Tie-breaker register')).toBeInTheDocument();
    expect(screen.getByText('Budget commitments')).toBeInTheDocument();
  });

  it('renders dashboard queue items as action cards', async () => {
    const user = userEvent.setup();
    const awardAction = {
      id: 'award-card-1',
      roleContext: 'BUYER' as const,
      sourceType: 'TENDER_CREATED' as const,
      tenderId: 'tender-card-1',
      awardId: 'rec-card-1',
      noticeId: null,
      contractId: null,
      title: 'Road maintenance award',
      otherParty: 'Arusha Works Ltd',
      currentStage: 'Award approval',
      requiredAction: 'Approve award',
      dueDate: new Date().toISOString(),
      riskLevel: 'Medium' as const,
      status: 'RECOMMENDED',
      amount: 90000000,
      currency: 'TZS',
      nextRoute: '/awards-contracts/recommendation?recommendation=rec-card-1',
      nextAction: {
        key: 'approve-award',
        label: 'Approve award',
        url: '/awards-contracts/recommendation?recommendation=rec-card-1',
        method: 'GET' as const,
        canAct: true,
        disabledReason: null,
        requiredRole: 'BUYER' as const,
        requiredEvidence: []
      }
    };
    vi.spyOn(awardsContractsApi, 'dashboard').mockResolvedValue({
      summary: { urgentActions: 0, awardQueues: 1, contractActions: 0 },
      queues: {
        'my-urgent-actions': [],
        'awarding-in-progress': [awardAction],
        'awards-received': [],
        'contracts-in-progress': [],
        'active-contracts': [],
        'closed-contracts': []
      }
    });

    renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts?queue=awarding-in-progress');

    await waitFor(() => expect(screen.getByText('Road maintenance award')).toBeInTheDocument());
    expect(screen.getByText('Arusha Works Ltd')).toBeInTheDocument();
    expect(screen.getByText('Award approval')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Approve award' }));
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Approve award' })).toBeInTheDocument());
    expect(screen.getByText(/Open the focused workspace for this action/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/awards-contracts/recommendation?recommendation=rec-card-1'));
  });

  it('renders grouped contract formation and post-award tabs from contract detail', async () => {
    const contract = {
      id: 'contract-1',
      reference: 'PX-C-1',
      title: 'Road maintenance contract',
      status: 'NEGOTIATION',
      buyerName: 'Buyer Org',
      supplierName: 'Supplier Org',
      amount: 90000000,
      currency: 'TZS',
      payload: { draft: { parties: { buyer: 'Buyer Org' }, tender: {}, financials: {}, clauses: [] } },
      parties: [{ id: 'party-1', title: 'Buyer Org', status: 'BUYER' }],
      clauses: [{ id: 'clause-1', type: 'clause', title: 'Payment terms', status: 'OPEN', dueDate: null, note: 'Review required', payload: {}, createdAt: new Date().toISOString(), updatedAt: null }],
      negotiations: [],
      signatures: [],
      milestones: [],
      managementPlan: null,
      mobilizationItems: [],
      kpis: [],
      deliverables: [],
      acceptances: [],
      inspections: [],
      goodsInspections: [],
      paymentSchedules: [],
      invoices: [],
      payments: [],
      threeWayMatches: [],
      paymentApprovals: [],
      paymentConfirmations: [],
      risks: [],
      riskForecasts: [],
      variations: [],
      issues: [],
      disputes: [],
      terminations: [],
      warranties: [],
      requiredDocuments: [],
      workflowApprovals: [],
      urgentActions: [],
      notifications: [],
      closeout: null,
      supplierPerformanceRecords: [],
      performanceScores: [],
      supplierRiskProfile: null,
      audit: []
    };
    vi.spyOn(awardsContractsApi, 'contract').mockResolvedValue(contract);

    const contractRender = renderFlow(<ContractNegotiationProcurexPage />, '/awards-contracts/negotiation?contract=contract-1');
    await waitFor(() => expect(screen.getByRole('tab', { name: /Draft/i })).toBeInTheDocument());
    expect(screen.getByRole('tab', { name: /Owner Approval/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Registers/i })).toBeInTheDocument();
    contractRender.unmount();

    renderFlow(<PostAwardTrackingProcurexPage />, '/awards-contracts/post-award?contract=contract-1');
    await waitFor(() => expect(screen.getByRole('tab', { name: /CMP/i })).toBeInTheDocument());
    expect(screen.getByRole('tab', { name: /Payments/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Termination/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Registers/i })).toBeInTheDocument();
  });

  it('filters post-award contract management actions by focused group', async () => {
    const user = userEvent.setup();
    const contract = {
      id: 'contract-1',
      reference: 'PX-C-1',
      title: 'Road maintenance contract',
      status: 'ACTIVE',
      buyerName: 'Buyer Org',
      supplierName: 'Supplier Org',
      amount: 90000000,
      currency: 'TZS',
      payload: {},
      parties: [],
      clauses: [],
      negotiations: [],
      signatures: [],
      milestones: [{ id: 'milestone-1', type: 'milestone', title: 'Delivery milestone', status: 'OPEN', dueDate: null, note: 'Pending delivery', payload: {}, createdAt: new Date().toISOString(), updatedAt: null }],
      managementPlan: null,
      mobilizationItems: [{ id: 'mob-1', type: 'mobilization', title: 'Kickoff meeting', status: 'OPEN', dueDate: null, note: 'Pending', payload: {}, createdAt: new Date().toISOString(), updatedAt: null }],
      kpis: [],
      deliverables: [],
      acceptances: [],
      inspections: [],
      goodsInspections: [],
      paymentSchedules: [],
      invoices: [{ id: 'invoice-1', reference: 'INV-1', status: 'SUBMITTED', amount: 1000, currency: 'TZS', createdAt: new Date().toISOString() }],
      payments: [],
      threeWayMatches: [],
      paymentApprovals: [],
      paymentConfirmations: [],
      risks: [{ id: 'risk-1', type: 'risk', title: 'Delay risk', status: 'OPEN', dueDate: null, note: 'Monitor closely', payload: {}, createdAt: new Date().toISOString(), updatedAt: null }],
      riskForecasts: [],
      variations: [],
      issues: [],
      disputes: [],
      terminations: [{ id: 'term-1', type: 'termination', title: 'Termination review', status: 'UNDER_REVIEW', dueDate: null, note: 'Review', payload: {}, createdAt: new Date().toISOString(), updatedAt: null }],
      warranties: [],
      requiredDocuments: [],
      workflowApprovals: [],
      urgentActions: [],
      notifications: [],
      closeout: null,
      supplierPerformanceRecords: [],
      performanceScores: [],
      supplierRiskProfile: null,
      audit: []
    };
    vi.spyOn(awardsContractsApi, 'contract').mockResolvedValue(contract);
    const { container } = renderFlow(<PostAwardTrackingProcurexPage />, '/awards-contracts/post-award?contract=contract-1');
    const form = (title: string) => container.querySelector(`[data-award-contract-form="${title}"]`);

    await waitFor(() => expect(screen.getByRole('tab', { name: /CMP/i })).toHaveClass('active'));
    expect(form('Contract Management Plan')).toBeInTheDocument();
    expect(form('Contract status')).toBeInTheDocument();
    expect(form('Milestone')).toBeInTheDocument();
    expect(form('Invoice submission')).not.toBeInTheDocument();
    expect(form('Termination')).not.toBeInTheDocument();
    expect(form('Supplier performance')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /Payments/i }));
    expect(form('Invoice submission')).toBeInTheDocument();
    expect(form('Payment approval')).toBeInTheDocument();
    expect(form('Contract Management Plan')).not.toBeInTheDocument();
    expect(form('Termination')).not.toBeInTheDocument();
    expect(form('Supplier performance')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /Termination/i }));
    expect(form('Termination')).toBeInTheDocument();
    expect(form('Termination notice')).toBeInTheDocument();
    expect(form('Invoice submission')).not.toBeInTheDocument();
    expect(form('Risk')).not.toBeInTheDocument();
    expect(form('Deliverable')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /Registers/i }));
    expect(screen.getByText('Mobilization')).toBeInTheDocument();
    expect(screen.getByText('Invoices')).toBeInTheDocument();
    expect(container.querySelector('[data-award-contract-form]')).not.toBeInTheDocument();
  });

  it('locks production action forms that belong to the other contract party', () => {
    const supplierAccess = {
      viewerRole: 'SUPPLIER' as const,
      canManageBuyerActions: false,
      canSubmitSupplierActions: true,
      canSignBuyer: false,
      canSignSupplier: true,
      readOnlyReason: 'Buyer actions are read-only for the supplier.'
    };
    render(
      <AwardContractAccessProvider access={supplierAccess}>
        <ActionFormPanel
          title="Contract Management Plan"
          badge="CMP"
          fields={[{ name: 'objectives', label: 'Objectives', kind: 'textarea' }]}
          onSubmit={async () => ({})}
        />
      </AwardContractAccessProvider>
    );

    expect(screen.getByText('Buyer actions are read-only for the supplier.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
  });

  it('opens production forms in a drawer and submits searchable picker values', async () => {
    const user = userEvent.setup();
    const submit = vi.fn().mockResolvedValue({});
    render(
      <AwardContractAccessProvider access={{
        viewerRole: 'BUYER',
        canManageBuyerActions: true,
        canSubmitSupplierActions: false,
        canSignBuyer: true,
        canSignSupplier: false,
        readOnlyReason: null
      }}>
        <ActionFormPanel
          title="Inspection"
          badge="Buyer"
          fields={[
            {
              name: 'milestoneId',
              label: 'Milestone',
              kind: 'select',
              required: true,
              options: [
                { value: '', label: 'Select milestone' },
                { value: 'milestone-1', label: 'Delivery milestone (SUBMITTED)' }
              ]
            },
            { name: 'title', label: 'Title', kind: 'text', required: true }
          ]}
          initialValues={{ milestoneId: '', title: 'Goods inspection' }}
          onSubmit={submit}
        />
      </AwardContractAccessProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Open action' }));
    expect(screen.getByRole('dialog', { name: 'Inspection' })).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox', { name: /Milestone/i }), 'Delivery');
    await user.click(screen.getByRole('option', { name: /Delivery milestone/i }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(submit).toHaveBeenCalledWith(expect.objectContaining({ milestoneId: 'milestone-1', title: 'Goods inspection' }), expect.any(Object)));
  });
});
