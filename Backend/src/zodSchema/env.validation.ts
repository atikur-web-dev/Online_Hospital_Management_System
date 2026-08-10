// Backend/src/zodSchema/env.validation.ts
import z from "zod";

export const envSchema = z.object({
  // ================= Node =================

  NODE_ENV: z
    .enum(["development", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .default(5000),

  // ================= Database =================

  DATABASE_URL: z
    .string()
    .url(),

  // ================= JWT =================

  JWT_SECRET: z
    .string()
    .min(8),

  // ================= Google OAuth =================

  GOOGLE_CLIENT_ID: z
    .string()
    .min(1),

  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1),

  GOOGLE_REDIRECT_URL: z
    .string()
    .url(),

  // ================= GitHub OAuth =================

  GITHUB_CLIENT_ID: z
    .string()
    .min(1),

  GITHUB_CLIENT_SECRET: z
    .string()
    .min(1),

  GITHUB_REDIRECT_URL: z
    .string()
    .url(),

  // ================= Gemini =================

  GOOGLE_GEMINI_API_KEY: z
    .string()
    .min(1),

  // ================= Cloudinary =================

  CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1),

  CLOUDINARY_API_KEY: z
    .string()
    .min(1),

  CLOUDINARY_API_SECRET: z
    .string()
    .min(1),

  // ================= SSLCommerz =================

  SSL_STORE_ID: z
    .string()
    .min(1),

  SSL_STORE_PASSWORD: z
    .string()
    .min(1),

  SSL_IS_LIVE: z
    .coerce
    .boolean()
    .default(false),

  SSL_PAYMENT_API: z
    .string()
    .url(),

  SSL_VALIDATION_API: z
    .string()
    .url(),

  SSL_SUCCESS_BACKEND_URL: z
    .string()
    .url(),

  SSL_FAIL_BACKEND_URL: z
    .string()
    .url(),

  SSL_CANCEL_BACKEND_URL: z
    .string()
    .url(),

  SSL_IPN_URL: z
    .string()
    .url(),

  // ================= SSLCommerz Frontend URLs =================

  SSL_SUCCESS_FRONTEND_URL: z
    .string()
    .url(),

  SSL_FAIL_FRONTEND_URL: z
    .string()
    .url(),

  SSL_CANCEL_FRONTEND_URL: z
    .string()
    .url(),

  // ================= Redis =================

  REDIS_URL: z
    .string()
    .url()
    .default("redis://localhost:6379"),

  CACHE_TTL: z
    .coerce
    .number()
    .default(300),

  // ================= Resend =================

  RESEND_API_KEY: z
    .string()
    .min(1),

  // ================= Email Verification =================

  EMAIL_VERIFICATION_SECRET: z
    .string()
    .min(8),

  EMAIL_VERIFICATION_EXPIRE: z
    .string()
    .default("10m"),

  // ================= URLs =================

  SERVER_URL: z
    .string()
    .url(),

  CLIENT_URL: z
    .string()
    .url(),
});

export type Env = z.infer<typeof envSchema>;