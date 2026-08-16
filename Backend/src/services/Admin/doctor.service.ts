// Backend/src/services/Admin/doctor.service.ts

import pool from "../../config/database.js";
import { hashPassword } from "../../utils/bcrypt.js";

// ============================================================
// GET ALL DOCTORS
// ============================================================

export const getAllDoctors = async () => {
  const query = `
    SELECT
      dp.id,
      dp.name,
      dp.phone,
      dp.specialization,
      dp.qualification,
      dp.experience,
      dp."consultationFee" AS "consultationFee",
      dp."isAvailable" AS "isAvailable",
      dp."createdAt" AS "createdAt",

      u.id AS "userId",
      u.email,
      u."isActive" AS "isActive",
      u."isEmailVerified" AS "isEmailVerified",
      u."profileImage" AS "profileImage",
      u."lastLogin" AS "lastLogin",
      u."createdAt" AS "userCreatedAt",

      d.id AS "departmentId",
      d.name AS "departmentName"

    FROM doctor_profiles dp

    INNER JOIN users u
      ON u.id = dp."userId"

    LEFT JOIN departments d
      ON d.id = dp."departmentId"

    WHERE u.role = 'DOCTOR'

    ORDER BY dp."createdAt" DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

// ============================================================
// CREATE NEW DOCTOR
// ============================================================

export interface CreateDoctorData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  departmentId?: string;
  specialization?: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  profileImage?: string;
}

export const createDoctor = async (
  data: CreateDoctorData,
) => {
  const client = await pool.connect();

  try {
    // ----------------------------------------------------------
    // START TRANSACTION
    // ----------------------------------------------------------

    await client.query("BEGIN");

    // ----------------------------------------------------------
    // NORMALIZE INPUT
    // ----------------------------------------------------------

    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();

    // ----------------------------------------------------------
    // CHECK REQUIRED FIELDS
    // ----------------------------------------------------------

    if (!email || !data.password || !name) {
      throw new Error(
        "Email, password and name are required.",
      );
    }

    // ----------------------------------------------------------
    // CHECK DUPLICATE EMAIL
    // ----------------------------------------------------------

    const existingUserQuery = `
      SELECT id
      FROM users
      WHERE email = $1
      LIMIT 1;
    `;

    const existingUserResult = await client.query(
      existingUserQuery,
      [email],
    );

    if (existingUserResult.rows.length > 0) {
      throw new Error(
        "A user already exists with this email.",
      );
    }

    // ----------------------------------------------------------
    // CHECK DEPARTMENT
    // ----------------------------------------------------------

    if (data.departmentId) {
      const departmentQuery = `
        SELECT id
        FROM departments
        WHERE id = $1
          AND "isActive" = TRUE
        LIMIT 1;
      `;

      const departmentResult = await client.query(
        departmentQuery,
        [data.departmentId],
      );

      if (departmentResult.rows.length === 0) {
        throw new Error(
          "Selected department does not exist or is inactive.",
        );
      }
    }

    // ----------------------------------------------------------
    // HASH PASSWORD
    // ----------------------------------------------------------

    const hashedPassword = await hashPassword(
      data.password,
    );

    // ----------------------------------------------------------
    // GENERATE USER ID
    // ----------------------------------------------------------

    const userId = `doctor_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    // ----------------------------------------------------------
    // INSERT USER
    // ----------------------------------------------------------

    const insertUserQuery = `
      INSERT INTO users (
        id,
        email,
        password,
        role,
        "isActive",
        "isEmailVerified",
        "profileImage",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        $1,
        $2,
        $3,
        'DOCTOR',
        TRUE,
        TRUE,
        $4,
        NOW(),
        NOW()
      )
      RETURNING
        id,
        email,
        role,
        "isActive" AS "isActive",
        "isEmailVerified" AS "isEmailVerified",
        "profileImage" AS "profileImage",
        "createdAt" AS "createdAt";
    `;

    const userResult = await client.query(
      insertUserQuery,
      [
        userId,
        email,
        hashedPassword,
        data.profileImage?.trim() || null,
      ],
    );

    const newUser = userResult.rows[0];

    // ----------------------------------------------------------
    // GENERATE DOCTOR PROFILE ID
    // ----------------------------------------------------------

    const doctorProfileId =
      `doctor_profile_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 10)}`;

    // ----------------------------------------------------------
    // INSERT DOCTOR PROFILE
    // ----------------------------------------------------------

    const insertDoctorQuery = `
      INSERT INTO doctor_profiles (
        id,
        "userId",
        name,
        phone,
        "departmentId",
        specialization,
        qualification,
        experience,
        "consultationFee",
        "isAvailable",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        TRUE,
        NOW(),
        NOW()
      )
      RETURNING
        id,
        "userId" AS "userId",
        name,
        phone,
        "departmentId" AS "departmentId",
        specialization,
        qualification,
        experience,
        "consultationFee" AS "consultationFee",
        "isAvailable" AS "isAvailable",
        "createdAt" AS "createdAt";
    `;

    const doctorResult = await client.query(
      insertDoctorQuery,
      [
        doctorProfileId,
        userId,
        name,
        data.phone?.trim() || null,
        data.departmentId || null,
        data.specialization?.trim() || null,
        data.qualification?.trim() || null,
        data.experience ?? null,
        data.consultationFee ?? null,
      ],
    );

    const doctorProfile = doctorResult.rows[0];

    // ----------------------------------------------------------
    // COMMIT TRANSACTION
    // ----------------------------------------------------------

    await client.query("COMMIT");

    // ----------------------------------------------------------
    // RETURN CREATED DOCTOR
    // ----------------------------------------------------------

    return {
      user: newUser,
      doctor: doctorProfile,
    };
  } catch (error) {
    // ----------------------------------------------------------
    // ROLLBACK
    // ----------------------------------------------------------

    await client.query("ROLLBACK");

    throw error;
  } finally {
    // ----------------------------------------------------------
    // RELEASE CONNECTION
    // ----------------------------------------------------------

    client.release();
  }
};

// ============================================================
// DELETE / DEACTIVATE DOCTOR
// ============================================================

export const deleteDoctor = async (doctorId: string) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ----------------------------------------------------------
    // FIND DOCTOR
    // ----------------------------------------------------------

    const doctorQuery = `
      SELECT
        dp.id,
        dp."userId" AS "userId",
        u.email,
        u."isActive" AS "isActive"
      FROM doctor_profiles dp
      INNER JOIN users u
        ON u.id = dp."userId"
      WHERE dp.id = $1
        AND u.role = 'DOCTOR'
      LIMIT 1;
    `;

    const doctorResult = await client.query(
      doctorQuery,
      [doctorId],
    );

    if (doctorResult.rows.length === 0) {
      throw new Error("Doctor not found.");
    }

    const doctor = doctorResult.rows[0];

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
      [doctor.userId],
    );

    // ----------------------------------------------------------
    // MAKE DOCTOR UNAVAILABLE
    // ----------------------------------------------------------

    await client.query(
      `
        UPDATE doctor_profiles
        SET
          "isAvailable" = FALSE,
          "updatedAt" = NOW()
        WHERE id = $1;
      `,
      [doctorId],
    );

    // ----------------------------------------------------------
    // COMMIT
    // ----------------------------------------------------------

    await client.query("COMMIT");

    return {
      id: doctor.id,
      userId: doctor.userId,
      email: doctor.email,
      isActive: false,
      isAvailable: false,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};