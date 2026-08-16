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
      dp.consultation_fee AS "consultationFee", 
      dp.is_available AS "isAvailable", 
      dp.created_at AS "createdAt",

      u.id AS "userId", 
      u.email, 
      u.is_active AS "isActive", 
      u.is_email_verified AS "isEmailVerified", 
      u.profile_image AS "profileImage", 
      u.last_login AS "lastLogin", 
      u.created_at AS "userCreatedAt",

      d.id AS "departmentId", 
      d.name AS "departmentName"

    FROM doctor_profiles dp

    INNER JOIN users u
      ON u.id = dp.user_id

    LEFT JOIN departments d
      ON d.id = dp.department_id

    WHERE u.role = 'DOCTOR'

    ORDER BY dp.created_at DESC;
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
          AND is_active = TRUE
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
        is_active,
        is_email_verified,
        profile_image,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        $3,
        'DOCTOR',
        TRUE,
        FALSE,
        $4,
        NOW(),
        NOW()
      )
      RETURNING
        id,
        email,
        role,
        is_active AS "isActive",
        is_email_verified AS "isEmailVerified",
        profile_image AS "profileImage",
        created_at AS "createdAt";
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

    const doctorProfileId = `doctor_profile_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    // ----------------------------------------------------------
    // INSERT DOCTOR PROFILE
    // ----------------------------------------------------------

    const insertDoctorQuery = `
      INSERT INTO doctor_profiles (
        id,
        user_id,
        name,
        phone,
        department_id,
        specialization,
        qualification,
        experience,
        consultation_fee,
        is_available,
        created_at,
        updated_at
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
        user_id AS "userId",
        name,
        phone,
        department_id AS "departmentId",
        specialization,
        qualification,
        experience,
        consultation_fee AS "consultationFee",
        is_available AS "isAvailable",
        created_at AS "createdAt";
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