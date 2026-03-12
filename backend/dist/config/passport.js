"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePassport = configurePassport;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const unifiedConfig_1 = require("../config/unifiedConfig");
function configurePassport() {
    // Google OAuth2 Strategy
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: unifiedConfig_1.config.google.clientId,
        clientSecret: unifiedConfig_1.config.google.clientSecret,
        callbackURL: unifiedConfig_1.config.google.callbackUrl,
        passReqToCallback: true,
    }, (req, accessToken, _refreshToken, _params, profile, done) => {
        const session = req.session;
        session.googleAccessToken = accessToken;
        session.googleUser = {
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value ?? '',
            photo: profile.photos?.[0]?.value,
        };
        done(null, profile);
    }));
    // GitHub OAuth2 Strategy
    passport_1.default.use(new passport_github2_1.Strategy({
        clientID: unifiedConfig_1.config.github.clientId,
        clientSecret: unifiedConfig_1.config.github.clientSecret,
        callbackURL: unifiedConfig_1.config.github.callbackUrl,
        passReqToCallback: true,
    }, (req, accessToken, _refreshToken, profile, done) => {
        const session = req.session;
        session.githubAccessToken = accessToken;
        session.githubUser = {
            id: String(profile.id),
            login: profile.username ?? '',
            name: profile.displayName,
            avatar_url: profile.photos?.[0]?.value ?? '',
        };
        done(null, profile);
    }));
    // Minimal serialize/deserialize (session-less, using cookie-session)
    passport_1.default.serializeUser((user, done) => done(null, user));
    passport_1.default.deserializeUser((user, done) => done(null, user));
}
//# sourceMappingURL=passport.js.map