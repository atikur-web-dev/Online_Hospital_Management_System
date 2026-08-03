// Frontend/src/hooks/useDoctorAppointment.ts
import { useCallback, useEffect, useState } from "react";
import { getMyDoctorAppointments } from "../api/doctorAppointment.api";

export const useDoctorAppointment = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMyDoctorAppointments();

      setAppointments(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments.");
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