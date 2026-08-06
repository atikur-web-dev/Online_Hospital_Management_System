// Backend/src/routes/prescription.routes.ts
import { Router } from "express";

import {
  createPrescription,
  getPrescription,
} from "../controller/doctor_controller/prescription.controller.js";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

/**
 * Doctor Only Routes
 */

// Create Prescription
router.post(
  "/",
  authenticate,
  authorize("DOCTOR"),
  createPrescription,
);

// Get Prescription By ID
router.get(
  "/:id",
  authenticate,
  authorize("DOCTOR"),
  getPrescription,
);

export default router;