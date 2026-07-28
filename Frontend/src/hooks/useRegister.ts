import { useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { registerUser } from "../api/auth.api";
import type { RegisterPayload } from "../api/auth.api";

interface ApiError {
  message?: string;
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    try {
      setLoading(true);
      setError("");

      await registerUser(payload);
      toast.success("Registration Successful!", {
        duration: 4000,
        style: {
          fontSize: "18px",
          fontWeight: "700",
          padding: "20px 24px",
          minWidth: "460px",
        },
      });

      setSuccess(true);

      return true;
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      const message =
        error.response?.data?.message ??
        "Registration failed. Please try again.";

      setError(message);

      toast.error(message);

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    success,
    setSuccess,
    error,
    setError,
  };
}
