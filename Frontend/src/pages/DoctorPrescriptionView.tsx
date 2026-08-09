// Frontend/src/pages/DoctorPrescriptionView.tsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Edit3,
  FileText,
  FlaskConical,
  Pill,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import { usePrescription } from "../hooks/usePrescription";

const DoctorPrescriptionView = () => {
  const { prescriptionId } = useParams<{
    prescriptionId: string;
  }>();

  const navigate = useNavigate();

  const {
    prescription,
    loading,
    fetchById,
  } = usePrescription();

  /**
   * Load Prescription
   */
  useEffect(() => {
    if (!prescriptionId) {
      toast.error("Prescription not found.");
      return;
    }

    fetchById(prescriptionId);
  }, [prescriptionId, fetchById]);

  /**
   * Loading State
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />

            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading prescription...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Not Found State
   */
  if (!prescription) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />

            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              Prescription Not Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              The prescription could not be loaded.
            </p>

            <button
              type="button"
              onClick={() => navigate("/doctor/appointments")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  const patient = prescription.appointment?.patient;

  /**
   * Navigate to Edit Page
   */
  const handleEdit = () => {
    navigate(
      `/doctor/prescription/edit/${prescription.id}`,
    );
  };

  /**
   * Navigate Back
   */
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-gray-700
              shadow-sm
              transition
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-700
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">

          <div className="border-b border-emerald-100 bg-emerald-50/60 px-6 py-7">
            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                <FileText className="h-7 w-7 text-emerald-700" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Prescription
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Prescription details and treatment plan
                </p>
              </div>

            </div>
          </div>

          {/* Patient / Appointment Information */}

          <div className="grid gap-6 p-6 md:grid-cols-2">

            {/* Patient */}

            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 h-5 w-5 text-blue-600" />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Patient
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {patient?.name ?? "Unknown Patient"}
                </p>
              </div>
            </div>

            {/* Appointment */}

            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 text-purple-600" />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Appointment
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {prescription.appointment?.appointmentAt
                    ? new Date(
                        prescription.appointment.appointmentAt,
                      ).toLocaleString()
                    : "--"}
                </p>
              </div>
            </div>

            {/* Created */}

            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 text-emerald-600" />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Created
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {new Date(
                    prescription.createdAt,
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Follow Up */}

            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 text-orange-600" />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Follow-up
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {prescription.followUpDate
                    ? new Date(
                        prescription.followUpDate,
                      ).toLocaleDateString()
                    : "No follow-up scheduled"}
                </p>
              </div>
            </div>

          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <ClipboardList className="h-5 w-5 text-blue-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Diagnosis
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Clinical diagnosis and findings
              </p>
            </div>

          </div>

          <div className="whitespace-pre-line px-6 py-6 text-sm leading-7 text-gray-700">
            {prescription.diagnosis}
          </div>

        </section>

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <Pill className="h-5 w-5 text-emerald-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Medicines
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Prescribed medications and instructions
              </p>
            </div>

          </div>

          <div className="space-y-4 p-6">

            {prescription.medicines.length === 0 ? (
              <p className="text-sm text-gray-500">
                No medicines prescribed.
              </p>
            ) : (
              prescription.medicines.map(
                (medicine, index) => (
                  <div
                    key={medicine.id ?? index}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >

                    {/* Medicine Name */}

                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {medicine.medicineName}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Medicine #{index + 1}
                      </p>
                    </div>

                    {/* Medicine Details */}

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Dosage
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {medicine.dosage}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Frequency
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {medicine.frequency}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Duration
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {medicine.duration}
                        </p>
                      </div>

                    </div>

                    {/* Medicine Instructions */}

                    {medicine.instructions?.trim() && (
                      <div className="mt-5 rounded-xl border border-gray-200 bg-white px-4 py-3">

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Instructions
                        </p>

                        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-gray-700">
                          {medicine.instructions}
                        </p>

                      </div>
                    )}

                  </div>
                ),
              )
            )}

          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
              <FlaskConical className="h-5 w-5 text-purple-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Diagnostic Tests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Recommended laboratory and imaging tests
              </p>
            </div>

          </div>

          <div className="space-y-4 p-6">

            {prescription.tests.length === 0 ? (
              <p className="text-sm text-gray-500">
                No diagnostic tests prescribed.
              </p>
            ) : (
              prescription.tests.map((test, index) => (
                <div
                  key={test.id ?? index}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                >

                  <p className="font-semibold text-gray-800">
                    {test.testName}
                  </p>

                  {/* Test Instructions */}

                  {test.instructions?.trim() && (
                    <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3">

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Instructions
                      </p>

                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-gray-700">
                        {test.instructions}
                      </p>

                    </div>
                  )}

                </div>
              ))
            )}

          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
              <FileText className="h-5 w-5 text-orange-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Medical Advice
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Additional instructions for the patient
              </p>
            </div>

          </div>

          <div className="whitespace-pre-line px-6 py-6 text-sm leading-7 text-gray-700">
            {prescription.advice?.trim()
              ? prescription.advice
              : "No additional advice provided."}
          </div>

        </section>

        <div className="flex justify-end border-t border-gray-200 pt-6 pb-10">

          <button
            type="button"
            onClick={handleEdit}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-emerald-600
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-emerald-700
              active:scale-95
            "
          >
            <Edit3 className="h-4 w-4" />
            Edit Prescription
          </button>

        </div>

      </div>
    </div>
  );
};

export default DoctorPrescriptionView;