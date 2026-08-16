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