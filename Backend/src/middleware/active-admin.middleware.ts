// Backend/src/middleware/active-admin.middleware.ts
// Backend/src/middleware/active-admin.middleware.ts

import type { Request, Response, NextFunction } from "express";
import pool from "../config/database.js";

export const isActiveAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const result = await pool.query(
      `
        SELECT "isActive"
        FROM "users"
        WHERE "id" = $1
          AND "role" = 'ADMIN'
        LIMIT 1;
      `,
      [req.user.id],
    );

    if (result.rows.length === 0) {
      res.status(403).json({
        success: false,
        message: "Admin account not found",
      });
      return;
    }

    if (!result.rows[0].isActive) {
      res.status(403).json({
        success: false,
        message: "Admin account is inactive",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Active admin check error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify admin account status",
    });
  }
};