import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { driveService } from '../services/driveService';
import { AuthenticatedSession } from '../middleware/authGuard';

export class DriveController extends BaseController {
  private getAuthSession(req: Request): AuthenticatedSession & { googleAccessToken: string } {
    const session = req.session as AuthenticatedSession | null;
    if (!session || !session.googleAccessToken) {
      throw new Error('Acesso não autorizado: Token do Google ausente na sessão.');
    }
    return session as AuthenticatedSession & { googleAccessToken: string };
  }

  async listFolders(req: Request, res: Response): Promise<void> {
    try {
      const { googleAccessToken } = this.getAuthSession(req);
      const folders = await driveService.listRootFolders(googleAccessToken);
      this.handleSuccess(res, folders);
    } catch (error) {
      this.handleError(error, res, 'listFolders');
    }
  }

  async listFolderContents(req: Request, res: Response): Promise<void> {
    try {
      const { googleAccessToken } = this.getAuthSession(req);
      const { id } = req.params as { id: string };
      const { pageToken } = req.query as { pageToken?: string };
      const contents = await driveService.listFolderContents(googleAccessToken, id, pageToken);
      this.handleSuccess(res, contents);
    } catch (error) {
      this.handleError(error, res, 'listFolderContents');
    }
  }

  async inspectFolder(req: Request, res: Response): Promise<void> {
    try {
      const { googleAccessToken } = this.getAuthSession(req);
      const { id } = req.params as { id: string };
      const result = await driveService.buildInspectionResult(googleAccessToken, id);
      this.handleSuccess(res, result);
    } catch (error) {
      this.handleError(error, res, 'inspectFolder');
    }
  }
}

export const driveController = new DriveController();
