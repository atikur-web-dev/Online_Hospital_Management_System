// Frontend/src/api/doctorAppointment.api.ts
import api from "./axios";

export const getMyDoctorAppointments = async () => {
  const response = await api.get("/doctor/appointments");

  return response.data;
};