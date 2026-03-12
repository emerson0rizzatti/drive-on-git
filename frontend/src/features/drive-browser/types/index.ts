export interface DriveFolder {
  id: string;
  name: string;
  modifiedTime?: string;
}

export interface DriveFolderContents {
  folders: DriveFolder[];
  files: Array<{
    id: string;
    name: string;
    mimeType: string;
    size?: string;
  }>;
  nextPageToken?: string;
}
