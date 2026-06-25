import { configureStore } from '@reduxjs/toolkit';
import invitationsReducer from './slices/invitationsSlice';
import membersReducer from './slices/membersSlice';
import orgReducer from './slices/orgSlice';
import plansReducer from './slices/plansSlice';
import auditLogsReducer from './slices/auditLogsSlice';
import usageReducer from './slices/usageSlice';

export const store = configureStore({
  reducer: {
    org: orgReducer,
    plans: plansReducer,
    members: membersReducer,
    invitations: invitationsReducer,
    auditLogs: auditLogsReducer,
    usage: usageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
