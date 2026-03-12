import { useSuspenseQuery } from '@tanstack/react-query';
import { inspectorApi } from '../api/inspectorApi';
import type { FolderInspectionResult } from '../types';

export const inspectorQueryKeys = {
  all: ['inspector'] as const,
  folder: (folderId: string) => [...inspectorQueryKeys.all, folderId] as const,
};

export const useInspectFolder = (folderId: string) => {
  return useSuspenseQuery<FolderInspectionResult, Error>({
    queryKey: inspectorQueryKeys.folder(folderId),
    queryFn: () => inspectorApi.inspectFolder(folderId),
    // Increase stale time because inspecting a large folder can be heavy
    staleTime: 10 * 60 * 1000, 
  });
};
