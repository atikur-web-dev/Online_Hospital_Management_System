// Frontend/src/api/doctor.api.ts
import api from "./axios";
interface GetDoctorsParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
}

export const getAllDoctors = async ({
  page = 1,
  limit = 8,
  search = "",
  department = "",
}: GetDoctorsParams = {}) => {
  const response = await api.get("/doctors", {
    params: {
      page,
      limit,
      search,
      department,
    },
  });

  return response.data;
};

export const getDoctorById = async (doctorId: string) => {
  const response = await api.get(`/doctors/${doctorId}`);

  return response.data;
};