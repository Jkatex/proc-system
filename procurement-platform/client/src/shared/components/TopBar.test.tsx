import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { store } from '@/app/store';
import { assumeUser, signOut } from '@/features/auth/slice';
import i18n from '@/i18n';
import { TopBar } from './TopBar';

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderTopBar() {
  store.dispatch(signOut());
  store.dispatch(
    assumeUser({
      id: 'user-1',
      displayName: 'Demo Verified User',
      email: 'demo@procurex.test',
      accountType: 'USER',
      organization: 'Company account tools',
      capabilities: ['BUYER'],
      verificationStatus: 'APPROVED'
    })
  );

  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <TopBar />
          <button type="button">Outside target</button>
          <LocationProbe />
        </MemoryRouter>
      </I18nextProvider>
    </Provider>
  );
}

function openAppsDrawer() {
  const appsButton = screen.getByRole('button', { name: 'Open apps' });
  fireEvent.click(appsButton);
  return appsButton;
}

describe('TopBar platform apps drawer', () => {
  afterEach(() => {
    act(() => {
      store.dispatch(signOut());
    });
  });

  it('opens the platform apps drawer from the 9-dot button', () => {
    renderTopBar();

    const appsButton = openAppsDrawer();
    const drawer = screen.getByText('ProcureX Apps').closest<HTMLElement>('[data-app-menu]');

    expect(appsButton).toHaveAttribute('aria-expanded', 'true');
    expect(drawer).toHaveClass('open');
    expect(drawer).not.toBeNull();
    expect(within(drawer!).getByText('Registration and Verification')).toBeInTheDocument();
    expect(within(drawer!).getByText('Procurement Planning')).toBeInTheDocument();
    expect(within(drawer!).getByText('Procurement')).toBeInTheDocument();
    expect(within(drawer!).getByText('Communication Center')).toBeInTheDocument();
    expect(within(drawer!).getByText('Evaluation')).toBeInTheDocument();
    expect(within(drawer!).getByText('Awarding and Contract')).toBeInTheDocument();
    expect(within(drawer!).getByText('Records and History')).toBeInTheDocument();
  });

  it('navigates to the selected app and closes the drawer', () => {
    renderTopBar();

    const appsButton = openAppsDrawer();
    fireEvent.click(screen.getByRole('button', { name: /Communication Center Messages, clarifications, alerts/i }));

    expect(screen.getByTestId('location')).toHaveTextContent('/communication');
    expect(appsButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('ProcureX Apps').closest('[data-app-menu]')).not.toHaveClass('open');
  });

  it('closes the platform apps drawer from outside click and Escape', () => {
    renderTopBar();

    const appsButton = openAppsDrawer();
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside target' }));
    expect(appsButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(appsButton);
    expect(appsButton).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(appsButton).toHaveAttribute('aria-expanded', 'false');
  });
});
