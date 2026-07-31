// Backend/src/controller/user_controller/doctor.controller.ts
import type { Request, Response, NextFunction } from "express";
import * as doctorService from "../../services/Doctor/doctor.service.js";

/**
 * Get All Doctors
 */
export const getAllDoctors = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctors = await doctorService.getAllDoctors();

    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully.",
      data: doctors,
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