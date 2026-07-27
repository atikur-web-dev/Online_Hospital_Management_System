// Backend/src/controller/auth.controller.ts

import type { Request, Response, NextFunction } from 'express';

import {
  registerUser,
  loginUser,
  refreshTokenService,
  logoutUser,
  getMe,
} from '../services/auth.service.js';

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validators/auth.validator.js';

// import { ValidationError } from '../utils/errors/httpErrors.js';
import { emailVerificationService } from '../services/emailVerification.service.js';

// ==============================
// Register
// ==============================
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = registerSchema.parse(req.body);

    const result = await registerUser(payload);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Login
// ==============================
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = loginSchema.parse(req.body);

    const result = await loginUser(payload);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Refresh Token
// ==============================
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = refreshTokenSchema.parse({
      refreshToken: req.cookies?.refreshToken || req.body.refreshToken,
    });

    const result = await refreshTokenService(payload.refreshToken);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Logout
// ==============================
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await logoutUser(req.user!.id);

    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Current User
// ==============================
export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getMe(req.user!.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Email Verification
interface VerifyParams {
  token: string;
}

export const emailVerify = async (
  req: Request<VerifyParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;

    const message = await emailVerificationService(token);

    res.status(200).json({
      success: true,
      message,
      redirectTo: "/login?verified=true",
    });
  } catch (error) {
    next(error);
  }
};