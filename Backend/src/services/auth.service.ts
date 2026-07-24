// Backend/src/services/auth.service.ts
import prisma from '../lib/prisma.js';
// import type { PatientProfile, DoctorProfile, AdminProfile } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import type { RegisterInput, LoginInput } from '../validators/auth.validator.js';

// ============ REGISTER ============
export const registerUser = async (data: RegisterInput) => {
  const { email, password, name, role, phone } = data;

  console.log('📝 1. Starting registration...');
  console.log('📝 2. Data:', { email, name, role, phone });

  // Check if prisma is working
  console.log('📝 3. Checking prisma object:', typeof prisma);
  console.log('📝 4. Prisma models:', Object.keys(prisma).filter(k => !k.startsWith('_')));

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  console.log('📝 5. Existing user check:', existingUser ? 'Found' : 'Not found');

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);
  console.log('📝 6. Password hashed');

  try {
    const user = await prisma.$transaction(async (tx) => {
      console.log('📝 7. Transaction started');
      console.log('📝 8. Available models in tx:', Object.keys(tx).filter(k => !k.startsWith('_')));

      // 1. Create User
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          isEmailVerified: true,
        },
      });

      console.log('📝 9. User created:', newUser.id);

      // 2. Create Profile based on role
      if (role === 'PATIENT') {
        console.log('📝 10. Creating Patient Profile...');
        console.log('📝 11. Does tx.patientProfile exist?', !!tx.patientProfile);
        
        if (tx.patientProfile) {
          await tx.patientProfile.create({
            data: {
              userId: newUser.id,
              name,
              phone: phone || null,
            },
          });
          console.log('📝 12. Patient Profile created');
        } else {
          console.error('❌ tx.patientProfile is undefined!');
          throw new Error('patientProfile model not found in Prisma schema');
        }
      } 
      else if (role === 'DOCTOR') {
        console.log('📝 10. Creating Doctor Profile...');
        console.log('📝 11. Does tx.doctorProfile exist?', !!tx.doctorProfile);
        
        if (tx.doctorProfile) {
          await tx.doctorProfile.create({
            data: {
              userId: newUser.id,
              name,
              phone: phone || null,
            },
          });
          console.log('📝 12. Doctor Profile created');
        } else {
          console.error('❌ tx.doctorProfile is undefined!');
          throw new Error('doctorProfile model not found in Prisma schema');
        }
      }
      else if (role === 'ADMIN') {
        console.log('📝 10. Creating Admin Profile...');
        console.log('📝 11. Does tx.adminProfile exist?', !!tx.adminProfile);
        
        if (tx.adminProfile) {
          await tx.adminProfile.create({
            data: {
              userId: newUser.id,
              name,
              phone: phone || null,
              permissions: ['MANAGE_USERS', 'VIEW_ANALYTICS'],
            },
          });
          console.log('📝 12. Admin Profile created');
        } else {
          console.error('❌ tx.adminProfile is undefined!');
          throw new Error('adminProfile model not found in Prisma schema');
        }
      }

      return newUser;
    });

    console.log('📝 13. Transaction completed!');

    // Generate tokens
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

    console.log('📝 14. Tokens generated!');

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Error in transaction:', error);
    // Preserve the original caught error as the cause for better debugging
    throw new Error(message || 'Registration failed', { cause: error });
  }
};


// ============ LOGIN ============
export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  console.log('📝 1. Login attempt for:', email);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      patientProfile: true,
      doctorProfile: true,
      adminProfile: true,
    },
  });

  console.log('📝 2. User found:', user ? 'Yes' : 'No');

  if (!user) {
    console.log('❌ User not found');
    throw new Error('Invalid credentials');
  }

  console.log('📝 3. Has password:', user.password ? 'Yes' : 'No');

  if (!user.password) {
    console.log('❌ No password (Google user)');
    throw new Error('Please login with Google');
  }

  console.log('📝 4. Comparing password...');
  const isValid = await comparePassword(password, user.password);
  console.log('📝 5. Password valid:', isValid);

  if (!isValid) {
    console.log('❌ Invalid password');
    throw new Error('Invalid credentials');
  }

  console.log('📝 6. Email verified:', user.isEmailVerified);

  if (!user.isEmailVerified) {
    console.log('❌ Email not verified');
    throw new Error('Please verify your email first');
  }

  console.log('📝 7. Updating last login...');
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  console.log('📝 8. Generating tokens...');
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({ id: user.id });

  console.log('📝 9. Saving refresh token...');
  
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('📝 10. Getting profile info...');
  // Get profile info
  let profileName = user.email;
  if (user.role === 'PATIENT' && user.patientProfile) {
    profileName = user.patientProfile.name;
  } else if (user.role === 'DOCTOR' && user.doctorProfile) {
    profileName = user.doctorProfile.name;
  }

  console.log('Login successful!');
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
      throw new Error("Refresh token not found");
    }

    // Check token expiry
    if (storedToken.expiresAt <= new Date()) {
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      throw new Error("Refresh token has expired");
    }

    // Extra security: Ensure JWT belongs to the same user
    if (storedToken.user.id !== payload.id) {
      throw new Error("Invalid refresh token");
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
    throw new Error("Invalid or expired refresh token");
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