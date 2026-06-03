import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from './config.js';
import userRepo from '../repos/user.repo.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CLIENT_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      let user;

      try {
        user = await userRepo.findByGoogleId(profile.id);

        if (!user && profile.emails && profile.emails.length > 0) {
          const email = profile.emails[0].value;

          user = await userRepo.findUserByEmail(email);

          if (user) {
            await userRepo.updateUser(user._id, {
              googleId: profile.id,
            });
          }
        }

        const usernameBase = profile.displayName.replace(/\s+/g, '');

        if (!user) {
          user = await userRepo.createUser({
            googleId: profile.id,
            email:
              profile.emails && profile.emails.length > 0 ? profile.emails[0].value : undefined,
            username: `${usernameBase}${Math.floor(Math.random() * 10000)}`,
            fullName: profile.displayName,
            isEmailVerified: true,
            avatar:
              profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
