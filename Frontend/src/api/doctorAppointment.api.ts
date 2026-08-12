// Frontend/src/api/doctorAppointment.api.ts

import api from "./axios";
import type { Appointment } from "../types/appointment";

export const getMyDoctorAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get("/doctor/appointments");

  return response.data.data;
};

export const getDoctorAppointmentById = async (
  id: string,
) => {
  const response = await api.get(
    `/doctor/appointments/${id}`,
  );

  return response.data;
};

export const confirmAppointment = async (
  id: string,
) => {
  const response = await api.patch(
    `/doctor/appointments/${id}/confirm`,
  );

  return response.data;
};

export const completeAppointment = async (
  id: string,
) => {
  const response = await api.patch(
    `/doctor/appointments/${id}/complete`,
  );

  return response.data;
};

export const cancelAppointment = async (
  id: string,
) => {
  const response = await api.patch(
    `/doctor/appointments/${id}/cancel`,
  );

  return response.data;
};

export const archiveAppointment = async (
  id: string,
) => {
  const response = await api.patch(
    `/doctor/appointments/${id}/archive`,
  );

  return response.data;
};