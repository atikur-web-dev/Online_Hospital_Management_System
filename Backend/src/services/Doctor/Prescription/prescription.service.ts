// Backend/src/services/Doctor/Prescription/prescription.service.ts
import prisma from '../../../lib/prisma.js';
import type { CreatePrescriptionInput } from '../../../types/prescription.js';

export const createPrescription = async (
  doctorUserId: string,
  payload: CreatePrescriptionInput,
) => {
  // Find doctor
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId: doctorUserId,
    },
  });

  if (!doctor) {
    throw new Error('Doctor not found.');
  }

  // Check appointment
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: payload.appointmentId,
    },
    include: {
      prescription: true,
    },
  });

  if (!appointment) {
    throw new Error('Appointment not found.');
  }

  if (appointment.doctorId !== doctor.id) {
    throw new Error('Unauthorized.');
  }

  if (appointment.prescription) {
    throw new Error('Prescription already exists.');
  }

  // Create prescription
  const prescription = await prisma.prescription.create({
    data: {
      appointmentId: payload.appointmentId,
      diagnosis: payload.diagnosis,
      advice: payload.advice ?? null,
    },
  });

  // Medicines
  if (payload.medicines.length > 0) {
    await prisma.prescriptionMedicine.createMany({
      data: payload.medicines.map((medicine) => ({
        prescriptionId: prescription.id,
        medicineName: medicine.name,
        dosage: medicine.dosage,
        frequency: medicine.frequency,
        duration: medicine.duration,
        instructions: medicine.instructions ?? null,
      })),
    });
  }

  // Tests
  if (payload.tests?.length) {
    await prisma.prescriptionTest.createMany({
      data: payload.tests.map((test) => ({
        prescriptionId: prescription.id,
        testName: test.name,
      })),
    });
  }

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

/**
 * Get Prescription By ID
 */
export const getPrescriptionById = async (
  doctorUserId: string,
  prescriptionId: string,
) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId: doctorUserId,
    },
  });

  if (!doctor) {
    throw new Error("Doctor profile not found.");
  }

  const prescription = await prisma.prescription.findFirst({
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
        },
      },

      medicines: true,
      tests: true,
    },
  });

  if (!prescription) {
    throw new Error("Prescription not found.");
  }

  return prescription;
};