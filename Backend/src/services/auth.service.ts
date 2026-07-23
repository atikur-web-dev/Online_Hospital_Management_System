import prisma from '../lib/prisma.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import type { RegisterInput, LoginInput } from '../validators/auth.validator.js';

// ============ REGISTER ============
export const registerUser = async (data: RegisterInput) => {
  const { email, password, name, role, phone } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        isEmailVerified: true, // TEMPORARY: auto-verify
      },
    });

    if (role === 'PATIENT') {
      await tx.patientProfile.create({
        data: {
          userId: newUser.id,
          name,
          phone: phone || null,
        },
      });
    } else if (role === 'DOCTOR') {
      await tx.doctorProfile.create({
        data: {
          userId: newUser.id,
          name,
          phone: phone || null,
        },
      });
    }

    return newUser;
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({ id: user.id });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

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
};

// ============ LOGIN ============
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

  if (!user.isEmailVerified) {
    throw new Error('Please verify your email first');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({ id: user.id });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Get profile info
  let profileName = user.email;
  if (user.role === 'PATIENT' && user.patientProfile) {
    profileName = user.patientProfile.name;
  } else if (user.role === 'DOCTOR' && user.doctorProfile) {
    profileName = user.doctorProfile.name;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: profileName,
      profileImage: user.profileImage,
    },
    token,
    refreshToken,
  };
};

// ============ REFRESH TOKEN ============
export const refreshTokenService = async (refreshToken: string) => {
  try {
    // verifyRefreshToken will throw if invalid; no need to keep the returned value
    verifyRefreshToken(refreshToken);
    
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    // Delete old refresh token
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Generate new tokens
    const newToken = generateToken({
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    const newRefreshToken = generateRefreshToken({ id: storedToken.user.id });

    await prisma.refreshToken.create({
      data: {
        userId: storedToken.user.id,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      token: newToken,
      refreshToken: newRefreshToken,
    };
  } catch {
    throw new Error('Invalid refresh token');
  }
};

// ============ LOGOUT ============
export const logoutUser = async (userId: string) => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
  
  // Session table থাকলে
  // await prisma.session.deleteMany({
  //   where: { userId },
  // });
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

  let profile = null;
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