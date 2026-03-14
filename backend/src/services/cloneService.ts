import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/node';
import { driveService } from './driveService';
import { githubService } from './githubService';
import { CloneJob, cloneJobs } from '../types/CloneJob';

export class cloneService {
  static startJob(
    folderId: string,
    repoOwner: string,
    repoName: string,
    googleToken: string,
    githubToken: string,
  ): string {
    const jobId = uuidv4();

    const job: CloneJob = {
      jobId,
      status: 'pending',
      folderId,
      ownedByMe: false, // Default will be updated in runJob
      folderName: '',
      repoOwner,
      repoName,
      files: [],
      current: 0,
      total: 0,
      startedAt: new Date(),
    };

    cloneJobs.set(jobId, job);

    // Run async without blocking the response
    this.runJob(job, googleToken, githubToken).catch((err) => {
      Sentry.captureException(err);
      job.status = 'failed';
      job.error = err instanceof Error ? err.message : 'Unknown error';
    });

    return jobId;
  }

  private static async runJob(
    job: CloneJob,
    googleToken: string,
    githubToken: string,
  ): Promise<void> {
    job.status = 'running';

    // 1. Inspect folder to get file list (excluding oversized)
    const inspection = await driveService.buildInspectionResult(googleToken, job.folderId);
    job.folderName = inspection.folderName;
    job.ownedByMe = inspection.ownedByMe;

    const filesToClone = inspection.validFiles;
    job.total = filesToClone.length;
    job.files = filesToClone.map((f) => ({
      fileId: f.id,
      fileName: f.name,
      filePath: f.path,
      status: 'pending' as const,
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
        const buffer = await driveService.downloadFile(googleToken, fileEntry.fileId);
        const existingSha = await githubService.getFileSha(
          githubToken,
          job.repoOwner,
          job.repoName,
          fileEntry.filePath,
        );

        await githubService.uploadFile(
          githubToken,
          job.repoOwner,
          job.repoName,
          fileEntry.filePath,
          buffer,
          `Add ${fileEntry.filePath} [Drive on Git]`,
          existingSha,
        );

        fileEntry.status = 'done';
      } catch (err) {
        Sentry.captureException(err);
        fileEntry.status = 'error';
        fileEntry.error = err instanceof Error ? err.message : 'Upload failed';
      }
    }

    job.status = 'completed';
    job.completedAt = new Date();
  }

  static getJob(jobId: string): CloneJob | undefined {
    return cloneJobs.get(jobId);
  }
}
