// Frontend/src/components/doctor/prescription/PrescriptionDocument.tsx

import {
  CalendarDays,
  FileText,
  FlaskConical,
  Pill,
  UserRound,
} from "lucide-react";

import type { PrescriptionResponse } from "../../../types/prescription";

interface PrescriptionDocumentProps {
  prescription: PrescriptionResponse;
}

const PrescriptionDocument = ({
  prescription,
}: PrescriptionDocumentProps) => {
  const patient = prescription.appointment?.patient;
  const doctor = prescription.appointment?.doctor;

  const doctorName = doctor?.name
    ?.replace(/^(?:Dr\.?\s*)+/i, "")
    .trim();

  const doctorDisplayName = doctorName
    ? `Dr. ${doctorName}`
    : "Doctor";

  const doctorFirstName = doctorName
    ?.split(/\s+/)[0]
    ?.trim();

const prescriptionDisplayId = prescription.id
  ? parseInt(
      prescription.id.replace(/\D/g, "").slice(-6) || "0",
      10,
    )
      .toString()
      .padStart(6, "0")
  : "000000";

  const formatDate = (
    date: string | null | undefined,
  ) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  };

  const formatDateTime = (
    date: string | null | undefined,
  ) => {
    if (!date) return "--";

    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b-2 border-emerald-600 px-10 py-8 sm:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Hospital / Clinic */}

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-700">
              CAREPLUS
            </h1>

            <p className="mt-1 text-sm font-medium text-gray-500">
              Medical & Healthcare Center
            </p>

            <p className="mt-3 text-xs leading-5 text-gray-500">
              Quality healthcare with compassionate care
            </p>
          </div>

          {/* Prescription */}

          <div className="text-left sm:text-right">
            <p className="text-2xl font-bold uppercase tracking-wide text-gray-800">
              Prescription
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Prescription ID:{" "}
<span className="font-medium text-gray-700">
  #{prescriptionDisplayId}
</span>
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Date:{" "}
              <span className="font-medium text-gray-700">
                {formatDate(prescription.createdAt)}
              </span>
            </p>
          </div>
        </div>

        {/* Doctor */}

        <div className="mt-7 border-t border-gray-100 pt-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Attending Physician
          </p>

          <p className="mt-2 text-sm font-semibold text-gray-800">
            {doctorDisplayName}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Medical Practitioner
          </p>
        </div>
      </header>

    
    
      <section className="border-b border-gray-200 px-10 py-6 sm:px-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Patient */}

          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Patient
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {patient?.name ?? "Unknown Patient"}
              </p>
            </div>
          </div>

          {/* Appointment */}

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Appointment
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {formatDateTime(
                  prescription.appointment?.appointmentAt,
                )}
              </p>
            </div>
          </div>

          {/* Gender */}

          {patient?.gender && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Gender
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {patient.gender}
              </p>
            </div>
          )}

          {/* Phone */}

          {patient?.phone && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Phone
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {patient.phone}
              </p>
            </div>
          )}
        </div>
      </section>

      
  
      <section className="px-10 pt-7 sm:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>

          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Diagnosis
          </h2>
        </div>

        <div className="mt-4 border-l-2 border-blue-200 pl-4">
          <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
            {prescription.diagnosis}
          </p>
        </div>
      </section>


      <section className="px-10 pt-8 sm:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
            <Pill className="h-4 w-4 text-emerald-600" />
          </div>

          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Medicines
          </h2>
        </div>

        {prescription.medicines.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">
            No medicines prescribed.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {prescription.medicines.map(
              (medicine, index) => (
                <div
                  key={
                    medicine.id ??
                    `${medicine.medicineName}-${index}`
                  }
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex items-start gap-4">
                    {/* Number */}

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Medicine Name */}

                      <p className="font-semibold text-gray-900">
                        {medicine.medicineName}
                      </p>

                      {/* Medicine Details */}

                      <div className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
                        <div>
                          <span className="text-xs text-gray-400">
                            Dosage
                          </span>

                          <p className="font-medium text-gray-700">
                            {medicine.dosage}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs text-gray-400">
                            Frequency
                          </span>

                          <p className="font-medium text-gray-700">
                            {medicine.frequency}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs text-gray-400">
                            Duration
                          </span>

                          <p className="font-medium text-gray-700">
                            {medicine.duration}
                          </p>
                        </div>
                      </div>

                      {/* Instructions */}

                      {medicine.instructions?.trim() && (
                        <p className="mt-2 text-xs leading-5 text-gray-500">
                          <span className="font-semibold text-gray-600">
                            Instructions:
                          </span>{" "}
                          {medicine.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>

   
      <section className="px-10 pt-8 sm:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
            <FlaskConical className="h-4 w-4 text-purple-600" />
          </div>

          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Test
          </h2>
        </div>

        {prescription.tests.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">
            No investigations prescribed.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {prescription.tests.map(
              (test, index) => (
                <div
                  key={
                    test.id ??
                    `${test.testName}-${index}`
                  }
                  className="flex items-start gap-3"
                >
                  <span className="mt-1 text-sm font-semibold text-purple-600">
                    {index + 1}.
                  </span>

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {test.testName}
                    </p>

                    {test.instructions?.trim() && (
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {test.instructions}
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>

      

      <section className="px-10 pt-8 sm:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
            <FileText className="h-4 w-4 text-orange-600" />
          </div>

          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Medical Advice
          </h2>
        </div>

        <div className="mt-4 rounded-xl bg-gray-50 px-5 py-4">
          <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
            {prescription.advice?.trim()
              ? prescription.advice
              : "No additional advice provided."}
          </p>
        </div>
      </section>

     

      {prescription.followUpDate && (
        <section className="px-10 pt-7 sm:px-12">
          <div className="rounded-xl border border-orange-100 bg-orange-50 px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-orange-500">
              Follow-up Appointment
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {formatDate(prescription.followUpDate)}
            </p>
          </div>
        </section>
      )}

      

      <section className="px-10 pb-10 pt-12 sm:px-12">
        <div className="mt-10 text-right">
          {/* Signature */}

          <div className="mb-2 inline-block min-w-45 border-b border-gray-400 pb-2">
            <p className="text-lg font-semibold italic text-gray-800">
              {doctorFirstName ?? "Doctor"}
            </p>
          </div>

          {/* Doctor Name */}

          <p className="text-sm font-semibold text-gray-800">
            {doctorDisplayName}
          </p>

          {/* Profession */}

          <p className="text-xs text-gray-500">
            Medical Practitioner
          </p>

          {/* Signature Label */}

          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Authorized Signature
          </p>
        </div>
      </section>



      <footer className="border-t-2 border-emerald-600 px-10 py-5 text-center sm:px-12">
        <p className="text-xs font-medium text-gray-500">
          This prescription was digitally issued through
          CarePlus Medical System.
        </p>

        <p className="mt-1 text-[11px] text-gray-400">
          Generated on{" "}
          {formatDateTime(prescription.createdAt)}
        </p>
      </footer>
    </div>
  );
};

export default PrescriptionDocument;