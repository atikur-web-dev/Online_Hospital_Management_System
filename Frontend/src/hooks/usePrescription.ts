// Frontend/src/hooks/usePrescription.ts
import { useState, useCallback } from "react";
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
  message?: string | string[];
}

const getErrorMessage = (
  error: AxiosError<ApiError>,
  fallback: string,
): string => {
  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  if (typeof message === "string") {
    return message;
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
};

export const usePrescription = () => {
  const [loading, setLoading] = useState(false);

  const [prescription, setPrescription] = useState<PrescriptionResponse | null>(
    null,
  );

  // Create Prescription
  const create = async (data: PrescriptionFormData): Promise<string | null> => {
    try {
      setLoading(true);

      const response = await createPrescription(data);

      const createdPrescription = response.data.data;

      setPrescription(createdPrescription);

      toast.success(response.data.message);

      return createdPrescription.id;
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      console.error(
        "Create prescription error:",
        error.response?.data ?? error,
      );

      const errorMessage = error.response?.data?.message;

      toast.error(
        Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : (errorMessage ?? "Failed to create prescription."),
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get Prescription By ID
  const fetchById = useCallback(
    async (prescriptionId: string): Promise<boolean> => {
      try {
        setLoading(true);

        const response = await getPrescription(prescriptionId);

        setPrescription(response.data.data);

        return true;
      } catch (err) {
        const error = err as AxiosError<ApiError>;

        console.error("GET PRESCRIPTION ERROR:", error);

        console.error("GET PRESCRIPTION RESPONSE:", error.response);

        console.error("GET PRESCRIPTION RESPONSE DATA:", error.response?.data);

        console.error("GET PRESCRIPTION REQUEST:", error.request);

        console.error("GET PRESCRIPTION MESSAGE:", error.message);

        toast.error(getErrorMessage(error, "Failed to load prescription."));

        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

// Update Prescription
  const update = async (
    prescriptionId: string,
    data: Partial<Omit<PrescriptionFormData, "appointmentId">>,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await updatePrescription(prescriptionId, data);

      setPrescription(response.data.data);

      toast.success(response.data.message);

      return true;
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      console.error("UPDATE PRESCRIPTION ERROR:", error);

      console.error("UPDATE PRESCRIPTION RESPONSE:", error.response);

      console.error("UPDATE PRESCRIPTION RESPONSE DATA:", error.response?.data);

      console.error("UPDATE PRESCRIPTION REQUEST:", error.request);

      console.error("UPDATE PRESCRIPTION MESSAGE:", error.message);

      toast.error(getErrorMessage(error, "Failed to update prescription."));

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
