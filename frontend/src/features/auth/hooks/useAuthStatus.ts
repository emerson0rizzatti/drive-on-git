import { useSuspenseQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import type { AuthStatusResponse } from '../types';

export const authQueryKeys = {
  status: ['auth', 'status'] as const,
};

export const useAuthStatus = () => {
  return useSuspenseQuery<AuthStatusResponse, Error>({
    queryKey: authQueryKeys.status,
    queryFn: authApi.getStatus,
  });
};
