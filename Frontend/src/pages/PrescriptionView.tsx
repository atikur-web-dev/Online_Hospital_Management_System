// Frontend/src/pages/PrescriptionView.tsx
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  FlaskConical,
  Pill,
  UserRound,
} from "lucide-react";

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { usePrescription } from "../hooks/usePrescription";

const PrescriptionView = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const { prescription, loading, fetchById } = usePrescription();

  useEffect(() => {
    if (!id) {
      toast.error("Prescription not found.");
      return;
    }

    fetchById(id);
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <span className="text-sm font-medium">Loading prescription...</span>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="min-h-125 flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          Prescription Not Found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          The prescription could not be loaded.
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  const appointment = prescription.appointment;

  const patientName = appointment?.patient?.name ?? "Patient";

  const appointmentDate = appointment?.appointmentAt
    ? new Date(appointment.appointmentAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "--";

  const prescriptionDate = new Date(prescription.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const followUpDate = prescription.followUpDate
    ? new Date(prescription.followUpDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="hidden items-center gap-2 text-sm font-medium text-gray-500 sm:flex">
          <ClipboardList className="h-4 w-4 text-emerald-600" />
          Prescription Details
        </div>
      </div>

      {/* Header */}
      <section className="rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div className="flex flex-col gap-6 border-b border-emerald-100 p-6 md:flex-row md:items-start md:justify-between">
          {/* Title */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
              <FileText className="h-7 w-7 text-emerald-700" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Medical Prescription
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Prescription details and treatment plan.
              </p>
            </div>
          </div>

          {/* Patient / Appointment */}
          <div className="grid gap-4 sm:grid-cols-2 md:min-w-105">
            <div className="flex items-center gap-3">
              <UserRound className="h-5 w-5 text-emerald-600" />

              <div>
                <p className="text-xs text-gray-500">Patient</p>

                <p className="font-semibold text-gray-800">{patientName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-purple-600" />

              <div>
                <p className="text-xs text-gray-500">Appointment</p>

                <p className="font-semibold text-gray-800">{appointmentDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Meta */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 bg-gray-50 px-6 py-4">
          <div>
            <p className="text-xs text-gray-500">Prescription ID</p>

            <p className="mt-0.5 text-sm font-medium text-gray-700">
              {prescription.id}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Created</p>

            <p className="mt-0.5 text-sm font-medium text-gray-700">
              {prescriptionDate}
            </p>
          </div>

          {followUpDate && (
            <div>
              <p className="text-xs text-gray-500">Follow-up</p>

              <p className="mt-0.5 text-sm font-semibold text-emerald-700">
                {followUpDate}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Diagnosis */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-emerald-100 px-6 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <FileText className="h-5 w-5 text-emerald-700" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Diagnosis</h2>

            <p className="mt-1 text-sm text-gray-500">
              Clinical diagnosis and findings.
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
            <p className="whitespace-pre-line text-[15px] leading-7 text-gray-700">
              {prescription.diagnosis}
            </p>
          </div>
        </div>
      </section>

      {/* Medicines */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-emerald-100 px-6 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <Pill className="h-5 w-5 text-emerald-700" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Medicines</h2>

            <p className="mt-1 text-sm text-gray-500">
              Prescribed medications and instructions.
            </p>
          </div>
        </div>

        <div className="space-y-4 p-6">
          {prescription.medicines.length === 0 ? (
            <div className="rounded-xl bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
              No medicines prescribed.
            </div>
          ) : (
            prescription.medicines.map((medicine, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                      Medicine #{index + 1}
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-gray-900">
                      {medicine.medicineName}
                    </h3>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs text-gray-500">Dosage</p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {medicine.dosage}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs text-gray-500">Frequency</p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {medicine.frequency}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs text-gray-500">Duration</p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {medicine.duration}
                    </p>
                  </div>
                </div>

                {medicine.instructions && (
                  <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Instructions
                    </p>

                    <p className="mt-1 whitespace-pre-line text-sm leading-6 text-gray-700">
                      {medicine.instructions}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Tests */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-emerald-100 px-6 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <FlaskConical className="h-5 w-5 text-emerald-700" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Diagnostic Tests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Laboratory and imaging investigations.
            </p>
          </div>
        </div>

        <div className="space-y-3 p-6">
          {prescription.tests.length === 0 ? (
            <div className="rounded-xl bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
              No diagnostic tests prescribed.
            </div>
          ) : (
            prescription.tests.map((test, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                  <FlaskConical className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                    Test #{index + 1}
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {test.testName}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Advice */}
      {(prescription.advice || followUpDate) && (
        <section className="mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-emerald-100 px-6 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
              <ClipboardList className="h-5 w-5 text-emerald-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Advice & Follow-up
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Additional medical advice and follow-up plan.
              </p>
            </div>
          </div>

          <div className="space-y-5 p-6">
            {prescription.advice && (
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Medical Advice
                </p>

                <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
                  <p className="whitespace-pre-line text-[15px] leading-7 text-gray-700">
                    {prescription.advice}
                  </p>
                </div>
              </div>
            )}

            {followUpDate && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Follow-up Date
                </p>

                <p className="mt-1 text-base font-semibold text-gray-800">
                  {followUpDate}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bottom */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Appointment
        </button>
      </div>
    </div>
  );
};

export default PrescriptionView;
