// Backend/src/controller/user_controller/appointment.controller.ts
import type { Request, Response, NextFunction } from 'express';
import * as appointmentService from '../../services/Appointment/appointment.service.js';
import { createAppointmentSchema } from '../../validators/appointment.validator.js';

/**
 * Create Appointment
 */
export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const body = createAppointmentSchema.parse(req.body);

    const appointment = await appointmentService.createAppointment(
      req.user.id,
      body,
    );

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get My Appointments
 */
export const getMyAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const appointments = await appointmentService.getMyAppointments(
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: 'Appointments fetched successfully.',
      data: appointments,
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
        message: 'Unauthorized',
      });
    }

    const appointmentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required.',
      });
    }

    const appointment = await appointmentService.cancelAppointment(
      req.user.id,
      appointmentId,
    );

    return res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully.',
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};
