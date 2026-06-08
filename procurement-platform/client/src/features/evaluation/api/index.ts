import { apiClient } from '@/shared/api/http';
import type {
  EvaluationDashboard,
  EvaluationDraftsResponse,
  EvaluationRecordsQuery,
  EvaluationRecordsResponse,
  ReadyEvaluationResponse
} from '@/features/evaluation/types';

export const evaluationApi = {
  async getDashboard() {
    const response = await apiClient.get<EvaluationDashboard>('/api/evaluations/dashboard');
    return response.data;
  },
  async listRecords(query: EvaluationRecordsQuery) {
    const response = await apiClient.get<EvaluationRecordsResponse>('/api/evaluations/records', {
      params: query
    });
    return response.data;
  },
  async listDrafts() {
    const response = await apiClient.get<EvaluationDraftsResponse>('/api/evaluations/drafts');
    return response.data;
  },
  async listReady() {
    const response = await apiClient.get<ReadyEvaluationResponse>('/api/evaluations/ready');
    return response.data;
  }
};
