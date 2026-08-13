// Frontend/src/pages/PublicPrescriptionView.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Loader2, AlertCircle } from "lucide-react";

import PrescriptionDocument from "../components/doctor/prescription/PrescriptionDocument";

import type { PrescriptionResponse } from "../types/prescription";

const PublicPrescriptionView = () => {
  const { token } = useParams<{ token: string }>();

  const [prescription, setPrescription] =
    useState<PrescriptionResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // Load Public Prescription
  // ============================================================

  useEffect(() => {
    const loadPrescription = async () => {
      if (!token) {
        setError("Invalid prescription link.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/prescriptions/public/${encodeURIComponent(token)}`,
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load prescription.",
          );
        }

        setPrescription(result.data);
      } catch (err) {
        console.error(
          "PUBLIC PRESCRIPTION LOAD ERROR:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load prescription.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPrescription();
  }, [token]);

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />

          <p className="text-sm font-medium text-gray-600">
            Loading prescription...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // Error
  // ============================================================

  if (error || !prescription) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-5">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-gray-900">
            Unable to View Prescription
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error ||
              "The prescription could not be loaded."}
          </p>

          <p className="mt-4 text-xs text-gray-400">
            The link may be invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // Prescription
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
      {/* ======================================================
          Top Action Bar
      ======================================================= */}

      <div className="mx-auto mb-6 flex w-full max-w-5xl justify-end px-5 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          <Download className="h-4 w-4" />

          Download Prescription
        </button>
      </div>

      {/* ======================================================
          Prescription Document
      ======================================================= */}

      <main className="mx-auto w-full max-w-5xl px-5 print:max-w-none print:px-0">
        <PrescriptionDocument prescription={prescription} />
      </main>
    </div>
  );
};

export default PublicPrescriptionView;