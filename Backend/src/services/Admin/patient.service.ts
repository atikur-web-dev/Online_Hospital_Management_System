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

// ============================================================
// DEACTIVATE PATIENT
// ============================================================


export const deletePatient = async (patientId: string) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ----------------------------------------------------------
    // FIND PATIENT
    // ----------------------------------------------------------

    const patientQuery = `
      SELECT
        pp.id,
        pp."userId" AS "userId",
        u.email,
        u."isActive" AS "isActive"
      FROM patient_profiles pp

      INNER JOIN users u
        ON u.id = pp."userId"

      WHERE pp.id = $1
        AND u.role = 'PATIENT'

      LIMIT 1;
    `;

    const patientResult = await client.query(
      patientQuery,
      [patientId],
    );

    if (patientResult.rows.length === 0) {
      throw new Error("Patient not found.");
    }

    const patient = patientResult.rows[0];

    // ----------------------------------------------------------
    // DEACTIVATE USER ACCOUNT
    // ----------------------------------------------------------

    await client.query(
      `
        UPDATE users
        SET
          "isActive" = FALSE,
          "updatedAt" = NOW()
        WHERE id = $1;
      `,
      [patient.userId],
    );

    // ----------------------------------------------------------
    // COMMIT TRANSACTION
    // ----------------------------------------------------------

    await client.query("COMMIT");

    return {
      id: patient.id,
      userId: patient.userId,
      email: patient.email,
      isActive: false,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};