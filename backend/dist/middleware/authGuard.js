"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
exports.googleAuthGuard = googleAuthGuard;
exports.githubAuthGuard = githubAuthGuard;
function authGuard(req, res, next) {
    const session = req.session;
    if (!session?.googleAccessToken || !session?.githubAccessToken) {
        res.status(401).json({ error: 'Unauthorized', message: 'Both Google and GitHub authentication are required' });
        return;
    }
    next();
}
function googleAuthGuard(req, res, next) {
    const session = req.session;
    if (!session?.googleAccessToken) {
        res.status(401).json({ error: 'Unauthorized', message: 'Google authentication is required' });
        return;
    }
    next();
}
function githubAuthGuard(req, res, next) {
    const session = req.session;
    if (!session?.githubAccessToken) {
        res.status(401).json({ error: 'Unauthorized', message: 'GitHub authentication is required' });
        return;
    }
    next();
}
//# sourceMappingURL=authGuard.js.map