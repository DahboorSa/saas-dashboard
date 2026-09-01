import { useAuth } from '@/contexts/auth-context';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
