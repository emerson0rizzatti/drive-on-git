import { axiosInstance } from '../../../api/axiosInstance';
import type { GitHubRepo } from '../../repo-selector/types';

export const myReposApi = {
  getMyRepos: async (): Promise<GitHubRepo[]> => {
    const { data } = await axiosInstance.get('/github/repos/tagged');
    return data.data; // List of repos with 'drive-on-git' topic
  },
};
