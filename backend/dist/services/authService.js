"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
class authService {
    static getStatus(session) {
        return {
            google: !!session.googleAccessToken,
            github: !!session.githubAccessToken,
            googleUser: session.googleUser,
            githubUser: session.githubUser,
        };
    }
    static clearSession(session) {
        delete session.googleAccessToken;
        delete session.googleUser;
        delete session.githubAccessToken;
        delete session.githubUser;
    }
}
exports.authService = authService;
//# sourceMappingURL=authService.js.map