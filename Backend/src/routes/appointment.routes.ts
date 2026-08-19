// Backend/src/routes/appointment.routes.ts

import { Router } from "express";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

import * as appointmentController from "../controller/user_controller/appointment.controller.js";

const router = Router();

// Create Appointment
router.post(
  "/",
  authenticate,
  authorize("PATIENT"),
  appointmentController.createAppointment,
);

// Get My Appointments
router.get(
  "/my",
  authenticate,
  authorize("PATIENT"),
  appointmentController.getMyAppointments,
);

// Get Doctor Booked Appointments
router.get(
  "/doctor/:doctorId/booked",
  appointmentController.getDoctorBookedAppointments,
);

// Cancel Appointment
router.patch(
  "/:id/cancel",
  authenticate,
  authorize("PATIENT"),
  appointmentController.cancelAppointment,
);

// Delete Appointment For Patient
router.patch(
  "/:id/delete",
  authenticate,
  authorize("PATIENT"),
  appointmentController.deleteAppointmentForPatient,
);

export default router;