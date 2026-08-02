import { sendMail } from "../../utils/sendMail.js";
import { appointmentConfirmationTemplate } from "../../templates/appointmentConfirmation.js";

export async function sendAppointmentConfirmationEmail({
  email,
  patientName,
  doctorName,
  department,
 appointmentDate,
  appointmentTime,
  problem,
}: {
  email: string;
  patientName: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  problem?: string | null;
}) {

  await sendMail(
    email,
    "Appointment Confirmation | CarePlus Hospital",
    appointmentConfirmationTemplate({
      patientName,
      doctorName,
      department,
      appointmentDate,
      appointmentTime,
      ...(problem !== undefined && { problem }),
    }),
  );

}