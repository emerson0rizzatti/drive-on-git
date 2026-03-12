import { z } from 'zod';
export declare const createRepoSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    private: z.ZodBoolean;
}, z.core.$strip>;
export type CreateRepoInput = z.infer<typeof createRepoSchema>;
//# sourceMappingURL=repo.schema.d.ts.map