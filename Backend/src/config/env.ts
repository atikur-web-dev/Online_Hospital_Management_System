// src/config/env.ts
import "dotenv/config";
import { envSchema } from "../zodSchema/env.validation.js";

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Environment validation failed");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
