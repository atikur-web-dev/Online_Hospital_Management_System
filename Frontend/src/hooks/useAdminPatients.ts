// Frontend/src/hooks/useAdminPatients.ts
import { useCallback, useEffect, useState } from "react";

import {
  getAllPatients,
  deletePatient,
  type AdminPatient,
} from "../api/admin.api";

const useAdminPatients = () => {
  const [patients, setPatients] = useState<AdminPatient[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllPatients();

      setPatients(response.data);
    } catch (err) {
      console.error(
        "Failed to fetch admin patients:",
        err,
      );

      setError(
        "Failed to load patients.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivatePatient = useCallback(async (patientId: string) => {
    try {
      const response = await deletePatient(patientId);
      // Since deletePatient returns updated status, we update local state
      setPatients((prev) =>
        prev.map((pat) =>
          pat.id === patientId ? { ...pat, isActive: false } : pat
        )
      );
      return response;
    } catch (err: any) {
      console.error("Failed to deactivate patient:", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    deactivatePatient,
  };
};

export default useAdminPatients;