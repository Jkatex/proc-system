import { useAppSelector } from '@/app/store';

export function useRecords() {
  return useAppSelector((state) => state.records.records);
}
