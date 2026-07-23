import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma.js';
import { generateToken } from '../utils/jwt.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found'), undefined);
        }

        // Check if user exists
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ email }, { googleId: profile.id }],
          },
        });

        if (!user) {
          // Create new user
          user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
              data: {
                email,
                googleId: profile.id,
                role: 'PATIENT',
                isEmailVerified: true,
                profileImage: profile.photos?.[0]?.value ?? null,
              },
            });

            const displayName = profile.displayName ?? email.split('@')[0];

            await tx.patientProfile.create({
              data: {
                userId: newUser.id,
                name: displayName,
              },
            });

            return newUser;
          });
        } else {
          // Update googleId if not set
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId: profile.id,
                isEmailVerified: true,
              },
            });
          }
        }

        // Generate JWT
        const token = generateToken({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        return done(null, { user, token });
      } catch (error) {
        return done(error, undefined);
      }
    },
  ),
);

export default passport;
