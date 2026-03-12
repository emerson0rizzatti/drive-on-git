import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { authService } from '../services/authService';
import { AuthenticatedSession } from '../middleware/authGuard';
import { config } from '../config/unifiedConfig';

export class AuthController extends BaseController {
  getStatus(req: Request, res: Response): void {
    try {
      const status = authService.getStatus(req.session as AuthenticatedSession);
      this.handleSuccess(res, status);
    } catch (error) {
      this.handleError(error, res, 'getStatus');
    }
  }

  logout(req: Request, res: Response): void {
    try {
      authService.clearSession(req.session as AuthenticatedSession);
      this.handleSuccess(res, { message: 'Sessão encerrada com sucesso' });
    } catch (error) {
      this.handleError(error, res, 'logout');
    }
  }

  googleCallback(req: Request, res: Response): void {
    // After Passport handles OAuth, redirect to frontend
    res.redirect(`${config.frontend.url}?auth=google_success`);
  }

  githubCallback(req: Request, res: Response): void {
    res.redirect(`${config.frontend.url}?auth=github_success`);
  }
}

export const authController = new AuthController();
