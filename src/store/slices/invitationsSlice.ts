import { getInvitations } from '@/lib/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type Invitation = {
  id: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: string;
  createdAt: string;
  invitedBy?: string;
};

type InvitationsState = {
  data: Invitation[];
  loading: boolean;
  error: string | null;
};

const initialState: InvitationsState = { data: [], loading: false, error: null };

export const fetchInvitations = createAsyncThunk('invitations/fetch', async () => {
  const res = await getInvitations();
  return res.data as Invitation[];
});

const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    clearInvitations: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvitations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvitations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load invitations';
      });
  },
});

export const { clearInvitations } = invitationsSlice.actions;
export default invitationsSlice.reducer;
