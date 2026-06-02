import { createSlice } from '@reduxjs/toolkit';

const publicSlice = createSlice({
  name: 'public',
  initialState: {
    lastVisitedPage: 'welcome'
  },
  reducers: {}
});

export default publicSlice.reducer;
