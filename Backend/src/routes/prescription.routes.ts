// Backend/src/routes/prescription.routes.ts
import { Router } from "express";

import {
  createPrescription,
  getPrescription,
  updatePrescription,
} from "../controller/doctor_controller/prescription.controller.js";

import {
  sendPrescriptionEmailController,
} from "../controller/Prescription/prescription.controller.js";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

// ================= Create Prescription =================

router.post(
  "/",
  authenticate,
  authorize("DOCTOR"),
  createPrescription,
);

// ================= Get Prescription By ID =================

router.get(
  "/:id",
  authenticate,
  authorize("DOCTOR"),
  getPrescription,
);

// ================= Update Prescription =================

router.patch(
  "/:id",
  authenticate,
  authorize("DOCTOR"),
  updatePrescription,
);

// ================= Send Prescription To Patient =================

router.post(
  "/:prescriptionId/send-email",
  authenticate,
  authorize("DOCTOR"),
  sendPrescriptionEmailController,
);

export default router;