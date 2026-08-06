// Frontend/src/hooks/usePrescription.ts
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import {
  createPrescription,
  getPrescription,
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

  const fetchById = async (
    prescriptionId: string,
  ): Promise<void> => {
    try {
      setLoading(true);

      const response = await getPrescription(
        prescriptionId,
      );

      setPrescription(response.data.data);
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      toast.error(
        error.response?.data?.message ??
          "Failed to load prescription.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    prescription,
    create,
    fetchById,
  };
};