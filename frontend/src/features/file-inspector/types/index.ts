export interface InspectedFile {
  id: string;
  name: string;
  path: string;
  sizeBytes: number;
  sizeMB: number;
  mimeType: string;
  oversized: boolean; // > 100MB marker
}

export interface FolderInspectionResult {
  folderId: string;
  folderName: string;
  ownedByMe: boolean;
  totalFiles: number;
  totalSizeBytes: number;
  totalSizeMB: number;
  validFiles: InspectedFile[];
  oversizedFiles: InspectedFile[];
  exceedsRepoLimit: boolean; // total > 1GB marker
}
