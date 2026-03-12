import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { githubService } from '../services/githubService';
import { createRepoSchema } from '../validators/repo.schema';
import { AuthenticatedSession } from '../middleware/authGuard';

export class GitHubController extends BaseController {
  async listRepos(req: Request, res: Response): Promise<void> {
    try {
      const { githubAccessToken } = req.session as AuthenticatedSession;
      const repos = await githubService.listUserRepos(githubAccessToken!);
      this.handleSuccess(res, repos);
    } catch (error) {
      this.handleError(error, res, 'listRepos');
    }
  }

  async listTaggedRepos(req: Request, res: Response): Promise<void> {
    try {
      const { githubAccessToken } = req.session as AuthenticatedSession;
      const repos = await githubService.listTaggedRepos(githubAccessToken!);
      this.handleSuccess(res, repos);
    } catch (error) {
      this.handleError(error, res, 'listTaggedRepos');
    }
  }

  async createRepo(req: Request, res: Response): Promise<void> {
    try {
      const { githubAccessToken } = req.session as AuthenticatedSession;
      const input = createRepoSchema.parse(req.body);
      const repo = await githubService.createRepo(githubAccessToken!, input);
      this.handleCreated(res, repo);
    } catch (error) {
      this.handleError(error, res, 'createRepo');
    }
  }
}

export const gitHubController = new GitHubController();
