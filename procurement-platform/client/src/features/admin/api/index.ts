import { mockApi } from '@/shared/api/mockApi';

export const adminApi = {
  getMetrics: mockApi.getAdminMetrics,
  getChartSeries: mockApi.getChartSeries
};
