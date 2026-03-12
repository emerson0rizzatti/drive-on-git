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


export function authGuard(req: Request, res: Response, next: NextFunction): void {
  const session = req.session as AuthenticatedSession;
  if (!session?.googleAccessToken || !session?.githubAccessToken) {
    res.status(401).json({ error: 'Unauthorized', message: 'É necessária a autenticação tanto no Google quanto no GitHub' });
    return;
  }
  next();
}

export function googleAuthGuard(req: Request, res: Response, next: NextFunction): void {
  const session = req.session as AuthenticatedSession;
  if (!session?.googleAccessToken) {
    res.status(401).json({ error: 'Unauthorized', message: 'A autenticação no Google é necessária' });
    return;
  }
  next();
}

export function githubAuthGuard(req: Request, res: Response, next: NextFunction): void {
  const session = req.session as AuthenticatedSession;
  if (!session?.githubAccessToken) {
    res.status(401).json({ error: 'Unauthorized', message: 'A autenticação no GitHub é necessária' });
    return;
  }
  next();
}
