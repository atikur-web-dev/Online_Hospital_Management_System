// Frontend/src/api/prescription.api.ts
import api from "./axios";

import type {
  PrescriptionFormData,
  PrescriptionResponse,
} from "../types/prescription";

/**
 * Create Prescription
 */
export const createPrescription = async (
  data: PrescriptionFormData,
) => {
  return api.post<{
    success: boolean;
    message: string;
    data: PrescriptionResponse;
  }>("/prescriptions", data);
};

/**
 * Get Prescription By ID
 */
export const getPrescription = async (
  prescriptionId: string,
) => {
  return api.get<{
    success: boolean;
    data: PrescriptionResponse;
  }>(`/prescriptions/${prescriptionId}`);
};