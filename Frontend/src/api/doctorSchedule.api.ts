// Frontend/src/api/doctorSchedule.api.ts
import api from "./axios";

export interface DoctorSchedule {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface DoctorScheduleResponse {
  id: string;
  isAvailable: boolean;
  schedules: DoctorSchedule[];
}

/**
 * Get logged-in doctor's schedule
 */
export const getMyDoctorSchedule = async () => {
  const response = await api.get("/doctor-schedule");

  return response.data;
};

// Update logged-in doctor's schedule
export const updateMyDoctorSchedule = async (
  schedules: DoctorSchedule[],
) => {
  const response = await api.put("/doctor-schedule", {
    schedules,
  });

  return response.data;
};

// Update doctor availability
export const updateDoctorAvailability = async (
  isAvailable: boolean,
) => {
  const response = await api.patch(
    "/doctor-schedule/availability",
    {
      isAvailable,
    },
  );

  return response.data;
};