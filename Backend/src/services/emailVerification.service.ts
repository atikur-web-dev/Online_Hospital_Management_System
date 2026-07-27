// Backend/src/services/emailVerification.service.ts

import jwt, { type JwtPayload } from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { env } from '../config/env.js';

import {
  NotFoundError,
  ValidationError,
} from '../utils/errors/httpErrors.js';

interface EmailVerificationTokenPayload extends JwtPayload {
  email: string;
}

export async function emailVerificationService(
  token: string,
): Promise<string> {
  let decoded: EmailVerificationTokenPayload;

  // ================= Verify Token =================
  try {
    const verified = jwt.verify(
      token,
      env.EMAIL_VERIFICATION_SECRET,
    );

    if (
      typeof verified === 'string' ||
      typeof verified.email !== 'string'
    ) {
      throw new ValidationError({}, 'Invalid verification link');
    }

    decoded = verified as EmailVerificationTokenPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new ValidationError(
        {},
        'Verification link has expired. Please register again.',
      );
    }

    throw new ValidationError({}, 'Invalid verification link');
  }

  // ================= Find User =================
  const user = await prisma.user.findUnique({
    where: {
      email: decoded.email,
    },
  });

  if (!user) {
    throw new NotFoundError({}, 'User not found');
  }

  // ================= Already Verified =================
  if (user.isEmailVerified) {
    return 'User is already verified';
  }

  // ================= Update Verification =================
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isEmailVerified: true,
    },
  });

  return 'Email verified successfully!';
}