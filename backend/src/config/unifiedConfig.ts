import 'dotenv/config';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  session: {
    secret: requireEnv('SESSION_SECRET'),
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  google: {
    clientId: requireEnv('GOOGLE_CLIENT_ID'),
    clientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
    callbackUrl: requireEnv('GOOGLE_CALLBACK_URL'),
  },
  github: {
    clientId: requireEnv('GITHUB_CLIENT_ID'),
    clientSecret: requireEnv('GITHUB_CLIENT_SECRET'),
    callbackUrl: requireEnv('GITHUB_CALLBACK_URL'),
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
  },
} as const;
