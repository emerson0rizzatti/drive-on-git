import { z } from 'zod';

export const startCloneSchema = z.object({
  folderId: z.string().min(1, 'folderId is required'),
  repoOwner: z.string().min(1, 'repoOwner is required'),
  repoName: z.string().min(1, 'repoName is required'),
});

export type StartCloneInput = z.infer<typeof startCloneSchema>;
