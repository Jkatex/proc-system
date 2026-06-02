import { useAppSelector } from '@/app/store';

export function useEvaluationState() {
  return useAppSelector((state) => state.evaluation);
}
