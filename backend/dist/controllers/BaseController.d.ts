import { Response } from 'express';
export declare abstract class BaseController {
    protected handleSuccess<T>(res: Response, data: T, statusCode?: number): void;
    protected handleCreated<T>(res: Response, data: T): void;
    protected handleError(error: unknown, res: Response, context: string): void;
    private getStatusCode;
}
//# sourceMappingURL=BaseController.d.ts.map