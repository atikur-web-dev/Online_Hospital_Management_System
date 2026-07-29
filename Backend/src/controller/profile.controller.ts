// Backend/src/controller/profile.controller.ts
import type { Request, Response } from "express";

import {
  getMyProfile,
  updateMyProfile,
} from "../services/profile.service.js";

/**
 * GET /api/v1/profile/me
 */
export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user!;

    const profile = await getMyProfile(
      user.id,
      user.role
    );

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: profile,
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

/**
 * PATCH /api/v1/profile
 */
export const updateProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user!;

    const profile = await updateMyProfile(
      user.id,
      user.role,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: profile,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};