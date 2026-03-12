import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { githubApi } from '../api/githubApi';
import type { GitHubRepo, CreateRepoPayload } from '../types';

export const githubQueryKeys = {
  all: ['github'] as const,
  repos: () => [...githubQueryKeys.all, 'repos'] as const,
};

export const useGithubRepos = () => {
  return useSuspenseQuery<GitHubRepo[], Error>({
    queryKey: githubQueryKeys.repos(),
    queryFn: githubApi.getRepos,
  });
};

export const useCreateRepo = () => {
  const queryClient = useQueryClient();

  return useMutation<GitHubRepo, Error, CreateRepoPayload>({
    mutationFn: githubApi.createRepo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: githubQueryKeys.repos() });
    },
  });
};
