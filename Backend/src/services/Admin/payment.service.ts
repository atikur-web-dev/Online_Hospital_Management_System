// Backend/src/services/Admin/payment.service.ts

import pool from "../../config/database.js";

// ============================================================
// GET ALL PAYMENTS
// ============================================================

export const getAllPayments = async () => {
  const query = `
    SELECT
      p.id,
      p."appointmentId" AS "appointmentId",
      p."patientId" AS "patientId",
      p."doctorId" AS "doctorId",
      p.amount,
      p.currency,
      p.status,
      p."transactionId" AS "transactionId",
      p."paidAt" AS "paidAt",
      p."createdAt" AS "createdAt",
      p."updatedAt" AS "updatedAt",

      pp.name AS "patientName",
      pu.email AS "patientEmail",

      dp.name AS "doctorName",
      du.email AS "doctorEmail",

      a."appointmentAt" AS "appointmentAt",
      a.status AS "appointmentStatus"

    FROM payments p

    INNER JOIN patient_profiles pp
      ON pp.id = p."patientId"

    INNER JOIN users pu
      ON pu.id = pp."userId"

    INNER JOIN doctor_profiles dp
      ON dp.id = p."doctorId"

    INNER JOIN users du
      ON du.id = dp."userId"

    INNER JOIN appointments a
      ON a.id = p."appointmentId"

    ORDER BY p."createdAt" DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};