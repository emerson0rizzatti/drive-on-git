"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCloneSchema = void 0;
const zod_1 = require("zod");
exports.startCloneSchema = zod_1.z.object({
    folderId: zod_1.z.string().min(1, 'folderId is required'),
    repoOwner: zod_1.z.string().min(1, 'repoOwner is required'),
    repoName: zod_1.z.string().min(1, 'repoName is required'),
});
//# sourceMappingURL=clone.schema.js.map