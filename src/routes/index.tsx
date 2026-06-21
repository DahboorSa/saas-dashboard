import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import OrgLayout from '@/pages/organization/OrgLayout';
import OrgGeneralPage from '@/pages/organization/OrgGeneralPage';
import MembersPage from '@/pages/organization/MembersPage';
import InvitationsPage from '@/pages/organization/InvitationsPage';
import BillingPage from '@/pages/organization/BillingPage';
import DangerZonePage from '@/pages/organization/DangerZonePage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/organization" element={<OrgLayout />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<OrgGeneralPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="invitations" element={<InvitationsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="danger" element={<DangerZonePage />} />
          </Route>
        </Route>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}
