import { Request, Response, NextFunction, RequestHandler } from 'express';
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare function asyncErrorWrapper(handler: AsyncHandler): RequestHandler;
export {};
//# sourceMappingURL=asyncErrorWrapper.d.ts.map