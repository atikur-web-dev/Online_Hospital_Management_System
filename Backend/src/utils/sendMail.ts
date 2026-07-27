// Backend/src/utils/sendMail.ts
import { resend } from "../config/resend.js";

export async function sendMail(
  to: string,
  subject: string,
  html: string,
) {
  const { error } =
    await resend.emails.send({
      from:
        "CarePlus <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

  if (error) {
    throw new Error(error.message);
  }
}