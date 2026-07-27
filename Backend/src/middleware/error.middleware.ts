// Backend/src/middleware/error.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";

import { ApiError } from "../utils/errors/apiError.js";
import { formatErrors } from "../utils/errors/formatErrors.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  void _next;

  // ===========================
  // Custom API Error
  // ===========================
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
      }),
    });
  }

  // ===========================
  // Zod Validation Error
  // ===========================
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validation Error",
      errors: formatErrors(err),
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
      }),
    });
  }

  // ===========================
  // Prisma Errors
  // ===========================
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          message: "Resource already exists",
          errors: {
            fields: err.meta?.target
              ? [`Duplicate value for ${String(err.meta.target)}`]
              : ["Duplicate value"],
          },
        });

      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Resource not found",
          errors: {},
        });

      default:
        return res.status(400).json({
          success: false,
          message: err.message,
          errors: {},
        });
    }
  }

  // ===========================
  // Normal JS Error
  // ===========================
  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      message: err.message,
      errors: {},
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
      }),
    });
  }

  // ===========================
  // Unknown Error
  // ===========================
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: {},
  });
};