// Backend/src/services/Admin/admin.service.ts
import prisma from "../../lib/prisma.js";
import { hashPassword } from "../../utils/bcrypt.js";

interface CreateAdminData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export const createAdmin = async ({
  email,
  password,
  name,
  phone,
}: CreateAdminData) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await hashPassword(password);
  const adminName = name?.trim() || email.split("@")[0] || "Admin";

  const admin = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ADMIN",
        isEmailVerified: true,
        isActive: true,
      },
    });

    await tx.adminProfile.create({
      data: {
        userId: newUser.id,
        name: adminName,
        phone: phone ?? null,
        permissions: [
          "MANAGE_USERS",
          "MANAGE_DOCTORS",
          "MANAGE_PATIENTS",
          "MANAGE_APPOINTMENTS",
          "MANAGE_PAYMENTS",
          "VIEW_ANALYTICS",
        ],
      },
    });

    return newUser;
  });

  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  };
};

export const getAllAdmins = async () => {
  return prisma.user.findMany({
    where: {
      role: "ADMIN",
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
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const toggleAdminStatus = async (adminId: string) => {
  const admin = await prisma.user.findUnique({
    where: {
      id: adminId,
    },
  });

  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Admin not found");
  }

  if (admin.email === "atikuradmin@gmail.com") {
    throw new Error(
      "Cannot deactivate the main admin account",
    );
  }

  const updatedAdmin = await prisma.user.update({
    where: {
      id: adminId,
    },
    data: {
      isActive: !admin.isActive,
    },
  });

  return {
    id: updatedAdmin.id,
    email: updatedAdmin.email,
    isActive: updatedAdmin.isActive,
  };
};

export const deleteAdmin = async (adminId: string) => {
  const admin = await prisma.user.findUnique({
    where: {
      id: adminId,
    },
  });

  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Admin not found");
  }

  if (admin.email === "atikuradmin@gmail.com") {
    throw new Error(
      "Cannot delete the main admin account",
    );
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
};

