import type { Request, Response } from "express";

import {
  createPrescription as createPrescriptionService,
  getPrescriptionById,
  updatePrescription as updatePrescriptionService,
} from "../../services/Doctor/Prescription/prescription.service.js";

import {
  createPrescriptionSchema,
  updatePrescriptionSchema,
} from "../../validators/prescription.validator.js";


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

    const parsed = createPrescriptionSchema.parse(
      req.body,
    );

    const payload = {
      ...parsed,
      followUpDate: parsed.followUpDate
        ? new Date(parsed.followUpDate)
        : null,
    };

    const prescription =
      await createPrescriptionService(
        doctorUserId,
        payload,
      );

    return res.status(201).json({
      success: true,
      message:
        "Prescription created successfully.",
      data: prescription,
    });
  } catch (error) {
    console.error(
      "Create prescription error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create prescription.",
    });
  }
};


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

    const prescription =
      await getPrescriptionById(
        doctorUserId,
        id,
      );

    return res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    console.error(
      "Get prescription error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch prescription.",
    });
  }
};


export const updatePrescription = async (
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

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prescription id.",
      });
    }

    const parsed =
      updatePrescriptionSchema.parse(req.body);

    const payload = {
      ...(parsed.diagnosis !== undefined && {
        diagnosis: parsed.diagnosis,
      }),

      ...(parsed.advice !== undefined && {
        advice: parsed.advice,
      }),

      ...(parsed.followUpDate !== undefined && {
        followUpDate:
          parsed.followUpDate !== null
            ? new Date(parsed.followUpDate)
            : null,
      }),

      ...(parsed.medicines !== undefined && {
        medicines: parsed.medicines.map(
          (medicine) => ({
            name: medicine.name,
            dosage: medicine.dosage,
            frequency: medicine.frequency,
            duration: medicine.duration,

            ...(medicine.instructions !==
              undefined && {
              instructions:
                medicine.instructions,
            }),
          }),
        ),
      }),

      ...(parsed.tests !== undefined && {
        tests: parsed.tests.map((test) => ({
          name: test.name,

          ...(test.instructions !==
            undefined && {
            instructions:
              test.instructions,
          }),
        })),
      }),
    };

    const prescription =
      await updatePrescriptionService(
        req.user.id,
        id,
        payload,
      );

    return res.status(200).json({
      success: true,
      message:
        "Prescription updated successfully.",
      data: prescription,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update prescription.",
    });
  }
};