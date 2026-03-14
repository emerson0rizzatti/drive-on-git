import express from 'express';
import { driveController } from '../controllers/DriveController';
import { asyncErrorWrapper } from '../middleware/asyncErrorWrapper';
import { googleAuthGuard } from '../middleware/authGuard';
import { validateRequest } from '../middleware/validateRequest';
import { z } from 'zod';
import { driveFolderContentsSchema, driveFolderIdSchema } from '../validators/drive.schema';

const router = express.Router();

router.use(googleAuthGuard);

router.get('/folders', asyncErrorWrapper((req, res) => driveController.listFolders(req, res)));

router.get(
  '/folders/:id',
  validateRequest(driveFolderContentsSchema),
  asyncErrorWrapper((req, res) => driveController.listFolderContents(req, res))
);

router.get(
  '/inspect/:id',
  validateRequest(z.object({ params: driveFolderIdSchema })),
  asyncErrorWrapper((req, res) => driveController.inspectFolder(req, res))
);

router.delete(
  '/folders/:id',
  validateRequest(z.object({ params: driveFolderIdSchema })),
  asyncErrorWrapper((req, res) => driveController.deleteFolder(req, res))
);

export default router;
