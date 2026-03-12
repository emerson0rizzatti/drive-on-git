import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedSession {
    googleAccessToken?: string;
    googleUser?: {
        id: string;
        displayName: string;
        email: string;
        photo?: string;
    };
    githubAccessToken?: string;
    githubUser?: {
        id: string;
        login: string;
        name: string;
        avatar_url: string;
    };
}
export declare function authGuard(req: Request, res: Response, next: NextFunction): void;
export declare function googleAuthGuard(req: Request, res: Response, next: NextFunction): void;
export declare function githubAuthGuard(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=authGuard.d.ts.map