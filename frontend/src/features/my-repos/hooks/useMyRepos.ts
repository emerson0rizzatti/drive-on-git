import { useSuspenseQuery } from '@tanstack/react-query';
import { myReposApi } from '../api/myReposApi';
import type { GitHubRepo } from '../../repo-selector/types';

export const myReposQueryKeys = {
  all: ['my-repos'] as const,
};

export const useMyRepos = () => {
  return useSuspenseQuery<GitHubRepo[], Error>({
    queryKey: myReposQueryKeys.all,
    queryFn: myReposApi.getMyRepos,
  });
};
