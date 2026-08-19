import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { isActiveAdmin } from "../middleware/active-admin.middleware.js";


// ADMIN CONTROLLERS
import {
  getDashboard,
} from "../controller/admin_controller/dashboard.controller.js";

import {
  createAdmin,
  getAllAdmins,
  toggleAdminStatus,
  deleteAdmin,
} from "../controller/admin_controller/admin.controller.js";


// PATIENT CONTROLLERS
import {
  getAllPatients,
  deletePatient,
} from "../controller/admin_controller/patient.controller.js";


// DOCTOR CONTROLLERS
import {
  getAllDoctors,
  createDoctor,
  updateDoctor,
  toggleDoctorStatus,
  deleteDoctor,
} from "../controller/admin_controller/doctor.controller.js";


// DEPARTMENT CONTROLLERS
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  toggleDepartmentStatus,
} from "../controller/admin_controller/department.controller.js";


// PAYMENT CONTROLLERS
import {
  getAllPayments,
} from "../controller/admin_controller/payment.controller.js";

const router = Router();


// ADMIN AUTHORIZATION
router.use(authenticate, isAdmin, isActiveAdmin);

// ADMIN DASHBOARD
router.get("/dashboard", getDashboard);

// MANAGE PATIENTS
router.get("/patients", getAllPatients);
router.delete("/patients/:patientId", deletePatient);

// MANAGE DOCTORS
router.get("/doctors", getAllDoctors);
router.post("/doctors", createDoctor);
router.patch("/doctors/:doctorId", updateDoctor);
router.patch("/doctors/:doctorId/toggle", toggleDoctorStatus);
router.delete("/doctors/:doctorId", deleteDoctor);

// MANAGE DEPARTMENTS
router.get("/departments", getAllDepartments);
router.post("/departments", createDepartment);
router.patch("/departments/:departmentId", updateDepartment);
router.patch(
  "/departments/:departmentId/toggle",
  toggleDepartmentStatus,
);

// MANAGE PAYMENTS
router.get("/payments", getAllPayments);

// MANAGE ADMINS
router.get("/", getAllAdmins);
router.post("/", createAdmin);
router.patch("/:adminId/toggle", toggleAdminStatus);
router.delete("/:adminId", deleteAdmin);



export default router;