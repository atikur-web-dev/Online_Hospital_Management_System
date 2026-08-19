// Backend/src/controller/admin_controller/doctor.controller.ts

import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as doctorService from "../../services/Admin/doctor.service.js";

// GET ALL DOCTORS
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


// CREATE NEW DOCTOR
export const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      email,
      password,
      name,
      phone,
      departmentId,
      specialization,
      qualification,
      experience,
      consultationFee,
      profileImage,
    } = req.body;


    // REQUIRED FIELDS
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message:
          "Email, password and name are required.",
      });
    }


    // VALIDATE EXPERIENCE
    if (
      experience !== undefined &&
      experience !== null &&
      (typeof experience !== "number" || experience < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Experience must be a valid positive number.",
      });
    }

    // VALIDATE CONSULTATION FEE
    if (
      consultationFee !== undefined &&
      consultationFee !== null &&
      (typeof consultationFee !== "number" ||
        consultationFee < 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Consultation fee must be a valid positive number.",
      });
    }

    // CREATE DOCTOR
    const doctor = await doctorService.createDoctor({
      email,
      password,
      name,
      phone,
      departmentId,
      specialization,
      qualification,
      experience,
      consultationFee,
      profileImage,
    });

 
    // RESPONSE
    return res.status(201).json({
      success: true,
      message: "Doctor created successfully.",
      data: doctor,
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE / DEACTIVATE DOCTOR
export const deleteDoctor = async (
  req: Request<{ doctorId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId || Array.isArray(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor id.",
      });
    }

    const doctor = await doctorService.deleteDoctor(
      doctorId,
    );

    return res.status(200).json({
      success: true,
      message: "Doctor deactivated successfully.",
      data: doctor,
    });
  } catch (error) {
    return next(error);
  }
};


// UPDATE DOCTOR DETAILS
export const updateDoctor = async (
  req: Request<{ doctorId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { doctorId } = req.params;
    const {
      name,
      phone,
      departmentId,
      specialization,
      qualification,
      experience,
      consultationFee,
      isAvailable,
    } = req.body;

    if (!doctorId || Array.isArray(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor id.",
      });
    }

    // ----------------------------------------------------------
    // VALIDATE EXPERIENCE
    // ----------------------------------------------------------

    if (
      experience !== undefined &&
      experience !== null &&
      (typeof experience !== "number" || experience < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Experience must be a valid positive number.",
      });
    }

    // ----------------------------------------------------------
    // VALIDATE CONSULTATION FEE
    // ----------------------------------------------------------

    if (
      consultationFee !== undefined &&
      consultationFee !== null &&
      (typeof consultationFee !== "number" ||
        consultationFee < 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Consultation fee must be a valid positive number.",
      });
    }

    const doctor = await doctorService.updateDoctor(doctorId, {
      name,
      phone,
      departmentId,
      specialization,
      qualification,
      experience,
      consultationFee,
      isAvailable,
    });

    return res.status(200).json({
      success: true,
      message: "Doctor details updated successfully.",
      data: doctor,
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// TOGGLE DOCTOR STATUS (BLOCK / UNBLOCK)
// ============================================================

export const toggleDoctorStatus = async (
  req: Request<{ doctorId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId || Array.isArray(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor id.",
      });
    }

    const doctor = await doctorService.toggleDoctorStatus(doctorId);

    return res.status(200).json({
      success: true,
      message: `Doctor status updated successfully. Account is now ${
        doctor.isActive ? "active" : "inactive"
      }.`,
      data: doctor,
    });
  } catch (error) {
    return next(error);
  }
};