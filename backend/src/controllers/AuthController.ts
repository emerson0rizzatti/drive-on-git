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
    const session = req.session as AuthenticatedSession;
    const userEmail = session.googleUser?.email?.toLowerCase();

    // Enforce allow-list if defined
    if (config.allowedUsers.length > 0) {
      if (!userEmail || !config.allowedUsers.includes(userEmail)) {
        console.warn(`[AuthController] Unauthorized login attempt from: ${userEmail}`);
        authService.clearSession(session);
        return res.redirect(`${config.frontend.url}?auth=access_denied&email=${encodeURIComponent(userEmail || '')}`);
      }
    }

    res.redirect(`${config.frontend.url}?auth=google_success`);
  }

  githubCallback(req: Request, res: Response): void {
    res.redirect(`${config.frontend.url}?auth=github_success`);
  }
}

export const authController = new AuthController();
