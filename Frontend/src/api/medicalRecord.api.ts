// Frontend/src/api/medicalRecord.api.ts
import api from "./axios";

import type {
  MedicalHistory,
  MedicalReport,
  MedicalRecords,
  CreateMedicalHistoryPayload,
  UpdateMedicalHistoryPayload,
  CreateMedicalReportPayload,
} from "../types/medicalRecord.types";


// Medical History
export const createMedicalHistory = async (
  data: CreateMedicalHistoryPayload,
) => {
  const response = await api.post(
    "/medical-records/history",
    data,
  );

  return response.data;
};

export const getMedicalHistories = async (): Promise<
  MedicalHistory[]
> => {
  const response = await api.get(
    "/medical-records/history",
  );

  return response.data.data;
};

export const updateMedicalHistory = async (
  historyId: string,
  data: UpdateMedicalHistoryPayload,
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


// Medical Reports
export const uploadMedicalReport = async (
  file: File,
  data: CreateMedicalReportPayload,
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

export const getMedicalReports = async (): Promise<
  MedicalReport[]
> => {
  const response = await api.get(
    "/medical-records/reports",
  );

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


// All Medical Records
export const getMyMedicalRecords =
  async (): Promise<MedicalRecords> => {
    const response = await api.get(
      "/medical-records",
    );

    return response.data.data;
  };