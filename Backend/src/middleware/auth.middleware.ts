import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { UnauthorizeError } from '../utils/errors/httpErrors.js';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
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
console.log("AUTH HEADER =", req.headers.authorization);
console.log("TOKEN =", token);
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      isEmailVerified: decoded.isEmailVerified,
    };

    next();
  } catch (error) {
    console.error('JWT Verify Error:', error);

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

// Email Verification Middleware
export const requiredEmailVerification = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user?.isEmailVerified) {
    return next(
      new UnauthorizeError(
        {},
        'Please verify your email address to access this feature',
      ),
    );
  }

  next();
};
