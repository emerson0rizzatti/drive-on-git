import { axiosInstance } from '../../../api/axiosInstance';
import type { DriveFolder, DriveFolderContents } from '../types';

export const driveApi = {
  getRootFolders: async (): Promise<DriveFolder[]> => {
    const { data } = await axiosInstance.get('/drive/folders');
    return data.data;
  },
  getFolderContents: async (folderId: string, pageToken?: string): Promise<DriveFolderContents> => {
    const { data } = await axiosInstance.get(`/drive/folders/${folderId}`, {
      params: { pageToken },
    });
    return data.data;
  },
};
