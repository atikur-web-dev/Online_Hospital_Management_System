// Backend/src/services/MedicalRecord/medicalRecord.service.ts
import prisma from "../../lib/prisma.js";
import {
  createMedicalHistorySchema,
  updateMedicalHistorySchema,
  createMedicalReportSchema,
} from "../../validators/medicalRecord.validator.js";
import { uploadImage, deleteImage } from "../cloudinary.service.js";


// ============================================================
// Helper: Find Patient Profile
// ============================================================

const getPatientProfile = async (userId: string) => {
  const patient = await prisma.patientProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!patient) {
    throw new Error("Patient profile not found.");
  }

  return patient;
};


// ============================================================
// Medical History
// ============================================================

export const createMedicalHistory = async (
  userId: string,
  body: unknown,
) => {
  const patient = await getPatientProfile(userId);

  const data = createMedicalHistorySchema.parse(body);

  return prisma.medicalHistory.create({
    data: {
      patientId: patient.id,
      condition: data.condition,
      details: data.details ?? null,
      diagnosedAt: data.diagnosedAt
        ? new Date(data.diagnosedAt)
        : null,
    },
  });
};


export const getMedicalHistories = async (
  userId: string,
) => {
  const patient = await getPatientProfile(userId);

  return prisma.medicalHistory.findMany({
    where: {
      patientId: patient.id,
    },
    orderBy: {
      diagnosedAt: "desc",
    },
  });
};


export const updateMedicalHistory = async (
  userId: string,
  historyId: string,
  body: unknown,
) => {
  const patient = await getPatientProfile(userId);

  const history = await prisma.medicalHistory.findUnique({
    where: {
      id: historyId,
    },
  });

  if (!history) {
    throw new Error("Medical history not found.");
  }

  if (history.patientId !== patient.id) {
    throw new Error("You are not allowed to update this medical history.");
  }

  const data = updateMedicalHistorySchema.parse(body);

  return prisma.medicalHistory.update({
    where: {
      id: historyId,
    },
    data: {
      ...(data.condition !== undefined && {
        condition: data.condition,
      }),

      ...(data.details !== undefined && {
        details: data.details,
      }),

      ...(data.diagnosedAt !== undefined && {
        diagnosedAt: data.diagnosedAt
          ? new Date(data.diagnosedAt)
          : null,
      }),
    },
  });
};


export const deleteMedicalHistory = async (
  userId: string,
  historyId: string,
) => {
  const patient = await getPatientProfile(userId);

  const history = await prisma.medicalHistory.findUnique({
    where: {
      id: historyId,
    },
  });

  if (!history) {
    throw new Error("Medical history not found.");
  }

  if (history.patientId !== patient.id) {
    throw new Error("You are not allowed to delete this medical history.");
  }

  return prisma.medicalHistory.delete({
    where: {
      id: historyId,
    },
  });
};


// ============================================================
// Medical Reports
// ============================================================

export const uploadMedicalReport = async (
  userId: string,
  file: Express.Multer.File,
  body: unknown,
) => {
  const patient = await getPatientProfile(userId);

  if (!file) {
    throw new Error("Medical report file is required.");
  }

  const data = createMedicalReportSchema.parse(body);

  const uploadedFile = await uploadImage(
    file,
    "careplus/medical-reports",
  );

  return prisma.medicalReport.create({
    data: {
      patientId: patient.id,
      title: data.title,
      description: data.description ?? null,
      fileUrl: uploadedFile.secure_url,
      filePublicId: uploadedFile.public_id,
      fileType: file.mimetype,
    },
  });
};


export const getMedicalReports = async (
  userId: string,
) => {
  const patient = await getPatientProfile(userId);

  return prisma.medicalReport.findMany({
    where: {
      patientId: patient.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


export const deleteMedicalReport = async (
  userId: string,
  reportId: string,
) => {
  const patient = await getPatientProfile(userId);

  const report = await prisma.medicalReport.findUnique({
    where: {
      id: reportId,
    },
  });

  if (!report) {
    throw new Error("Medical report not found.");
  }

  if (report.patientId !== patient.id) {
    throw new Error("You are not allowed to delete this medical report.");
  }

  if (report.filePublicId) {
    await deleteImage(report.filePublicId);
  }

  return prisma.medicalReport.delete({
    where: {
      id: reportId,
    },
  });
};


// ============================================================
// Get Patient Medical Records
// ============================================================

export const getPatientMedicalRecords = async (
  userId: string,
) => {
  const patient = await getPatientProfile(userId);

  const [medicalHistories, medicalReports] =
    await Promise.all([
      prisma.medicalHistory.findMany({
        where: {
          patientId: patient.id,
        },
        orderBy: {
          diagnosedAt: "desc",
        },
      }),

      prisma.medicalReport.findMany({
        where: {
          patientId: patient.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

  return {
    medicalHistories,
    medicalReports,
  };
};