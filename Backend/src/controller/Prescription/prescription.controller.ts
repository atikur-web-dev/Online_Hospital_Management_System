// Backend/src/controller/Prescription/prescription.controller.ts
import type { Request, Response } from 'express';
import { sendPrescriptionToPatient } from '../../services/Prescription/prescriptionEmail.service.js';
export const sendPrescriptionEmailController = async (
  req: Request,
  res: Response,
) => {
  const { prescriptionId } = req.params;

  if (!prescriptionId || Array.isArray(prescriptionId)) {
    return res.status(400).json({
      success: false,
      message: 'Prescription ID is required',
    });
  }

  const message = await sendPrescriptionToPatient(prescriptionId);

  return res.status(200).json({
    success: true,
    message,
  });
};
