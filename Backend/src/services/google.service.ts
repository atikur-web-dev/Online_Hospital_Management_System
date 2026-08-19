// Backend/src/services/google.service.ts

import { google } from "googleapis";
import { googleClient } from "../config/google.js";
import prisma from "../lib/prisma.js";
import {
  generateToken,
  generateRefreshToken,
} from "../utils/jwt.js";

export const getGoogleAuthUrl = () => {
  const url = googleClient.generateAuthUrl({
    access_type: "offline",
    prompt: "select_account",
    scope: ["openid", "email", "profile"],
  });

  return url;
};

export const handleGoogleCallback = async (code: string) => {
  // 1. Exchange code for Google tokens
  const { tokens } = await googleClient.getToken(code);
  googleClient.setCredentials(tokens);

  // 2. Get Google user info
  const oauth2 = google.oauth2({
    auth: googleClient,
    version: "v2",
  });

  const { data } = await oauth2.userinfo.get();

  if (!data.email) {
    throw new Error("Google email not found");
  }

  const googleId = data.id ?? null;
  const profileImage = data.picture ?? null;
  const googleName = data.name ?? "Google User";

  // 3. Create or Update User
  const user = await prisma.user.upsert({
    where: {
      email: data.email,
    },

    update: {
      googleId,
      profileImage,
      isEmailVerified: true,
    },

    create: {
      email: data.email,
      googleId,
      profileImage,
      isEmailVerified: true,
      role: "PATIENT",

      patientProfile: {
        create: {
          name: googleName,
        },
      },
    },
  });

  // 4. Ensure Patient Profile Exists
  const patientProfile = await prisma.patientProfile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!patientProfile) {
    await prisma.patientProfile.create({
      data: {
        userId: user.id,
        name: googleName,
      },
    });
  }

  // 5. Generate JWT Tokens
  const accessToken = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  // 6. Save Refresh Token
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ),
    },
  });

  // 7. Return
  return {
    user,
    accessToken,
    refreshToken,
    googleName,
  };
};