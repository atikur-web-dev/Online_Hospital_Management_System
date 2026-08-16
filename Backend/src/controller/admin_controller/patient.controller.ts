// Backend/src/controller/admin_controller/patient.controller.ts
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as patientService from "../../services/Admin/patient.service.js";

type PatientParams = {
  patientId: string;
};
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

// ============================================================
// DEACTIVATE PATIENT
// ============================================================

export const deletePatient = async (
  req: Request<PatientParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { patientId } = req.params;

    if (!patientId || Array.isArray(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient id.",
      });
    }

    const patient =
      await patientService.deletePatient(patientId);

    return res.status(200).json({
      success: true,
      message: "Patient deactivated successfully.",
      data: patient,
    });
  } catch (error) {
    return next(error);
  }
};