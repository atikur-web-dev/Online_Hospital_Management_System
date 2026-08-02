// Frontend/src/hooks/useAppointment.ts
import { useState } from "react";
import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  deleteAppointmentForPatient,
  type CreateAppointmentPayload,
} from "../api/appointment.api";

export const useAppointment = () => {
  const [loading, setLoading] = useState(false);

  const bookAppointment = async (payload: CreateAppointmentPayload) => {
    try {
      setLoading(true);

      const response = await createAppointment(payload);

      return response;
    } finally {
      setLoading(false);
    }
  };
  const fetchMyAppointments = async () => {
    try {
      setLoading(true);

      const response = await getMyAppointments();

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const cancelMyAppointment = async (appointmentId: string) => {
    try {
      setLoading(true);

      const response = await cancelAppointment(appointmentId);

      return response;
    } finally {
      setLoading(false);
    }
  };

  const deleteMyAppointment = async (appointmentId: string) => {
    try {
      setLoading(true);

      const response = await deleteAppointmentForPatient(appointmentId);

      return response.data;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    bookAppointment,
    fetchMyAppointments,
    cancelMyAppointment,
    deleteMyAppointment,
  };
};
