import { getAuditLogs } from '@/lib/api/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type AuditLogEntry = {
  action: string;
  resourceType: string;
  resourceId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

type AuditLogsState = {
  data: AuditLogEntry[];
  loading: boolean;
  error: string | null;
};

const initialState: AuditLogsState = { data: [], loading: false, error: null };

export const fetchAuditLogs = createAsyncThunk('auditLogs/fetch', async () => {
  const res = await getAuditLogs();
  return res.data as AuditLogEntry[];
});

const auditLogsSlice = createSlice({
  name: 'auditLogs',
  initialState,
  reducers: {
    clearAuditLogs: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load audit logs';
      });
  },
});

export const { clearAuditLogs } = auditLogsSlice.actions;
export default auditLogsSlice.reducer;
