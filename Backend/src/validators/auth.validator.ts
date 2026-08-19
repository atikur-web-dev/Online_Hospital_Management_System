// Backend/src/validators/auth.validator.ts

import { z } from "zod";

//  Register Validation 

export const registerSchema = z.object({
  // Common Fields
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters"),

  email: z
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  phone: z
    .string()
    .trim()
    .optional(),

  role: z.enum(["PATIENT", "DOCTOR"]),

  // Patient Fields 

  dateOfBirth: z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.date().optional()
),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

  address: z
    .string()
    .trim()
    .optional(),

  //  Doctor Fields 

  specialization: z
    .string()
    .trim()
    .optional(),

  qualification: z
    .string()
    .trim()
    .optional(),

  experience: z
    .coerce
    .number()
    .int()
    .nonnegative()
    .optional(),

  consultationFee: z
    .coerce
    .number()
    .nonnegative()
    .optional(),
});

// Login Validation 

export const loginSchema = z.object({
  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

//  Refresh Token Validation

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, "Refresh token is required"),
});

// Email Verification 

export const verifyEmailSchema = z.object({
  token: z
    .string()
    .min(1, "Verification token is required"),
});

//Types 

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;