// Backend/src/services/auth.service.ts
import prisma from '../lib/prisma.js';
// import type { PatientProfile, DoctorProfile, AdminProfile } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import type {
  RegisterInput,
  LoginInput,
} from '../validators/auth.validator.js';
import { generateVerificationLink } from '../utils/generateVerificationLink.js';
import { sendMail } from '../config/mailConfig.js';
import { emailVerificationTemplate } from '../templates/emailVerification.js';
import { InternalServerError, ConflictError } from '../utils/errors/httpErrors.js';

export const registerUser = async (data: RegisterInput) => {
  const {
    email,
    password,
    name,
    role,
    phone,

    // Patient
    dateOfBirth,
    gender,
    address,

    // Doctor
    specialization,
    qualification,
    experience,
    consultationFee,
  } = data;

  // ================= Check Existing User =================

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ConflictError({}, 'User already exists');
  }

  // ================= Hash Password =================

  const hashedPassword = await hashPassword(password);

  try {
    // ================= Transaction =================

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          isEmailVerified: false,
        },
      });

      if (role === 'PATIENT') {
        await tx.patientProfile.create({
          data: {
            userId: createdUser.id,
            name,
            phone: phone ?? null,

            dateOfBirth: dateOfBirth ?? null,
            gender: gender ?? null,
            address: address ?? null,
          },
        });
      }

      if (role === 'DOCTOR') {
        await tx.doctorProfile.create({
          data: {
            userId: createdUser.id,
            name,
            phone: phone ?? null,

            specialization: specialization ?? null,
            qualification: qualification ?? null,
            experience: experience ?? null,
            consultationFee: consultationFee ?? null,
          },
        });
      }

      return createdUser;
    });

    // ================= JWT =================

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
    });

    // ================= Store Refresh Token =================

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // ================= Send Verification Email =================

    const verificationLink = generateVerificationLink(user.email);

try {
  await sendMail(
    [user.email],
    "Verify Your Email",
    emailVerificationTemplate(
      verificationLink,
      name,
    ),
  );
} catch (error) {
  console.error("Email sending failed:", error);
}

    // ================= Response =================

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      token,
      refreshToken,
    };
  } catch (error) {
    console.error(error);

    throw new InternalServerError(
      {},
      error instanceof Error ? error.message : 'Registration failed',
    );
  }
};

// Login
export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      patientProfile: true,
      doctorProfile: true,
      adminProfile: true,
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.password) {
    throw new Error('Please login with Google');
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  if (user.role !== 'ADMIN' && !user.isEmailVerified) {
    throw new Error('Please verify your email first');
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLogin: new Date(),
    },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  let profileName = user.email;

  switch (user.role) {
    case 'PATIENT':
      profileName = user.patientProfile?.name ?? user.email;
      break;

    case 'DOCTOR':
      profileName = user.doctorProfile?.name ?? user.email;
      break;

    case 'ADMIN':
      profileName = user.adminProfile?.name ?? user.email;
      break;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: profileName,
      profileImage: user.profileImage,
      isEmailVerified: user.isEmailVerified,
      isAdmin: user.role === 'ADMIN',
    },
    token,
    refreshToken,
  };
};

// ============ REFRESH TOKEN ============
export const refreshTokenService = async (refreshToken: string) => {
  try {
    // Verify JWT and get payload
    const payload = verifyRefreshToken(refreshToken);

    // Find token in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    // Check token expiry
    if (storedToken.expiresAt <= new Date()) {
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      throw new Error('Refresh token has expired');
    }

    // Extra security: Ensure JWT belongs to the same user
    if (storedToken.user.id !== payload.id) {
      throw new Error('Invalid refresh token');
    }

    // Delete old refresh token (Rotation)
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Generate new access token
    const token = generateToken({
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
      isEmailVerified: storedToken.user.isEmailVerified,
    });

    // Generate new refresh token
    const newRefreshToken = generateRefreshToken({
      id: storedToken.user.id,
    });

    // Save new refresh token
    await prisma.refreshToken.create({
      data: {
        userId: storedToken.user.id,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days
      },
    });

    return {
      token,
      refreshToken: newRefreshToken,
    };
  } catch {
    throw new Error('Invalid or expired refresh token');
  }
};

// ============ LOGOUT ============
export const logoutUser = async (userId: string) => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

// ============ GET CURRENT USER ============
export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      patientProfile: true,
      doctorProfile: true,
      adminProfile: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  let profile:
    | typeof user.patientProfile
    | typeof user.doctorProfile
    | typeof user.adminProfile
    | null = null;
  if (user.role === 'PATIENT' && user.patientProfile) {
    profile = user.patientProfile;
  } else if (user.role === 'DOCTOR' && user.doctorProfile) {
    profile = user.doctorProfile;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    profileImage: user.profileImage,
    lastLogin: user.lastLogin,
    profile,
  };
};
