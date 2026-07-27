// Backend/src/utils/jwt.ts

import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "change-this-secret";
const JWT_REFRESH_SECRET: Secret =
  process.env.JWT_REFRESH_SECRET ?? "change-this-refresh-secret";

export interface AccessTokenPayload {
   id: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  isEmailVerified: boolean;
}

export interface RefreshTokenPayload {
  id: string;
}


export const generateToken = (payload: AccessTokenPayload): string => {
  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
};


export const generateRefreshToken = (
  payload: RefreshTokenPayload
): string => {
  const options: SignOptions = {
    expiresIn: "30d",
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
};

export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
};