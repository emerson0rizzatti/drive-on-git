import express from 'express';
import { driveController } from '../controllers/DriveController';
import { asyncErrorWrapper } from '../middleware/asyncErrorWrapper';
import { googleAuthGuard } from '../middleware/authGuard';

const router = express.Router();

router.use(googleAuthGuard);

router.get('/folders', asyncErrorWrapper((req, res) => driveController.listFolders(req, res)));
router.get('/folders/:id', asyncErrorWrapper((req, res) => driveController.listFolderContents(req, res)));
router.get('/inspect/:id', asyncErrorWrapper((req, res) => driveController.inspectFolder(req, res)));

export default router;
