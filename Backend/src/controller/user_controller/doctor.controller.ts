// Backend/src/controller/user_controller/doctor.controller.ts
import type { Request, Response, NextFunction } from "express";
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

    const result = await doctorService.getAllDoctors({
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

    const doctor = await doctorService.getDoctorById(doctorId);

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

    const dashboard = await doctorService.getDashboard(userId);

    return res.status(200).json({
      success: true,
      message: "Doctor dashboard fetched successfully.",
      data: dashboard,
    });
  } catch (error) {
    return next(error);
  }
};