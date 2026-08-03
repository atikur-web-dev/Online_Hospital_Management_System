// Frontend/src/api/doctor.ts
import axios from "./axios";

export const getDoctorDashboard = async () => {
  const response = await axios.get("/doctor/dashboard");
  return response.data;
};