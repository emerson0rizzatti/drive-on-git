import { useSuspenseQuery } from '@tanstack/react-query';
import { driveApi } from '../api/driveApi';
import type { DriveFolder, DriveFolderContents } from '../types';

export const driveQueryKeys = {
  all: ['drive'] as const,
  rootFolders: () => [...driveQueryKeys.all, 'rootFolders'] as const,
  folderContents: (folderId: string) => [...driveQueryKeys.all, 'folders', folderId] as const,
};

export const useRootFolders = () => {
  return useSuspenseQuery<DriveFolder[], Error>({
    queryKey: driveQueryKeys.rootFolders(),
    queryFn: driveApi.getRootFolders,
  });
};

export const useFolderContents = (folderId: string) => {
  return useSuspenseQuery<DriveFolderContents, Error>({
    queryKey: driveQueryKeys.folderContents(folderId),
    queryFn: () => driveApi.getFolderContents(folderId),
  });
};
