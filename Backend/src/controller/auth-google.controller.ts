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

    console.log("\n========== GOOGLE LOGIN START ==========");

    const url = getGoogleAuthUrl();

    console.log("Generated Google Auth URL:");
    console.log(url);

    console.log("Redirecting user to Google...\n");


    return res.redirect(url);


  } catch (error) {

    console.error(
      "❌ Google Login Error:",
      error
    );


    return res.status(500).json({
      success:false,
      message:"Google login failed",
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


    console.log("\n========== GOOGLE CALLBACK START ==========");


    const { code } = req.query;


    console.log(
      "Authorization Code:",
      code ? "RECEIVED ✅" : "MISSING ❌"
    );



    if (
      !code ||
      typeof code !== "string"
    ) {


      console.log(
        "❌ Authorization code invalid"
      );


      return res.status(400).json({

        success:false,

        message:"Authorization code missing",

      });

    }




    console.log(
      "Calling handleGoogleCallback service..."
    );



    const result = await handleGoogleCallback(
      code
    );



    console.log(
      "Google service completed successfully ✅"
    );



    const {
      user,
      accessToken,
      refreshToken,

    } = result;



    console.log(
      "\n----- USER INFORMATION -----"
    );


    console.log({
      id: user.id,
      email: user.email,
      role: user.role,
      googleId: user.googleId,
      verified: user.isEmailVerified,
    });



    console.log(
      "\nAccess Token Generated:",
      accessToken ? "YES ✅" : "NO ❌"
    );



    console.log(
      "Refresh Token Generated:",
      refreshToken ? "YES ✅" : "NO ❌"
    );





    console.log(
      "\nSaving refresh token cookie..."
    );



    setRefreshTokenCookie(
      res,
      refreshToken
    );



    console.log(
      "Refresh cookie saved ✅"
    );





    const frontendUrl =
      process.env.CORS_ORIGIN ??
      "http://localhost:5173";



    const redirectUrl =
      `${frontendUrl}/auth/google/callback?accessToken=${accessToken}`



    console.log(
      "\nRedirecting to frontend:"
    );

    console.log(
      redirectUrl
    );



    console.log(
      "========== GOOGLE CALLBACK SUCCESS ==========\n"
    );



    return res.redirect(
      redirectUrl
    );




  } catch(error:any) {


    console.log(
      "\n========== GOOGLE CALLBACK FAILED =========="
    );


    console.error(
      "Error Message:",
      error.message
    );


    console.error(
      "Full Error:",
      error
    );


    console.log(
      "============================================\n"
    );



    return res.status(500).json({

      success:false,

      message:"Google authentication failed",

    });


  }

};