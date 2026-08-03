// Frontend/src/api/doctor.ts
import axios from "./axios";

export const getDoctorDashboard = async () => {
  const response = await axios.get("/doctors/dashboard");
  return response.data;
};