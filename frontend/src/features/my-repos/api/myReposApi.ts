import { authApiConfig } from '../../auth/api/authApi';
import type { GitHubRepo } from '../../repo-selector/types';

export const myReposApi = {
  getMyRepos: async (): Promise<GitHubRepo[]> => {
    const { data } = await authApiConfig.get('/github/my-repos');
    return data.data; // List of repos with 'drive-on-git' topic
  },
};
