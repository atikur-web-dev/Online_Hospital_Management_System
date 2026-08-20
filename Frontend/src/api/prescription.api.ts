// Frontend/src/api/prescription.api.ts
import api from "./axios";

import type {
  PrescriptionFormData,
  PrescriptionResponse,
} from "../types/prescription";

// Create Prescription
export const createPrescription = async (
  data: PrescriptionFormData,
) => {
  return api.post<{
    success: boolean;
    message: string;
    data: PrescriptionResponse;
  }>("/prescriptions", data);
};

// Get Prescription By ID
export const getPrescription = async (
  prescriptionId: string,
) => {
  return api.get<{
    success: boolean;
    data: PrescriptionResponse;
  }>(`/prescriptions/${prescriptionId}`);
};

// Update Prescription
export const updatePrescription = async (
  prescriptionId: string,
  data: Partial<
    Omit<PrescriptionFormData, "appointmentId">
  >,
) => {
  return api.patch<{
    success: boolean;
    message: string;
    data: PrescriptionResponse;
  }>(
    `/prescriptions/${prescriptionId}`,
    data,
  );
};

export const sendPrescriptionEmail = async (
  prescriptionId: string,
) => {
  const response = await api.post(
    `/prescriptions/${prescriptionId}/send-email`,
  );

  return response.data;
};