import prisma from "../../lib/prisma.js";
import { sendMail } from "../../utils/sendMail.js";
import { generatePrescriptionLink } from "../../utils/prescriptionLink.js";
import { prescriptionEmailTemplate } from "../../templates/prescriptionEmail.js";
import { NotFoundError } from "../../utils/errors/httpErrors.js";

export async function sendPrescriptionToPatient(
  prescriptionId: string,
): Promise<string> {

  // Find Prescription 
  const prescription = await prisma.prescription.findUnique({
    where: {
      id: prescriptionId,
    },
    include: {
      appointment: {
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          doctor: true,
        },
      },
    },
  });

  if (!prescription) {
    throw new NotFoundError(
      {},
      "Prescription not found",
    );
  }

  //  Patient Email
  const patientEmail =
    prescription.appointment.patient.user.email;

  if (!patientEmail) {
    throw new NotFoundError(
      {},
      "Patient email address not found",
    );
  }

  //  Names 
  const patientName =
    prescription.appointment.patient.name;

  const doctorName =
    prescription.appointment.doctor.name;

  //  Generate Secure Link 
  const prescriptionLink =
    generatePrescriptionLink(prescription.id);

  // Email
  const html = prescriptionEmailTemplate({
    patientName,
    doctorName,
    prescriptionLink,
  });

  await sendMail(
    patientEmail,
    "Your Medical Prescription - CarePlus",
    html,
  );

  return "Prescription sent to patient successfully";
}