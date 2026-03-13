import { axiosInstance } from '../../../api/axiosInstance';
import type { StartClonePayload } from '../types';

export const cloneApi = {
  startClone: async (payload: StartClonePayload): Promise<{ jobId: string }> => {
    const { data } = await axiosInstance.post('/clone/start', payload);
    return data.data; // backend wraps result in { success: true, data: { jobId } }
  },
};
