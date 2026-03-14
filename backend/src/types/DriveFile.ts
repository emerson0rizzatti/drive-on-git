// Drive API types
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number; // bytes
  parents?: string[];
  modifiedTime?: string;
}

export interface DriveFolder {
  id: string;
  name: string;
  parents?: string[];
  modifiedTime?: string;
}

export interface DriveFolderContents {
  folders: DriveFolder[];
  files: DriveFile[];
  nextPageToken?: string;
}

export interface InspectedFile {
  id: string;
  name: string;
  path: string; // relative path within the selected folder
  sizeBytes: number;
  sizeMB: number;
  mimeType: string;
  oversized: boolean; // > 100MB
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
  exceedsRepoLimit: boolean; // total > 1GB
}
