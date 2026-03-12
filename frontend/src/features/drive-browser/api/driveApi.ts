import { authApiConfig } from '../../auth/api/authApi';
import type { DriveFolder, DriveFolderContents } from '../types';

export const driveApi = {
  getRootFolders: async (): Promise<DriveFolder[]> => {
    const { data } = await authApiConfig.get('/drive/folders');
    return data.data;
  },
  getFolderContents: async (folderId: string, pageToken?: string): Promise<DriveFolderContents> => {
    const { data } = await authApiConfig.get(`/drive/folders/${folderId}`, {
      params: { pageToken },
    });
    return data.data;
  },
};
