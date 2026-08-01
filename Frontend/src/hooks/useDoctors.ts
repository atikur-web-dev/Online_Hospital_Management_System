// Frontend/src/hooks/useDoctors.ts
import { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllDoctors } from "../api/doctor.api";
import type { DoctorProfile } from "../types/profile.types";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseDoctorsReturn {
  doctors: DoctorProfile[];
  loading: boolean;
  searching: boolean;
  error: string | null;
  pagination: Pagination;
  search: string;
  setSearch: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  fetchDoctors: (page: number) => void;
}

export const useDoctors = (): UseDoctorsReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize from URL params
  const initialDepartment = searchParams.get('department') || "";
  const initialSearch = searchParams.get('search') || "";

  // State
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [department, setDepartment] = useState(initialDepartment);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });

  // Refs for latest values
  const searchRef = useRef(search);
  const departmentRef = useRef(department);
  const pageRef = useRef(pagination.page);
  const isInitialMount = useRef(true);
  const debounceTimerRef = useRef<number | null>(null);

  // Update refs
  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    departmentRef.current = department;
  }, [department]);

  useEffect(() => {
    pageRef.current = pagination.page;
  }, [pagination.page]);

  // Update URL params when search or department changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (department) params.set('department', department);
    setSearchParams(params, { replace: true });
  }, [search, department, setSearchParams]);

  // Core fetch function
  const fetchDoctors = useCallback(
    async (page: number, searchValue: string, departmentValue: string) => {
      try {
        const response = await getAllDoctors({
          page,
          limit: pagination.limit,
          search: searchValue,
          department: departmentValue,
        });

        setDoctors(response.data.doctors);
        setPagination(response.data.pagination);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to load doctors. Please try again.");
        setDoctors([]);
      }
    },
    [pagination.limit]
  );

  // Wrapped fetch for external use
  const fetchDoctorsWrapper = useCallback(
    (page: number) => {
      fetchDoctors(page, searchRef.current, departmentRef.current);
    },
    [fetchDoctors]
  );

  // Debounced search handler
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // If search is empty, fetch immediately
      if (value === "") {
        setSearching(true);
        fetchDoctors(1, "", departmentRef.current)
          .finally(() => setSearching(false));
        return;
      }

      // Debounce for non-empty search
      setSearching(true);
      debounceTimerRef.current = window.setTimeout(() => {
        fetchDoctors(1, value, departmentRef.current)
          .finally(() => setSearching(false));
        debounceTimerRef.current = null;
      }, 500);
    },
    [fetchDoctors]
  );

  // Department change handler
  const handleDepartmentChange = useCallback(
    (value: string) => {
      setDepartment(value);
      // Reset to page 1 when department changes
      fetchDoctors(1, searchRef.current, value);
    },
    [fetchDoctors]
  );

  // Initial load
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Use initial values from URL
      fetchDoctors(1, initialSearch, initialDepartment)
        .finally(() => setLoading(false));
    }
  }, [fetchDoctors, initialSearch, initialDepartment]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  return {
    doctors,
    loading,
    searching,
    error,
    pagination,
    search,
    setSearch: handleSearchChange,
    department,
    setDepartment: handleDepartmentChange,
    fetchDoctors: fetchDoctorsWrapper,
  };
};