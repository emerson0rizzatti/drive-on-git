import { CloneJob } from '../types/CloneJob';
export declare class cloneService {
    static startJob(folderId: string, repoOwner: string, repoName: string, googleToken: string, githubToken: string): string;
    private static runJob;
    static getJob(jobId: string): CloneJob | undefined;
}
//# sourceMappingURL=cloneService.d.ts.map