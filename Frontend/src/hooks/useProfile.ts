// Frontend/src/hooks/useProfile.ts
import { useCallback, useEffect, useState } from "react";

import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../api/profile.api";

import type {
  Profile,
  PatientProfile,
  DoctorProfile,
  AdminProfile,
} from "../types/profile.types";

type UpdateProfileData =
  | Partial<PatientProfile>
  | Partial<DoctorProfile>
  | Partial<AdminProfile>;

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch Profile
   */
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProfile();

      setProfile(data);
    } catch (err) {
      console.error(err);

      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update Profile
   */
  const updateMyProfile = async (
    body: UpdateProfileData
  ) => {
    try {
      setSaving(true);
      setError(null);

      const updatedProfile =
        await updateProfile(body);

      setProfile(updatedProfile);

      return updatedProfile;
    } catch (err) {
      console.error(err);

      setError("Failed to update profile.");

      throw err;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Upload Avatar
   */
  const uploadAvatar = async (
    image: File
  ) => {
    try {
      setUploading(true);
      setError(null);

      const imageUrl =
        await uploadProfileImage(image);

      setProfile((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          user: {
            ...prev.user,
            profileImage: imageUrl,
          },
        };
      });

      return imageUrl;
    } catch (err) {
      console.error(err);

      setError("Failed to upload image.");

      throw err;
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    saving,
    uploading,
    error,
    fetchProfile,
    updateMyProfile,
    uploadAvatar,
  };
};