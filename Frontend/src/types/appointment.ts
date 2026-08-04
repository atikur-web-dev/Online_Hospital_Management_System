// Frontend/src/types/appointment.ts
export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface Patient {
  id: string;
  name: string;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;

  user: {
    email: string;
    profileImage: string | null;
  };
}

export interface Appointment {
  id: string;

  status: AppointmentStatus;

  problem: string | null;

  appointmentAt: string;

  patient: Patient;
}