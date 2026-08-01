// Backend/src/validators/appointment.validator.ts
import { z } from "zod";

export const createAppointmentSchema = z.object({
  doctorId: z
    .string()
    .trim()
    .min(1, "Doctor ID is required"),

  appointmentAt: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.coerce.date()
  ).refine(
    (date) => date > new Date(),
    {
      message: "Appointment must be scheduled in the future",
    }
  ),

  problem: z
    .string()
    .trim()
    .max(500, "Problem must be under 500 characters")
    .optional(),
});

export type CreateAppointmentInput =
  z.infer<typeof createAppointmentSchema>;