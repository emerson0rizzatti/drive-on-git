import { axiosInstance } from '../../../api/axiosInstance';
import type { AuthStatusResponse } from '../types';

export const authApi = {
  getStatus: async (): Promise<AuthStatusResponse> => {
    const { data } = await axiosInstance.get('/auth/status');
    return data.data; 
  },
  
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
  
  getGoogleLoginUrl: (): string => `${axiosInstance.defaults.baseURL}/auth/google`,
  getGithubLoginUrl: (): string => `${axiosInstance.defaults.baseURL}/auth/github`,
};
