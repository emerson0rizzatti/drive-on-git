import { authApiConfig } from '../../auth/api/authApi';
import type { GitHubRepo, CreateRepoPayload } from '../types';

export const githubApi = {
  getRepos: async (): Promise<GitHubRepo[]> => {
    const { data } = await authApiConfig.get('/github/repos');
    return data.data;
  },
  
  createRepo: async (payload: CreateRepoPayload): Promise<GitHubRepo> => {
    const { data } = await authApiConfig.post('/github/repos', payload);
    return data.data;
  },
};
