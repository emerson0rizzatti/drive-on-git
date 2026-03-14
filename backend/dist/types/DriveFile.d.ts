export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    size?: number;
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
    path: string;
    sizeBytes: number;
    sizeMB: number;
    mimeType: string;
    oversized: boolean;
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
    exceedsRepoLimit: boolean;
}
//# sourceMappingURL=DriveFile.d.ts.map