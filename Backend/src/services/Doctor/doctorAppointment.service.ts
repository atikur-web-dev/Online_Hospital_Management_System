// Backend/src/services/Doctor/doctorAppointment.service.ts
import prisma from "../../lib/prisma.js";
import { ApiError } from "../../utils/errors/apiError.js";

export const getMyAppointments = async (doctorUserId: string) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId: doctorUserId,
    },
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found.", {});
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
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
    },

    orderBy: {
      appointmentAt: "asc",
    },
  });

  return appointments;
};

export const confirmAppointment = async (
  doctorUserId: string,
  appointmentId: string,
) => {
  // Find doctor profile
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId: doctorUserId,
    },
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found.", {});
  }

  // Find appointment
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      doctorId: doctor.id,
    },
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment not found.", {});
  }

  // Prevent confirming cancelled/completed appointments
  if (appointment.status === "CANCELLED") {
    throw new ApiError(
      400,
      "Cancelled appointment cannot be confirmed.",
      {},
    );
  }

  if (appointment.status === "COMPLETED") {
    throw new ApiError(
      400,
      "Completed appointment cannot be confirmed.",
      {},
    );
  }

  // Already confirmed
  if (appointment.status === "CONFIRMED") {
    return appointment;
  }

  // Update status
  const updatedAppointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status: "CONFIRMED",
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
    throw new ApiError(404, "Doctor profile not found.", {});
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      doctorId: doctor.id,
    },
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment not found.", {});
  }

  if (appointment.status === "CANCELLED") {
    throw new ApiError(
      400,
      "Cancelled appointment cannot be completed.",
      {},
    );
  }

  if (appointment.status === "COMPLETED") {
    return appointment;
  }

  const updatedAppointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status: "COMPLETED",
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
    throw new ApiError(404, "Doctor profile not found.", {});
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      doctorId: doctor.id,
    },
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment not found.", {});
  }

  if (appointment.status === "COMPLETED") {
    throw new ApiError(
      400,
      "Completed appointment cannot be cancelled.",
      {},
    );
  }

  if (appointment.status === "CANCELLED") {
    return appointment;
  }

  const updatedAppointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status: "CANCELLED",
    },
  });

  return updatedAppointment;
};