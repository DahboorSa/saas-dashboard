import axios from 'axios';

const url = import.meta.env.VITE_NEST_API_URL;
if (!url)
  throw new Error(
    'VITE_NEST_API_URL is not set — copy .env and restart the dev server',
  );

async function loginApi(email: string, password: string) {
  try {
    const response = await axios.post(`${url}/auth/login`, {
      email,
      password,
    });
    return response;
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
    const response = await axios.post(`${url}/auth/register`, {
      email,
      password,
      name: orgName,
      firstName,
      lastName,
    });
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

async function verifyEmail(token: string) {
  try {
    const response = await axios.post(
      `${url}/auth/verify-email?token=${token}`,
      {},
    );
    return response;
  } catch (error) {
    console.error('Email verification failed:', error);
    throw error;
  }
}

async function resetPassword(password: string, token: string) {
  try {
    const response = await axios.post(`${url}/auth/reset-password`, {
      password,
      token,
    });
    return response;
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
}

async function forgotPassword(email: string) {
  try {
    const response = await axios.post(`${url}/auth/forgot-password`, {
      email,
    });
    return response;
  } catch (error) {
    console.error('Forgot password failed:', error);
    throw error;
  }
}

async function resendVerificationEmail(email: string) {
  try {
    const response = await axios.post(`${url}/auth/resend-verification`, {
      email,
    });
    return response;
  } catch (error) {
    console.error('Resend verification failed:', error);
    throw error;
  }
}

async function getPlans() {
  try {
    const response = await axios.get(`${url}/plans`);
    return response;
  } catch (error) {
    console.error('Get plans failed:', error);
    throw error;
  }
}

async function getMembers() {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${url}/organizations/members`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error('Get members failed:', error);
    throw error;
  }
}

async function getInvitations() {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${url}/invitations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${url}/invitations`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`API response for sendInvitation:`, response.data);
    return response;
  } catch (error) {
    console.error(`Send invitation failed:`, error);
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
};
