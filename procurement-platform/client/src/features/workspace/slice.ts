import { createSlice } from '@reduxjs/toolkit';
import type { WorkspaceItem } from './types';

type WorkspaceState = {
  workItems: WorkspaceItem[];
};

const initialState: WorkspaceState = {
  workItems: []
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {}
});

export default workspaceSlice.reducer;
