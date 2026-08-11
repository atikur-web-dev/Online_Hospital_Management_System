// Backend/src/routes/medicalRecord.routes.ts
import { Router } from "express";

import {
  createMedicalHistory,
  getMedicalHistories,
  updateMedicalHistory,
  deleteMedicalHistory,
  uploadMedicalReport,
  getMedicalReports,
  deleteMedicalReport,
  getMyMedicalRecords,
} from "../controller/medical_record_controller/medicalRecord.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();


// ============================================================
// Patient Medical History
// ============================================================

// Create medical history
router.post(
  "/history",
  authenticate,
  createMedicalHistory,
);

// Get all medical histories
router.get(
  "/history",
  authenticate,
  getMedicalHistories,
);

// Update medical history
router.put(
  "/history/:id",
  authenticate,
  updateMedicalHistory,
);

// Delete medical history
router.delete(
  "/history/:id",
  authenticate,
  deleteMedicalHistory,
);


// ============================================================
// Patient Medical Reports
// ============================================================

// Upload medical report
router.post(
  "/reports",
  authenticate,
  upload.single("file"),
  uploadMedicalReport,
);

// Get all medical reports
router.get(
  "/reports",
  authenticate,
  getMedicalReports,
);

// Delete medical report
router.delete(
  "/reports/:id",
  authenticate,
  deleteMedicalReport,
);


// ============================================================
// Get Everything
// ============================================================

router.get(
  "/",
  authenticate,
  getMyMedicalRecords,
);

export default router;