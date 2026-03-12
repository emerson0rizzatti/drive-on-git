import { axiosInstance } from '../../../api/axiosInstance';
import type { GitHubRepo, CreateRepoPayload } from '../types';

export const githubApi = {
  getRepos: async (): Promise<GitHubRepo[]> => {
    const { data } = await axiosInstance.get('/github/repos');
    return data.data;
  },
  
  createRepo: async (payload: CreateRepoPayload): Promise<GitHubRepo> => {
    const { data } = await axiosInstance.post('/github/repos', payload);
    return data.data;
  },
};
