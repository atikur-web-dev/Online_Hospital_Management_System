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

interface ValidationIssue {
  message?: string;
  path?: (string | number)[];
  code?: string;
}

interface ApiError {
  message?: string | string[] | ValidationIssue[];
}

const getErrorMessage = (
  error: AxiosError<ApiError>,
  fallback: string,
): string => {
  const message = error.response?.data?.message;

  // CASE 1: message is a string
  if (typeof message === "string") {
    const trimmedMessage = message.trim();

    // Backend may send validation errors as a JSON string.
    if (
      trimmedMessage.startsWith("[") ||
      trimmedMessage.startsWith("{")
    ) {
      try {
        const parsed = JSON.parse(trimmedMessage);

        // -----------------------------------------------
        // JSON array
        // -----------------------------------------------
        if (Array.isArray(parsed)) {
          const messages = parsed
            .map((item) => {
              if (
                item &&
                typeof item === "object" &&
                typeof item.message === "string"
              ) {
                return item.message;
              }

              return null;
            })
            .filter(
              (item): item is string => Boolean(item),
            );

          if (messages.length > 0) {
            return messages.join(", ");
          }
        }

        // -----------------------------------------------
        // Single JSON object
        // -----------------------------------------------
        if (
          parsed &&
          typeof parsed === "object" &&
          typeof parsed.message === "string"
        ) {
          return parsed.message;
        }
      } catch {
        // The string is not valid JSON.
        // Continue and return it normally.
      }
    }

    // Normal backend message
    return trimmedMessage;
  }


  // CASE 2: message is an array
  if (Array.isArray(message)) {
    const messages = message
      .map((item) => {
        // -----------------------------------------------
        // Array item is a normal string
        // -----------------------------------------------
        if (typeof item === "string") {
          const trimmedItem = item.trim();

          // The string itself may contain JSON.
          if (
            trimmedItem.startsWith("[") ||
            trimmedItem.startsWith("{")
          ) {
            try {
              const parsed = JSON.parse(trimmedItem);

              // Nested JSON array
              if (Array.isArray(parsed)) {
                return parsed
                  .map((entry) => {
                    if (
                      entry &&
                      typeof entry === "object" &&
                      typeof entry.message === "string"
                    ) {
                      return entry.message;
                    }

                    return null;
                  })
                  .filter(
                    (entry): entry is string =>
                      Boolean(entry),
                  )
                  .join(", ");
              }

              // Nested JSON object
              if (
                parsed &&
                typeof parsed === "object" &&
                typeof parsed.message === "string"
              ) {
                return parsed.message;
              }
            } catch {
              // Not JSON.
              // Return original string below.
            }
          }

          return item;
        }
        // Array item is a validation object
        
        if (
          item &&
          typeof item === "object" &&
          typeof item.message === "string"
        ) {
          return item.message;
        }

        return null;
      })
      .filter(
        (item): item is string => Boolean(item),
      );

    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

 
  // CASE 3: Axios error fallback
  if (error.message) {
    return error.message;
  }


  // CASE 4: Generic fallback
  return fallback;
};

export const usePrescription = () => {
  const [loading, setLoading] = useState(false);

  const [prescription, setPrescription] =
    useState<PrescriptionResponse | null>(null);


  // Create Prescription
  const create = async (
    data: PrescriptionFormData,
  ): Promise<string | null> => {
    try {
      setLoading(true);

      const response = await createPrescription(data);

      const createdPrescription =
        response.data.data;

      setPrescription(createdPrescription);

      toast.success(response.data.message);

      return createdPrescription.id;
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      console.error(
        "CREATE PRESCRIPTION ERROR:",
        error,
      );

      console.error(
        "CREATE PRESCRIPTION RESPONSE:",
        error.response,
      );

      console.error(
        "CREATE PRESCRIPTION RESPONSE DATA:",
        error.response?.data,
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to create prescription.",
        ),
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get Prescription By ID
  const fetchById = useCallback(
    async (
      prescriptionId: string,
    ): Promise<boolean> => {
      try {
        setLoading(true);

        const response =
          await getPrescription(prescriptionId);

        setPrescription(response.data.data);

        return true;
      } catch (err) {
        const error =
          err as AxiosError<ApiError>;

        console.error(
          "GET PRESCRIPTION ERROR:",
          error,
        );

        console.error(
          "GET PRESCRIPTION RESPONSE:",
          error.response,
        );

        console.error(
          "GET PRESCRIPTION RESPONSE DATA:",
          error.response?.data,
        );

        console.error(
          "GET PRESCRIPTION REQUEST:",
          error.request,
        );

        console.error(
          "GET PRESCRIPTION MESSAGE:",
          error.message,
        );

        toast.error(
          getErrorMessage(
            error,
            "Failed to load prescription.",
          ),
        );

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
    data: Partial<
      Omit<PrescriptionFormData, "appointmentId">
    >,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response =
        await updatePrescription(
          prescriptionId,
          data,
        );

      setPrescription(response.data.data);

      toast.success(response.data.message);

      return true;
    } catch (err) {
      const error =
        err as AxiosError<ApiError>;

      console.error(
        "UPDATE PRESCRIPTION ERROR:",
        error,
      );

      console.error(
        "UPDATE PRESCRIPTION RESPONSE:",
        error.response,
      );

      console.error(
        "UPDATE PRESCRIPTION RESPONSE DATA:",
        error.response?.data,
      );

      console.error(
        "UPDATE PRESCRIPTION REQUEST:",
        error.request,
      );

      console.error(
        "UPDATE PRESCRIPTION MESSAGE:",
        error.message,
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to update prescription.",
        ),
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

