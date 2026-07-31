// Backend/src/services/Doctor/doctor.service.ts
import prisma from "../../lib/prisma.js";

export const getAllDoctors = async () => {
  return prisma.doctorProfile.findMany({
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
  });
};