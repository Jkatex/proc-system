import type { Tender } from '@/shared/types/domain';

export function getBudgetBand(tender: Tender) {
  if (tender.budget >= 1000000000) return 'billion-plus';
  if (tender.budget >= 100000000) return 'hundred-million-plus';
  return 'under-hundred-million';
}
