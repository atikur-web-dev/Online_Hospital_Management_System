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

// ============================================================
// UPDATE DEPARTMENT
// ============================================================

type DepartmentParams = {
  departmentId: string;
};

export const updateDepartment = async (
  req: Request<DepartmentParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { departmentId } = req.params;

    if (!departmentId || Array.isArray(departmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department id.",
      });
    }

    const { name, description } = req.body ?? {};

    if (name !== undefined && typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Department name must be a string.",
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Department description must be a string.",
      });
    }

    const department =
      await departmentService.updateDepartment(
        departmentId,
        {
          name,
          description,
        },
      );

    return res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      data: department,
    });
  } catch (error) {
    return next(error);
  }
};