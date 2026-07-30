// Backend/src/validators/profile.validator.ts
import { z } from "zod";

export const updatePatientProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),

  phone: z
    .string()
    .min(11)
    .max(20)
    .optional(),

  dateOfBirth: z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.date().optional()
),

  gender: z
    .enum([
      "MALE",
      "FEMALE",
      "OTHER",
    ])
    .optional(),

  address: z
    .string()
    .max(255)
    .optional(),
});

export const updateDoctorProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),

  phone: z
    .string()
    .min(11)
    .max(20)
    .optional(),

  specialization: z
    .string()
    .max(100)
    .optional(),

  qualification: z
    .string()
    .max(150)
    .optional(),

  experience: z
    .number()
    .int()
    .min(0)
    .optional(),

  consultationFee: z
    .number()
    .min(0)
    .optional(),

  isAvailable: z
    .boolean()
    .optional(),
});

export const updateAdminProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),

  phone: z
    .string()
    .min(11)
    .max(20)
    .optional(),

  permissions: z
    .array(z.string())
    .optional(),
});