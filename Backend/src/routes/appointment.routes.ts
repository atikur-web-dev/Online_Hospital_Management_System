// Backend/src/routes/appointment.routes.ts

import { Router } from "express";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

import * as appointmentController from "../controller/user_controller/appointment.controller.js";

const router = Router();

/**
 * Create Appointment
 * POST /api/v1/appointments
 */
router.post(
  "/",
  authenticate,
  authorize("PATIENT"),
  appointmentController.createAppointment,
);

/**
 * Get My Appointments
 * GET /api/v1/appointments/my
 */
router.get(
  "/my",
  authenticate,
  authorize("PATIENT"),
  appointmentController.getMyAppointments,
);

/**
 * Get Doctor Booked Appointments
 * GET /api/v1/appointments/doctor/:doctorId/booked
 */
router.get(
  "/doctor/:doctorId/booked",
  appointmentController.getDoctorBookedAppointments,
);

/**
 * Cancel Appointment
 * PATCH /api/v1/appointments/:id/cancel
 */
router.patch(
  "/:id/cancel",
  authenticate,
  authorize("PATIENT"),
  appointmentController.cancelAppointment,
);

/**
 * Delete Appointment For Patient
 * PATCH /api/v1/appointments/:id/delete
 */
router.patch(
  "/:id/delete",
  authenticate,
  authorize("PATIENT"),
  appointmentController.deleteAppointmentForPatient,
);

export default router;