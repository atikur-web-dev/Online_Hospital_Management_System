// Frontend/src/types/medicalRecord.types.ts
export interface MedicalHistory {
  id: string;
  condition: string;
  details?: string | null;
  diagnosedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  filePublicId?: string | null;
  fileType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalRecords {
  medicalHistories: MedicalHistory[];
  medicalReports: MedicalReport[];
}

export interface CreateMedicalHistoryPayload {
  condition: string;
  details?: string;
  diagnosedAt?: string;
}

export interface UpdateMedicalHistoryPayload {
  condition?: string;
  details?: string;
  diagnosedAt?: string | null;
}

export interface CreateMedicalReportPayload {
  title: string;
  description?: string;
}