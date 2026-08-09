// Backend/src/controller/payment_controller/payment.controller.ts

import type { Request, Response } from "express";

import {
  initiatePayment,
  validatePayment,
} from "../../services/Payment/payment.service.js";

export const initiatePaymentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const appointmentId = String(req.params.appointmentId ?? "");

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    const patientUserId = req.user?.id;

    if (!patientUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const payment = await initiatePayment(
      appointmentId,
      patientUserId,
    );

    return res.status(200).json({
      success: true,
      message: "Payment initiated successfully.",
      data: payment,
    });
  } catch (error: unknown) {
    console.error(
      "Payment initiation error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to initiate payment.",
    });
  }
};

export const paymentSuccessController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { val_id } = req.body;

    if (!val_id) {
      return res.redirect(
        process.env.SSL_FAIL_FRONTEND_URL ??
          "http://localhost:5173/payment/fail",
      );
    }

    await validatePayment(val_id);

    return res.redirect(
      process.env.SSL_SUCCESS_FRONTEND_URL ??
        "http://localhost:5173/payment/success",
    );
  } catch (error: unknown) {
    console.error(
      "Payment success validation error:",
      error,
    );

    return res.redirect(
      process.env.SSL_FAIL_FRONTEND_URL ??
        "http://localhost:5173/payment/fail",
    );
  }
};

export const paymentFailController = async (
  _req: Request,
  res: Response,
) => {
  return res.redirect(
    process.env.SSL_FAIL_FRONTEND_URL ??
      "http://localhost:5173/payment/fail",
  );
};

export const paymentCancelController = async (
  _req: Request,
  res: Response,
) => {
  return res.redirect(
    process.env.SSL_CANCEL_FRONTEND_URL ??
      "http://localhost:5173/payment/cancel",
  );
};

export const paymentIPNController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { val_id } = req.body;

    if (!val_id) {
      return res.status(400).json({
        success: false,
        message: "Validation ID is missing.",
      });
    }

    await validatePayment(val_id);

    return res.status(200).json({
      success: true,
      message: "Payment validated successfully.",
    });
  } catch (error: unknown) {
    console.error(
      "Payment IPN error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Payment validation failed.",
    });
  }
};