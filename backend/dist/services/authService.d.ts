import { AuthenticatedSession } from '../middleware/authGuard';
export interface AuthStatus {
    google: boolean;
    github: boolean;
    googleUser?: AuthenticatedSession['googleUser'];
    githubUser?: AuthenticatedSession['githubUser'];
}
export declare class authService {
    static getStatus(session: AuthenticatedSession): AuthStatus;
    static clearSession(session: AuthenticatedSession): void;
}
//# sourceMappingURL=authService.d.ts.map