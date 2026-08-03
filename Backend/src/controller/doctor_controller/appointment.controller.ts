import type { Request, Response, NextFunction } from "express";
import * as appointmentService from "../../services/Doctor/doctorAppointment.service.js";

export const getMyAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const appointments = await appointmentService.getMyAppointments(
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully.",
      data: appointments,
    });
  } catch (error) {
    return next(error);
  }
};

export const confirmAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const appointmentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    const appointment = await appointmentService.confirmAppointment(
      req.user.id,
      appointmentId,
    );

    return res.status(200).json({
      success: true,
      message: "Appointment confirmed successfully.",
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};

export const completeAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const appointmentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    const appointment =
      await appointmentService.completeAppointment(
        req.user.id,
        appointmentId,
      );

    return res.status(200).json({
      success: true,
      message: "Appointment completed successfully.",
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};

export const cancelAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const appointmentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    const appointment =
      await appointmentService.cancelAppointment(
        req.user.id,
        appointmentId,
      );

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};