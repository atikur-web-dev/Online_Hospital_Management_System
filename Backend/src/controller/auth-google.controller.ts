// Backend/src/controller/auth-google.controller.ts
import type { Request, Response } from "express";

import {
  getGoogleAuthUrl,
  handleGoogleCallback,
} from "../services/google.service.js";

import { setRefreshTokenCookie } from "../utils/cookies.js";

/**
 * Redirect user to Google OAuth page
 */
export const googleLogin = async (
  _req: Request,
  res: Response
) => {
  try {
    const url = getGoogleAuthUrl();

    return res.redirect(url);
  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Google login failed.",
    });
  }
};

/**
 * Google OAuth Callback
 */
export const googleCallback = async (
  req: Request,
  res: Response
) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        message: "Authorization code is missing.",
      });
    }

    const {
      user,
      accessToken,
      refreshToken,
      googleName,
    } = await handleGoogleCallback(code);

    setRefreshTokenCookie(res, refreshToken);

    const frontendUrl =
      process.env.CLIENT_URL ??
      "http://localhost:5173";

    const redirectUrl =
      `${frontendUrl}/auth/google/callback` +
      `?accessToken=${encodeURIComponent(accessToken)}` +
      `&role=${encodeURIComponent(user.role)}` +
      `&name=${encodeURIComponent(googleName)}` +
      `&profileImage=${encodeURIComponent(
        user.profileImage ?? ""
      )}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google Callback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed.",
    });
  }
};