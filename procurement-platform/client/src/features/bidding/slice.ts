import { createSlice } from '@reduxjs/toolkit';
import { bids } from '@/shared/data/fixtures';

const biddingSlice = createSlice({
  name: 'bidding',
  initialState: {
    bids,
    draftSaved: false
  },
  reducers: {
    saveBidDraft(state) {
      state.draftSaved = true;
    }
  }
});

export const { saveBidDraft } = biddingSlice.actions;
export default biddingSlice.reducer;
