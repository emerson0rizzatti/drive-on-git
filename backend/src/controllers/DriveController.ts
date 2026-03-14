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

  async deleteFolder(req: Request, res: Response): Promise<void> {
    try {
      const { googleAccessToken } = this.getAuthSession(req);
      const { id } = req.params as { id: string };
      console.log(`[DriveController] Request to delete folder: ${id}`);
      
      // Safety check: verify ownership again before deletion
      const { ownedByMe, name } = await driveService.getFolderMetadata(googleAccessToken, id);
      console.log(`[DriveController] Folder: ${name}, OwnedByMe: ${ownedByMe}`);

      if (!ownedByMe) {
        console.warn(`[DriveController] Delete aborted: User is not the owner of ${id}`);
        return this.handleError(new Error('Apenas o proprietário da pasta tem permissão para excluí-la. Operação abortada para segurança.'), res, 'deleteFolder');
      }

      await driveService.deleteFolder(googleAccessToken, id);
      console.log(`[DriveController] Folder ${id} deleted successfully.`);
      this.handleSuccess(res, { message: 'Pasta excluída com sucesso.' });
    } catch (error: any) {
      if (error.response?.status === 403) {
        console.error('[DriveController] Google API 403: Insufficient permissions or scope.', error.response.data);
      }
      this.handleError(error, res, 'deleteFolder');
    }
  }
}

export const driveController = new DriveController();
