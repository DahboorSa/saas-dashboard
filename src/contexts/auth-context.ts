import { createContext, useContext } from 'react';

export type AuthUser = {
  userId: string;
  orgId: string;
  role: string;
  email: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
