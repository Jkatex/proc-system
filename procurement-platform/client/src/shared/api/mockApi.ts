import { adminMetrics, bids, chartSeries, demoUsers, messages, records, tenders, workItems } from '@/shared/data/fixtures';

const delay = (ms = 120) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const mockApi = {
  async signIn(email: string) {
    await delay();
    return email.toLowerCase().includes('admin') ? demoUsers.admin : demoUsers.user;
  },
  async getSession() {
    await delay();
    return demoUsers.user;
  },
  async getTenders() {
    await delay();
    return tenders;
  },
  async getBids() {
    await delay();
    return bids;
  },
  async getMessages() {
    await delay();
    return messages;
  },
  async getRecords() {
    await delay();
    return records;
  },
  async getWorkItems() {
    await delay();
    return workItems;
  },
  async getAdminMetrics() {
    await delay();
    return adminMetrics;
  },
  async getChartSeries() {
    await delay();
    return chartSeries;
  }
};
