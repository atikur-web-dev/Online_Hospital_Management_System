// Backend/src/services/Appointment/appointment.service.ts

import prisma from '../../lib/prisma.js';
import type { CreateAppointmentInput } from '../../validators/appointment.validator.js';
import { ApiError } from '../../utils/errors/apiError.js';
export const createAppointment = async (
  patientUserId: string,
  data: CreateAppointmentInput,
) => {
  const { doctorId, appointmentAt, problem } = data;
  console.log('JWT User ID:', patientUserId);
  // Find Patient Profile
  const patient = await prisma.patientProfile.findUnique({
    where: {
      userId: patientUserId,
    },
  });

  console.log('Patient Profile:', patient);

  if (!patient) {
    throw new Error('Patient profile not found.');
  }

  // Find Doctor
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!doctor) {
    throw new Error('Doctor not found.');
  }

  // Doctor Availability
  if (!doctor.isAvailable) {
    throw new Error('Doctor is currently unavailable.');
  }

  // Check Duplicate Appointment
  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      doctorId,
      appointmentAt,
    },
  });

  if (existingAppointment) {
    throw new Error('This time slot is already booked.');
  }

  // Create Appointment
  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId,
      appointmentAt,
      problem: problem ?? null,
    },

    include: {
      patient: {
        select: {
          id: true,
          name: true,
        },
      },

      doctor: {
        select: {
          id: true,
          name: true,
          specialization: true,
        },
      },
    },
  });

  return appointment;
};

/**
 * Get Patient Appointments
 */
export const getMyAppointments = async (patientUserId: string) => {
  const patient = await prisma.patientProfile.findUnique({
    where: {
      userId: patientUserId,
    },
  });

  if (!patient) {
    throw new Error('Patient profile not found.');
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
    },

    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          specialization: true,

          department: {
            select: {
              name: true,
            },
          },

          user: {
            select: {
              profileImage: true,
            },
          },
        },
      },
    },

    orderBy: {
      appointmentAt: 'desc',
    },
  });

  return appointments;
};

export const cancelAppointment = async (
  patientUserId: string,
  appointmentId: string,
) => {
  const patient = await prisma.patientProfile.findUnique({
    where: {
      userId: patientUserId,
    },
  });

  if (!patient) {
    throw new Error('Patient profile not found.');
  }

  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
  });

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found.', {});
  }

  if (appointment.patientId !== patient.id) {
    throw new ApiError(401, 'Unauthorized', {});
  }

  if (appointment.status === 'COMPLETED') {
    throw new Error('Completed appointment cannot be cancelled.');
  }

  if (appointment.status === 'CANCELLED') {
    throw new Error('Appointment already cancelled.');
  }

  return prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status: 'CANCELLED',
    },
  });
};
