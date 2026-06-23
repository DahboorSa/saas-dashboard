import { getPlans } from '@/lib/api/client';
import { type Plan } from '@/lib/plans';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

type PlansState = {
  data: Plan[];
  loading: boolean;
  error: string | null;
};

const initialState: PlansState = { data: [], loading: false, error: null };

export const fetchPlans = createAsyncThunk('plans/fetch', async () => {
  const res = await getPlans();
  return res.data as Plan[];
});

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearPlans: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load plans';
      });
  },
});

export const { clearPlans } = plansSlice.actions;
export default plansSlice.reducer;
