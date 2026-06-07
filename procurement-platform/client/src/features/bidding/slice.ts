import { createSlice } from '@reduxjs/toolkit';
import type { BidPackage } from './types';

type BiddingState = {
  bids: BidPackage[];
  draftSaved: boolean;
};

const initialState: BiddingState = {
  bids: [],
  draftSaved: false
};

const biddingSlice = createSlice({
  name: 'bidding',
  initialState,
  reducers: {
    saveBidDraft(state) {
      state.draftSaved = true;
    }
  }
});

export const { saveBidDraft } = biddingSlice.actions;
export default biddingSlice.reducer;
