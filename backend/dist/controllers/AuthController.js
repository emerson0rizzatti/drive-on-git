"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const BaseController_1 = require("./BaseController");
const authService_1 = require("../services/authService");
const unifiedConfig_1 = require("../config/unifiedConfig");
class AuthController extends BaseController_1.BaseController {
    getStatus(req, res) {
        try {
            const status = authService_1.authService.getStatus(req.session);
            this.handleSuccess(res, status);
        }
        catch (error) {
            this.handleError(error, res, 'getStatus');
        }
    }
    logout(req, res) {
        try {
            authService_1.authService.clearSession(req.session);
            this.handleSuccess(res, { message: 'Sessão encerrada com sucesso' });
        }
        catch (error) {
            this.handleError(error, res, 'logout');
        }
    }
    googleCallback(req, res) {
        // After Passport handles OAuth, redirect to frontend
        res.redirect(`${unifiedConfig_1.config.frontend.url}?auth=google_success`);
    }
    githubCallback(req, res) {
        res.redirect(`${unifiedConfig_1.config.frontend.url}?auth=github_success`);
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=AuthController.js.map