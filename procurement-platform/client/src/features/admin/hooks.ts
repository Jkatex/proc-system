import { useAppSelector } from '@/app/store';

export function useAdminMetrics() {
  return useAppSelector((state) => state.admin.metrics);
}
