// Frontend/src/components/medical-record/MedicalRecordsSection.tsx
import { useEffect } from "react";
import useMedicalRecord from "../../hooks/useMedicalRecord";

import MedicalHistoryForm from "./MedicalHistoryForm";
import MedicalReportForm from "./MedicalReportForm";
import MedicalReportCard from "./MedicalReportCard";

const MedicalRecordsSection = () => {
  const { medicalHistories, medicalReports, loading, fetchMedicalRecords } =
    useMedicalRecord();

  useEffect(() => {
    fetchMedicalRecords();
  }, [fetchMedicalRecords]);

  return (
    <section className="space-y-8">
      {/* ================================================== */}
      {/* Header */}
      {/* ================================================== */}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Medical Records</h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage your medical history and medical reports in one place.
        </p>
      </div>

      {/* ================================================== */}
      {/* Medical History */}
      {/* ================================================== */}

      <div className="space-y-5">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Medical History
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Keep track of your previous medical conditions and diagnoses.
          </p>
        </div>

        <MedicalHistoryForm onSuccess={fetchMedicalRecords} />

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-500">Loading medical history...</p>
          </div>
        ) : medicalHistories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="font-medium text-gray-700">
              No medical history found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your medical history using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicalHistories.map((history) => (
              <div
                key={history.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="wrap-break-word text-lg font-semibold text-gray-900">
                      {history.condition}
                    </h4>

                    {history.diagnosedAt && (
                      <p className="mt-1 text-sm text-gray-500">
                        Diagnosed on{" "}
                        {new Date(history.diagnosedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {history.details ? (
                  <p className="mt-4 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-gray-600">
                    {history.details}
                  </p>
                ) : (
                  <p className="mt-4 text-sm italic text-gray-400">
                    No additional details provided.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* Medical Reports */}
      {/* ================================================== */}

      <div className="space-y-5">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Medical Reports
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Upload and manage your medical reports.
          </p>
        </div>

        <MedicalReportForm onSuccess={fetchMedicalRecords} />

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-500">Loading medical reports...</p>
          </div>
        ) : medicalReports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="font-medium text-gray-700">
              No medical reports found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Upload your first medical report using the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {medicalReports.map((report) => (
              <MedicalReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MedicalRecordsSection;
