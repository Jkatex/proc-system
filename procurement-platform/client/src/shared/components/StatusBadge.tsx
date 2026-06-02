import { statusTone } from '@/shared/utils/format';

type StatusBadgeProps = {
  value: string;
};

export function StatusBadge({ value }: StatusBadgeProps) {
  return <span className={`px-status ${statusTone(value)}`}>{value}</span>;
}
