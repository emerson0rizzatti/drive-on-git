"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.driveService = void 0;
const axios_1 = __importDefault(require("axios"));
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const FILE_SIZE_LIMIT_BYTES = 100 * 1024 * 1024; // 100 MB
const REPO_SIZE_LIMIT_BYTES = 1024 * 1024 * 1024; // 1 GB
function authHeader(token) {
    return { Authorization: `Bearer ${token}` };
}
class driveService {
    static async listRootFolders(accessToken) {
        const params = {
            q: "mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false",
            fields: 'files(id,name,modifiedTime)',
            pageSize: 50,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        };
        const { data } = await axios_1.default.get(`${DRIVE_API}/files`, {
            params,
            headers: authHeader(accessToken),
        });
        return data.files;
    }
    static async listFolderContents(accessToken, folderId, pageToken) {
        console.log(`[DriveService] Listing contents for folderId: ${folderId}${pageToken ? ' (page: ' + pageToken + ')' : ''}`);
        const params = {
            q: `'${folderId}' in parents and trashed=false`,
            fields: 'nextPageToken,files(id,name,mimeType,size,modifiedTime,parents)',
            pageSize: 100,
            orderBy: 'name',
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        };
        if (pageToken)
            params.pageToken = pageToken;
        const { data } = await axios_1.default.get(`${DRIVE_API}/files`, {
            params,
            headers: authHeader(accessToken),
        });
        if (!data || !data.files) {
            console.warn(`[DriveService] No files found for folderId in response: ${folderId}`);
            return { folders: [], files: [], nextPageToken: undefined };
        }
        const folders = [];
        const files = [];
        for (const item of data.files) {
            if (item.mimeType === 'application/vnd.google-apps.folder') {
                folders.push(item);
            }
            else {
                files.push(item);
            }
        }
        return { folders, files, nextPageToken: data.nextPageToken };
    }
    static async getFolderName(accessToken, folderId) {
        const { data } = await axios_1.default.get(`${DRIVE_API}/files/${folderId}`, {
            params: {
                fields: 'name',
                supportsAllDrives: true
            },
            headers: authHeader(accessToken),
        });
        return data.name;
    }
    // Recursively inspect all files in a folder
    static async inspectFolder(accessToken, folderId, basePath = '', depth = 0) {
        if (depth > 10) {
            console.warn(`[DriveService] Max depth reached at ${basePath}. Skipping deeper traversal.`);
            return [];
        }
        const results = [];
        let pageToken;
        do {
            const contents = await this.listFolderContents(accessToken, folderId, pageToken);
            pageToken = contents.nextPageToken;
            // Process files
            for (const file of contents.files) {
                if (!file.id || !file.name)
                    continue;
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
                if (!folder.id || !folder.name)
                    continue;
                const subPath = basePath ? `${basePath}/${folder.name}` : folder.name;
                try {
                    const subFiles = await this.inspectFolder(accessToken, folder.id, subPath, depth + 1);
                    results.push(...subFiles);
                }
                catch (err) {
                    console.error(`[DriveService] Failed to inspect subfolder ${subPath} (${folder.id}):`, err);
                    // Continue with other folders instead of failing entire inspection
                }
            }
        } while (pageToken);
        return results;
    }
    static async buildInspectionResult(accessToken, folderId) {
        console.log(`[DriveService] Starting inspection for folder: ${folderId}`);
        const folderName = await this.getFolderName(accessToken, folderId);
        console.log(`[DriveService] Folder name: ${folderName}`);
        const allFiles = await this.inspectFolder(accessToken, folderId);
        console.log(`[DriveService] Inspection complete. Found ${allFiles.length} files.`);
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
    static async downloadFile(accessToken, fileId) {
        const { data } = await axios_1.default.get(`${DRIVE_API}/files/${fileId}`, {
            params: {
                alt: 'media',
                supportsAllDrives: true
            },
            headers: authHeader(accessToken),
            responseType: 'arraybuffer',
        });
        return Buffer.from(data);
    }
}
exports.driveService = driveService;
//# sourceMappingURL=driveService.js.map