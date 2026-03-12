import axios from 'axios';
import {
  DriveFolderContents,
  DriveFile,
  DriveFolder,
  InspectedFile,
  FolderInspectionResult,
} from '../types/DriveFile';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const FILE_SIZE_LIMIT_BYTES = 100 * 1024 * 1024; // 100 MB
const REPO_SIZE_LIMIT_BYTES = 1024 * 1024 * 1024; // 1 GB

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export class driveService {
  static async listRootFolders(accessToken: string): Promise<DriveFolder[]> {
    const params = {
      q: "mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false",
      fields: 'files(id,name,modifiedTime)',
      pageSize: 50,
    };
    const { data } = await axios.get(`${DRIVE_API}/files`, {
      params,
      headers: authHeader(accessToken),
    });
    return data.files as DriveFolder[];
  }

  static async listFolderContents(
    accessToken: string,
    folderId: string,
    pageToken?: string,
  ): Promise<DriveFolderContents> {
    const params: Record<string, string | number> = {
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'nextPageToken,files(id,name,mimeType,size,modifiedTime,parents)',
      pageSize: 100,
      orderBy: 'name',
    };
    if (pageToken) params.pageToken = pageToken;

    const { data } = await axios.get(`${DRIVE_API}/files`, {
      params,
      headers: authHeader(accessToken),
    });

    const folders: DriveFolder[] = [];
    const files: DriveFile[] = [];

    for (const item of data.files) {
      if (item.mimeType === 'application/vnd.google-apps.folder') {
        folders.push(item as DriveFolder);
      } else {
        files.push(item as DriveFile);
      }
    }

    return { folders, files, nextPageToken: data.nextPageToken };
  }

  static async getFolderName(accessToken: string, folderId: string): Promise<string> {
    const { data } = await axios.get(`${DRIVE_API}/files/${folderId}`, {
      params: { fields: 'name' },
      headers: authHeader(accessToken),
    });
    return data.name as string;
  }

  // Recursively inspect all files in a folder
  static async inspectFolder(
    accessToken: string,
    folderId: string,
    basePath: string = '',
  ): Promise<InspectedFile[]> {
    const results: InspectedFile[] = [];
    let pageToken: string | undefined;

    do {
      const contents = await this.listFolderContents(accessToken, folderId, pageToken);
      pageToken = contents.nextPageToken;

      // Process files
      for (const file of contents.files) {
        const sizeBytes = parseInt(String(file.size ?? '0'), 10);
        const sizeMB = sizeBytes / (1024 * 1024);
        const filePath = basePath ? `${basePath}/${file.name}` : file.name;

        results.push({
          id: file.id,
          name: file.name,
          path: filePath,
          sizeBytes,
          sizeMB: parseFloat(sizeMB.toFixed(2)),
          mimeType: file.mimeType,
          oversized: sizeBytes > FILE_SIZE_LIMIT_BYTES,
        });
      }

      // Recurse into subfolders
      for (const folder of contents.folders) {
        const subPath = basePath ? `${basePath}/${folder.name}` : folder.name;
        const subFiles = await this.inspectFolder(accessToken, folder.id, subPath);
        results.push(...subFiles);
      }
    } while (pageToken);

    return results;
  }

  static async buildInspectionResult(
    accessToken: string,
    folderId: string,
  ): Promise<FolderInspectionResult> {
    const folderName = await this.getFolderName(accessToken, folderId);
    const allFiles = await this.inspectFolder(accessToken, folderId);

    const validFiles = allFiles.filter((f) => !f.oversized);
    const oversizedFiles = allFiles.filter((f) => f.oversized);
    const totalSizeBytes = allFiles.reduce((acc, f) => acc + f.sizeBytes, 0);
    const validSizeBytes = validFiles.reduce((acc, f) => acc + f.sizeBytes, 0);

    return {
      folderId,
      folderName,
      totalFiles: allFiles.length,
      totalSizeBytes,
      totalSizeMB: parseFloat((totalSizeBytes / (1024 * 1024)).toFixed(2)),
      validFiles,
      oversizedFiles,
      exceedsRepoLimit: validSizeBytes > REPO_SIZE_LIMIT_BYTES,
    };
  }

  // Download a file as a Buffer
  static async downloadFile(accessToken: string, fileId: string): Promise<Buffer> {
    const { data } = await axios.get(`${DRIVE_API}/files/${fileId}`, {
      params: { alt: 'media' },
      headers: authHeader(accessToken),
      responseType: 'arraybuffer',
    });
    return Buffer.from(data);
  }
}
