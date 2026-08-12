export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface Patient {
  id: string;
  name: string;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;

  user: {
    email: string;
    profileImage: string | null;
  };
}

export interface PrescriptionSummary {
  id: string;
  diagnosis: string;
  createdAt: string;
}

export interface PrescriptionMedicine {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
}

export interface PrescriptionTest {
  id: string;
  testName: string;
}

export interface PrescriptionDetails {
  id: string;
  diagnosis: string;
  advice: string | null;
  followUpDate: string | null;
  medicines: PrescriptionMedicine[];
  tests: PrescriptionTest[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicalHistorySummary {
  id: string;
  condition: string;
  details: string | null;
  diagnosedAt: string | null;
}

export interface MedicalReportSummary {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  status: AppointmentStatus;
  problem: string | null;
  appointmentAt: string;
  patient: Patient;
  prescription: PrescriptionSummary | null;
}

export interface AppointmentDetails
  extends Omit<Appointment, "prescription"> {
  prescription: PrescriptionDetails | null;

  medicalHistories: MedicalHistorySummary[];
  medicalReports: MedicalReportSummary[];
}