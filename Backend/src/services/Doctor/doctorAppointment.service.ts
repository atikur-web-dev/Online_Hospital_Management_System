// Backend/src/services/Doctor/doctorAppointment.service.ts
import prisma from '../../lib/prisma.js';
import { ApiError } from '../../utils/errors/apiError.js';

export const getMyAppointments = async (doctorUserId: string) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId: doctorUserId,
    },
  });

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.', {});
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      doctorArchived: false,
    },

    include: {
      patient: {
        select: {
          id: true,
          name: true,
          phone: true,
          gender: true,
          dateOfBirth: true,

          user: {
            select: {
              email: true,
              profileImage: true,
            },
          },
        },
      },

      prescription: {
        select: {
          id: true,
          diagnosis: true,
          createdAt: true,
        },
      },
    },

    orderBy: {
      appointmentAt: 'asc',
    },
  });

  return appointments;
};

export const getAppointmentById = async (
  doctorUserId: string,
  appointmentId: string,
) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId: doctorUserId,
    },
  });

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.', {});
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      doctorId: doctor.id,
      doctorArchived: false,
    },

    include: {
      patient: {
        select: {
          id: true,
          name: true,
          phone: true,
          gender: true,
          dateOfBirth: true,

          user: {
            select: {
              email: true,
              profileImage: true,
            },
          },
        },
      },

      prescription: {
        select: {
          id: true,
          diagnosis: true,
          advice: true,
          followUpDate: true,

          medicines: {
            select: {
              id: true,
              medicineName: true,
              dosage: true,
              frequency: true,
              duration: true,
              instructions: true,
            },
          },

          tests: {
            select: {
              id: true,
              testName: true,
            },
          },

          createdAt: true,
          updatedAt: true,
        },
      },
      sharedMedicalHistories: {
        include: {
          medicalHistory: {
            select: {
              id: true,
              condition: true,
              details: true,
              diagnosedAt: true,
            },
          },
        },
      },

      sharedMedicalReports: {
        include: {
          medicalReport: {
            select: {
              id: true,
              title: true,
              description: true,
              fileUrl: true,
              fileType: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found.', {});
  }

  return {
    ...appointment,

    medicalHistories: appointment.sharedMedicalHistories.map(
      (item) => item.medicalHistory,
    ),

    medicalReports: appointment.sharedMedicalReports.map(
      (item) => item.medicalReport,
    ),
  };
};

export const confirmAppointment = async (
  doctorUserId: string,
  appointmentId: string,
) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId: doctorUserId,
    },
  });

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.', {});
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      doctorId: doctor.id,
    },
  });

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found.', {});
  }

  if (appointment.status === 'CANCELLED') {
    throw new ApiError(400, 'Cancelled appointment cannot be confirmed.', {});
  }

  if (appointment.status === 'COMPLETED') {
    throw new ApiError(400, 'Completed appointment cannot be confirmed.', {});
  }

  if (appointment.status === 'CONFIRMED') {
    return appointment;
  }

  const updatedAppointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },

    data: {
      status: 'CONFIRMED',
    },
  });

  return updatedAppointment;
};

export const completeAppointment = async (
  doctorUserId: string,
  appointmentId: string,
) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId: doctorUserId,
    },
  });

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.', {});
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      doctorId: doctor.id,
    },

    include: {
      prescription: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found.', {});
  }

  if (appointment.status === 'CANCELLED') {
    throw new ApiError(400, 'Cancelled appointment cannot be completed.', {});
  }

  if (appointment.status === 'COMPLETED') {
    return appointment;
  }

  if (!appointment.prescription) {
    throw new ApiError(
      400,
      'Appointment cannot be completed without a prescription.',
      {},
    );
  }

  if (appointment.status !== 'CONFIRMED') {
    throw new ApiError(
      400,
      'Only confirmed appointments can be completed.',
      {},
    );
  }

  const updatedAppointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },

    data: {
      status: 'COMPLETED',
    },
  });

  return updatedAppointment;
};

export const cancelAppointment = async (
  doctorUserId: string,
  appointmentId: string,
) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId: doctorUserId,
    },
  });

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.', {});
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      doctorId: doctor.id,
    },
  });

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found.', {});
  }

  if (appointment.status === 'COMPLETED') {
    throw new ApiError(400, 'Completed appointment cannot be cancelled.', {});
  }

  if (appointment.status === 'CANCELLED') {
    return appointment;
  }

  const updatedAppointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },

    data: {
      status: 'CANCELLED',
    },
  });

  return updatedAppointment;
};

export const archiveAppointment = async (
  doctorUserId: string,
  appointmentId: string,
) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId: doctorUserId,
    },
  });

  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.', {});
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      doctorId: doctor.id,
    },
  });

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found.', {});
  }

  if (appointment.doctorArchived) {
    return appointment;
  }

  const updatedAppointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },

    data: {
      doctorArchived: true,
    },
  });

  return updatedAppointment;
};
