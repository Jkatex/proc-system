import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n, { persistLanguage } from '@/i18n';
import { ProcurexStaticPage } from './ProcurexStaticPage';

describe('ProcurexStaticPage localization', () => {
  afterEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
      persistLanguage('en');
    });
  });

  it('translates generated static page text and attributes to Swahili', async () => {
    await act(async () => {
      await i18n.changeLanguage('sw');
    });

    render(
      <MemoryRouter>
        <ProcurexStaticPage
          pageKey="welcome"
          html='<main><button aria-label="Open apps">Create Tender</button><input placeholder="Search" /></main>'
        />
      </MemoryRouter>
    );

    expect(await screen.findByText('Tengeneza Zabuni')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText('Fungua programu')).toBeInTheDocument());
  });
});
