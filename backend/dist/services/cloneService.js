"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneService = void 0;
const uuid_1 = require("uuid");
const Sentry = __importStar(require("@sentry/node"));
const driveService_1 = require("./driveService");
const githubService_1 = require("./githubService");
const CloneJob_1 = require("../types/CloneJob");
class cloneService {
    static startJob(folderId, repoOwner, repoName, googleToken, githubToken) {
        const jobId = (0, uuid_1.v4)();
        const job = {
            jobId,
            status: 'pending',
            folderId,
            folderName: '',
            repoOwner,
            repoName,
            files: [],
            current: 0,
            total: 0,
            startedAt: new Date(),
        };
        CloneJob_1.cloneJobs.set(jobId, job);
        // Run async without blocking the response
        this.runJob(job, googleToken, githubToken).catch((err) => {
            Sentry.captureException(err);
            job.status = 'failed';
            job.error = err instanceof Error ? err.message : 'Unknown error';
        });
        return jobId;
    }
    static async runJob(job, googleToken, githubToken) {
        job.status = 'running';
        // 1. Inspect folder to get file list (excluding oversized)
        const inspection = await driveService_1.driveService.buildInspectionResult(googleToken, job.folderId);
        job.folderName = inspection.folderName;
        const filesToClone = inspection.validFiles;
        job.total = filesToClone.length;
        job.files = filesToClone.map((f) => ({
            fileId: f.id,
            fileName: f.name,
            filePath: f.path,
            status: 'pending',
        }));
        // Add skipped files to job record
        for (const oversized of inspection.oversizedFiles) {
            job.files.push({
                fileId: oversized.id,
                fileName: oversized.name,
                filePath: oversized.path,
                status: 'skipped',
                error: `File exceeds 100 MB limit (${oversized.sizeMB.toFixed(1)} MB)`,
            });
        }
        // 2. Upload each valid file
        for (let i = 0; i < filesToClone.length; i++) {
            const fileEntry = job.files[i];
            fileEntry.status = 'uploading';
            job.current = i + 1;
            try {
                const buffer = await driveService_1.driveService.downloadFile(googleToken, fileEntry.fileId);
                const existingSha = await githubService_1.githubService.getFileSha(githubToken, job.repoOwner, job.repoName, fileEntry.filePath);
                await githubService_1.githubService.uploadFile(githubToken, job.repoOwner, job.repoName, fileEntry.filePath, buffer, `Add ${fileEntry.filePath} [Drive on Git]`, existingSha);
                fileEntry.status = 'done';
            }
            catch (err) {
                Sentry.captureException(err);
                fileEntry.status = 'error';
                fileEntry.error = err instanceof Error ? err.message : 'Upload failed';
            }
        }
        job.status = 'completed';
        job.completedAt = new Date();
    }
    static getJob(jobId) {
        return CloneJob_1.cloneJobs.get(jobId);
    }
}
exports.cloneService = cloneService;
//# sourceMappingURL=cloneService.js.map