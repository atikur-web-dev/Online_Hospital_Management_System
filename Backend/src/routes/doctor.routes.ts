// Backend/src/routes/doctor.routes.ts
import { Router } from "express";
import {
  getAllDoctors,
  getDoctor,
  getDashboard,
} from "../controller/user_controller/doctor.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Public
router.get("/", getAllDoctors);
router.get("/:id", getDoctor);

// Doctor Dashboard
router.get("/dashboard", authenticate, getDashboard);

export default router;