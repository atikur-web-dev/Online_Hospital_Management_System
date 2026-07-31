// Frontend/src/api/doctor.api.ts
import api from "./axios";

export const getAllDoctors = async () => {
  const response = await api.get("/doctors");

  return response.data;
};

export const getDoctorById = async (doctorId: string) => {
  const response = await api.get(`/doctors/${doctorId}`);

  return response.data;
};