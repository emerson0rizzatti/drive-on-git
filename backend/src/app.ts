import './instrument'; // Sentry — MUST be first import
import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import passport from 'passport';
import * as Sentry from '@sentry/node';

import { config } from './config/unifiedConfig';
import { configurePassport } from './config/passport';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import driveRoutes from './routes/driveRoutes';
import githubRoutes from './routes/githubRoutes';
import cloneRoutes from './routes/cloneRoutes';

const app = express();

// --- CORS ---
app.use(
  cors({
    origin: config.frontend.url,
    credentials: true,
  }),
);

// --- Body Parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Session (cookie-based, no DB) ---
app.use(
  cookieSession({
    name: 'dog_session', // Drive on Git session
    keys: [config.session.secret],
    maxAge: 24 * 60 * 60 * 1000, // 24h
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  }),
);

// Patch to make passport work with cookie-session
app.use((req, _res, next) => {
  if (req.session && !(req.session as any).regenerate) {
    (req.session as any).regenerate = (cb: () => void) => cb();
    (req.session as any).save = (cb: () => void) => cb();
  }
  next();
});

// --- Passport ---
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// --- Health Check ---
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'drive-on-git-backend' });
});

// --- Routes ---
app.use('/auth', authRoutes);
app.use('/drive', driveRoutes);
app.use('/github', githubRoutes);
app.use('/clone', cloneRoutes);

// --- Sentry Error Handler (must be after routes) ---
Sentry.setupExpressErrorHandler(app);

// --- Global Error Handler ---
app.use(errorHandler);

export default app;
