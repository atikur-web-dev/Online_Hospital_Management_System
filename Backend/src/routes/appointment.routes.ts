// Backend/src/routes/appointment.routes.ts
import { Router } from "express";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

import * as appointmentController from "../controller/user_controller/appointment.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("PATIENT"),
  appointmentController.createAppointment,
);

export default router;