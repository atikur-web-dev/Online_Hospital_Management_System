// Frontend/src/hooks/useAdminPatients.ts
import { useCallback, useEffect, useState } from "react";

import {
  getAllPatients,
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

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    fetchPatients,
  };
};

export default useAdminPatients;