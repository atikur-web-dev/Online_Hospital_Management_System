// Frontend/src/api/auth.api.ts
import api from "./axios";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
}

export const registerUser = async (
  data: RegisterPayload
) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};

// Future
export const loginUser = async () => {}

export const logoutUser = async () => {}

export const forgotPassword = async () => {}

export const verifyEmail = async () => {}