// Frontend/src/hooks/useDoctorAppointment.ts

import { useCallback, useEffect, useState } from "react";
import {
  getMyDoctorAppointments,
} from "../api/doctorAppointment.api";
import type { Appointment } from "../types/appointment";

export const useDoctorAppointment = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMyDoctorAppointments();

      setAppointments(response);
    } catch (err: any) {
      console.error(err);
      console.log(err.response);

      setError(
        err.response?.data?.message ??
          err.message ??
          "Failed to load appointments.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
  };
};