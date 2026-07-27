// Backend/src/middleware/admin.middleware.ts
import type { Request, Response, NextFunction } from 'express';

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  if (req.user.role !== "ADMIN") {
    res.status(403).json({
      success: false,
      message: "Forbidden",
    });
    return;
  }

  return next();
};
