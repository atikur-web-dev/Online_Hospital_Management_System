// Backend/src/routes/payment.routes.ts
import { Router } from "express";

import {
  initiatePaymentController,
  paymentSuccessController,
  paymentFailController,
  paymentCancelController,
  paymentIPNController,
} from "../controller/payment_controller/payment.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/initiate/:appointmentId",
  authenticate,
  initiatePaymentController,
);

router.post(
  "/success",
  paymentSuccessController,
);

router.post(
  "/fail",
  paymentFailController,
);

router.post(
  "/cancel",
  paymentCancelController,
);

router.post(
  "/ipn",
  paymentIPNController,
);

export default router;