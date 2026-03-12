"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./instrument"); // Sentry — MUST be first import
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const Sentry = __importStar(require("@sentry/node"));
const unifiedConfig_1 = require("./config/unifiedConfig");
const passport_2 = require("./config/passport");
const errorHandler_1 = require("./middleware/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const driveRoutes_1 = __importDefault(require("./routes/driveRoutes"));
const githubRoutes_1 = __importDefault(require("./routes/githubRoutes"));
const cloneRoutes_1 = __importDefault(require("./routes/cloneRoutes"));
const app = (0, express_1.default)();
// --- CORS ---
app.use((0, cors_1.default)({
    origin: unifiedConfig_1.config.frontend.url,
    credentials: true,
}));
// --- Body Parsing ---
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// --- Session (cookie-based, no DB) ---
app.use((0, cookie_session_1.default)({
    name: 'dog_session', // Drive on Git session
    keys: [unifiedConfig_1.config.session.secret],
    maxAge: 24 * 60 * 60 * 1000, // 24h
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
}));
// Patch to make passport work with cookie-session
app.use((req, _res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => cb();
        req.session.save = (cb) => cb();
    }
    next();
});
// --- Passport ---
(0, passport_2.configurePassport)();
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// --- Health Check ---
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'drive-on-git-backend' });
});
// --- Routes ---
app.use('/auth', authRoutes_1.default);
app.use('/drive', driveRoutes_1.default);
app.use('/github', githubRoutes_1.default);
app.use('/clone', cloneRoutes_1.default);
// --- Sentry Error Handler (must be after routes) ---
Sentry.setupExpressErrorHandler(app);
// --- Global Error Handler ---
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map