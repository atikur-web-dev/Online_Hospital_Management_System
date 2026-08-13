// Backend/src/types/prescription.ts
export interface MedicineInput {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | undefined;
}

export interface TestInput {
  name: string;
  instructions?: string | undefined;
}

export interface CreatePrescriptionInput {
  appointmentId: string;
  diagnosis: string;
  medicines: MedicineInput[];
  tests?: TestInput[] | undefined;
  advice?: string | undefined;
  followUpDate?: Date | null | undefined;
}

export interface UpdatePrescriptionInput {
  diagnosis?: string;
  medicines?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  tests?: {
    name: string;
    instructions?: string;
  }[];
  advice?: string;
  followUpDate?: Date | null;
}

export interface PrescriptionMedicine {
  id: string;
  prescriptionId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
}

export interface PrescriptionTest {
  id: string;
  prescriptionId: string;
  testName: string;
  instructions?: string | null;
}

export interface PrescriptionPatient {
  id: string;
  name: string;
  gender?: string | null;
  phone?: string | null;
}

export interface PrescriptionDoctor {
  id: string;
  name: string;
}

export interface PrescriptionAppointment {
  id: string;
  appointmentAt: Date | string;
  patient: PrescriptionPatient;
  doctor: PrescriptionDoctor;
}

export interface PrescriptionResponse {
  id: string;
  diagnosis: string;
  advice?: string | null;
  followUpDate?: Date | string | null;
  createdAt: Date | string;
  medicines: PrescriptionMedicine[];
  tests: PrescriptionTest[];
  appointment: PrescriptionAppointment;
}