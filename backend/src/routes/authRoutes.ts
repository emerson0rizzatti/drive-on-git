import express from 'express';
import passport from 'passport';
import { authController } from '../controllers/AuthController';
import { asyncErrorWrapper } from '../middleware/asyncErrorWrapper';

const router = express.Router();

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive'],
    session: false,
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/?auth=google_error' }),
  (req, res) => authController.googleCallback(req, res),
);

// GitHub OAuth
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['repo', 'user'],
    session: false,
  }),
);

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/?auth=github_error' }),
  (req, res) => authController.githubCallback(req, res),
);

// Status and logout
router.get('/status', (req, res) => authController.getStatus(req, res));
router.post('/logout', asyncErrorWrapper(async (req, res) => {
  authController.logout(req, res);
}));

export default router;
