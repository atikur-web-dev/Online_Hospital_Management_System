// Backend/src/validators/prescription.validator.ts
import { z } from "zod";

const medicineSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Medicine name is required.")
    .max(100),

  dosage: z
    .string()
    .trim()
    .min(1, "Dosage is required.")
    .max(100),

  frequency: z
    .string()
    .trim()
    .min(1, "Frequency is required.")
    .max(100),

  duration: z
    .string()
    .trim()
    .min(1, "Duration is required.")
    .max(100),

  instructions: z
    .string()
    .trim()
    .max(300)
    .optional(),
});

const testSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Test name is required.")
    .max(100),

  instructions: z
    .string()
    .trim()
    .max(300)
    .optional(),
});

export const createPrescriptionSchema = z.object({
  appointmentId: z
    .string()
    .trim()
    .min(1, "Appointment ID is required."),

  diagnosis: z
    .string()
    .trim()
    .min(5, "Diagnosis is too short.")
    .max(3000),

  medicines: z
    .array(medicineSchema)
    .min(1, "At least one medicine is required."),

  tests: z
    .array(testSchema)
    .optional()
    .default([]),

  advice: z
    .string()
    .trim()
    .max(3000)
    .optional(),

  followUpDate: z
    .string()
    .datetime()
    .optional()
    .nullable(),
});

export const updatePrescriptionSchema = z.object({
  diagnosis: z
    .string()
    .trim()
    .min(5)
    .max(3000)
    .optional(),

  medicines: z
    .array(medicineSchema)
    .optional(),

  tests: z
    .array(testSchema)
    .optional(),

  advice: z
    .string()
    .trim()
    .max(3000)
    .optional(),

  followUpDate: z
    .string()
    .datetime()
    .optional()
    .nullable(),
});

export type CreatePrescriptionBody = z.infer<
  typeof createPrescriptionSchema
>;

export type UpdatePrescriptionBody = z.infer<
  typeof updatePrescriptionSchema
>;