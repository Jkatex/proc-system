import { useAppSelector } from '@/app/store';

export function useTenders() {
  return useAppSelector((state) => state.procurement.tenders);
}
