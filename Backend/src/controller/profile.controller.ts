// Backend/src/controller/profile.controller.ts
import type { Request, Response } from "express";

import {
  getMyProfile,
  updateMyProfile,
  uploadMyProfileImage,
} from "../services/profile.service.js";

// Get Logged In User Profile
export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const profile = await getMyProfile(
      req.user!.id,
      req.user!.role
    );

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: profile,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

// Update Logged In User Profile
export const updateProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const profile = await updateMyProfile(
      req.user!.id,
      req.user!.role,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: profile,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

// Upload Profile Image
export const uploadProfileImage = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const user = await uploadMyProfileImage(
      req.user!.id,
      req.file
    );

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully.",
      data: {
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload profile image.",
    });
  }
};