// Backend/src/routes/doctorAppointment.routes.ts
import { Router } from "express";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

import * as appointmentController from "../controller/doctor_controller/appointment.controller.js";


const router = Router();

router.get(
  "/",
  authenticate,
  authorize("DOCTOR"),
  appointmentController.getMyAppointments,
);

router.patch(
  "/:id/confirm",
  authenticate,
  authorize("DOCTOR"),
  appointmentController.confirmAppointment,
);

router.patch(
  "/:id/complete",
  authenticate,
  authorize("DOCTOR"),
  appointmentController.completeAppointment,
);

router.patch(
  "/:id/cancel",
  authenticate,
  authorize("DOCTOR"),
  appointmentController.cancelAppointment,
);

export default router;