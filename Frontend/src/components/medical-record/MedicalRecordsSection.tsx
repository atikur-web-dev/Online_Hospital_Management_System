// Frontend/src/components/medical-record/MedicalRecordsSection.tsx

import { useState } from "react";

import useMedicalRecord from "../../hooks/useMedicalRecord";

import MedicalHistoryCard from "./MedicalHistoryCard";
import MedicalHistoryForm from "./MedicalHistoryForm";
import MedicalReportCard from "./MedicalReportCard";
import MedicalReportForm from "./MedicalReportForm";

import type { MedicalHistory } from "../../types/medicalRecord.types";

const MedicalRecordsSection = () => {
  const {
    medicalHistories,
    medicalReports,
    loading,
    fetchMedicalRecords,
  } = useMedicalRecord();

  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  const [editingHistory, setEditingHistory] =
    useState<MedicalHistory | null>(null);

  const handleAddHistory = () => {
    setEditingHistory(null);
    setShowHistoryForm((previous) => !previous);
  };

  const handleEditHistory = (history: MedicalHistory) => {
    setEditingHistory(history);
    setShowHistoryForm(true);
  };

  const handleHistorySuccess = async () => {
    await fetchMedicalRecords();

    setShowHistoryForm(false);
    setEditingHistory(null);
  };

  const handleHistoryCancel = () => {
    setShowHistoryForm(false);
    setEditingHistory(null);
  };

  const handleReportSuccess = async () => {
    await fetchMedicalRecords();

    setShowReportForm(false);
  };

  const handleReportCancel = () => {
    setShowReportForm(false);
  };

  return (
    <section className="space-y-10">
      {/* ================================================== */}
      {/* Header */}
      {/* ================================================== */}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          My Medical Records
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage your medical history and medical reports in one place.
        </p>
      </div>

      {/* ================================================== */}
      {/* Medical History */}
      {/* ================================================== */}

      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Medical History
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add previous medical conditions, diagnoses, symptoms,
              treatments, and other important medical information.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddHistory}
            className="shrink-0 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            {showHistoryForm
              ? "Close Form"
              : "+ Add Medical History"}
          </button>
        </div>

        {/* History Form */}

        {showHistoryForm && (
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <MedicalHistoryForm
              history={editingHistory}
              onSuccess={handleHistorySuccess}
              onCancel={handleHistoryCancel}
            />
          </div>
        )}

        {/* History List */}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-500">
              Loading medical history...
            </p>
          </div>
        ) : medicalHistories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="font-medium text-gray-700">
              No medical history found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Click "Add Medical History" to add your first
              medical condition.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {medicalHistories.map((history) => (
              <MedicalHistoryCard
                key={history.id}
                history={history}
                onEdit={handleEditHistory}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* Medical Reports */}
      {/* ================================================== */}

      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Medical Reports
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Upload and manage your medical test reports,
              X-rays, prescriptions, and other medical documents.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowReportForm((previous) => !previous)
            }
            className="shrink-0 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            {showReportForm
              ? "Close Form"
              : "+ Upload Medical Report"}
          </button>
        </div>

        {/* Report Upload Form */}

        {showReportForm && (
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <MedicalReportForm
              onSuccess={handleReportSuccess}
              onCancel={handleReportCancel}
            />
          </div>
        )}

        {/* Report List */}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-500">
              Loading medical reports...
            </p>
          </div>
        ) : medicalReports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="font-medium text-gray-700">
              No medical reports found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Click "Upload Medical Report" to upload your
              first report.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {medicalReports.map((report) => (
              <MedicalReportCard
                key={report.id}
                report={report}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MedicalRecordsSection;