import { z } from 'zod';

export const createRepoSchema = z.object({
  name: z
    .string()
    .min(1, 'Repository name is required')
    .max(100)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Repository name can only contain letters, numbers, hyphens, dots and underscores'),
  description: z.string().max(350).optional(),
  private: z.boolean(),
});

export type CreateRepoInput = z.infer<typeof createRepoSchema>;
