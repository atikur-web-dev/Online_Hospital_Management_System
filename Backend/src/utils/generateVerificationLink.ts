// Backend/src/utils/generateVerificationLink.ts
import jwt from "jsonwebtoken";

export const generateVerificationLink = (
  email: string,
) => {
  const token = jwt.sign(
    { email },
    process.env.EMAIL_VERIFICATION_SECRET!,
    {
      expiresIn:
        process.env.EMAIL_VERIFICATION_EXPIRE ||
        "10m",
    },
  );

  return `${process.env.APP_URL}/api/v1/auth/verify/${token}`;
};