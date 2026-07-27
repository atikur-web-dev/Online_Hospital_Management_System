export type UserRole = "PATIENT" | "DOCTOR";

export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

export interface RegisterFormData {
  role: UserRole;

  name: string;
  email: string;
  phone: string;

  password: string;
  confirmPassword: string;

  // Patient

  dateOfBirth: string;
  gender: Gender;
  address: string;

  // Doctor

  specialization: string;
  qualification: string;
  experience: string;
  consultationFee: string;
}