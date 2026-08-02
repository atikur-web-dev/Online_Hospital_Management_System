// Frontend/src/api/appointment.api.ts
import api from "./axios";

export interface CreateAppointmentPayload {
  doctorId: string;
  appointmentAt: string; 
  problem?: string;
}

export const createAppointment = async (
  data: CreateAppointmentPayload,
) => {
  const response = await api.post("/appointments", data);

  return response.data;
};

export const getMyAppointments = async () => {
  const response = await api.get("/appointments/my");
  return response.data;
};

export const cancelAppointment = async (
  appointmentId: string,
) => {
  const response = await api.patch(
    `/appointments/${appointmentId}/cancel`,
  );

  return response.data;
};