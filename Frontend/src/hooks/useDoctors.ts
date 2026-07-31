// Frontend/src/hooks/useDoctors.ts
import { useCallback, useEffect, useState } from "react";

import {
  getAllDoctors,
} from "../api/doctor.api";

import type { DoctorProfile } from "../types/profile.types";

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch Doctors
   */
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllDoctors();

      setDoctors(response.data);
    } catch (err) {
      console.error(err);

      setError("Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return {
    doctors,
    loading,
    error,
    fetchDoctors,
  };
};