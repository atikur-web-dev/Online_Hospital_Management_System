// Frontend/src/hooks/useAdminDashboard.ts

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAdminDashboard,
  type AdminDashboardData,
} from "../api/admin.api";

const useAdminDashboard = () => {
  const [dashboard, setDashboard] =
    useState<AdminDashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ============================================================
  // FETCH ADMIN DASHBOARD
  // ============================================================

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await getAdminDashboard();

      setDashboard(response.data);
    } catch (err: any) {
      console.error(
        "Failed to fetch admin dashboard:",
        err,
      );

      setError(
        err?.response?.data?.message ??
          "Failed to load admin dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ============================================================
  // RETURN
  // ============================================================

  return {
    dashboard,
    loading,
    error,
    fetchDashboard,
  };
};

export default useAdminDashboard;