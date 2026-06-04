import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { store } from '@/app/store';
import '@/i18n';
import { summaryCards, urgentActions } from './fixtures';
import { AwardingContractsProcurexPage } from './components/procurex/AwardingContractsProcurexPage';
import { AwardResponseProcurexPage } from './components/procurex/AwardResponseProcurexPage';
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

describe('awards and contracts lifecycle flow', () => {
  it('opens the requested dashboard queue from the URL', async () => {
    const { container } = renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts?queue=awards-received');

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Awards Received' })).toHaveClass('active'));

    const panel = container.querySelector<HTMLElement>('[data-tab="awards-received"].tab-content--visible');
    expect(panel).toBeInTheDocument();
    expect(within(panel!).getByText('Supply of Laptops')).toBeInTheDocument();
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

  it('routes supplier awards received to the supplier response flow', async () => {
    const user = userEvent.setup();
    const { container } = renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts?queue=awards-received');

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Awards Received' })).toHaveClass('active'));
    const panel = container.querySelector<HTMLElement>('[data-tab="awards-received"].tab-content--visible');
    const firstSupplierAwardAction = panel!.querySelector<HTMLElement>('[data-route-search="award=supplier-award-1"]');
    expect(firstSupplierAwardAction).toBeInTheDocument();
    await user.click(firstSupplierAwardAction!);

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent('/awards-contracts/award-response?award=supplier-award-1')
    );
  });

  it('routes contract actions to the intended contract tab', async () => {
    const user = userEvent.setup();
    const { container } = renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts?queue=contracts-in-progress');

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Contracts in Progress' })).toHaveClass('active'));
    const panel = container.querySelector<HTMLElement>('[data-tab="contracts-in-progress"].tab-content--visible');
    await user.click(within(panel!).getByRole('button', { name: 'Buyer Signature Required' }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/awards-contracts/negotiation?tab=signatures'));
  });

  it('routes active and closed contract actions to the correct post-award modes', async () => {
    const user = userEvent.setup();
    const { container } = renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts?queue=active-contracts');

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Active Contracts' })).toHaveClass('active'));
    const activePanel = container.querySelector<HTMLElement>('[data-tab="active-contracts"].tab-content--visible');
    await user.click(within(activePanel!).getAllByRole('button', { name: 'Track' })[0]);
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/awards-contracts/post-award?mode=active&tab=milestones'));

    await user.click(screen.getByRole('button', { name: 'Go to Closed Contracts tab' }));
    const closedPanel = container.querySelector<HTMLElement>('[data-tab="closed-contracts"].tab-content--visible');
    await user.click(within(closedPanel!).getAllByRole('button', { name: 'View Closure' })[0]);
    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/awards-contracts/post-award?mode=closed&tab=closure&contract=closed-contract-1'
      )
    );
  });

  it('opens the selected supplier award response panel from the URL', async () => {
    const { container } = renderFlow(
      <AwardResponseProcurexPage />,
      '/awards-contracts/award-response?award=supplier-award-2'
    );

    const activePanel = container.querySelector<HTMLElement>('[data-award-response-panel="supplier-award-2"]');
    await waitFor(() => expect(activePanel).toHaveClass('active'));
    expect(within(activePanel!).getByRole('heading', { name: 'Maintenance Services' })).toBeInTheDocument();
  });

  it('opens post-award tracking in closed read-only mode from the URL', async () => {
    const { container } = renderFlow(
      <PostAwardTrackingProcurexPage />,
      '/awards-contracts/post-award?mode=closed&contract=closed-contract-2&tab=closure'
    );

    const closedMode = container.querySelector<HTMLElement>('[data-post-award-mode-panel="closed"]');
    const activeClosedContract = container.querySelector<HTMLElement>('[data-closed-contract-panel="closed-contract-2"]');

    await waitFor(() => expect(closedMode).not.toHaveStyle({ display: 'none' }));
    expect(activeClosedContract).toHaveClass('active');
    expect(within(activeClosedContract!).getByText('Network Cabling Works')).toBeInTheDocument();
  });

  it('renders dashboard summary counts from typed fixtures', async () => {
    renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts');

    for (const card of summaryCards) {
      const summary = screen.getByRole('button', { name: `Go to ${card.label} tab` });
      expect(within(summary).getByText(String(card.value))).toBeInTheDocument();
    }
  });

  it('shows buyer and supplier role badges in urgent actions', async () => {
    const { container } = renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts?queue=my-urgent-actions');
    const panel = container.querySelector<HTMLElement>('[data-tab="my-urgent-actions"].tab-content--visible');

    await waitFor(() => expect(panel).toBeInTheDocument());
    expect(within(panel!).getAllByText('Buyer').length).toBeGreaterThan(0);
    expect(within(panel!).getAllByText('Supplier').length).toBeGreaterThan(0);
    expect(within(panel!).getAllByRole('row').length).toBe(urgentActions.length + 1);
  });

  it('updates supplier award response status locally', async () => {
    const user = userEvent.setup();
    const { container } = renderFlow(
      <AwardResponseProcurexPage />,
      '/awards-contracts/award-response?award=supplier-award-1'
    );
    const activePanel = container.querySelector<HTMLElement>('[data-award-response-panel="supplier-award-1"]');

    await waitFor(() => expect(activePanel).toHaveClass('active'));
    await user.click(within(activePanel!).getByRole('button', { name: 'Request Clarification' }));
    expect(within(activePanel!).getByText('Current supplier response: Clarification Requested')).toBeInTheDocument();
  });

  it('renders post-award active and closed modes from URL parameters', async () => {
    const activeRender = renderFlow(
      <PostAwardTrackingProcurexPage />,
      '/awards-contracts/post-award?mode=active&tab=payments'
    );

    const activeMode = activeRender.container.querySelector<HTMLElement>('[data-post-award-mode-panel="active"]');
    await waitFor(() => expect(activeMode).not.toHaveStyle({ display: 'none' }));
    expect(screen.getByText('Invoices & Payments')).toHaveClass('active');

    activeRender.unmount();

    const closedRender = renderFlow(
      <PostAwardTrackingProcurexPage />,
      '/awards-contracts/post-award?mode=closed&contract=closed-contract-1&tab=closure'
    );

    const closedMode = closedRender.container.querySelector<HTMLElement>('[data-post-award-mode-panel="closed"]');
    await waitFor(() => expect(closedMode).not.toHaveStyle({ display: 'none' }));
    expect(closedRender.container.querySelector<HTMLElement>('[data-closed-contract-panel="closed-contract-1"]')).toHaveClass('active');
  });
});
