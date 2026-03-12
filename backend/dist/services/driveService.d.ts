import { DriveFolderContents, DriveFolder, InspectedFile, FolderInspectionResult } from '../types/DriveFile';
export declare class driveService {
    static listRootFolders(accessToken: string): Promise<DriveFolder[]>;
    static listFolderContents(accessToken: string, folderId: string, pageToken?: string): Promise<DriveFolderContents>;
    static getFolderName(accessToken: string, folderId: string): Promise<string>;
    static inspectFolder(accessToken: string, folderId: string, basePath?: string): Promise<InspectedFile[]>;
    static buildInspectionResult(accessToken: string, folderId: string): Promise<FolderInspectionResult>;
    static downloadFile(accessToken: string, fileId: string): Promise<Buffer>;
}
//# sourceMappingURL=driveService.d.ts.map