// Backend/src/utils/prescriptionToken.ts
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

interface PrescriptionTokenPayload extends JwtPayload {
  prescriptionId: string;
}

export const verifyPrescriptionToken = (
  token: string,
): PrescriptionTokenPayload => {
  const decoded = jwt.verify(
    token,
    env.PRESCRIPTION_VIEW_SECRET,
  );

  if (
    typeof decoded === "string" ||
    typeof decoded.prescriptionId !== "string"
  ) {
    throw new Error("Invalid prescription token");
  }

  return decoded as PrescriptionTokenPayload;
};