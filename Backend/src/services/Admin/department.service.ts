// Backend/src/services/Admin/department.service.ts
// Backend/src/services/Admin/department.service.ts

import pool from "../../config/database.js";

// ============================================================
// GET ALL DEPARTMENTS
// ============================================================

export const getAllDepartments = async () => {
  const query = `
    SELECT
      d.id,
      d.name,
      d.description,
      d."isActive" AS "isActive",
      d."createdAt" AS "createdAt",
      d."updatedAt" AS "updatedAt",

      COUNT(dp.id)::int AS "doctorCount"

    FROM departments d

    LEFT JOIN doctor_profiles dp
      ON dp."departmentId" = d.id

    GROUP BY
      d.id,
      d.name,
      d.description,
      d."isActive",
      d."createdAt",
      d."updatedAt"

    ORDER BY d."createdAt" DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

// ============================================================
// CREATE DEPARTMENT
// ============================================================

export interface CreateDepartmentData {
  name: string;
  description?: string;
}

export const createDepartment = async (
  data: CreateDepartmentData,
) => {
  const name = data.name.trim();
  const description =
    data.description?.trim() || null;

  if (!name) {
    throw new Error("Department name is required.");
  }

  // ----------------------------------------------------------
  // CHECK DUPLICATE DEPARTMENT
  // ----------------------------------------------------------

  const existingQuery = `
    SELECT id
    FROM departments
    WHERE LOWER(name) = LOWER($1)
    LIMIT 1;
  `;

  const existingResult = await pool.query(
    existingQuery,
    [name],
  );

  if (existingResult.rows.length > 0) {
    throw new Error(
      "A department already exists with this name.",
    );
  }

  // ----------------------------------------------------------
  // GENERATE ID
  // ----------------------------------------------------------

  const departmentId = `department_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 10)}`;

  // ----------------------------------------------------------
  // INSERT DEPARTMENT
  // ----------------------------------------------------------

  const insertQuery = `
    INSERT INTO departments (
      id,
      name,
      description,
      "isActive",
      "createdAt",
      "updatedAt"
    )
    VALUES (
      $1,
      $2,
      $3,
      TRUE,
      NOW(),
      NOW()
    )
    RETURNING
      id,
      name,
      description,
      "isActive" AS "isActive",
      "createdAt" AS "createdAt",
      "updatedAt" AS "updatedAt";
  `;

  const result = await pool.query(
    insertQuery,
    [
      departmentId,
      name,
      description,
    ],
  );

  return result.rows[0];
};