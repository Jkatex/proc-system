import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/shared/api/http';
import { WelcomeProcurexPage } from './WelcomeProcurexPage';

vi.mock('@/shared/api/http', () => ({
  apiClient: {
    get: vi.fn()
  }
}));

const apiGet = vi.mocked(apiClient.get);

function renderWelcome() {
  return render(
    <MemoryRouter>
      <WelcomeProcurexPage />
    </MemoryRouter>
  );
}

describe('WelcomeProcurexPage', () => {
  beforeEach(() => {
    apiGet.mockReset();
  });

  it('renders the ProcureX landing page, CTAs, and API-backed featured tender data', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        stats: {
          participantCount: 2450,
          participantLabel: 'Used by 2,000+ participants',
          openTenderCount: 18,
          verifiedProfileCompletionRate: 99.6,
          activeWorkspaceLabel: 'Live public workspace'
        },
        featuredTenders: [
          {
            id: 'tender-1',
            reference: 'PX-WRK-2026-001',
            title: 'Construction of community water wells',
            buyerName: 'Medical Stores Department',
            type: 'WORKS',
            status: 'OPEN',
            budget: '480000000',
            currency: 'TZS',
            location: 'Dodoma',
            closingDate: '2026-08-30T00:00:00.000Z',
            categories: ['Works']
          }
        ]
      }
    });

    renderWelcome();

    expect(screen.getByRole('heading', { name: 'Buy. Supply. Connect. Grow.' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Get Started' })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Browse Open Tenders' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Browse Open Tenders' })[0]).toHaveAttribute('href', '/guest-marketplace');

    expect(await screen.findByText('PX-WRK-2026-001')).toBeInTheDocument();
    expect(screen.getByText('Construction of community water wells')).toBeInTheDocument();
    expect(screen.getByText('18 open tenders visible now.')).toBeInTheDocument();
    expect(screen.getByText('99.6% Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('Live public workspace')).toBeInTheDocument();
  });

  it('falls back to stable ProcureX content if the welcome API fails', async () => {
    apiGet.mockRejectedValueOnce(new Error('network unavailable'));

    renderWelcome();

    await waitFor(() => expect(apiGet).toHaveBeenCalledWith('/api/procurement/public/welcome'));
    expect(screen.getByText('PX-OPEN-2026')).toBeInTheDocument();
    expect(screen.getByText('12 open tenders visible now.')).toBeInTheDocument();
    expect(screen.getByText('98.4% Completion Rate')).toBeInTheDocument();
  });
});
