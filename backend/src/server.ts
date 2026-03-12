import app from './app';
import { config } from './config/unifiedConfig';

const server = app.listen(config.port, () => {
  console.log(`[Drive on Git] Backend running on port ${config.port}`);
  console.log(`[Drive on Git] Frontend URL: ${config.frontend.url}`);
});

server.on('error', (err) => {
  console.error('[Drive on Git] Server error:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('[Drive on Git] SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});
