// Frontend/src/api/profile.api.ts

import api from "./axios";

import type {
  Profile,
  PatientProfile,
  DoctorProfile,
  AdminProfile,
} from "../types/profile.types";

/**
 * Get Logged In User Profile
 */
export const getProfile = async (): Promise<Profile> => {
  const response = await api.get("/profile/me");

  return response.data.data;
};

/**
 * Update Logged In User Profile
 */
export const updateProfile = async (
  data:
    | Partial<PatientProfile>
    | Partial<DoctorProfile>
    | Partial<AdminProfile>
): Promise<Profile> => {
  const response = await api.patch(
    "/profile/me",
    data
  );

  return response.data.data;
};

/**
 * Upload Profile Image
 */
export const uploadProfileImage = async (
  image: File
): Promise<string> => {
  const formData = new FormData();

  formData.append(
    "image",
    image
  );

  const response = await api.patch(
    "/profile/me/avatar",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data.data.profileImage;
};