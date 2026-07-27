import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env.js";

export const generateVerificationLink = (email: string): string => {
  const token = jwt.sign(
    { email },
    env.EMAIL_VERIFICATION_SECRET,
    {
      expiresIn: env.EMAIL_VERIFICATION_EXPIRE as StringValue,
    }
  );

  return `${env.SERVER_URL}/api/v1/auth/verify/${token}`;
};