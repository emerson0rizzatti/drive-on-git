import express from 'express';
import { gitHubController } from '../controllers/GitHubController';
import { asyncErrorWrapper } from '../middleware/asyncErrorWrapper';
import { githubAuthGuard } from '../middleware/authGuard';

const router = express.Router();

router.use(githubAuthGuard);

router.get('/repos', asyncErrorWrapper((req, res) => gitHubController.listRepos(req, res)));
router.get('/repos/tagged', asyncErrorWrapper((req, res) => gitHubController.listTaggedRepos(req, res)));
router.post('/repos', asyncErrorWrapper((req, res) => gitHubController.createRepo(req, res)));

export default router;
