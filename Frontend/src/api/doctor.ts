import axios from "./axios";

export const getDoctorDashboard = async () => {
  const response = await axios.get("/doctors/dashboard");
  return response.data;
};


export const getDoctorSchedule = async () => {
  const response = await axios.get("/doctors/schedule");
  return response.data;
};

export const updateDoctorSchedule = async (
  schedules: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[],
) => {
  const response = await axios.put(
    "/doctors/schedule",
    {
      schedules,
    },
  );

  return response.data;
};

export const updateDoctorAvailability = async (
  isAvailable: boolean,
) => {
  const response = await axios.patch(
    "/doctors/availability",
    {
      isAvailable,
    },
  );

  return response.data;
};