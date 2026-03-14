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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const Sentry = __importStar(require("@sentry/node"));
class BaseController {
    handleSuccess(res, data, statusCode = 200) {
        res.status(statusCode).json({ success: true, data });
    }
    handleCreated(res, data) {
        this.handleSuccess(res, data, 201);
    }
    handleError(error, res, context) {
        Sentry.captureException(error, { tags: { context } });
        // Log detailed axios error if present
        if (error.response) {
            console.error(`[BaseController] Axios Error in ${context}:`, {
                status: error.response.status,
                data: error.response.data,
            });
        }
        else {
            console.error(`[BaseController] Error in ${context}:`, error);
        }
        if (error.response) {
            res.status(error.response.status).json({
                success: false,
                error: error.message,
                details: error.response.data
            });
        }
        else if (error instanceof Error) {
            const statusCode = this.getStatusCode(error);
            res.status(statusCode).json({ success: false, error: error.message });
        }
        else {
            res.status(500).json({ success: false, error: 'Unknown error' });
        }
    }
    getStatusCode(error) {
        if (error.response) {
            return error.response.status;
        }
        if (error.message?.includes('Unauthorized') || error.message?.includes('authentication'))
            return 401;
        if (error.message?.includes('Forbidden') || error.message?.includes('permission'))
            return 403;
        if (error.message?.includes('Not found') || error.message?.includes('not found'))
            return 404;
        if (error.message?.includes('validation') || error.message?.includes('invalid'))
            return 422;
        return 500;
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=BaseController.js.map