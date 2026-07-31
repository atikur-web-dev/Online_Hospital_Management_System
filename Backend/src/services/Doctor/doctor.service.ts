// Backend/src/services/Doctor/doctor.service.ts
import prisma from '../../lib/prisma.js';

export const getAllDoctors = async () => {
  const doctors = await prisma.doctorProfile.findMany({
    where: {
      user: {
        isActive: true,
        isEmailVerified: true,
      },
    },

    include: {
      user: {
        select: {
          id: true,
          email: true,
          profileImage: true,
          isEmailVerified: true,
          role: true,
        },
      },

      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  return doctors;
};
/**
 * Get Single Doctor
 */
export const getDoctorById = async (doctorId: string) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      id: doctorId,
    },

    include: {
      user: {
        select: {
          email: true,
          profileImage: true,
          isEmailVerified: true,
          role: true,
        },
      },

      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!doctor) {
    throw new Error('Doctor not found.');
  }

  return doctor;
};
