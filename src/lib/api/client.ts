import axios from 'axios';
import { tokenStore } from '@/lib/tokenStore';

const url = import.meta.env.VITE_NEST_API_URL;
if (!url)
  throw new Error(
    'VITE_NEST_API_URL is not set — copy .env and restart the dev server',
  );

const apiClient = axios.create({ baseURL: url, withCredentials: true });

apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- 401 / silent-refresh interceptor ---

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(token: string | null, err: unknown = null) {
  pendingQueue.forEach(({ resolve, reject }) =>
    token ? resolve(token) : reject(err),
  );
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Skip the interceptor for the refresh endpoint itself, and for already-retried requests
    if (
      error.response?.status !== 401 ||
      original._retry ||
      original.url === '/auth/refresh'
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then(() => {
        original._retry = true;
        return apiClient(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshSession();
      tokenStore.set(newToken);
      flushQueue(newToken);
      return apiClient(original);
    } catch (refreshError) {
      flushQueue(null, refreshError);
      tokenStore.clear();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// --- Exported API functions ---

export async function refreshSession(): Promise<string> {
  // withCredentials is set on the instance — httpOnly cookie is sent automatically
  const { data } = await apiClient.post<{ accessToken: string }>(
    '/auth/refresh-token',
  );
  return data.accessToken;
}

export async function logoutApi() {
  await apiClient.post('/auth/logout');
}

export async function loginApi(email: string, password: string) {
  return apiClient.post<{ accessToken: string }>('/auth/login', {
    email,
    password,
  });
}

export async function registerApi(
  email: string,
  password: string,
  orgName: string,
  firstName: string,
  lastName: string,
) {
  return apiClient.post<{ accessToken: string }>('/auth/register', {
    email,
    password,
    name: orgName,
    firstName,
    lastName,
  });
}

export async function verifyEmail(token: string) {
  return apiClient.post(`/auth/verify-email?token=${token}`, {});
}

export async function resetPassword(password: string, token: string) {
  return apiClient.post('/auth/reset-password', { password, token });
}

export async function forgotPassword(email: string) {
  return apiClient.post('/auth/forgot-password', { email });
}

export async function resendVerificationEmail(email: string) {
  return apiClient.post('/auth/resend-verification', { email });
}

export async function getPlans() {
  return apiClient.get('/plans');
}

export async function getMembers() {
  return apiClient.get('/organizations/members');
}

export async function getInvitations() {
  return apiClient.get('/invitations');
}

type InvitationPayload = { email: string; role: string };

export async function sendInvitation(payload: InvitationPayload[]) {
  return apiClient.post('/invitations', payload);
}

export async function getOrganizationDetails() {
  return apiClient.get('/organizations/me');
}

export async function getUsage() {
  return apiClient.get('/usage');
}

export async function getAuditLogs() {
  return apiClient.get('/audit-logs');
}
