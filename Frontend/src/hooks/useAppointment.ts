// Frontend/src/hooks/useAppointment.ts
import { useState } from "react";
import {
  createAppointment,
  type CreateAppointmentPayload,
} from "../api/appointment.api";

export const useAppointment = () => {
  const [loading, setLoading] = useState(false);

  const bookAppointment = async (
    payload: CreateAppointmentPayload,
  ) => {
    try {
      setLoading(true);

      const response = await createAppointment(payload);

      return response;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    bookAppointment,
  };
};