// Backend/src/controller/admin_controller/department.controller.ts

import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as departmentService from "../../services/Admin/department.service.js";

// ============================================================
// GET ALL DEPARTMENTS
// ============================================================

export const getAllDepartments = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const departments =
      await departmentService.getAllDepartments();

    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully.",
      data: departments,
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// CREATE DEPARTMENT
// ============================================================

export const createDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Department name is required.",
      });
    }

    const department =
      await departmentService.createDepartment({
        name,
        description,
      });

    return res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: department,
    });
  } catch (error) {
    return next(error);
  }
};