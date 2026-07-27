// Backend/src/controller/auth.controller.ts
import type { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  refreshTokenService,
  logoutUser,
  getMe,
} from "../services/auth.service.js";

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validators/auth.validator.js";
import { ValidationError } from "../utils/errors/httpErrors.js";
import { emailVerificationService } from "../services/emailVerification.service.js";

// ===============================
// Register
// ===============================
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = registerSchema.parse(req.body);

    const result = await registerUser(data);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
     return next(error);
  }
};

// ===============================
// Login
// ===============================
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
     return next(error);
  }
};

// ===============================
// Refresh Access Token
// ===============================
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    const data = refreshTokenSchema.parse({
      refreshToken,
    });

    const result = await refreshTokenService(data.refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: {
        token: result.token,
      },
    });
  } catch (error) {
     return next(error);
  }
};

// ===============================
// Logout
// ===============================
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
  res.status(401).json({
    success: false,
    message: 'Unauthorized',
  });
  return;
}

const userId = req.user.id;

    await logoutUser(userId);

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
     return next(error);
  }
};

// ===============================
// Current User
// ===============================
export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
  res.status(401).json({
    success: false,
    message: 'Unauthorized',
  });
  return;
}

const user = await getMe(req.user.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const emailVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    if (!token || Array.isArray(token)) {
      throw new ValidationError(
        {},
        'Invalid verification link. No token provided.',
      );
    }

    const message = await emailVerificationService(token);

    res.status(200).json({
      success: true,
      message: message,
      redirectTo: '/login?verified=true',
    });
  } catch (error) {
    next(error);
  }
};