import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  Sentry.captureException(err);
  console.error('[ErrorHandler]', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
}
