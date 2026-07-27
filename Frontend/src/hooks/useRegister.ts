import { useState } from "react";
import { AxiosError } from "axios";

import { registerUser } from "../api/auth.api";
import type { RegisterPayload } from "../api/auth.api";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const register = async (payload: RegisterPayload) => {
    try {
      setLoading(true);
      setError("");

      await registerUser(payload);

      setSuccess(true);

      return true;
    } catch (err) {
      const error = err as AxiosError<{
        message?: string;
      }>;

      setError(
        error.response?.data?.message ??
          "Registration failed. Please try again."
      );

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