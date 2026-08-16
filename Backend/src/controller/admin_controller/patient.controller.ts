// Backend/src/controller/admin_controller/patient.controller.ts
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as patientService from "../../services/Admin/patient.service.js";

// ============================================================
// GET ALL PATIENTS
// ============================================================

export const getAllPatients = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const patients =
      await patientService.getAllPatients();

    return res.status(200).json({
      success: true,
      message: "Patients fetched successfully.",
      data: patients,
    });
  } catch (error) {
    return next(error);
  }
};