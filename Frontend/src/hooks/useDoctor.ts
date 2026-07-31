// Frontend/src/hooks/useDoctor.ts
import { useCallback, useEffect, useState } from "react";
import { getDoctorById } from "../api/doctor.api";
import type { DoctorProfile } from "../types/profile.types";

export const useDoctor = (doctorId: string | undefined) => {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchDoctor = useCallback(async () => {

    if (!doctorId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getDoctorById(doctorId);
      setDoctor(response.data);

    } catch (err) {
      console.error(err);
      setError("Failed to load doctor.");

    } finally {
      setLoading(false);
    }

  }, [doctorId]);
  useEffect(() => {
    fetchDoctor();
  }, [fetchDoctor]);

  return {
    doctor,
    loading,
    error,
    fetchDoctor,
  };

};