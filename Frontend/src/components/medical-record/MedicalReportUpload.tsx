// Frontend/src/components/medical-record/MedicalReportUpload.tsx
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import useMedicalRecord from "../../hooks/useMedicalRecord";

interface MedicalReportUploadProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const MedicalReportUpload = ({
  onSuccess,
  onCancel,
}: MedicalReportUploadProps) => {
  const { addMedicalReport, reportLoading } =
    useMedicalRecord();

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      toast.error(
        "Only JPG, JPEG, PNG, WEBP and PDF files are allowed.",
      );

      e.target.value = "";
      setFile(null);

      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size must be under 5 MB.");

      e.target.value = "";
      setFile(null);

      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      toast.error("Please enter a report title.");
      return;
    }

    if (!file) {
      toast.error("Please select a medical report file.");
      return;
    }

    try {
      await addMedicalReport(file, {
        title: trimmedTitle,
        ...(trimmedDescription
          ? { description: trimmedDescription }
          : {}),
      });

      setTitle("");
      setDescription("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSuccess?.();
    } catch (error) {
      console.error(
        "Failed to upload medical report:",
        error,
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Title */}
      <div>
        <label
          htmlFor="medical-report-title"
          className="mb-2 block font-medium text-emerald-700"
        >
          Report Title
        </label>

        <input
          id="medical-report-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Blood Test Report"
          maxLength={200}
          disabled={reportLoading}
          className="w-full rounded-xl border border-gray-200 px-4 py-3
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500
                     disabled:cursor-not-allowed
                     disabled:bg-gray-100"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="medical-report-description"
          className="mb-2 block font-medium text-emerald-700"
        >
          Description
        </label>

        <textarea
          id="medical-report-description"
          rows={4}
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Optional description about this report..."
          disabled={reportLoading}
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500
                     disabled:cursor-not-allowed
                     disabled:bg-gray-100"
        />

        <p className="mt-1 text-xs text-gray-500">
          Optional
        </p>
      </div>

      {/* File */}
      <div>
        <label
          htmlFor="medical-report-file"
          className="mb-2 block font-medium text-emerald-700"
        >
          Medical Report
        </label>

        <input
          ref={fileInputRef}
          id="medical-report-file"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={handleFileChange}
          disabled={reportLoading}
          className="block w-full rounded-xl border border-gray-200
                     bg-white px-4 py-3 text-sm text-gray-700
                     file:mr-4 file:rounded-lg file:border-0
                     file:bg-emerald-50 file:px-4 file:py-2
                     file:font-medium file:text-emerald-700
                     hover:file:bg-emerald-100
                     disabled:cursor-not-allowed
                     disabled:bg-gray-100"
          required
        />

        <p className="mt-2 text-xs text-gray-500">
          JPG, JPEG, PNG, WEBP or PDF — maximum 5 MB.
        </p>

        {file && (
          <div className="mt-3 rounded-xl bg-gray-50 px-4 py-3">
            <p className="truncate text-sm font-medium text-gray-700">
              {file.name}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={reportLoading}
          className="flex-1 rounded-xl bg-emerald-600 px-4 py-3
                     font-medium text-white
                     transition hover:bg-emerald-700
                     disabled:cursor-not-allowed
                     disabled:opacity-60"
        >
          {reportLoading
            ? "Uploading..."
            : "Upload Medical Report"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={reportLoading}
            className="rounded-xl border border-gray-300
                       px-5 py-3 font-medium text-gray-700
                       transition hover:bg-gray-50
                       disabled:cursor-not-allowed
                       disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default MedicalReportUpload;