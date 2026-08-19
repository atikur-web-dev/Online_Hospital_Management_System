// Backend/src/controller/admin_controller/dashboard.controller.ts
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as dashboardService from "../../services/Admin/dashboard.service.js";


// ADMIN DASHBOARD
export const getDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dashboard =
      await dashboardService.getDashboard();

    return res.status(200).json({
      success: true,
      message: "Admin dashboard fetched successfully.",
      data: dashboard,
    });
  } catch (error) {
    return next(error);
  }
};