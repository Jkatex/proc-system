import { createSlice } from '@reduxjs/toolkit';
import { tenders } from '@/shared/data/fixtures';

const procurementSlice = createSlice({
  name: 'procurement',
  initialState: {
    tenders,
    selectedTenderId: tenders[0]?.id ?? null
  },
  reducers: {
    selectTender(state, action: { payload: string }) {
      state.selectedTenderId = action.payload;
    }
  }
});

export const { selectTender } = procurementSlice.actions;
export default procurementSlice.reducer;
