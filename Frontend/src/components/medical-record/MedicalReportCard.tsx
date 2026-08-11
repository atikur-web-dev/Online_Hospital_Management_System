// Frontend/src/components/medical-record/MedicalReportCard.tsx
import toast from "react-hot-toast";

import type { MedicalReport } from "../../api/medicalRecord.api";
import useMedicalRecord from "../../hooks/useMedicalRecord";

interface MedicalReportCardProps {
  report: MedicalReport;
}

const MedicalReportCard = ({
  report,
}: MedicalReportCardProps) => {
  const { removeMedicalReport, reportLoading } =
    useMedicalRecord();

  const createdDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString()
    : null;

  const isPdf =
    report.fileType === "application/pdf";

  const handleOpenReport = () => {
    if (!report.fileUrl) {
      toast.error("Report file is unavailable.");
      return;
    }

    window.open(
      report.fileUrl,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medical report?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeMedicalReport(report.id);
    } catch (error) {
      console.error(
        "Failed to delete medical report:",
        error,
      );
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="wrap-break-word text-lg font-semibold text-gray-900">
            {report.title}
          </h3>

          {createdDate && (
            <p className="mt-1 text-sm text-gray-500">
              Uploaded on {createdDate}
            </p>
          )}
        </div>

        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {isPdf ? "PDF" : "Image"}
        </span>
      </div>

      {/* Description */}
      {report.description ? (
        <p className="mt-4 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-gray-600">
          {report.description}
        </p>
      ) : (
        <p className="mt-4 text-sm italic text-gray-400">
          No description provided.
        </p>
      )}

      {/* File information */}
      <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          File type
        </p>

        <p className="mt-1 break-all text-sm text-gray-700">
          {report.fileType || "Unknown"}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={handleOpenReport}
          disabled={reportLoading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          View Report
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={reportLoading}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {reportLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default MedicalReportCard;