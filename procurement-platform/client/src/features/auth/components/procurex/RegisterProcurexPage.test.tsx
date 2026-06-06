import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authApi } from '@/features/auth/api';
import { useCurrentLegalVersions } from '@/features/public/hooks';
import { RegisterProcurexPage } from './RegisterProcurexPage';

vi.mock('@/features/auth/api', () => ({
  authApi: {
    startRegistration: vi.fn(),
    verifyOtp: vi.fn(),
    activateEmail: vi.fn(),
    setPassword: vi.fn()
  }
}));

vi.mock('@/features/public/hooks', () => ({
  useCurrentLegalVersions: vi.fn()
}));

const mockedAuthApi = vi.mocked(authApi);
const mockedUseCurrentLegalVersions = vi.mocked(useCurrentLegalVersions);

function fillVisibleInput(type: string, value: string, index = 0) {
  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(`input[type="${type}"], input:not([type])`)).filter(
    (input) => input.offsetParent !== null || input.closest('.register-screen-new.active')
  );
  fireEvent.change(inputs[index], { target: { value } });
}

describe('RegisterProcurexPage', () => {
  beforeEach(() => {
    mockedAuthApi.startRegistration.mockReset();
    mockedAuthApi.verifyOtp.mockReset();
    mockedAuthApi.activateEmail.mockReset();
    mockedAuthApi.setPassword.mockReset();
    mockedUseCurrentLegalVersions.mockReturnValue({
      data: {
        terms: {
          id: 'terms-version-id',
          pageKey: 'terms-and-conditions',
          version: '2026.06.06',
          status: 'PUBLISHED',
          title: 'Terms and Conditions',
          summary: null,
          content: {},
          contentHash: 'terms-hash',
          effectiveAt: '2026-06-06T00:00:00.000Z',
          publishedAt: '2026-06-06T00:00:00.000Z',
          lastUpdated: '2026-06-06T00:00:00.000Z'
        },
        privacy: {
          id: 'privacy-version-id',
          pageKey: 'privacy-policy',
          version: '2026.06.06',
          status: 'PUBLISHED',
          title: 'Privacy Policy',
          summary: null,
          content: {},
          contentHash: 'privacy-hash',
          effectiveAt: '2026-06-06T00:00:00.000Z',
          publishedAt: '2026-06-06T00:00:00.000Z',
          lastUpdated: '2026-06-06T00:00:00.000Z'
        }
      },
      status: 'success',
      isLoading: false,
      isError: false
    });
  });

  it('links to legal pages and sends accepted legal version IDs when creating the account', async () => {
    mockedAuthApi.startRegistration.mockResolvedValueOnce({ user: {}, challengeId: 'otp-challenge', expiresAt: '2026-06-06T00:00:00.000Z' } as never);
    mockedAuthApi.verifyOtp.mockResolvedValueOnce({ activationChallengeId: 'activation-challenge', expiresAt: '2026-06-06T00:00:00.000Z' });
    mockedAuthApi.activateEmail.mockResolvedValueOnce({ user: {} } as never);
    mockedAuthApi.setPassword.mockResolvedValueOnce({ user: {} } as never);

    render(
      <MemoryRouter>
        <RegisterProcurexPage />
      </MemoryRouter>
    );

    fireEvent.change(document.querySelector<HTMLInputElement>('input[type="email"]')!, { target: { value: 'legal@example.test' } });
    fireEvent.change(document.querySelector<HTMLInputElement>('input[type="tel"]')!, { target: { value: '+255700000004' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await screen.findByRole('heading', { name: 'Verify Your Number' });
    fillVisibleInput('text', '123456');
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));

    await screen.findByRole('heading', { name: 'Activate Your Email' });
    fillVisibleInput('text', '87654321');
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Password Setup' }));

    await screen.findByRole('heading', { name: 'Create Your Password' });
    const passwordInputs = document.querySelectorAll<HTMLInputElement>('input[type="password"]');
    fireEvent.change(passwordInputs[0], { target: { value: 'Strong123!' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'Strong123!' } });
    fireEvent.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('link', { name: 'Terms and Conditions' })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() =>
      expect(mockedAuthApi.setPassword).toHaveBeenCalledWith({
        email: 'legal@example.test',
        password: 'Strong123!',
        termsAccepted: true,
        privacyAccepted: true,
        termsVersionId: 'terms-version-id',
        privacyVersionId: 'privacy-version-id'
      })
    );
  });
});
