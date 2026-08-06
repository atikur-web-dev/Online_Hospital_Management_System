// Backend/src/controller/doctor_controller/prescription.controller.ts

import type { Request, Response } from "express";

import {
  createPrescription as createPrescriptionService,
  getPrescriptionById,
} from "../../services/Doctor/Prescription/prescription.service.js";

import {
  createPrescriptionSchema,
} from "../../validators/prescription.validator.js";

/**
 * Create Prescription
 */
export const createPrescription = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const doctorUserId = req.user.id;

   const parsed = createPrescriptionSchema.parse(req.body);

const payload = {
  ...parsed,

  followUpDate: parsed.followUpDate
    ? new Date(parsed.followUpDate)
    : null,
};

    const prescription = await createPrescriptionService(
      doctorUserId,
      payload,
    );

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully.",
      data: prescription,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create prescription.",
    });
  }
};

/**
 * Get Prescription By ID
 */
export const getPrescription = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const doctorUserId = req.user.id;

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prescription id.",
      });
    }

    const prescription = await getPrescriptionById(doctorUserId, id);

    return res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch prescription.",
    });
  }
};