import { createSlice } from '@reduxjs/toolkit';
import { adminMetrics, records, tenders } from '@/shared/data/fixtures';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    metrics: adminMetrics,
    tenders,
    auditRows: records
  },
  reducers: {}
});

export default adminSlice.reducer;
