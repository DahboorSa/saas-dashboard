import { getMembers } from '@/lib/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  role: string;
  email: string;
  isVerified: boolean;
  isActive: boolean;
};

type MembersState = {
  data: Member[];
  loading: boolean;
  error: string | null;
};

const initialState: MembersState = { data: [], loading: false, error: null };

export const fetchMembers = createAsyncThunk('members/fetch', async () => {
  const res = await getMembers();
  return res.data as Member[];
});

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    clearMembers: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load members';
      });
  },
});

export const { clearMembers } = membersSlice.actions;
export default membersSlice.reducer;
