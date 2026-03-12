import { Request, Response } from 'express';
import { BaseController } from './BaseController';
export declare class AuthController extends BaseController {
    getStatus(req: Request, res: Response): void;
    logout(req: Request, res: Response): void;
    googleCallback(req: Request, res: Response): void;
    githubCallback(req: Request, res: Response): void;
}
export declare const authController: AuthController;
//# sourceMappingURL=AuthController.d.ts.map