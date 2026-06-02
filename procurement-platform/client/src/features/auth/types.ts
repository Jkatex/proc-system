import type { SessionUser } from '@/shared/types/domain';

export type AuthSession = {
  user: SessionUser | null;
  isAuthenticated: boolean;
};
