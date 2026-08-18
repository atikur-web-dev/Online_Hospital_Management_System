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

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  const response = await api.get<AdminDashboardResponse>("/admin/dashboard");

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
export const getAllPatients = async (): Promise<AdminPatientsResponse> => {
  const response = await api.get<AdminPatientsResponse>("/admin/patients");

  return response.data;
};

// ============================================================
// ADMIN DEPARTMENTS
// ============================================================

export interface AdminDepartment {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  doctorCount: number;
}

export interface AdminDepartmentsResponse {
  success: boolean;
  message: string;
  data: AdminDepartment[];
}

export interface AdminDepartmentResponse {
  success: boolean;
  message: string;
  data: AdminDepartment;
}

export interface CreateDepartmentPayload {
  name: string;
  description?: string;
}

export interface UpdateDepartmentPayload {
  name?: string;
  description?: string | null;
}

/**
 * Get all departments
 */
export const getAllDepartments =
  async (): Promise<AdminDepartmentsResponse> => {
    const response =
      await api.get<AdminDepartmentsResponse>("/admin/departments");

    return response.data;
  };

/**
 * Create department
 */
export const createDepartment = async (
  data: CreateDepartmentPayload,
): Promise<AdminDepartmentResponse> => {
  const response = await api.post<AdminDepartmentResponse>(
    "/admin/departments",
    data,
  );

  return response.data;
};

/**
 * Update department
 */
export const updateDepartment = async (
  departmentId: string,
  data: UpdateDepartmentPayload,
): Promise<AdminDepartmentResponse> => {
  const response = await api.patch<AdminDepartmentResponse>(
    `/admin/departments/${departmentId}`,
    data,
  );

  return response.data;
};

/**
 * Toggle department status
 */
export const toggleDepartmentStatus = async (
  departmentId: string,
): Promise<AdminDepartmentResponse> => {
  const response = await api.patch<AdminDepartmentResponse>(
    `/admin/departments/${departmentId}/toggle`,
  );

  return response.data;
};

// ============================================================
// ADMIN DOCTORS
// ============================================================

export interface AdminDoctor {
  id: string;
  name: string;
  phone: string | null;

  specialization: string | null;
  qualification: string | null;
  experience: number | null;
  consultationFee: number | null;

  isAvailable: boolean;

  departmentId: string | null;
  departmentName: string | null;

  userId: string;
  email: string;

  isActive: boolean;
  isEmailVerified: boolean;

  profileImage: string | null;
  lastLogin: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface AdminDoctorsResponse {
  success: boolean;
  message: string;
  data: AdminDoctor[];
}

export interface AdminDoctorResponse {
  success: boolean;
  message: string;
  data: AdminDoctor;
}

export interface CreateDoctorPayload {
  email: string;
  password: string;

  name: string;
  phone?: string;

  departmentId: string;
  specialization?: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
}

export interface UpdateDoctorPayload {
  name?: string;
  phone?: string | null;

  departmentId?: string | null;
  specialization?: string | null;
  qualification?: string | null;
  experience?: number | null;
  consultationFee?: number | null;

  isAvailable?: boolean;
}

/**
 * Get all doctors
 */
export const getAllDoctors = async (): Promise<AdminDoctorsResponse> => {
  const response = await api.get<AdminDoctorsResponse>("/admin/doctors");

  return response.data;
};

/**
 * Create doctor
 */
export const createDoctor = async (
  data: CreateDoctorPayload,
): Promise<AdminDoctorResponse> => {
  const response = await api.post<AdminDoctorResponse>("/admin/doctors", data);

  return response.data;
};

/**
 * Update doctor
 */
export const updateDoctor = async (
  doctorId: string,
  data: UpdateDoctorPayload,
): Promise<AdminDoctorResponse> => {
  const response = await api.patch<AdminDoctorResponse>(
    `/admin/doctors/${doctorId}`,
    data,
  );

  return response.data;
};

/**
 * Toggle doctor status
 */
export const toggleDoctorStatus = async (
  doctorId: string,
): Promise<AdminDoctorResponse> => {
  const response = await api.patch<AdminDoctorResponse>(
    `/admin/doctors/${doctorId}/toggle`,
  );

  return response.data;
};

/**
 * Delete / deactivate doctor
 */
export const deleteDoctor = async (
  doctorId: string,
): Promise<AdminDoctorResponse> => {
  const response = await api.delete<AdminDoctorResponse>(
    `/admin/doctors/${doctorId}`,
  );

  return response.data;
};

// ============================================================
// ADMIN PAYMENTS
// ============================================================

export interface AdminPayment {
  id: string;

  appointmentId: string;
  patientId: string;
  doctorId: string;

  amount: number;
  currency: string;

  status: string;
  transactionId: string | null;
  paidAt: string | null;

  createdAt: string;
  updatedAt: string;

  patientName: string;
  patientEmail: string;

  doctorName: string;
  doctorEmail: string;
  specialization: string | null;

  appointmentAt: string;
}

export interface AdminPaymentsResponse {
  success: boolean;
  message: string;
  data: AdminPayment[];
}

/**
 * Get all payments
 */
export const getAllPayments = async (): Promise<AdminPaymentsResponse> => {
  const response = await api.get<AdminPaymentsResponse>("/admin/payments");

  return response.data;
};

/**
 * Deactivate / Block patient
 */
export const deletePatient = async (patientId: string): Promise<any> => {
  const response = await api.delete<any>(`/admin/patients/${patientId}`);
  return response.data;
};

