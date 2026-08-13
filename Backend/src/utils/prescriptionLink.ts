// Backend/src/utils/prescriptionLink.ts
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generatePrescriptionLink = (
  prescriptionId: string,
): string => {
  const token = jwt.sign(
    {
      prescriptionId,
    },
    env.PRESCRIPTION_VIEW_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return `${env.CLIENT_URL}/prescription/view/${token}`;
};