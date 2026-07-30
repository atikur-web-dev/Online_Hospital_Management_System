// Backend/src/utils/jwt.ts
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

const getJwtSecret = (): Secret => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing from .env");
  }

  return secret;
};

const getRefreshSecret = (): Secret => {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is missing from .env");
  }

  return secret;
};

export interface AccessTokenPayload {
  id: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  isEmailVerified: boolean;
}

export interface RefreshTokenPayload {
  id: string;
}

export const generateToken = (
  payload: AccessTokenPayload
): string => {
  console.log("SIGN SECRET =", getJwtSecret());
  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, getJwtSecret(), options);
};

export const verifyToken = (token: string): AccessTokenPayload => {
  console.log("VERIFY SECRET =", getJwtSecret());
  console.log("VERIFY TOKEN =", token);

  const decoded = jwt.verify(token, getJwtSecret());

  console.log("VERIFIED =", decoded);

  return decoded as AccessTokenPayload;
};

export const generateRefreshToken = (
  payload: RefreshTokenPayload
): string => {
  const options: SignOptions = {
    expiresIn: "30d",
  };

  return jwt.sign(payload, getRefreshSecret(), options);
};

export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload => {
  return jwt.verify(token, getRefreshSecret()) as RefreshTokenPayload;
};