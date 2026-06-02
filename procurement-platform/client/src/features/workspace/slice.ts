import { createSlice } from '@reduxjs/toolkit';
import { workItems } from '@/shared/data/fixtures';

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    workItems
  },
  reducers: {}
});

export default workspaceSlice.reducer;
