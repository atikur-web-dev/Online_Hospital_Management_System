// Frontend/src/api/medicalRecord.api.ts
import api from "./axios";

export interface MedicalHistory {
  id: string;
  patientId: string;
  condition: string;
  details: string | null;
  diagnosedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  title: string;
  description: string | null;
  fileUrl: string;
  filePublicId: string | null;
  fileType: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecords {
  medicalHistories: MedicalHistory[];
  medicalReports: MedicalReport[];
}

// ============================================================
// Medical History
// ============================================================

export const createMedicalHistory = async (data: {
  condition: string;
  details?: string;
  diagnosedAt?: string;
}) => {
  const response = await api.post("/medical-records/history", data);

  return response.data;
};

export const getMedicalHistories = async (): Promise<MedicalHistory[]> => {
  const response = await api.get("/medical-records/history");

  return response.data.data;
};

export const updateMedicalHistory = async (
  historyId: string,
  data: {
    condition?: string;
    details?: string;
    diagnosedAt?: string | null;
  },
) => {
  const response = await api.put(
    `/medical-records/history/${historyId}`,
    data,
  );

  return response.data;
};

export const deleteMedicalHistory = async (
  historyId: string,
) => {
  const response = await api.delete(
    `/medical-records/history/${historyId}`,
  );

  return response.data;
};

// ============================================================
// Medical Reports
// ============================================================

export const uploadMedicalReport = async (
  file: File,
  data: {
    title: string;
    description?: string;
  },
) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("title", data.title);

  if (data.description) {
    formData.append("description", data.description);
  }

  const response = await api.post(
    "/medical-records/reports",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const getMedicalReports = async (): Promise<MedicalReport[]> => {
  const response = await api.get("/medical-records/reports");

  return response.data.data;
};

export const deleteMedicalReport = async (
  reportId: string,
) => {
  const response = await api.delete(
    `/medical-records/reports/${reportId}`,
  );

  return response.data;
};

// ============================================================
// All Medical Records
// ============================================================

export const getMyMedicalRecords =
  async (): Promise<MedicalRecords> => {
    const response = await api.get("/medical-records");

    return response.data.data;
  };