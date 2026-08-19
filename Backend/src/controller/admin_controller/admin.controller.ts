// Backend/src/controller/admin_controller/admin.controller.ts
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as adminService from "../../services/Admin/admin.service.js";

type AdminParams = {
  adminId: string;
};


// CREATE NEW ADMIN
export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      email,
      password,
      name,
      phone,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const admin = await adminService.createAdmin({
      email,
      password,
      name,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      data: admin,
    });
  } catch (error) {
    return next(error);
  }
};


// GET ALL ADMINS
export const getAllAdmins = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admins = await adminService.getAllAdmins();

    return res.status(200).json({
      success: true,
      message: "Admins fetched successfully.",
      data: admins,
    });
  } catch (error) {
    return next(error);
  }
};


// TOGGLE ADMIN STATUS
export const toggleAdminStatus = async (
  req: Request<AdminParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { adminId } = req.params;

    if (!adminId || Array.isArray(adminId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin id.",
      });
    }

    const admin =
      await adminService.toggleAdminStatus(adminId);

    return res.status(200).json({
      success: true,
      message: `Admin ${
        admin.isActive
          ? "activated"
          : "deactivated"
      } successfully.`,
      data: admin,
    });
  } catch (error) {
    return next(error);
  }
};


// DELETE ADMIN
export const deleteAdmin = async (
  req: Request<AdminParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { adminId } = req.params;

    if (!adminId || Array.isArray(adminId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin id.",
      });
    }

    await adminService.deleteAdmin(adminId);

    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};