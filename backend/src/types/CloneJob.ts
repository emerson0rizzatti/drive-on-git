export type CloneStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface CloneJobFile {
  fileId: string;
  fileName: string;
  filePath: string;
  status: 'pending' | 'uploading' | 'done' | 'error' | 'skipped';
  error?: string;
}

export interface CloneJob {
  jobId: string;
  status: CloneStatus;
  folderId: string;
  folderName: string;
  repoOwner: string;
  repoName: string;
  files: CloneJobFile[];
  current: number;
  total: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

// In-memory job store (no database)
export const cloneJobs = new Map<string, CloneJob>();
