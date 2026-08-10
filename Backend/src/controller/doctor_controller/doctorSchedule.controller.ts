// Backend/src/controller/doctor_controller/doctorSchedule.controller.ts
// Backend/src/controller/doctor_controller/doctorSchedule.controller.ts

import type { Request, Response, NextFunction } from "express";
import * as doctorScheduleService from "../../services/Doctor/doctorSchedule.service.js";

/**
 * Get logged-in doctor's schedule
 */
export const getMySchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const schedule =
      await doctorScheduleService.getMySchedule(userId);

    return res.status(200).json({
      success: true,
      message: "Doctor schedule fetched successfully.",
      data: schedule,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update logged-in doctor's schedule
 */
export const updateMySchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const { schedules } = req.body;

    if (!Array.isArray(schedules)) {
      return res.status(400).json({
        success: false,
        message: "Schedules must be an array.",
      });
    }

    const result =
      await doctorScheduleService.updateMySchedule(
        userId,
        schedules,
      );

    return res.status(200).json({
      success: true,
      message: "Doctor schedule updated successfully.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update logged-in doctor's availability
 */
export const updateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAvailable must be a boolean.",
      });
    }

    const result =
      await doctorScheduleService.updateAvailability(
        userId,
        isAvailable,
      );

    return res.status(200).json({
      success: true,
      message: "Doctor availability updated successfully.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};