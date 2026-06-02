import { useAppSelector } from '@/app/store';

export function useBids() {
  return useAppSelector((state) => state.bidding.bids);
}
