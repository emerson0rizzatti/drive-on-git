"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const unifiedConfig_1 = require("./config/unifiedConfig");
const server = app_1.default.listen(unifiedConfig_1.config.port, () => {
    console.log(`[Drive on Git] Backend running on port ${unifiedConfig_1.config.port}`);
    console.log(`[Drive on Git] Frontend URL: ${unifiedConfig_1.config.frontend.url}`);
});
server.on('error', (err) => {
    console.error('[Drive on Git] Server error:', err);
    process.exit(1);
});
process.on('SIGTERM', () => {
    console.log('[Drive on Git] SIGTERM received. Shutting down gracefully...');
    server.close(() => process.exit(0));
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('[Drive on Git] Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('[Drive on Git] Uncaught Exception:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map