// Backend/src/services/profile.service.ts
import prisma from "../lib/prisma.js";

import {
  updateAdminProfileSchema,
  updateDoctorProfileSchema,
  updatePatientProfileSchema,
} from "../validators/profile.validator.js";

import type { UserRole } from "../generated/prisma/index.js";

/**
 * Get Logged In User Profile
 */
export const getMyProfile = async (
  userId: string,
  role: UserRole
) => {
  switch (role) {
    case "PATIENT":
      return prisma.patientProfile.findUnique({
        where: {
          userId,
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
        },
      });

    case "DOCTOR":
      return prisma.doctorProfile.findUnique({
        where: {
          userId,
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
        },
      });

    case "ADMIN":
      return prisma.adminProfile.findUnique({
        where: {
          userId,
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
        },
      });

    default:
      throw new Error("Invalid user role");
  }
};

/**
 * Update Logged In User Profile
 */
export const updateMyProfile = async (
  userId: string,
  role: UserRole,
  body: unknown
) => {
  switch (role) {
    case "PATIENT": {
      const parsed =
        updatePatientProfileSchema.parse(body);

      const data = {
        ...(parsed.name !== undefined && {
          name: parsed.name,
        }),

        ...(parsed.phone !== undefined && {
          phone: parsed.phone,
        }),

        ...(parsed.gender !== undefined && {
          gender: parsed.gender,
        }),

        ...(parsed.address !== undefined && {
          address: parsed.address,
        }),

        ...(parsed.dateOfBirth !== undefined && {
          dateOfBirth: new Date(parsed.dateOfBirth),
        }),
      };

      return prisma.patientProfile.update({
        where: {
          userId,
        },
        data,
      });
    }

    case "DOCTOR": {
      const parsed =
        updateDoctorProfileSchema.parse(body);

      const data = {
        ...(parsed.name !== undefined && {
          name: parsed.name,
        }),

        ...(parsed.phone !== undefined && {
          phone: parsed.phone,
        }),

        ...(parsed.specialization !== undefined && {
          specialization: parsed.specialization,
        }),

        ...(parsed.qualification !== undefined && {
          qualification: parsed.qualification,
        }),

        ...(parsed.experience !== undefined && {
          experience: parsed.experience,
        }),

        ...(parsed.consultationFee !== undefined && {
          consultationFee: parsed.consultationFee,
        }),

        ...(parsed.isAvailable !== undefined && {
          isAvailable: parsed.isAvailable,
        }),
      };

      return prisma.doctorProfile.update({
        where: {
          userId,
        },
        data,
      });
    }

    case "ADMIN": {
      const parsed =
        updateAdminProfileSchema.parse(body);

      const data = {
        ...(parsed.name !== undefined && {
          name: parsed.name,
        }),

        ...(parsed.phone !== undefined && {
          phone: parsed.phone,
        }),

        ...(parsed.permissions !== undefined && {
          permissions: parsed.permissions,
        }),
      };

      return prisma.adminProfile.update({
        where: {
          userId,
        },
        data,
      });
    }

    default:
      throw new Error("Invalid user role");
  }
};