// Backend/src/routes/doctor.routes.ts
import { Router } from "express";

import * as doctorController from "../controller/user_controller/doctor.controller.js";

const router = Router();

/**
 * Get All Doctors
 * GET /api/v1/doctors
 */
router.get("/", doctorController.getAllDoctors);

export default router;