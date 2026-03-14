import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { authApi } from '../api/authApi';
import { authQueryKeys } from './useAuthStatus';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Invalidate auth status query
      queryClient.invalidateQueries({ queryKey: authQueryKeys.status });
      
      // Redirect to home/login
      navigate({ to: '/' });
    },
  });
};
