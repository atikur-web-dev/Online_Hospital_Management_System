// Frontend/src/hooks/useDoctors.ts
import { useCallback, useEffect, useState, useRef } from "react";

import { getAllDoctors } from "../api/doctor.api";
import type { DoctorProfile } from "../types/profile.types";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });

  // Use refs to track the current values
  const searchRef = useRef(search);
  const departmentRef = useRef(department);
  const pageRef = useRef(pagination.page);

  // Update refs when state changes
  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    departmentRef.current = department;
  }, [department]);

  useEffect(() => {
    pageRef.current = pagination.page;
  }, [pagination.page]);

  const fetchDoctors = useCallback(
    async (
      page: number,
      searchValue: string,
      departmentValue: string,
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllDoctors({
          page,
          limit: pagination.limit,
          search: searchValue,
          department: departmentValue,
        });

        setDoctors(response.data.doctors);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctors.");
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit],
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors(1, searchRef.current, departmentRef.current);
    }, 500); // Increased to 500ms for better debouncing

    return () => clearTimeout(timer);
  }, [search, department, fetchDoctors]);

  // Initial load
  useEffect(() => {
    fetchDoctors(1, "", "");
  }, []); // Empty dependency array for initial load only

  return {
    doctors,
    loading,
    error,

    pagination,

    search,
    setSearch,

    department,
    setDepartment,

    fetchDoctors: (page: number) => {
      fetchDoctors(page, searchRef.current, departmentRef.current);
    },
  };
};