export interface CloneJobStatus {
  jobId: string;
  folderId: string;
  folderName: string;
  ownedByMe?: boolean;
  repoOwner: string;
  repoName: string;
  status: 'pending' | 'inspecting' | 'processing' | 'completed' | 'failed';
  progress: {
    totalFiles: number;
    processedFiles: number;
    successfulFiles: number;
    failedFiles: number;
    skippedFiles: number;
    currentFile?: string;
  };
  errors: string[];
  createdAt: string;
}

export interface StartClonePayload {
  folderId: string;
  repoOwner: string;
  repoName: string;
}
