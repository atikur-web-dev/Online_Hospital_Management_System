// Backend/src/validators/medicalRecord.validator.ts
import { z } from "zod";

export const createMedicalHistorySchema = z.object({
  condition: z
    .string()
    .min(2, "Condition is required.")
    .max(200, "Condition is too long."),

  details: z
    .string()
    .max(2000, "Details are too long.")
    .optional(),

  diagnosedAt: z
    .string()
    .datetime()
    .optional(),
});

export const updateMedicalHistorySchema = z.object({
  condition: z
    .string()
    .min(2, "Condition is required.")
    .max(200, "Condition is too long.")
    .optional(),

  details: z
    .string()
    .max(2000, "Details are too long.")
    .optional(),

  diagnosedAt: z
    .string()
    .datetime()
    .nullable()
    .optional(),
});

export const createMedicalReportSchema = z.object({
  title: z
    .string()
    .min(2, "Report title is required.")
    .max(200, "Report title is too long."),

  description: z
    .string()
    .max(2000, "Description is too long.")
    .optional(),
});

export type CreateMedicalHistoryInput = z.infer<
  typeof createMedicalHistorySchema
>;

export type UpdateMedicalHistoryInput = z.infer<
  typeof updateMedicalHistorySchema
>;

export type CreateMedicalReportInput = z.infer<
  typeof createMedicalReportSchema
>;