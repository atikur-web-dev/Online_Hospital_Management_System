// Backend/src/controller/admin_controller/payment.controller.ts
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as paymentService from "../../services/Admin/payment.service.js";

// ============================================================
// GET ALL PAYMENTS
// ============================================================

export const getAllPayments = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payments =
      await paymentService.getAllPayments();

    return res.status(200).json({
      success: true,
      message: "Payments fetched successfully.",
      data: payments,
    });
  } catch (error) {
    return next(error);
  }
};