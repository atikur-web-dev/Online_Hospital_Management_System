// Backend/src/services/Doctor/Prescription/prescription.service.ts
import prisma from "../../../lib/prisma.js";
import type {
  CreatePrescriptionInput,
  UpdatePrescriptionInput,
} from "../../../types/prescription.js";


export const createPrescription = async (
  doctorUserId: string,
  payload: CreatePrescriptionInput,
) => {
  // Find doctor
  const doctor =
    await prisma.doctorProfile.findUnique({
      where: {
        userId: doctorUserId,
      },
    });

  if (!doctor) {
    throw new Error("Doctor not found.");
  }

  // Check appointment
  const appointment =
    await prisma.appointment.findUnique({
      where: {
        id: payload.appointmentId,
      },
      include: {
        prescription: true,
      },
    });

  if (!appointment) {
    throw new Error("Appointment not found.");
  }

  // Make sure appointment belongs to this doctor
  if (appointment.doctorId !== doctor.id) {
    throw new Error("Unauthorized.");
  }

  // Prevent duplicate prescription
  if (appointment.prescription) {
    throw new Error(
      "Prescription already exists.",
    );
  }

  // Create prescription
  const prescription =
    await prisma.prescription.create({
      data: {
        appointmentId:
          payload.appointmentId,
        diagnosis: payload.diagnosis,
        advice: payload.advice ?? null,
        followUpDate:
          payload.followUpDate ?? null,
      },
    });

  // Medicines
  if (payload.medicines.length > 0) {
    await prisma.prescriptionMedicine.createMany({
      data: payload.medicines.map(
        (medicine) => ({
          prescriptionId:
            prescription.id,
          medicineName: medicine.name,
          dosage: medicine.dosage,
          frequency: medicine.frequency,
          duration: medicine.duration,
          instructions:
            medicine.instructions ?? null,
        }),
      ),
    });
  }

  // Tests
  if (payload.tests?.length) {
    await prisma.prescriptionTest.createMany({
      data: payload.tests.map((test) => ({
        prescriptionId:
          prescription.id,
        testName: test.name,
      })),
    });
  }

  // Return complete prescription
  return await prisma.prescription.findUnique({
    where: {
      id: prescription.id,
    },
    include: {
      medicines: true,
      tests: true,
      appointment: {
        include: {
          patient: true,
          doctor: true,
        },
      },
    },
  });
};


export const getPrescriptionById = async (
  doctorUserId: string,
  prescriptionId: string,
) => {
  const doctor =
    await prisma.doctorProfile.findUnique({
      where: {
        userId: doctorUserId,
      },
    });

  if (!doctor) {
    throw new Error(
      "Doctor profile not found.",
    );
  }

  const prescription =
    await prisma.prescription.findFirst({
      where: {
        id: prescriptionId,
        appointment: {
          doctorId: doctor.id,
        },
      },

      include: {
        appointment: {
          include: {
            patient: true,
            doctor: true,
          },
        },

        medicines: true,
        tests: true,
      },
    });

  if (!prescription) {
    throw new Error(
      "Prescription not found.",
    );
  }

  return prescription;
};


export const updatePrescription = async (
  doctorUserId: string,
  prescriptionId: string,
  payload: UpdatePrescriptionInput,
) => {
  const doctor =
    await prisma.doctorProfile.findUnique({
      where: {
        userId: doctorUserId,
      },
    });

  if (!doctor) {
    throw new Error(
      "Doctor profile not found.",
    );
  }

  // Find prescription and make sure it belongs to this doctor's appointment
  const prescription =
    await prisma.prescription.findFirst({
      where: {
        id: prescriptionId,
        appointment: {
          doctorId: doctor.id,
        },
      },
    });

  if (!prescription) {
    throw new Error(
      "Prescription not found.",
    );
  }

  const result =
    await prisma.$transaction(async (tx) => {
      // Update main prescription fields
      await tx.prescription.update({
        where: {
          id: prescriptionId,
        },

        data: {
          ...(payload.diagnosis !==
            undefined && {
            diagnosis:
              payload.diagnosis,
          }),

          ...(payload.advice !==
            undefined && {
            advice:
              payload.advice || null,
          }),

          ...(payload.followUpDate !==
            undefined && {
            followUpDate:
              payload.followUpDate,
          }),
        },
      });

      // Replace medicines
      if (
        payload.medicines !==
        undefined
      ) {
        await tx.prescriptionMedicine.deleteMany(
          {
            where: {
              prescriptionId,
            },
          },
        );

        if (
          payload.medicines.length > 0
        ) {
          await tx.prescriptionMedicine.createMany(
            {
              data: payload.medicines.map(
                (medicine) => ({
                  prescriptionId,
                  medicineName:
                    medicine.name,
                  dosage:
                    medicine.dosage,
                  frequency:
                    medicine.frequency,
                  duration:
                    medicine.duration,
                  instructions:
                    medicine.instructions ??
                    null,
                }),
              ),
            },
          );
        }
      }

      // Replace tests
      if (
        payload.tests !== undefined
      ) {
        await tx.prescriptionTest.deleteMany(
          {
            where: {
              prescriptionId,
            },
          },
        );

        if (
          payload.tests.length > 0
        ) {
          await tx.prescriptionTest.createMany(
            {
              data: payload.tests.map(
                (test) => ({
                  prescriptionId,
                  testName: test.name,
                }),
              ),
            },
          );
        }
      }

      // Return updated prescription
      return tx.prescription.findUnique({
        where: {
          id: prescriptionId,
        },

        include: {
          medicines: true,
          tests: true,

          appointment: {
            include: {
              patient: true,
              doctor: true,
            },
          },
        },
      });
    });

  return result;
};