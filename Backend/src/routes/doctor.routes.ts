// Backend/src/routes/doctor.routes.ts
import { Router } from "express";
import {
  getAllDoctors,
  getDoctor,
  getDashboard,
} from "../controller/user_controller/doctor.controller.js";

const router = Router();

router.get("/dashboard", getDashboard);

router.get("/", getAllDoctors);

router.get("/:id", getDoctor);

export default router;