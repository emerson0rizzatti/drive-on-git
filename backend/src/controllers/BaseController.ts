import { Response } from 'express';
import * as Sentry from '@sentry/node';

export abstract class BaseController {
  protected handleSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
    res.status(statusCode).json({ success: true, data });
  }

  protected handleCreated<T>(res: Response, data: T): void {
    this.handleSuccess(res, data, 201);
  }

  protected handleError(error: any, res: Response, context: string): void {
    Sentry.captureException(error, { tags: { context } });
    
    // Log detailed axios error if present
    if (error.response) {
      console.error(`[BaseController] Axios Error in ${context}:`, {
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error(`[BaseController] Error in ${context}:`, error);
    }

    if (error.response) {
      res.status(error.response.status).json({ 
        success: false, 
        error: error.message,
        details: error.response.data 
      });
    } else if (error instanceof Error) {
      const statusCode = this.getStatusCode(error);
      res.status(statusCode).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Unknown error' });
    }
  }

  private getStatusCode(error: any): number {
    if (error.response) {
      return error.response.status;
    }
    if (error.message?.includes('Unauthorized') || error.message?.includes('authentication')) return 401;
    if (error.message?.includes('Forbidden') || error.message?.includes('permission')) return 403;
    if (error.message?.includes('Not found') || error.message?.includes('not found')) return 404;
    if (error.message?.includes('validation') || error.message?.includes('invalid')) return 422;
    return 500;
  }
}
