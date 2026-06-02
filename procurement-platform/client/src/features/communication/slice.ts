import { createSlice } from '@reduxjs/toolkit';
import { messages } from '@/shared/data/fixtures';

const communicationSlice = createSlice({
  name: 'communication',
  initialState: {
    messages
  },
  reducers: {
    markAllRead(state) {
      state.messages = state.messages.map((message) => ({ ...message, status: 'Read' }));
    }
  }
});

export const { markAllRead } = communicationSlice.actions;
export default communicationSlice.reducer;
