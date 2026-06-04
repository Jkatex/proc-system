import { apiClient } from '@/shared/api/http';
import type { SessionUser } from '@/shared/types/domain';
import { clearDemoSession, getDemoUser, isDemoAuthToken } from '../demoAuth';

export type AuthSessionResponse = {
  token: string;
  user: SessionUser;
  expiresAt: string;
};

export type SessionResponse = {
  user: SessionUser;
  expiresAt: string;
};

export type ForgotPasswordResponse = {
  ok: boolean;
  message: string;
  challengeId?: string;
  expiresAt?: string;
};

export const authApi = {
  async startRegistration(input: { email: string; phone: string }) {
    const response = await apiClient.post<{
      user: SessionUser;
      challengeId: string;
      expiresAt: string;
    }>('/api/identity/registration/start', input);
    return response.data;
  },
  async verifyOtp(input: { challengeId: string; code: string }) {
    const response = await apiClient.post<{
      activationChallengeId: string;
      expiresAt: string;
    }>('/api/identity/registration/verify-otp', input);
    return response.data;
  },
  async activateEmail(input: { challengeId: string; code: string }) {
    const response = await apiClient.post<{ user: SessionUser }>('/api/identity/registration/activate-email', input);
    return response.data;
  },
  async setPassword(input: { email: string; password: string }) {
    const response = await apiClient.post<{ user: SessionUser }>('/api/identity/registration/set-password', input);
    return response.data;
  },
  async signIn(input: { email: string; password: string }) {
    const response = await apiClient.post<AuthSessionResponse>('/api/identity/auth/sign-in', input);
    return response.data;
  },
  async forgotPassword(input: { email: string }) {
    const response = await apiClient.post<ForgotPasswordResponse>('/api/identity/auth/forgot-password', input);
    return response.data;
  },
  async resetPassword(input: { challengeId: string; code: string; password: string }) {
    const response = await apiClient.post<{ ok: boolean; user: SessionUser }>('/api/identity/auth/reset-password', input);
    return response.data;
  },
  async getSession() {
    if (isDemoAuthToken()) {
      return {
        user: getDemoUser(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    }
    const response = await apiClient.get<SessionResponse>('/api/identity/session');
    return response.data;
  },
  async signOut() {
    if (isDemoAuthToken()) {
      clearDemoSession();
      return { ok: true };
    }
    const response = await apiClient.post<{ ok: boolean }>('/api/identity/auth/sign-out');
    return response.data;
  }
};
