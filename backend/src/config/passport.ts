import passport from 'passport';
import { Request } from 'express';
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback, GoogleCallbackParameters } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import { config } from '../config/unifiedConfig';
import { AuthenticatedSession } from '../middleware/authGuard';

export function configurePassport(): void {
  // Google OAuth2 Strategy
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.google.clientId,
          clientSecret: config.google.clientSecret,
          callbackURL: config.google.callbackUrl,
          passReqToCallback: true,
          accessType: 'offline',
          prompt: 'consent',
        } as any,
        (req: Request, accessToken: string, refreshToken: string, _params: GoogleCallbackParameters, profile: GoogleProfile, done: VerifyCallback) => {
        const session = (req as any).session as AuthenticatedSession;
        session.googleAccessToken = accessToken;
        if (refreshToken) {
          session.googleRefreshToken = refreshToken;
        }
        session.googleUser = {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value ?? '',
          photo: profile.photos?.[0]?.value,
        };
        done(null, profile);
      },
    ),
  );

  // GitHub OAuth2 Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackUrl,
        passReqToCallback: true,
      },
      (req: any, accessToken: string, _refreshToken: string, profile: GitHubProfile, done: any) => {
        const session = req.session as AuthenticatedSession;
        session.githubAccessToken = accessToken;
        session.githubUser = {
          id: String(profile.id),
          login: (profile as any).username ?? '',
          name: profile.displayName,
          avatar_url: profile.photos?.[0]?.value ?? '',
        };
        done(null, profile);
      },
    ),
  );

  // Minimal serialize/deserialize (session-less, using cookie-session)
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user as Express.User));
}
