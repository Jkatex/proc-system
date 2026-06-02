import { useAppSelector } from '@/app/store';

export function useAuthSession() {
  return useAppSelector((state) => state.auth);
}
