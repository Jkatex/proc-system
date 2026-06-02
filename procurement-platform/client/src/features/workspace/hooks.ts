import { useAppSelector } from '@/app/store';

export function useWorkspaceItems() {
  return useAppSelector((state) => state.workspace.workItems);
}
