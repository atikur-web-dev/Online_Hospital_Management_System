import type { Request, Response } from 'express';
import prisma from '../../lib/prisma.js';
import { hashPassword } from '../../utils/bcrypt.js';

type AdminParams = {
  adminId: string;
};

// ============ CREATE NEW ADMIN ============
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const hashedPassword = await hashPassword(password);

    const admin = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'ADMIN',
          isEmailVerified: true,
          isActive: true,
        },
      });

      await tx.adminProfile.create({
        data: {
          userId: newUser.id,
          name: name || email.split('@')[0],
          phone: phone || null,
          permissions: [
            'MANAGE_USERS',
            'MANAGE_DOCTORS',
            'MANAGE_PATIENTS',
            'MANAGE_APPOINTMENTS',
            'MANAGE_PAYMENTS',
            'VIEW_ANALYTICS',
          ],
        },
      });

      return newUser;
    });

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      message: message || 'Failed to create admin',
    });
  }
};

// ============ GET ALL ADMINS ============
export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        adminProfile: {
          select: {
            name: true,
            phone: true,
            permissions: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      data: admins,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      message: message || 'Failed to get admins',
    });
  }
};

// ============ TOGGLE ADMIN STATUS ============
export const toggleAdminStatus = async (
  req: Request<AdminParams>,
  res: Response,
) => {
  try {
    const adminId = req.params.adminId;

    const admin = await prisma.user.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin || admin.role !== 'ADMIN') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    if (admin.email === 'atikuradmin@gmail.com') {
      return res.status(403).json({
        success: false,
        message: 'Cannot deactivate the main admin account',
      });
    }

    const updatedAdmin = await prisma.user.update({
      where: {
        id: adminId,
      },
      data: {
        isActive: !admin.isActive,
      },
    });

    return res.json({
      success: true,
      message: `Admin ${
        updatedAdmin.isActive ? 'activated' : 'deactivated'
      } successfully`,
      data: {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        isActive: updatedAdmin.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to toggle admin status',
    });
  }
};

// ============ DELETE ADMIN ============
export const deleteAdmin = async (req: Request<AdminParams>, res: Response) => {
  try {
    const adminId = req.params.adminId;

    const admin = await prisma.user.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin || admin.role !== 'ADMIN') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    if (admin.email === 'atikuradmin@gmail.com') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete the main admin account',
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.adminProfile.delete({
        where: {
          userId: adminId,
        },
      });

      await tx.user.delete({
        where: {
          id: adminId,
        },
      });
    });

    return res.json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to delete admin',
    });
  }
};
