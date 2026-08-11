// Frontend/src/components/medical-record/MedicalHistoryForm.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import type { MedicalHistory } from "../../api/medicalRecord.api";
import useMedicalRecord from "../../hooks/useMedicalRecord";

interface MedicalHistoryFormProps {
  history?: MedicalHistory | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MedicalHistoryForm = ({
  history,
  onSuccess,
  onCancel,
}: MedicalHistoryFormProps) => {
  const { addMedicalHistory, editMedicalHistory } =
    useMedicalRecord();

  const [condition, setCondition] = useState("");
  const [details, setDetails] = useState("");
  const [diagnosedAt, setDiagnosedAt] = useState("");

  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(history);

  /**
   * Populate form when editing
   */
  useEffect(() => {
    if (history) {
      setCondition(history.condition ?? "");
      setDetails(history.details ?? "");

      setDiagnosedAt(
        history.diagnosedAt
          ? new Date(history.diagnosedAt)
              .toISOString()
              .split("T")[0]
          : "",
      );

      return;
    }

    setCondition("");
    setDetails("");
    setDiagnosedAt("");
  }, [history]);

  /**
   * Submit
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const trimmedCondition = condition.trim();
    const trimmedDetails = details.trim();

    if (!trimmedCondition) {
      toast.error("Please enter the medical condition.");
      return;
    }

    try {
      setLoading(true);

      if (isEditing && history) {
        await editMedicalHistory(history.id, {
          condition: trimmedCondition,
          details: trimmedDetails || undefined,
          diagnosedAt: diagnosedAt
            ? diagnosedAt
            : null,
        });
      } else {
        await addMedicalHistory({
          condition: trimmedCondition,
          details: trimmedDetails || undefined,
          ...(diagnosedAt
            ? { diagnosedAt }
            : {}),
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error(
        "Failed to save medical history:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Condition */}
      <div>
        <label
          htmlFor="medical-condition"
          className="block mb-2 font-medium text-emerald-700"
        >
          Medical Condition
        </label>

        <input
          id="medical-condition"
          type="text"
          value={condition}
          onChange={(e) =>
            setCondition(e.target.value)
          }
          placeholder="e.g. Diabetes, Asthma, Gastritis"
          maxLength={200}
          className="w-full border border-gray-200 rounded-xl px-4 py-3
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500"
          disabled={loading}
          required
        />
      </div>

      {/* Details */}
      <div>
        <label
          htmlFor="medical-details"
          className="block mb-2 font-medium text-emerald-700"
        >
          Details
        </label>

        <textarea
          id="medical-details"
          rows={4}
          value={details}
          onChange={(e) =>
            setDetails(e.target.value)
          }
          placeholder="Describe the condition, symptoms, treatment, etc."
          className="w-full border border-gray-200 rounded-xl px-4 py-3
                     resize-none
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500"
          disabled={loading}
        />

        <p className="mt-1 text-xs text-gray-500">
          Optional
        </p>
      </div>

      {/* Diagnosed Date */}
      <div>
        <label
          htmlFor="diagnosed-at"
          className="block mb-2 font-medium text-emerald-700"
        >
          Diagnosed Date
        </label>

        <input
          id="diagnosed-at"
          type="date"
          value={diagnosedAt}
          max={new Date()
            .toISOString()
            .split("T")[0]}
          onChange={(e) =>
            setDiagnosedAt(e.target.value)
          }
          className="w-full border border-gray-200 rounded-xl px-4 py-3
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500"
          disabled={loading}
        />

        <p className="mt-1 text-xs text-gray-500">
          Optional
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-emerald-600
                     px-4 py-3 font-medium text-white
                     hover:bg-emerald-700
                     disabled:opacity-60
                     disabled:cursor-not-allowed
                     transition"
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Medical History"
              : "Add Medical History"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-3 rounded-xl border
                       border-gray-300 text-gray-700
                       hover:bg-gray-50
                       disabled:opacity-60
                       transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default MedicalHistoryForm;