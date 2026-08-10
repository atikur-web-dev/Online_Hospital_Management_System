// Frontend/src/api/doctor.ts
import axios from "./axios";

export const getDoctorDashboard = async () => {
  const response = await axios.get("/doctors/dashboard");

  return response.data;
};


export const getMyDoctorSchedule = async () => {
  const response = await axios.get("/doctor-schedule");

  return response.data;
};

export const updateMyDoctorSchedule = async (
  schedules: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[],
) => {
  const response = await axios.put("/doctor-schedule", {
    schedules,
  });

  return response.data;
};

export const updateDoctorAvailability = async (
  isAvailable: boolean,
) => {
  const response = await axios.patch(
    "/doctor-schedule/availability",
    {
      isAvailable,
    },
  );

  return response.data;
};