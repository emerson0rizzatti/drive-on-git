"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driveController = exports.DriveController = void 0;
const BaseController_1 = require("./BaseController");
const driveService_1 = require("../services/driveService");
class DriveController extends BaseController_1.BaseController {
    getAuthSession(req) {
        const session = req.session;
        if (!session || !session.googleAccessToken) {
            throw new Error('Acesso não autorizado: Token do Google ausente na sessão.');
        }
        return session;
    }
    async listFolders(req, res) {
        try {
            const { googleAccessToken } = this.getAuthSession(req);
            const folders = await driveService_1.driveService.listRootFolders(googleAccessToken);
            this.handleSuccess(res, folders);
        }
        catch (error) {
            this.handleError(error, res, 'listFolders');
        }
    }
    async listFolderContents(req, res) {
        try {
            const { googleAccessToken } = this.getAuthSession(req);
            const { id } = req.params;
            const { pageToken } = req.query;
            const contents = await driveService_1.driveService.listFolderContents(googleAccessToken, id, pageToken);
            this.handleSuccess(res, contents);
        }
        catch (error) {
            this.handleError(error, res, 'listFolderContents');
        }
    }
    async inspectFolder(req, res) {
        try {
            const { googleAccessToken } = this.getAuthSession(req);
            const { id } = req.params;
            const result = await driveService_1.driveService.buildInspectionResult(googleAccessToken, id);
            this.handleSuccess(res, result);
        }
        catch (error) {
            this.handleError(error, res, 'inspectFolder');
        }
    }
}
exports.DriveController = DriveController;
exports.driveController = new DriveController();
//# sourceMappingURL=DriveController.js.map