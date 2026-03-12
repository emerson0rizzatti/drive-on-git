import axios from 'axios';
import { env } from '../../../config/env';
import type { AuthStatusResponse } from '../types';

export const authApiConfig = axios.create({
  baseURL: `${env.API_URL}/auth`,
  withCredentials: true, // required for cookie-session
});

export const authApi = {
  getStatus: async (): Promise<AuthStatusResponse> => {
    const { data } = await authApiConfig.get('/status');
    return data.data; // Assuming BaseController handleSuccess encapsulates in data { success: true, data: T }
  },
  
  logout: async (): Promise<void> => {
    await authApiConfig.post('/logout');
  },
  
  getGoogleLoginUrl: (): string => `${env.API_URL}/auth/google`,
  getGithubLoginUrl: (): string => `${env.API_URL}/auth/github`,
};
