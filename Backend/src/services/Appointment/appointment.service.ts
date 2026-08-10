// Backend/src/services/Appointment/appointment.service.ts

import prisma from '../../lib/prisma.js';
import { sendAppointmentConfirmationEmail } from '../../services/Appointment/appointmentEmail.service.js';
import type { CreateAppointmentInput } from '../../validators/appointment.validator.js';
import { ApiError } from '../../utils/errors/apiError.js';

const getBangladeshDateTimeParts = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(date);

  const weekday = parts.find((part) => part.type === 'weekday')?.value;

  const hourPart = parts.find((part) => part.type === 'hour')?.value;

  const minutePart = parts.find((part) => part.type === 'minute')?.value;

  if (!weekday || !hourPart || !minutePart) {
    throw new Error('Failed to determine appointment date and time.');
  }

  const hour = Number(hourPart);
  const minute = Number(minutePart);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error('Invalid appointment date and time.');
  }

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const dayOfWeek = dayMap[weekday];

  if (dayOfWeek === undefined) {
    throw new Error('Invalid appointment day.');
  }

  return {
    dayOfWeek,
    hour,
    minute,
  };
};

const timeToMinutes = (time: string): number => {
  const parts = time.split(':');

  if (parts.length !== 2) {
    throw new Error('Invalid schedule time format.');
  }

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error('Invalid schedule time.');
  }

  return hour * 60 + minute;
};

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

  // ============================================================
  // Doctor Schedule Validation
  // ============================================================

  const appointmentDateTime = new Date(appointmentAt);

  if (Number.isNaN(appointmentDateTime.getTime())) {
    throw new Error('Invalid appointment date and time.');
  }

  const { dayOfWeek, hour, minute } =
    getBangladeshDateTimeParts(appointmentDateTime);

  const appointmentMinutes = hour * 60 + minute;

  const schedule = await prisma.doctorSchedule.findUnique({
    where: {
      doctorId_dayOfWeek: {
        doctorId,
        dayOfWeek,
      },
    },
  });

  // No schedule configured for this day
  if (!schedule || !schedule.isActive) {
    throw new Error('Doctor is not available on this day.');
  }

  const scheduleStart = timeToMinutes(schedule.startTime);

  const scheduleEnd = timeToMinutes(schedule.endTime);

  // Appointment outside working hours
  if (appointmentMinutes < scheduleStart || appointmentMinutes >= scheduleEnd) {
    throw new Error(
      `Doctor is available from ${schedule.startTime} to ${schedule.endTime} on this day.`,
    );
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
      department: department?.name ?? 'General',
      appointmentDate: new Date(appointment.appointmentAt).toLocaleDateString(),
      appointmentTime: new Date(appointment.appointmentAt).toLocaleTimeString(
        [],
        {
          hour: '2-digit',
          minute: '2-digit',
        },
      ),

      ...(problem ? { problem } : {}),
    });
  } catch (err) {
    console.error('Failed to send appointment confirmation email:', err);
  }

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
      payment: {
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          transactionId: true,
          paidAt: true,
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
    throw new ApiError(404, 'Patient profile not found.', {});
  }

  // Find appointment
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
  });

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found.', {});
  }

  // Ownership check
  if (appointment.patientId !== patient.id) {
    throw new ApiError(
      403,
      'You are not allowed to delete this appointment.',
      {},
    );
  }

  // Only cancelled appointments can be hidden
  if (appointment.status !== 'CANCELLED') {
    throw new ApiError(400, 'Only cancelled appointments can be deleted.', {});
  }

  // Already deleted
  if (appointment.patientDeletedAt) {
    throw new ApiError(400, 'Appointment has already been deleted.', {});
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

/**
 * Get Doctor Booked Appointment Times
 */
export const getDoctorBookedAppointments = async (
  doctorId: string,
) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      status: {
        not: "CANCELLED",
      },
    },
    select: {
      appointmentAt: true,
    },
    orderBy: {
      appointmentAt: "asc",
    },
  });

  return appointments;
};