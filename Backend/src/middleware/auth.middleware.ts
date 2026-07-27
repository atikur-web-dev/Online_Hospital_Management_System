// Backend/src/middleware/auth.middleware.ts

import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { UnauthorizeError } from '../utils/errors/httpErrors.js';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token missing',
      });
      return;
    }

    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
      return;
    }

    next();
  };

  // Email verification Check Middleware
export const requiredEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // since we already run the authenticate middleware, so req.user is already set
  const user = req.user as { isEmailVerified?: boolean } | undefined;

  if (!user?.isEmailVerified) {
    throw new UnauthorizeError(
      {},
      'Please Verify your email address to access this feature',
    );
  }
  next();
};