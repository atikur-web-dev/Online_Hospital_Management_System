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