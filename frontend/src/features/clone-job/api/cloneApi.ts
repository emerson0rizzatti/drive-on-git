import { authApiConfig } from '../../auth/api/authApi';
import type { StartClonePayload } from '../types';

export const cloneApi = {
  startClone: async (payload: StartClonePayload): Promise<{ jobId: string }> => {
    const { data } = await authApiConfig.post('/clone', payload);
    return data; // using direct return due to 201 Created and response format mapping handled in backend BaseController
  },
};
