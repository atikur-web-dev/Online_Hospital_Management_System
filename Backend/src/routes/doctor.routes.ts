import { Router } from "express";

import {
  getAllDoctors,
  getDoctor,
  getDashboard,
  getMySchedule,
  updateMySchedule,
  updateAvailability,
} from "../controller/user_controller/doctor.controller.js";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = Router();


router.get(
  "/dashboard",
  authenticate,
  authorize("DOCTOR"),
  getDashboard,
);


// Get logged-in doctor's schedule
router.get(
  "/schedule",
  authenticate,
  authorize("DOCTOR"),
  getMySchedule,
);

// Update logged-in doctor's schedule
router.put(
  "/schedule",
  authenticate,
  authorize("DOCTOR"),
  updateMySchedule,
);

// Update logged-in doctor's availability
router.patch(
  "/availability",
  authenticate,
  authorize("DOCTOR"),
  updateAvailability,
);


// Get all doctors
router.get(
  "/",
  getAllDoctors,
);

// Get single doctor
router.get(
  "/:id",
  getDoctor,
);

export default router;