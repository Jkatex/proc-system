import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router-dom';
import '@/i18n';
import { store } from '@/app/store';
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

describe('awards and contracts first-run flow', () => {
  it('explains that awarding starts after evaluation', () => {
    renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts');

    expect(screen.getByRole('heading', { name: 'No awards or contracts are in progress yet.' })).toBeInTheDocument();
    expect(screen.getByText('Awarding is a secondary app')).toBeInTheDocument();
  });

  it('routes users upstream to create the tender source', async () => {
    const user = userEvent.setup();
    renderFlow(<AwardingContractsProcurexPage />, '/awards-contracts');

    await user.click(screen.getAllByRole('button', { name: 'Create tender' })[0]);

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/procurement/create-tender'));
  });

  it('shows an empty supplier award response when no award exists', () => {
    renderFlow(<AwardResponseProcurexPage />, '/awards-contracts/award-response?award=supplier-award-2');

    expect(screen.getByRole('heading', { name: 'No award notice has been received yet.' })).toBeInTheDocument();
  });

  it('shows an empty post-award tracker until a contract is signed', () => {
    renderFlow(<PostAwardTrackingProcurexPage />, '/awards-contracts/post-award?mode=closed&contract=closed-contract-2&tab=closure');

    expect(screen.getByRole('heading', { name: 'No active contract is ready for post-award tracking.' })).toBeInTheDocument();
  });
});
