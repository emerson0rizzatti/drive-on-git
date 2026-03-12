import { axiosInstance } from '../../../api/axiosInstance';
import type { StartClonePayload } from '../types';

export const cloneApi = {
  startClone: async (payload: StartClonePayload): Promise<{ jobId: string }> => {
    const { data } = await axiosInstance.post('/clone', payload);
    return data; // using direct return due to 201 Created and response format mapping handled in backend BaseController
  },
};
