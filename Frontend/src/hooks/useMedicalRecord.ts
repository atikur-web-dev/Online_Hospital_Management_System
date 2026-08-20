// Frontend/src/hooks/useMedicalRecord.ts
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  createMedicalHistory,
  getMedicalHistories,
  updateMedicalHistory,
  deleteMedicalHistory,
  uploadMedicalReport,
  getMedicalReports,
  deleteMedicalReport,
} from "../api/medicalRecord.api";

import type {
  MedicalHistory,
  MedicalReport,
  CreateMedicalHistoryPayload,
  UpdateMedicalHistoryPayload,
  CreateMedicalReportPayload,
} from "../types/medicalRecord.types";

const useMedicalRecord = () => {
  const [medicalHistories, setMedicalHistories] = useState<
    MedicalHistory[]
  >([]);

  const [medicalReports, setMedicalReports] = useState<
    MedicalReport[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [historyLoading, setHistoryLoading] = useState(false);

  const [reportLoading, setReportLoading] = useState(false);

// Fetch Medical Histories
  const fetchMedicalHistories = useCallback(async () => {
    try {
      setHistoryLoading(true);

      const histories = await getMedicalHistories();

      setMedicalHistories(histories);
    } catch (error: any) {
      console.error(
        "Failed to fetch medical histories:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to load medical histories.",
      );
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Fetch Medical Reports
  const fetchMedicalReports = useCallback(async () => {
    try {
      setReportLoading(true);

      const reports = await getMedicalReports();

      setMedicalReports(reports);
    } catch (error: any) {
      console.error(
        "Failed to fetch medical reports:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to load medical reports.",
      );
    } finally {
      setReportLoading(false);
    }
  }, []);

  // Fetch All Medical Records
  const fetchMedicalRecords = useCallback(async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchMedicalHistories(),
        fetchMedicalReports(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchMedicalHistories, fetchMedicalReports]);

  // Create Medical History
  const addMedicalHistory = async (data: {
    condition: string;
    details?: string;
    diagnosedAt?: string;
  }) => {
    try {
      setHistoryLoading(true);

      const response = await createMedicalHistory(data);

      await fetchMedicalHistories();

      toast.success(
        response?.message ??
          "Medical history added successfully.",
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Failed to create medical history:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to add medical history.",
      );

      throw error;
    } finally {
      setHistoryLoading(false);
    }
  };

  // Update Medical History
  const editMedicalHistory = async (
    historyId: string,
    data: {
      condition?: string;
      details?: string;
      diagnosedAt?: string | null;
    },
  ) => {
    try {
      setHistoryLoading(true);

      const response = await updateMedicalHistory(
        historyId,
        data,
      );

      await fetchMedicalHistories();

      toast.success(
        response?.message ??
          "Medical history updated successfully.",
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Failed to update medical history:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to update medical history.",
      );

      throw error;
    } finally {
      setHistoryLoading(false);
    }
  };

 // Delete Medical History
  const removeMedicalHistory = async (
    historyId: string,
  ) => {
    try {
      setHistoryLoading(true);

      const response = await deleteMedicalHistory(
        historyId,
      );

      await fetchMedicalHistories();

      toast.success(
        response?.message ??
          "Medical history deleted successfully.",
      );

      return response;
    } catch (error: any) {
      console.error(
        "Failed to delete medical history:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to delete medical history.",
      );

      throw error;
    } finally {
      setHistoryLoading(false);
    }
  };

  // Upload Medical Report
  const addMedicalReport = async (
    file: File,
    data: {
      title: string;
      description?: string;
    },
  ) => {
    try {
      setReportLoading(true);

      const response = await uploadMedicalReport(
        file,
        data,
      );

      await fetchMedicalReports();

      toast.success(
        response?.message ??
          "Medical report uploaded successfully.",
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Failed to upload medical report:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to upload medical report.",
      );

      throw error;
    } finally {
      setReportLoading(false);
    }
  };

  // Delete Medical Report
  const removeMedicalReport = async (
    reportId: string,
  ) => {
    try {
      setReportLoading(true);

      const response = await deleteMedicalReport(
        reportId,
      );

      await fetchMedicalReports();

      toast.success(
        response?.message ??
          "Medical report deleted successfully.",
      );

      return response;
    } catch (error: any) {
      console.error(
        "Failed to delete medical report:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to delete medical report.",
      );

      throw error;
    } finally {
      setReportLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchMedicalRecords();
  }, [fetchMedicalRecords]);

  return {
    medicalHistories,
    medicalReports,

    loading,
    historyLoading,
    reportLoading,

    fetchMedicalRecords,
    fetchMedicalHistories,
    fetchMedicalReports,

    addMedicalHistory,
    editMedicalHistory,
    removeMedicalHistory,

    addMedicalReport,
    removeMedicalReport,
  };
};

export default useMedicalRecord;