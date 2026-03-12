import { z } from 'zod';
export declare const startCloneSchema: z.ZodObject<{
    folderId: z.ZodString;
    repoOwner: z.ZodString;
    repoName: z.ZodString;
}, z.core.$strip>;
export type StartCloneInput = z.infer<typeof startCloneSchema>;
//# sourceMappingURL=clone.schema.d.ts.map