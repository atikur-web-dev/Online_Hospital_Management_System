// Backend/src/routes/profile.routes.ts
import { Router } from "express";

import {
  getProfile,
  updateProfile,
} from "../controller/profile.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET /api/v1/profile/me
 */
router.get(
  "/me",
  authenticate,
  getProfile
);

/**
 * PATCH /api/v1/profile
 */
router.patch(
  "/",
  authenticate,
  updateProfile
);

export default router;