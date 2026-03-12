import { Request, Response } from 'express';
import { BaseController } from './BaseController';
export declare class GitHubController extends BaseController {
    listRepos(req: Request, res: Response): Promise<void>;
    listTaggedRepos(req: Request, res: Response): Promise<void>;
    createRepo(req: Request, res: Response): Promise<void>;
}
export declare const gitHubController: GitHubController;
//# sourceMappingURL=GitHubController.d.ts.map