// Backend/src/services/Doctor/doctor.service.ts
import prisma from '../../lib/prisma.js';

interface GetAllDoctorsParams {
  page: number;
  limit: number;
  search?: string;
  department?: string;
}

export const getAllDoctors = async ({
  page,
  limit,
  search = "",
  department = "",
}: GetAllDoctorsParams) => {

  const skip = (page - 1) * limit;

  const whereCondition = {
    user: {
      isActive: true,
      isEmailVerified: true,
    },

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          specialization: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),

    ...(department && {
      department: {
        name: {
          equals: department,
          mode: "insensitive" as const,
        },
      },
    }),
  };

  // Get paginated doctors
  const doctors = await prisma.doctorProfile.findMany({
    where: whereCondition,

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
      createdAt: "desc",
    },

    skip,
    take: limit,
  });

  // Get total count
  const total = await prisma.doctorProfile.count({
    where: whereCondition,
  });

  return {
    doctors,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
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
