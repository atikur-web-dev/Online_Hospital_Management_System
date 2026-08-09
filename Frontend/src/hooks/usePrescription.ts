// Frontend/src/hooks/usePrescription.ts
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import {
  createPrescription,
  getPrescription,
  updatePrescription,
} from "../api/prescription.api";

import type {
  PrescriptionFormData,
  PrescriptionResponse,
} from "../types/prescription";

interface ApiError {
  message?: string;
}

export const usePrescription = () => {
  const [loading, setLoading] = useState(false);

  const [prescription, setPrescription] =
    useState<PrescriptionResponse | null>(null);

  /**
   * Create Prescription
   */
  const create = async (
    data: PrescriptionFormData,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await createPrescription(data);

      setPrescription(response.data.data);

      toast.success(response.data.message);

      return true;
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      toast.error(
        error.response?.data?.message ??
          "Failed to create prescription.",
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get Prescription By ID
   */
  const fetchById = async (
    prescriptionId: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response =
        await getPrescription(prescriptionId);

      setPrescription(response.data.data);

      return true;
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      toast.error(
        error.response?.data?.message ??
          "Failed to load prescription.",
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update Prescription
   */
  const update = async (
    prescriptionId: string,
    data: Partial<
      Omit<PrescriptionFormData, "appointmentId">
    >,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await updatePrescription(
        prescriptionId,
        data,
      );

      setPrescription(response.data.data);

      toast.success(response.data.message);

      return true;
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      toast.error(
        error.response?.data?.message ??
          "Failed to update prescription.",
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    prescription,
    create,
    fetchById,
    update,
  };
};