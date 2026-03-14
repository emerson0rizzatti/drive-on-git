import { Request, Response } from 'express';
import { BaseController } from './BaseController';
export declare class DriveController extends BaseController {
    private getAuthSession;
    listFolders(req: Request, res: Response): Promise<void>;
    listFolderContents(req: Request, res: Response): Promise<void>;
    inspectFolder(req: Request, res: Response): Promise<void>;
    deleteFolder(req: Request, res: Response): Promise<void>;
}
export declare const driveController: DriveController;
//# sourceMappingURL=DriveController.d.ts.map