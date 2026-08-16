// Backend/src/routes/admin.routes.ts

import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

// Admin Controllers
import {
  getDashboard,
} from "../controller/admin_controller/dashboard.controller.js";

import {
  createAdmin,
  getAllAdmins,
  toggleAdminStatus,
  deleteAdmin,
} from "../controller/admin_controller/admin.controller.js";

// Patient Controllers
import {
  getAllPatients,
} from "../controller/admin_controller/patient.controller.js";

// Doctor Controllers
import {
  getAllDoctors,
  createDoctor,
  deleteDoctor,
} from "../controller/admin_controller/doctor.controller.js";

const router = Router();

// ============================================================
// ADMIN AUTHORIZATION
// ============================================================

router.use(authenticate, isAdmin);

// ============================================================
// ADMIN DASHBOARD
// ============================================================

router.get("/dashboard", getDashboard);

// ============================================================
// MANAGE PATIENTS
// ============================================================

router.get("/patients", getAllPatients);

// ============================================================
// MANAGE DOCTORS
// ============================================================

router.get("/doctors", getAllDoctors);

router.post("/doctors", createDoctor);

router.delete("/doctors/:doctorId", deleteDoctor);

// ============================================================
// MANAGE ADMINS
// ============================================================

router.get("/", getAllAdmins);

router.post("/", createAdmin);

router.patch(
  "/:adminId/toggle",
  toggleAdminStatus,
);

router.delete(
  "/:adminId",
  deleteAdmin,
);

export default router;