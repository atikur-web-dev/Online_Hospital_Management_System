// Frontend/src/components/medical-record/MedicalHistoryCard.tsx
import toast from "react-hot-toast";

import type { MedicalHistory } from "../../api/medicalRecord.api";
import useMedicalRecord from "../../hooks/useMedicalRecord";

interface MedicalHistoryCardProps {
  history: MedicalHistory;
  onEdit?: (history: MedicalHistory) => void;
}

const MedicalHistoryCard = ({
  history,
  onEdit,
}: MedicalHistoryCardProps) => {
  const { removeMedicalHistory, historyLoading } =
    useMedicalRecord();

  const diagnosedDate = history.diagnosedAt
    ? new Date(history.diagnosedAt).toLocaleDateString()
    : null;

  const createdDate = history.createdAt
    ? new Date(history.createdAt).toLocaleDateString()
    : null;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medical history?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeMedicalHistory(history.id);
    } catch (error) {
      console.error(
        "Failed to delete medical history:",
        error,
      );

      toast.error("Failed to delete medical history.");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="wrap-break-word text-lg font-semibold text-gray-900">
            {history.condition}
          </h3>

          {diagnosedDate && (
            <p className="mt-1 text-sm text-emerald-600">
              Diagnosed on {diagnosedDate}
            </p>
          )}
        </div>

        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          Medical History
        </span>
      </div>

      {/* Details */}
      {history.details ? (
        <div className="mt-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            Details
          </p>

          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-gray-700">
            {history.details}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm italic text-gray-400">
          No additional details provided.
        </p>
      )}

      {/* Created date */}
      {createdDate && (
        <p className="mt-4 text-xs text-gray-400">
          Added on {createdDate}
        </p>
      )}

      {/* Actions */}
      <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(history)}
            disabled={historyLoading}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Edit
          </button>
        )}

        <button
          type="button"
          onClick={handleDelete}
          disabled={historyLoading}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {historyLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default MedicalHistoryCard;