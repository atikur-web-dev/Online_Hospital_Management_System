// Backend/src/config/passport.ts

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../lib/prisma.js';

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_REDIRECT_URL:", process.env.GOOGLE_REDIRECT_URL);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error('Google account has no email.'), undefined);
        }

        // Find existing user
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ email }, { googleId: profile.id }],
          },
        });

        const googlePhoto = profile.photos?.[0]?.value ?? null;

        if (!user) {
          user = await prisma.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
              data: {
                email,
                googleId: profile.id,
                role: 'PATIENT',
                isEmailVerified: true,
                profileImage: googlePhoto,
              },
            });

            await tx.patientProfile.create({
              data: {
                userId: createdUser.id,
                name: profile.displayName || email.split('@')[0] || 'Patient',
              },
            });

            return createdUser;
          });
        } else {
          user = await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              googleId: profile.id,
              isEmailVerified: true,
              profileImage: googlePhoto,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    },
  ),
);

export default passport;
