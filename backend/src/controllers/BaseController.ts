import { Response } from 'express';
import * as Sentry from '@sentry/node';

export abstract class BaseController {
  protected handleSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
    res.status(statusCode).json({ success: true, data });
  }

  protected handleCreated<T>(res: Response, data: T): void {
    this.handleSuccess(res, data, 201);
  }

  protected handleError(error: unknown, res: Response, context: string): void {
    Sentry.captureException(error, { tags: { context } });

    if (error instanceof Error) {
      const statusCode = this.getStatusCode(error);
      res.status(statusCode).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Unknown error' });
    }
  }

  private getStatusCode(error: Error): number {
    if (error.message.includes('Unauthorized') || error.message.includes('authentication')) return 401;
    if (error.message.includes('Forbidden') || error.message.includes('permission')) return 403;
    if (error.message.includes('Not found') || error.message.includes('not found')) return 404;
    if (error.message.includes('validation') || error.message.includes('invalid')) return 422;
    return 500;
  }
}
