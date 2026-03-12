"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const AuthController_1 = require("../controllers/AuthController");
const asyncErrorWrapper_1 = require("../middleware/asyncErrorWrapper");
const router = express_1.default.Router();
// Google OAuth
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive.readonly'],
    session: false,
}));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false, failureRedirect: '/?auth=google_error' }), (req, res) => AuthController_1.authController.googleCallback(req, res));
// GitHub OAuth
router.get('/github', passport_1.default.authenticate('github', {
    scope: ['repo', 'user'],
    session: false,
}));
router.get('/github/callback', passport_1.default.authenticate('github', { session: false, failureRedirect: '/?auth=github_error' }), (req, res) => AuthController_1.authController.githubCallback(req, res));
// Status and logout
router.get('/status', (req, res) => AuthController_1.authController.getStatus(req, res));
router.post('/logout', (0, asyncErrorWrapper_1.asyncErrorWrapper)(async (req, res) => {
    AuthController_1.authController.logout(req, res);
}));
exports.default = router;
//# sourceMappingURL=authRoutes.js.map