import express from 'express';
import { cloneController } from '../controllers/CloneController';
import { asyncErrorWrapper } from '../middleware/asyncErrorWrapper';
import { authGuard } from '../middleware/authGuard';

const router = express.Router();

router.use(authGuard); // Both Google + GitHub required

router.post('/start', asyncErrorWrapper(async (req, res) => cloneController.startClone(req, res)));
router.get('/status/:jobId', (req, res) => cloneController.streamStatus(req, res));

export default router;
