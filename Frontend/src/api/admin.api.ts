// Frontend/src/api/admin.api.ts

import api from "./axios";

// ============================================================
// ADMIN DASHBOARD TYPES
// ============================================================

export interface AdminDashboardStats {
  todayPatients: number;
  todayAppointments: number;
  activeDoctors: number;
  pendingAppointments: number;
  todayRevenue: number;
}

export interface AppointmentTrend {
  date: string;
  appointments: number;
}

export interface MonthlyStats {
  month: string;
  revenue: number;
  patients: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  appointmentTrend: AppointmentTrend[];
  monthlyStats: MonthlyStats[];
}

export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: AdminDashboardData;
}

// ============================================================
// GET ADMIN DASHBOARD
// ============================================================

export const getAdminDashboard =
  async (): Promise<AdminDashboardResponse> => {
    const response =
      await api.get<AdminDashboardResponse>(
        "/admin/dashboard",
      );

    return response.data;
  };

  // ============================================================
// ADMIN PATIENTS
// ============================================================

export interface AdminPatient {
  id: string;
  name: string;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  createdAt: string;

  userId: string;
  email: string;

  isActive: boolean;
  isEmailVerified: boolean;

  profileImage: string | null;
  lastLogin: string | null;
  userCreatedAt: string;
}

export interface AdminPatientsResponse {
  success: boolean;
  message: string;
  data: AdminPatient[];
}

/**
 * Get all patients
 */
export const getAllPatients =
  async (): Promise<AdminPatientsResponse> => {
    const response =
      await api.get<AdminPatientsResponse>(
        "/admin/patients",
      );

    return response.data;
  };