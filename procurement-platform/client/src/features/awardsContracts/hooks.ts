import { useAppSelector } from '@/app/store';

export function useAwardsContractsState() {
  return useAppSelector((state) => state.awardsContracts);
}
