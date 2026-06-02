import { useAppSelector } from '@/app/store';

export function useMessages() {
  return useAppSelector((state) => state.communication.messages);
}
