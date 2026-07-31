// Frontend/src/types/profile.types.ts
export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profileImage: string | null;
  isEmailVerified: boolean;
}

export interface Department {
  id: string;
  name: string;
}
export interface PatientProfile {
  id: string;
  userId: string;
  name: string;
  phone: string | null;
  dateOfBirth: string | null;
  gender: Gender | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  name: string;
  phone: string | null;
  specialization: string | null;
  qualification: string | null;
  experience: number | null;
  consultationFee: number | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  department: Department | null;
  user: User;
}

export interface AdminProfile {
  id: string;
  userId: string;
  name: string;
  phone: string | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  user: User;
}

export type Profile = PatientProfile | DoctorProfile | AdminProfile;
