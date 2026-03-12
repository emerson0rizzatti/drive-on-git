import * as Sentry from '@sentry/node';
import { config } from './config/unifiedConfig';

Sentry.init({
  dsn: config.sentry.dsn,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
});
