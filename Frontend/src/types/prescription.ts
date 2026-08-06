// Frontend/src/types/prescription.ts
export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface MedicalTest {
  name: string;
  instructions?: string;
}

export interface PrescriptionFormData {
  appointmentId: string;
  diagnosis: string;
  medicines: Medicine[];
  tests: MedicalTest[];
  advice: string;
  followUpDate: string;
}

export interface PrescriptionResponse {
  id: string;
  appointmentId: string;
  diagnosis: string;
  advice: string | null;
  followUpDate: string | null;
  medicines: Medicine[];
  tests: MedicalTest[];
  createdAt: string;
  updatedAt: string;
}