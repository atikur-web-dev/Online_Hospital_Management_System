import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as doctorService from "../../services/Doctor/doctor.service.js";

/**
 * Get All Doctors
 */
export const getAllDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      department = "",
    } = req.query;

    const result =
      await doctorService.getAllDoctors({
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        department: String(department),
      });

    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Single Doctor By ID
 */
export const getDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctorId = req.params.id;

    if (!doctorId || Array.isArray(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor id.",
      });
    }

    const doctor =
      await doctorService.getDoctorById(doctorId);

    return res.status(200).json({
      success: true,
      message: "Doctor fetched successfully.",
      data: doctor,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Doctor Dashboard
 */
export const getDashboard = async (
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

    const dashboard =
      await doctorService.getDashboard(userId);

    return res.status(200).json({
      success: true,
      message:
        "Doctor dashboard fetched successfully.",
      data: dashboard,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Logged-in Doctor Schedule
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
      await doctorService.getMySchedule(userId);

    return res.status(200).json({
      success: true,
      message:
        "Doctor schedule fetched successfully.",
      data: schedule,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update Logged-in Doctor Schedule
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
      await doctorService.updateMySchedule(
        userId,
        schedules,
      );

    return res.status(200).json({
      success: true,
      message:
        "Doctor schedule updated successfully.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update Doctor Availability
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
        message:
          "isAvailable must be a boolean.",
      });
    }

    const result =
      await doctorService.updateAvailability(
        userId,
        isAvailable,
      );

    return res.status(200).json({
      success: true,
      message:
        "Doctor availability updated successfully.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};