"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('3001'),
    SESSION_SECRET: zod_1.z.string().min(1, 'SESSION_SECRET is required'),
    FRONTEND_URL: zod_1.z.string().default('http://localhost:5173'),
    GOOGLE_CLIENT_ID: zod_1.z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
    GOOGLE_CALLBACK_URL: zod_1.z.string().min(1, 'GOOGLE_CALLBACK_URL is required'),
    GITHUB_CLIENT_ID: zod_1.z.string().min(1, 'GITHUB_CLIENT_ID is required'),
    GITHUB_CLIENT_SECRET: zod_1.z.string().min(1, 'GITHUB_CLIENT_SECRET is required'),
    GITHUB_CALLBACK_URL: zod_1.z.string().min(1, 'GITHUB_CALLBACK_URL is required'),
    SENTRY_DSN: zod_1.z.string().optional(),
});
const envVars = envSchema.parse(process.env);
exports.config = {
    port: parseInt(envVars.PORT, 10),
    session: {
        secret: envVars.SESSION_SECRET,
    },
    frontend: {
        url: envVars.FRONTEND_URL,
    },
    google: {
        clientId: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackUrl: envVars.GOOGLE_CALLBACK_URL,
    },
    github: {
        clientId: envVars.GITHUB_CLIENT_ID,
        clientSecret: envVars.GITHUB_CLIENT_SECRET,
        callbackUrl: envVars.GITHUB_CALLBACK_URL,
    },
    sentry: {
        dsn: envVars.SENTRY_DSN || '',
    },
};
//# sourceMappingURL=unifiedConfig.js.map