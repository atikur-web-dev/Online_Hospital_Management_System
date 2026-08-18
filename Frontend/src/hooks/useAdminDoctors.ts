// Frontend/src/hooks/useAdminDoctors.ts
import { useCallback, useEffect, useState } from "react";
import {
  getAllDoctors,
  createDoctor,
  updateDoctor,
  toggleDoctorStatus,
  deleteDoctor,
  type AdminDoctor,
  type CreateDoctorPayload,
  type UpdateDoctorPayload,
} from "../api/admin.api";

const useAdminDoctors = () => {
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // FETCH DOCTORS
  // ============================================================

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllDoctors();
      setDoctors(response.data);
    } catch (err: any) {
      console.error("Failed to fetch admin doctors:", err);
      setError(err?.response?.data?.message ?? "Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // CREATE DOCTOR
  // ============================================================

  const addDoctor = useCallback(async (data: CreateDoctorPayload) => {
    try {
      const response = await createDoctor(data);
      const { user, doctor } = response.data as any;
      const newAdminDoctor: AdminDoctor = {
        id: doctor.id,
        name: doctor.name,
        phone: doctor.phone,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        isAvailable: doctor.isAvailable,
        departmentId: doctor.departmentId,
        departmentName: null,
        userId: user.id,
        email: user.email,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        profileImage: user.profileImage,
        lastLogin: null,
        createdAt: doctor.createdAt,
        updatedAt: doctor.createdAt,
      };

      setDoctors((prev) => [newAdminDoctor, ...prev]);
      await fetchDoctors();
      return newAdminDoctor;
    } catch (err: any) {
      console.error("Failed to create doctor:", err);
      throw err;
    }
  }, [fetchDoctors]);

  // ============================================================
  // UPDATE DOCTOR
  // ============================================================

  const editDoctor = useCallback(async (doctorId: string, data: UpdateDoctorPayload) => {
    try {
      const response = await updateDoctor(doctorId, data);
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === doctorId ? response.data : doc))
      );
      return response.data;
    } catch (err: any) {
      console.error("Failed to update doctor:", err);
      throw err;
    }
  }, []);

  // ============================================================
  // TOGGLE ACCOUNT STATUS (ACTIVE / INACTIVE)
  // ============================================================

  const toggleStatus = useCallback(async (doctorId: string) => {
    try {
      const response = await toggleDoctorStatus(doctorId);
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === doctorId ? response.data : doc))
      );
      return response.data;
    } catch (err: any) {
      console.error("Failed to toggle doctor status:", err);
      throw err;
    }
  }, []);

  // ============================================================
  // SUSPEND / DEACTIVATE DOCTOR
  // ============================================================

  const removeDoctor = useCallback(async (doctorId: string) => {
    try {
      const response = await deleteDoctor(doctorId);
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === doctorId ? response.data : doc))
      );
      return response.data;
    } catch (err: any) {
      console.error("Failed to delete doctor:", err);
      throw err;
    }
  }, []);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // ============================================================
  // RETURN
  // ============================================================

  return {
    doctors,
    loading,
    error,
    fetchDoctors,
    addDoctor,
    editDoctor,
    toggleStatus,
    removeDoctor,
  };
};

export default useAdminDoctors;
