import { Router } from "express";

import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../controller/profile.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

// Get Logged In User Profile
router.get(
  "/me",
  authenticate,
  getProfile
);

// Update Logged In User Profile
router.patch(
  "/me",
  authenticate,
  updateProfile
);

// Upload Profile Image
router.patch(
  "/me/avatar",
  authenticate,
  upload.single("image"),
  uploadProfileImage
);

export default router;