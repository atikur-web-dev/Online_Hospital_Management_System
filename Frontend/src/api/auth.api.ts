// Frontend/src/api/auth.api.ts
import api from "./axios";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "PATIENT" | "DOCTOR";
  // Patient

  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  address?: string;

  // Doctor

  specialization?: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}


export const registerUser = async (
  data: RegisterPayload
) => {
  console.log(JSON.stringify(data, null, 2));
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};


export const loginUser = async (data: LoginPayload) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const logoutUser = async () => {}

export const forgotPassword = async () => {}

