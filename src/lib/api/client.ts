import axios from 'axios';
import { tokenStore } from '@/lib/tokenStore';

const url = import.meta.env.VITE_NEST_API_URL;
if (!url)
  throw new Error(
    'VITE_NEST_API_URL is not set — copy .env and restart the dev server',
  );

const apiClient = axios.create({ baseURL: url });

apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

async function loginApi(email: string, password: string) {
  try {
    return await apiClient.post('/auth/login', { email, password });
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

async function registerApi(
  email: string,
  password: string,
  orgName: string,
  firstName: string,
  lastName: string,
) {
  try {
    return await apiClient.post('/auth/register', {
      email,
      password,
      name: orgName,
      firstName,
      lastName,
    });
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

async function verifyEmail(token: string) {
  try {
    return await apiClient.post(`/auth/verify-email?token=${token}`, {});
  } catch (error) {
    console.error('Email verification failed:', error);
    throw error;
  }
}

async function resetPassword(password: string, token: string) {
  try {
    return await apiClient.post('/auth/reset-password', { password, token });
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
}

async function forgotPassword(email: string) {
  try {
    return await apiClient.post('/auth/forgot-password', { email });
  } catch (error) {
    console.error('Forgot password failed:', error);
    throw error;
  }
}

async function resendVerificationEmail(email: string) {
  try {
    return await apiClient.post('/auth/resend-verification', { email });
  } catch (error) {
    console.error('Resend verification failed:', error);
    throw error;
  }
}

async function getPlans() {
  try {
    return await apiClient.get('/plans');
  } catch (error) {
    console.error('Get plans failed:', error);
    throw error;
  }
}

async function getMembers() {
  try {
    return await apiClient.get('/organizations/members');
  } catch (error) {
    console.error('Get members failed:', error);
    throw error;
  }
}

async function getInvitations() {
  try {
    const response = await apiClient.get('/invitations');
    console.log('API response for getInvitations:', response.data);
    return response;
  } catch (error) {
    console.error('Get invitations failed:', error);
    throw error;
  }
}

type InvitationPayload = {
  email: string;
  role: string;
};

async function sendInvitation(payload: InvitationPayload[]) {
  try {
    const response = await apiClient.post('/invitations', payload);
    console.log('API response for sendInvitation:', response.data);
    return response;
  } catch (error) {
    console.error('Send invitation failed:', error);
    throw error;
  }
}
async function getOrganizationDetails() {
  try {
    const response = await apiClient.get('/organizations/me');
    console.log('API response for getOrganizationDetails:', response.data);
    return response;
  } catch (error) {
    console.error('Get organization details failed:', error);
    throw error;
  }
}

export {
  loginApi,
  registerApi,
  verifyEmail,
  resetPassword,
  forgotPassword,
  resendVerificationEmail,
  getPlans,
  getMembers,
  getInvitations,
  sendInvitation,
  getOrganizationDetails,
};
