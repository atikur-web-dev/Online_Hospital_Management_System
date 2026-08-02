// Backend/src/services/Appointment/appointment.service.ts

import prisma from '../../lib/prisma.js';
import { sendAppointmentConfirmationEmail } from "../../services/Appointment/appointmentEmail.service.js";
import type { CreateAppointmentInput } from '../../validators/appointment.validator.js';
import { ApiError } from '../../utils/errors/apiError.js';


export const createAppointment = async (
  patientUserId: string,
  data: CreateAppointmentInput,
) => {
  const { doctorId, appointmentAt, problem } = data;
  
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

  const patientUser = await prisma.user.findUnique({
  where: {
    id: patient.userId,
  },
});

const department = doctor.departmentId
  ? await prisma.department.findUnique({
      where: {
        id: doctor.departmentId,
      },
    })
  : null;

try {
  await sendAppointmentConfirmationEmail({
  email: patientUser!.email,
  patientName: patient.name,
  doctorName: doctor.name,
  department: department?.name ?? "General",
  appointmentDate: new Date(appointment.appointmentAt).toLocaleDateString(),
  appointmentTime: new Date(appointment.appointmentAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),

  ...(problem ? { problem } : {}),
});
} catch (err) {
  console.error(
    "Failed to send appointment confirmation email:",
    err,
  );
}

  return appointment;
};

/**
 * Get Patient Appointments
 */
export const getMyAppointments = async (
  patientUserId: string,
) => {
  const patient = await prisma.patientProfile.findUnique({
    where: {
      userId: patientUserId,
    },
  });

  if (!patient) {
    throw new Error("Patient profile not found.");
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
      patientDeletedAt: null,
    },

    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          phone: true,

          specialization: true,
          qualification: true,
          experience: true,
          consultationFee: true,
          isAvailable: true,

          department: {
            select: {
              id: true,
              name: true,
            },
          },

          user: {
            select: {
              profileImage: true,
              email: true,
            },
          },
        },
      },
    },

    orderBy: {
      appointmentAt: "desc",
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

export const deleteAppointmentForPatient = async (
  patientUserId: string,
  appointmentId: string,
) => {
  // Find patient
  const patient = await prisma.patientProfile.findUnique({
    where: {
      userId: patientUserId,
    },
  });

  if (!patient) {
    throw new ApiError(404, "Patient profile not found.", {});
  }

  // Find appointment
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment not found.", {});
  }

  // Ownership check
  if (appointment.patientId !== patient.id) {
    throw new ApiError(403, "You are not allowed to delete this appointment.", {});
  }

  // Only cancelled appointments can be hidden
  if (appointment.status !== "CANCELLED") {
    throw new ApiError(
      400,
      "Only cancelled appointments can be deleted.",
      {},
    );
  }

  // Already deleted
  if (appointment.patientDeletedAt) {
    throw new ApiError(
      400,
      "Appointment has already been deleted.",
      {},
    );
  }

  return prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      patientDeletedAt: new Date(),
    },
  });
};