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