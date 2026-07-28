// Backend/src/utils/cookies.ts
import type { Response } from "express";


export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string
) => {

  res.cookie(
    "refreshToken",
    refreshToken,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "strict"
          : "lax",
      maxAge:
        30 * 24 * 60 * 60 * 1000,
    }
  );

};

export const clearRefreshTokenCookie = (
  res: Response
) => {

  res.clearCookie(
    "refreshToken"
  );

};