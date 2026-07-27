// Frontend/src/hooks/useRegister.ts
import { useState } from "react";
import axios from "axios";

import {
  registerUser,
  type RegisterPayload,
} from "../api/auth.api";

export function useRegister() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const register = async (data: RegisterPayload) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await registerUser(data);

      setSuccess(
        response.message ??
          "Registration successful. Please verify your email."
      );

      return response;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Registration failed."
        );
      } else {
        setError("Something went wrong.");
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
    success,
  };
}