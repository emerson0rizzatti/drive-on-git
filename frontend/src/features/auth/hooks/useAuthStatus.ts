import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import type { AuthStatusResponse } from '../types';

export const authQueryKeys = {
  status: ['auth', 'status'] as const,
};

// Hook principal para componentes que PODEM esperar (Suspense)
export const useAuthStatus = () => {
  return useSuspenseQuery<AuthStatusResponse, Error>({
    queryKey: authQueryKeys.status,
    queryFn: authApi.getStatus,
    retry: 1,
  });
};

// Hook "seguro" para componentes de UI global (Barra superior) que não devem travar o app
export const useAuthStatusSafe = () => {
  return useQuery<AuthStatusResponse, Error>({
    queryKey: authQueryKeys.status,
    queryFn: authApi.getStatus,
    retry: false,
  });
};
