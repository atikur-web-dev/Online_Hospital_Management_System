// Backend/src/middleware/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

// Fixed: Switched from namespace to preferred module augmentation
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Fixed: Handled potential undefined by ensuring token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Malformed token structure',
      });
    }

    const decoded = verifyToken(token);
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Fixed: The type guard now ensures TypeScript recognizes the custom user shape
    if (!req.user || !('role' in req.user)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions',
      });
    }

    next();
  };
};