import { createSlice } from '@reduxjs/toolkit';
import type { ProcurementRecord } from './types';

type RecordsState = {
  records: ProcurementRecord[];
};

const initialState: RecordsState = {
  records: []
};

const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {}
});

export default recordsSlice.reducer;
