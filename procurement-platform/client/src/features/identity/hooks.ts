import { useAppSelector } from '@/app/store';

export function useIdentityState() {
  return useAppSelector((state) => state.identity);
}
