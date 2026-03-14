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
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
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
    console.log(`[DriveService] Listing contents for folderId: ${folderId}${pageToken ? ' (page: ' + pageToken + ')' : ''}`);
    const params: Record<string, string | number | boolean> = {
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'nextPageToken,files(id,name,mimeType,size,modifiedTime,parents)',
      pageSize: 100,
      orderBy: 'name',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    };
    if (pageToken) params.pageToken = pageToken;

    const { data } = await axios.get(`${DRIVE_API}/files`, {
      params,
      headers: authHeader(accessToken),
    });

    if (!data || !data.files) {
      console.warn(`[DriveService] No files found for folderId in response: ${folderId}`);
      return { folders: [], files: [], nextPageToken: undefined };
    }

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

  static async getFolderMetadata(accessToken: string, folderId: string): Promise<{ name: string; ownedByMe: boolean }> {
    const { data } = await axios.get(`${DRIVE_API}/files/${folderId}`, {
      params: { 
        fields: 'name,ownedByMe',
        supportsAllDrives: true 
      },
      headers: authHeader(accessToken),
    });
    return { 
      name: data.name as string, 
      ownedByMe: !!data.ownedByMe 
    };
  }

  // Recursively inspect all files in a folder
  static async inspectFolder(
    accessToken: string,
    folderId: string,
    basePath: string = '',
    depth: number = 0
  ): Promise<InspectedFile[]> {
    if (depth > 10) {
      console.warn(`[DriveService] Max depth reached at ${basePath}. Skipping deeper traversal.`);
      return [];
    }

    const results: InspectedFile[] = [];
    let pageToken: string | undefined;

    do {
      const contents = await this.listFolderContents(accessToken, folderId, pageToken);
      pageToken = contents.nextPageToken;

      // Process files
      for (const file of contents.files) {
        if (!file.id || !file.name) continue;

        const sizeBytes = parseInt(String(file.size ?? '0'), 10);
        const sizeMB = sizeBytes / (1024 * 1024);
        const filePath = basePath ? `${basePath}/${file.name}` : file.name;

        results.push({
          id: file.id,
          name: file.name,
          path: filePath,
          sizeBytes,
          sizeMB: parseFloat(sizeMB.toFixed(2)),
          mimeType: file.mimeType || 'unknown',
          oversized: sizeBytes > FILE_SIZE_LIMIT_BYTES,
        });
      }

      // Recurse into subfolders
      for (const folder of contents.folders) {
        if (!folder.id || !folder.name) continue;
        
        const subPath = basePath ? `${basePath}/${folder.name}` : folder.name;
        try {
          const subFiles = await this.inspectFolder(accessToken, folder.id, subPath, depth + 1);
          results.push(...subFiles);
        } catch (err) {
          console.error(`[DriveService] Failed to inspect subfolder ${subPath} (${folder.id}):`, err);
          // Continue with other folders instead of failing entire inspection
        }
      }
    } while (pageToken);

    return results;
  }

  static async buildInspectionResult(
    accessToken: string,
    folderId: string,
  ): Promise<FolderInspectionResult> {
    console.log(`[DriveService] Starting inspection for folder: ${folderId}`);
    const { name: folderName, ownedByMe } = await this.getFolderMetadata(accessToken, folderId);
    console.log(`[DriveService] Folder name: ${folderName}, OwnedByMe: ${ownedByMe}`);
    const allFiles = await this.inspectFolder(accessToken, folderId);
    console.log(`[DriveService] Inspection complete. Found ${allFiles.length} files.`);

    const validFiles = allFiles.filter((f) => !f.oversized);
    const oversizedFiles = allFiles.filter((f) => f.oversized);
    const totalSizeBytes = allFiles.reduce((acc, f) => acc + f.sizeBytes, 0);
    const validSizeBytes = validFiles.reduce((acc, f) => acc + f.sizeBytes, 0);

    return {
      folderId,
      folderName,
      ownedByMe,
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
      params: { 
        alt: 'media',
        supportsAllDrives: true
      },
      headers: authHeader(accessToken),
      responseType: 'arraybuffer',
    });
    return Buffer.from(data);
  }

  static async deleteFolder(accessToken: string, folderId: string): Promise<void> {
    await axios.delete(`${DRIVE_API}/files/${folderId}`, {
      params: { supportsAllDrives: true },
      headers: authHeader(accessToken),
    });
  }
}
