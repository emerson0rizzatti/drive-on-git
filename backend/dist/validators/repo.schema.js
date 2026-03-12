"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRepoSchema = void 0;
const zod_1 = require("zod");
exports.createRepoSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Repository name is required')
        .max(100)
        .regex(/^[a-zA-Z0-9._-]+$/, 'Repository name can only contain letters, numbers, hyphens, dots and underscores'),
    description: zod_1.z.string().max(350).optional(),
    private: zod_1.z.boolean(),
});
//# sourceMappingURL=repo.schema.js.map