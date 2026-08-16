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
  deletePatient,
} from "../controller/admin_controller/patient.controller.js";

// Doctor Controllers
import {
  getAllDoctors,
  createDoctor,
  deleteDoctor,
} from "../controller/admin_controller/doctor.controller.js";

// Department controllers
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  toggleDepartmentStatus,
} from "../controller/admin_controller/department.controller.js";

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
router.delete("/patients/:patientId", deletePatient);

// ============================================================
// MANAGE DOCTORS
// ============================================================

router.get("/doctors", getAllDoctors);

router.post("/doctors", createDoctor);

router.delete("/doctors/:doctorId", deleteDoctor);

// ============================================================
// MANAGE ADMINS
// ============================================================

// ALl departments
router.get("/departments", getAllDepartments);
router.post("/departments", createDepartment);
router.patch("/departments/:departmentId",updateDepartment);
router.patch("/departments/:departmentId/toggle",toggleDepartmentStatus);

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