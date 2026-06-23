import Shell from '@/components/layout/Shell';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import AuditLogPage from '@/pages/dashboard/AuditLogPage';
import OverviewPage from '@/pages/dashboard/OverviewPage';
import UsagePage from '@/pages/dashboard/UsagePage';
import BillingPage from '@/pages/organization/BillingPage';
import DangerZonePage from '@/pages/organization/DangerZonePage';
import InvitationsPage from '@/pages/organization/InvitationsPage';
import MembersPage from '@/pages/organization/MembersPage';
import OrgGeneralPage from '@/pages/organization/OrgGeneralPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected — all wrapped in Shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Shell />}>
            <Route path="/" element={<Navigate to="/overview" replace />} />

            {/* Workspace */}
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/usage" element={<UsagePage />} />
            <Route path="/audit-log" element={<AuditLogPage />} />

            {/* Organization */}
            <Route path="/organization">
              <Route index element={<Navigate to="general" replace />} />
              <Route path="general" element={<OrgGeneralPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="invitations" element={<InvitationsPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="danger" element={<DangerZonePage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
