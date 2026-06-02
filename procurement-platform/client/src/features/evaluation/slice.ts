import { createSlice } from '@reduxjs/toolkit';
import { bids } from '@/shared/data/fixtures';

const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState: {
    bids,
    currentStage: 'technical',
    progress: 58
  },
  reducers: {
    lockEvaluation(state) {
      state.currentStage = 'recommendation';
      state.progress = 100;
    }
  }
});

export const { lockEvaluation } = evaluationSlice.actions;
export default evaluationSlice.reducer;
