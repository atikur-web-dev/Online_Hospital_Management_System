// Frontend/src/api/doctorAppointment.api.ts
import api from "./axios";
import type {
  Appointment,
  AppointmentDetails,
} from "../types/appointment";

export const getMyDoctorAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get("/doctor/appointments");

  return response.data.data;
};

export const getDoctorAppointmentById = async (
  id: string,
): Promise<AppointmentDetails> => {
  const response = await api.get(
    `/doctor/appointments/${id}`,
  );

  return response.data.data;
};

export const confirmAppointment = async (
  id: string,
): Promise<Appointment> => {
  const response = await api.patch(
    `/doctor/appointments/${id}/confirm`,
  );

  return response.data.data;
};

export const completeAppointment = async (
  id: string,
): Promise<Appointment> => {
  const response = await api.patch(
    `/doctor/appointments/${id}/complete`,
  );

  return response.data.data;
};

export const cancelAppointment = async (
  id: string,
): Promise<Appointment> => {
  const response = await api.patch(
    `/doctor/appointments/${id}/cancel`,
  );

  return response.data.data;
};

export const archiveAppointment = async (
  id: string,
): Promise<Appointment> => {
  const response = await api.patch(
    `/doctor/appointments/${id}/archive`,
  );

  return response.data.data;
};