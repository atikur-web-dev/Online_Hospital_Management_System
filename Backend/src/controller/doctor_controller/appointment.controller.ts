// Backend/src/controller/doctor_controller/appointment.controller.ts
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