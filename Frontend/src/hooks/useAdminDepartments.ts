//Frontend/src/hooks/useAdminDepartments.ts
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  toggleDepartmentStatus,
  type AdminDepartment,
  type CreateDepartmentPayload,
  type UpdateDepartmentPayload,
} from "../api/admin.api";

const useAdminDepartments = () => {
  const [departments, setDepartments] = useState<
    AdminDepartment[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // FETCH DEPARTMENTS
  // ============================================================

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllDepartments();

      setDepartments(response.data);
    } catch (err: any) {
      console.error(
        "Failed to fetch admin departments:",
        err,
      );

      setError(
        err?.response?.data?.message ??
          "Failed to load departments.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // CREATE DEPARTMENT
  // ============================================================

  const addDepartment = useCallback(
    async (
      data: CreateDepartmentPayload,
    ) => {
      try {
        const response =
          await createDepartment(data);

        setDepartments((prev) => [
          response.data,
          ...prev,
        ]);

        return response.data;
      } catch (err: any) {
        console.error(
          "Failed to create department:",
          err,
        );

        throw err;
      }
    },
    [],
  );

  // ============================================================
  // UPDATE DEPARTMENT
  // ============================================================

  const editDepartment = useCallback(
    async (
      departmentId: string,
      data: UpdateDepartmentPayload,
    ) => {
      try {
        const response =
          await updateDepartment(
            departmentId,
            data,
          );

        setDepartments((prev) =>
          prev.map((department) =>
            department.id === departmentId
              ? response.data
              : department,
          ),
        );

        return response.data;
      } catch (err: any) {
        console.error(
          "Failed to update department:",
          err,
        );

        throw err;
      }
    },
    [],
  );

  // ============================================================
  // TOGGLE DEPARTMENT STATUS
  // ============================================================

  const toggleStatus = useCallback(
    async (departmentId: string) => {
      try {
        const response =
          await toggleDepartmentStatus(
            departmentId,
          );

        setDepartments((prev) =>
          prev.map((department) =>
            department.id === departmentId
              ? response.data
              : department,
          ),
        );

        return response.data;
      } catch (err: any) {
        console.error(
          "Failed to toggle department status:",
          err,
        );

        throw err;
      }
    },
    [],
  );

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // ============================================================
  // RETURN
  // ============================================================

  return {
    departments,
    loading,
    error,

    fetchDepartments,
    addDepartment,
    editDepartment,
    toggleStatus,
  };
};

export default useAdminDepartments;