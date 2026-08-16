// Backend/src/services/Admin/patient.service.ts
import pool from "../../config/database.js";

export const getAllPatients = async () => {
  const query = `
    SELECT
      pp.id,
      pp.name,
      pp.phone,
      pp."dateOfBirth",
      pp.gender,
      pp.address,
      pp."createdAt",

      u.id AS "userId",
      u.email,
      u."isActive",
      u."isEmailVerified",
      u."profileImage",
      u."lastLogin",
      u."createdAt" AS "userCreatedAt"

    FROM patient_profiles pp

    INNER JOIN users u
      ON u.id = pp."userId"

    WHERE u.role::text = 'PATIENT'

    ORDER BY pp."createdAt" DESC
  `;

  const result = await pool.query(query);

  return result.rows;
};