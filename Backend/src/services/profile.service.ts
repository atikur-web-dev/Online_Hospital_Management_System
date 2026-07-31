// Backend/src/services/profile.service.ts
import prisma from '../lib/prisma.js';

import {
  updateAdminProfileSchema,
  updateDoctorProfileSchema,
  updatePatientProfileSchema,
} from '../validators/profile.validator.js';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import type { UserRole } from '../generated/prisma/index.js';
import { uploadImage, deleteImage } from './cloudinary.service.js';
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
      const parsed = updatePatientProfileSchema.parse(body);

      const data = {
        ...(parsed.name !== undefined && { name: parsed.name }),
        ...(parsed.phone !== undefined && { phone: parsed.phone }),
        ...(parsed.gender !== undefined && { gender: parsed.gender }),
        ...(parsed.address !== undefined && { address: parsed.address }),
        ...(parsed.dateOfBirth !== undefined && {
          dateOfBirth: new Date(parsed.dateOfBirth),
        }),
      };

      return prisma.patientProfile.update({
        where: { userId },
        data,
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
    }

    case "DOCTOR": {
      const parsed = updateDoctorProfileSchema.parse(body);

      const data = {
        ...(parsed.name !== undefined && { name: parsed.name }),
        ...(parsed.phone !== undefined && { phone: parsed.phone }),
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
        where: { userId },
        data,
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
    }

    case "ADMIN": {
      const parsed = updateAdminProfileSchema.parse(body);

      const data = {
        ...(parsed.name !== undefined && { name: parsed.name }),
        ...(parsed.phone !== undefined && { phone: parsed.phone }),
        ...(parsed.permissions !== undefined && {
          permissions: parsed.permissions,
        }),
      };

      return prisma.adminProfile.update({
        where: { userId },
        data,
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
    }

    default:
      throw new Error("Invalid user role");
  }
};
/**
 * Upload Profile Image
 */
export const uploadProfileImage = async (
  userId: string,
  file: Express.Multer.File
) => {
  if (!file) {
    throw new Error("Profile image is required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      profileImage: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const uploadResult = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "careplus/profile-images",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profileImage: uploadResult.secure_url,
      profileImagePublicId: uploadResult.public_id,
    },
    select: {
      id: true,
      email: true,
      role: true,
      profileImage: true,
    },
  });

  return updatedUser;
};

/**
 * Upload Logged In User Profile Image
 */
export const uploadMyProfileImage = async (
  userId: string,
  file: Express.Multer.File
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      profileImagePublicId: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.profileImagePublicId) {
    await deleteImage(user.profileImagePublicId);
  }

  const uploadedImage = await uploadImage(
    file,
    "careplus/profile-images"
  );

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profileImage: uploadedImage.secure_url,
      profileImagePublicId: uploadedImage.public_id,
    },
    select: {
      id: true,
      email: true,
      role: true,
      profileImage: true,
      profileImagePublicId: true,
    },
  });

  return updatedUser;
};