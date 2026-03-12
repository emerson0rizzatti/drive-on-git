import { GitHubRepo, CreateRepoPayload } from '../types/GitHubRepo';
export declare class githubService {
    static listUserRepos(accessToken: string): Promise<GitHubRepo[]>;
    static listTaggedRepos(accessToken: string): Promise<GitHubRepo[]>;
    static createRepo(accessToken: string, payload: CreateRepoPayload): Promise<GitHubRepo>;
    static getRepo(accessToken: string, owner: string, repo: string): Promise<GitHubRepo>;
    static uploadFile(accessToken: string, owner: string, repo: string, path: string, content: Buffer, message: string, sha?: string): Promise<void>;
    static getFileSha(accessToken: string, owner: string, repo: string, path: string): Promise<string | undefined>;
}
//# sourceMappingURL=githubService.d.ts.map