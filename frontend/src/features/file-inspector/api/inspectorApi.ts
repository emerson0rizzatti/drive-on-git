import { axiosInstance } from '../../../api/axiosInstance';
import type { FolderInspectionResult } from '../types';

export const inspectorApi = {
  inspectFolder: async (folderId: string): Promise<FolderInspectionResult> => {
    // This endpoint runs a recursive directory traversal on Google Drive
    const { data } = await axiosInstance.get(`/drive/inspect/${folderId}`);
    return data.data;
  },
};
