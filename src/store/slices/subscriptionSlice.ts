import { getSubscription } from '@/lib/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

export type SubscriptionData = {
  paymentStatus: string;
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
  paymentMethods: PaymentMethod[];
};

type SubscriptionState = {
  data: SubscriptionData | null;
  loading: boolean;
  error: string | null;
};

const initialState: SubscriptionState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchSubscription = createAsyncThunk(
  'subscription/fetch',
  async () => {
    const res = await getSubscription();
    return res.data as SubscriptionData;
  },
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscription: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load subscription';
      });
  },
});

export const { clearSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
