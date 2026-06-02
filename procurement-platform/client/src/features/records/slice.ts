import { createSlice } from '@reduxjs/toolkit';
import { records } from '@/shared/data/fixtures';

const recordsSlice = createSlice({
  name: 'records',
  initialState: {
    records
  },
  reducers: {}
});

export default recordsSlice.reducer;
