import { Router } from "express";

import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../controller/profile.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

/**
 * GET /api/v1/profile/me
 * Get Logged In User Profile
 */
router.get(
  "/me",
  authenticate,
  getProfile
);

/**
 * PATCH /api/v1/profile/me
 * Update Logged In User Profile
 */
router.patch(
  "/me",
  authenticate,
  updateProfile
);

/**
 * PATCH /api/v1/profile/me/avatar
 * Upload Profile Image
 */
router.patch(
  "/me/avatar",
  authenticate,
  upload.single("image"),
  uploadProfileImage
);

export default router;