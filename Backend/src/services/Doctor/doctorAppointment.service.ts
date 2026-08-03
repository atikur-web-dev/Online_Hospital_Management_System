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

