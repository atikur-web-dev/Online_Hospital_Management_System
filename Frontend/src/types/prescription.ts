export interface Medicine {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface MedicalTest {
  id?: string;
  name: string;
  instructions?: string;
}

export interface PrescriptionFormData {
  appointmentId: string;
  diagnosis: string;
  medicines: Medicine[];
  tests: MedicalTest[];
  advice: string;
  followUpDate: string | null;
}

/**
 * Backend response structure
 */
export interface PrescriptionMedicineResponse {
  id: string;
  prescriptionId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
}

export interface PrescriptionTestResponse {
  id: string;
  prescriptionId: string;
  testName: string;
}

export interface PrescriptionPatient {
  id: string;
  name: string;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
}

export interface PrescriptionDoctor {
  id: string;
  name?: string;
}

export interface PrescriptionAppointment {
  id: string;
  appointmentAt: string;
  patient: PrescriptionPatient;
  doctor?: PrescriptionDoctor;
}

export interface PrescriptionResponse {
  id: string;
  appointmentId: string;
  diagnosis: string;
  advice: string | null;
  followUpDate: string | null;
  medicines: PrescriptionMedicineResponse[];
  tests: PrescriptionTestResponse[];
  createdAt: string;
  updatedAt: string;
  appointment?: PrescriptionAppointment;
}