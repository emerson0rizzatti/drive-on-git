import { z } from 'zod';

export const driveFolderIdSchema = z.object({
  id: z.string().min(1, 'folderId is required'),
});

export const driveFolderContentsSchema = z.object({
  params: driveFolderIdSchema,
  query: z.object({
    pageToken: z.string().optional(),
  }),
});

export type DriveFolderIdInput = z.infer<typeof driveFolderIdSchema>;
export type DriveFolderContentsInput = z.infer<typeof driveFolderContentsSchema>;
