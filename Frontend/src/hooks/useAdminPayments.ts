// Frontend/src/hooks/useAdminPayments.ts
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAllPayments,
  type AdminPayment,
} from "../api/admin.api";

const useAdminPayments = () => {
  const [payments, setPayments] = useState<
    AdminPayment[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  // FETCH PAYMENTS
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await getAllPayments();

      setPayments(response.data);
    } catch (err: any) {
      console.error(
        "Failed to fetch admin payments:",
        err,
      );

      setError(
        err?.response?.data?.message ??
          "Failed to load payments.",
      );
    } finally {
      setLoading(false);
    }
  }, []);


  // INITIAL LOAD
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    error,
    fetchPayments,
  };
};

export default useAdminPayments;