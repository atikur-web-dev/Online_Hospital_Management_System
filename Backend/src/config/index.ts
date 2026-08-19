// src/config/index.ts
import { env } from "./env.js";
export const config = {
  ...env,
  
  APP_URL:
    env.NODE_ENV === "development"
      ? `http://localhost:${env.PORT}`
      : process.env.APP_URL || "",
};
