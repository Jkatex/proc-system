import { createSlice } from '@reduxjs/toolkit';
import type { ProcurementTender } from './types';

type ProcurementState = {
  tenders: ProcurementTender[];
  selectedTenderId: string | null;
};

const initialState: ProcurementState = {
  tenders: [],
  selectedTenderId: null
};

const procurementSlice = createSlice({
  name: 'procurement',
  initialState,
  reducers: {
    selectTender(state, action: { payload: string }) {
      state.selectedTenderId = action.payload;
    }
  }
});

export const { selectTender } = procurementSlice.actions;
export default procurementSlice.reducer;
