import { getUsage } from '@/lib/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type UsageData = {
  apiCalls: { current: number; limit: number; limitExceeded: boolean };
  webhooks: { active: number; limit: number };
  members: { count: number; limit: number };
  period: { start: string; end: string };
  resetsAt: string;
};

type UsageState = {
  data: UsageData | null;
  loading: boolean;
  error: string | null;
};

const initialState: UsageState = { data: null, loading: false, error: null };

export const fetchUsage = createAsyncThunk('usage/fetch', async () => {
  const res = await getUsage();
  return res.data as UsageData;
});

const usageSlice = createSlice({
  name: 'usage',
  initialState,
  reducers: {
    clearUsage: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load usage';
      });
  },
});

export const { clearUsage } = usageSlice.actions;
export default usageSlice.reducer;
