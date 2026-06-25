import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { tokenStore } from '@/lib/tokenStore';
import { refreshSession, logoutApi } from '@/lib/api/client';

export type AuthUser = {
  userId: string;
  orgId: string;
  role: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (accessToken: string) => void;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: attempt silent session restore via httpOnly cookie
  useEffect(() => {
    refreshSession()
      .then((accessToken) => {
        tokenStore.set(accessToken);
        setUser(decodeToken(accessToken));
      })
      .catch(() => {
        // Cookie missing or expired — user must log in
      })
      .finally(() => setIsLoading(false));
  }, []);

  function login(accessToken: string) {
    tokenStore.set(accessToken);
    setUser(decodeToken(accessToken));
  }

  function logout() {
    logoutApi().catch(() => {}); // fire-and-forget — backend clears the cookie
    tokenStore.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
