import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import i18n, { persistLanguage } from '@/i18n';
import { ProcurexStaticPage } from './ProcurexStaticPage';

const selectedEvaluationTenderKey = 'procurex.selectedEvaluationTender';
const selectedEvaluationReportKey = 'procurex.selectedEvaluationReport';
const marketplaceHtml = `
  <section data-marketplace-root>
    <div role="tablist">
      <button type="button" role="tab" class="active" aria-selected="true" data-marketplace-tab="marketplace">Marketplace</button>
      <button type="button" role="tab" aria-selected="false" data-marketplace-tab="my-tenders">My Tenders</button>
      <button type="button" role="tab" aria-selected="false" data-marketplace-tab="my-bids">My Bids</button>
    </div>
    <section data-marketplace-tab-panel="marketplace">Marketplace page</section>
    <section data-marketplace-tab-panel="my-tenders">Tender page</section>
    <section data-marketplace-tab-panel="my-bids">Bid page</section>
  </section>
`;

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

async function waitForI18nReady() {
  if (i18n.isInitialized) return;

  await new Promise<void>((resolve) => {
    const handleInitialized = () => {
      i18n.off('initialized', handleInitialized);
      resolve();
    };
    i18n.on('initialized', handleInitialized);
  });
}

type RenderStaticPageOptions = {
  extraContent?: ReactNode;
  initialEntries?: string[];
};

function renderStaticPage(pageKey: string, html: string, options: RenderStaticPageOptions = {}) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={options.initialEntries}>
        {options.extraContent}
        <ProcurexStaticPage pageKey={pageKey} html={html} />
      </MemoryRouter>
    </Provider>
  );
}

describe('ProcurexStaticPage localization', () => {
  afterEach(async () => {
    window.localStorage.removeItem(selectedEvaluationTenderKey);
    window.localStorage.removeItem(selectedEvaluationReportKey);
    await waitForI18nReady();
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

    renderStaticPage('welcome', '<main><button aria-label="Open apps">Create Tender</button><input placeholder="Search" /></main>');

    expect(await screen.findByText('Tengeneza Zabuni')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText('Fungua programu')).toBeInTheDocument());
  });

  it('clears saved evaluation selection when the evaluation page is entered', () => {
    window.localStorage.setItem(selectedEvaluationTenderKey, 'PX-WRK-2026-001');
    window.localStorage.setItem(selectedEvaluationReportKey, 'PX-WRK-2026-001');

    renderStaticPage('bid-evaluation', '<main><h1>Tenders for Evaluation</h1></main>');

    expect(window.localStorage.getItem(selectedEvaluationTenderKey)).toBeNull();
    expect(window.localStorage.getItem(selectedEvaluationReportKey)).toBeNull();
    expect(screen.getByText('Tenders for Evaluation')).toBeInTheDocument();
  });

  it('clears saved evaluation selection when another Procurex page navigates to evaluation', () => {
    window.localStorage.setItem(selectedEvaluationTenderKey, 'PX-WRK-2026-001');
    window.localStorage.setItem(selectedEvaluationReportKey, 'PX-WRK-2026-001');

    renderStaticPage('workspace-dashboard', '<main><button type="button" data-navigate="bid-evaluation">Evaluation</button></main>');

    fireEvent.click(screen.getByText('Evaluation'));

    expect(window.localStorage.getItem(selectedEvaluationTenderKey)).toBeNull();
    expect(window.localStorage.getItem(selectedEvaluationReportKey)).toBeNull();
  });

  it('shows marketplace work sections from route-backed pages', async () => {
    renderStaticPage('marketplace', marketplaceHtml, { initialEntries: ['/procurement/my-tenders'] });

    const panel = screen.getByText('Tender page').closest<HTMLElement>('[data-marketplace-tab-panel]');
    await waitFor(() => expect(panel).toHaveStyle({ display: 'grid' }));
    expect(screen.getByRole('tab', { name: 'My Tenders' })).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates marketplace work tabs to in-app pages', async () => {
    renderStaticPage('marketplace', marketplaceHtml, {
      extraContent: <LocationProbe />,
      initialEntries: ['/procurement/marketplace']
    });

    fireEvent.click(screen.getByRole('tab', { name: 'My Bids' }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/procurement/my-bids'));
    expect(screen.getByRole('tab', { name: 'My Bids' })).toHaveAttribute('aria-selected', 'true');
  });
});
