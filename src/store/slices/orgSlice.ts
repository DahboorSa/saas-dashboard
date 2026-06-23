import { getOrganizationDetails } from '@/lib/api/client';
import type { Plan } from '@/lib/plans';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type OrgData = {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  plan: Plan;
  paymentStatus: string;
  trialEndsAt: string | null;
  stripeCustomerId: string | null;
};

type OrgState = {
  data: OrgData | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrgState = { data: null, loading: false, error: null };

export const fetchOrg = createAsyncThunk('org/fetch', async () => {
  const res = await getOrganizationDetails();
  return res.data as OrgData;
});

const orgSlice = createSlice({
  name: 'org',
  initialState,
  reducers: {
    clearOrg: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrg.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load organization';
      });
  },
});

export const { clearOrg } = orgSlice.actions;
export default orgSlice.reducer;
