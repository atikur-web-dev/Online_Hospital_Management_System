// Backend/src/routes/doctorSchedule.routes.ts
// Backend/src/routes/doctorSchedule.routes.ts

import { Router } from "express";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

import * as doctorScheduleController from "../controller/doctor_controller/doctorSchedule.controller.js";

const router = Router();

/**
 * Get logged-in doctor's schedule
 * GET /api/doctor-schedule
 */
router.get(
  "/",
  authenticate,
  authorize("DOCTOR"),
  doctorScheduleController.getMySchedule,
);

/**
 * Update logged-in doctor's schedule
 * PUT /api/doctor-schedule
 */
router.put(
  "/",
  authenticate,
  authorize("DOCTOR"),
  doctorScheduleController.updateMySchedule,
);

/**
 * Update doctor availability
 * PATCH /api/doctor-schedule/availability
 */
router.patch(
  "/availability",
  authenticate,
  authorize("DOCTOR"),
  doctorScheduleController.updateAvailability,
);

export default router;