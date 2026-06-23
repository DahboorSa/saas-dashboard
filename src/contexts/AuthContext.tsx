import { createContext, useContext, useState, type ReactNode } from 'react';
import { tokenStore } from '@/lib/tokenStore';

export type AuthUser = {
  userId: string;
  orgId: string;
  role: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeToken(token: string): AuthUser {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return {
    userId: payload.userId,
    orgId: payload.orgId,
    role: payload.role,
    email: payload.email,
  };
}

function initUser(): AuthUser | null {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    const user = decodeToken(token);
    tokenStore.set(token);
    return user;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(initUser);

  function login(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    tokenStore.set(accessToken);
    setUser(decodeToken(accessToken));
  }

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    tokenStore.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
