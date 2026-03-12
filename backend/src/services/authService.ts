import { AuthenticatedSession } from '../middleware/authGuard';

export interface AuthStatus {
  google: boolean;
  github: boolean;
  googleUser?: AuthenticatedSession['googleUser'];
  githubUser?: AuthenticatedSession['githubUser'];
}

export class authService {
  static getStatus(session: AuthenticatedSession): AuthStatus {
    return {
      google: !!session.googleAccessToken,
      github: !!session.githubAccessToken,
      googleUser: session.googleUser,
      githubUser: session.githubUser,
    };
  }

  static clearSession(session: AuthenticatedSession): void {
    delete session.googleAccessToken;
    delete session.googleUser;
    delete session.githubAccessToken;
    delete session.githubUser;
  }
}
