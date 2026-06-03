import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from '@/app/store';
import i18n, { persistLanguage } from '@/i18n';
import { ProcurexStaticPage } from './ProcurexStaticPage';

const selectedEvaluationTenderKey = 'procurex.selectedEvaluationTender';
const selectedEvaluationReportKey = 'procurex.selectedEvaluationReport';

function renderStaticPage(children: ReactNode, initialEntries = ['/']) {
  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </I18nextProvider>
    </Provider>
  );
}

function waitForI18nReady() {
  if (i18n.isInitialized) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const handleInitialized = () => {
      i18n.off('initialized', handleInitialized);
      resolve();
    };

    i18n.on('initialized', handleInitialized);
  });
}

describe('ProcurexStaticPage localization', () => {
  afterEach(async () => {
    await waitForI18nReady();
    window.localStorage.removeItem(selectedEvaluationTenderKey);
    window.localStorage.removeItem(selectedEvaluationReportKey);
    await act(async () => {
      await i18n.changeLanguage('en');
      persistLanguage('en');
    });
  });

  it('translates generated static page text and attributes to Swahili', async () => {
    await waitForI18nReady();
    await act(async () => {
      await i18n.changeLanguage('sw');
    });

    renderStaticPage(
        <ProcurexStaticPage
          pageKey="welcome"
          html='<main><button aria-label="Open apps">Create Tender</button><input placeholder="Search" /></main>'
        />
    );

    expect(await screen.findByText('Tengeneza Zabuni')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText('Fungua programu')).toBeInTheDocument());
  });

  it('clears saved evaluation selection when the evaluation page is entered', () => {
    window.localStorage.setItem(selectedEvaluationTenderKey, 'PX-WRK-2026-001');
    window.localStorage.setItem(selectedEvaluationReportKey, 'PX-WRK-2026-001');

    renderStaticPage(<ProcurexStaticPage pageKey="bid-evaluation" html="<main><h1>Tenders for Evaluation</h1></main>" />);

    expect(window.localStorage.getItem(selectedEvaluationTenderKey)).toBeNull();
    expect(window.localStorage.getItem(selectedEvaluationReportKey)).toBeNull();
    expect(screen.getByText('Tenders for Evaluation')).toBeInTheDocument();
  });

  it('clears saved evaluation selection when another Procurex page navigates to evaluation', () => {
    window.localStorage.setItem(selectedEvaluationTenderKey, 'PX-WRK-2026-001');
    window.localStorage.setItem(selectedEvaluationReportKey, 'PX-WRK-2026-001');

    renderStaticPage(
        <ProcurexStaticPage
          pageKey="workspace-dashboard"
          html='<main><button type="button" data-navigate="bid-evaluation">Evaluation</button></main>'
        />
    );

    fireEvent.click(screen.getByText('Evaluation'));

    expect(window.localStorage.getItem(selectedEvaluationTenderKey)).toBeNull();
    expect(window.localStorage.getItem(selectedEvaluationReportKey)).toBeNull();
  });

  it('uses route history for back controls instead of forcing dashboard navigation', async () => {
    renderStaticPage(
      <Routes>
        <Route path="/dashboard" element={<div>Dashboard home</div>} />
        <Route path="/procurement/marketplace" element={<div>Marketplace previous page</div>} />
        <Route
          path="/communication"
          element={
            <ProcurexStaticPage
              pageKey="communication-center"
              html='<main><button type="button" class="app-brand-button" data-navigate="workspace-dashboard">Communication Center</button></main>'
            />
          }
        />
      </Routes>,
      ['/procurement/marketplace', '/communication']
    );

    fireEvent.click(screen.getByText('Communication Center'));

    expect(await screen.findByText('Marketplace previous page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard home')).not.toBeInTheDocument();
  });
});
