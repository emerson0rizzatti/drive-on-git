"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
exports.googleAuthGuard = googleAuthGuard;
exports.githubAuthGuard = githubAuthGuard;
function authGuard(req, res, next) {
    const session = req.session;
    if (!session?.googleAccessToken || !session?.githubAccessToken) {
        res.status(401).json({ error: 'Unauthorized', message: 'É necessária a autenticação tanto no Google quanto no GitHub' });
        return;
    }
    next();
}
function googleAuthGuard(req, res, next) {
    const session = req.session;
    if (!session?.googleAccessToken) {
        res.status(401).json({ error: 'Unauthorized', message: 'A autenticação no Google é necessária' });
        return;
    }
    next();
}
function githubAuthGuard(req, res, next) {
    const session = req.session;
    if (!session?.githubAccessToken) {
        res.status(401).json({ error: 'Unauthorized', message: 'A autenticação no GitHub é necessária' });
        return;
    }
    next();
}
//# sourceMappingURL=authGuard.js.map