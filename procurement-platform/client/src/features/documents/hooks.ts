import { useAppSelector } from '@/app/store';

export function useDocumentQueue() {
  return useAppSelector((state) => state.documents.uploadQueue);
}
