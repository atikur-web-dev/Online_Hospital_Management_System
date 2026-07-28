// Backend/src/controller/auth-google.controller.ts
import type { Request, Response } from "express";

import {
  getGoogleAuthUrl,
  handleGoogleCallback,
} from "../services/google.service.js";

import {
  setRefreshTokenCookie,
} from "../utils/cookies.js";


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

    console.error(
      "Google login error:",
      error
    );

    return res.status(500).json({
      success:false,
      message:"Google login failed",
    });

  }

};



/**
 * Google OAuth callback
 */
export const googleCallback = async (
  req: Request,
  res: Response
) => {

  try {

    const { code } = req.query;


    if (
      !code ||
      typeof code !== "string"
    ) {

      return res.status(400).json({
        success:false,
        message:"Authorization code missing",
      });

    }


    const {
      user,
      accessToken,
      refreshToken,

    } = await handleGoogleCallback(code);



    // Store refresh token cookie

    setRefreshTokenCookie(
      res,
      refreshToken
    );


    console.log(
      "Google User:",
      user.email
    );


    /**
     * Redirect back to frontend
     */

    const frontendUrl =
      process.env.CORS_ORIGIN ??
      "http://localhost:5173";


    return res.redirect(
      `${frontendUrl}/auth/google/callback?token=${accessToken}`
    );


  } catch(error) {


    console.error(
      "Google callback error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:"Google authentication failed",

    });

  }

};