import { DriveFolderContents, DriveFolder, InspectedFile, FolderInspectionResult } from '../types/DriveFile';
export declare class driveService {
    static listRootFolders(accessToken: string): Promise<DriveFolder[]>;
    static listFolderContents(accessToken: string, folderId: string, pageToken?: string): Promise<DriveFolderContents>;
    static getFolderMetadata(accessToken: string, folderId: string): Promise<{
        name: string;
        ownedByMe: boolean;
    }>;
    static inspectFolder(accessToken: string, folderId: string, basePath?: string, depth?: number): Promise<InspectedFile[]>;
    static buildInspectionResult(accessToken: string, folderId: string): Promise<FolderInspectionResult>;
    static downloadFile(accessToken: string, fileId: string): Promise<Buffer>;
    static deleteFolder(accessToken: string, folderId: string): Promise<void>;
}
//# sourceMappingURL=driveService.d.ts.map