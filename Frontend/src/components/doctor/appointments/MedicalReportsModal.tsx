// Frontend/src/components/doctor/appointments/MedicalReportsModal.tsx
import {
  Calendar,
  ClipboardList,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  ExternalLink,
  Download,
  X,
  Stethoscope,
  UserCircle2,
  Mail,
  Phone,
} from "lucide-react";

import type { AppointmentDetails } from "../../../types/appointment";

interface MedicalReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentDetails | null;
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) {
    return FileImage;
  }

  if (
    fileType.includes("spreadsheet") ||
    fileType.includes("excel") ||
    fileType.includes("csv")
  ) {
    return FileSpreadsheet;
  }

  if (fileType === "application/pdf") {
    return FileText;
  }

  return File;
};

const formatDate = (date: string | null) => {
  if (!date) {
    return "Not specified";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatFileType = (fileType: string) => {
  if (!fileType) {
    return "FILE";
  }

  const parts = fileType.split("/");

  return (parts[parts.length - 1] || "FILE").toUpperCase();
};

const MedicalReportsModal = ({
  isOpen,
  onClose,
  appointment,
}: MedicalReportsModalProps) => {
  if (!isOpen || !appointment) {
    return null;
  }

  const patient = appointment.patient;
  console.log("PATIENT DATA:", patient);
  console.log("PROFILE IMAGE:", patient.user?.profileImage);

  const medicalHistories = appointment.medicalHistories ?? [];

  const medicalReports = appointment.medicalReports ?? [];

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* =====================================================
            Header
            ===================================================== */}

        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <ClipboardList className="h-5 w-5 text-emerald-600" />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  Medical Records
                </h2>

                <p className="mt-0.5 text-sm text-gray-500 truncate">
                  Previous medical information shared by{" "}
                  <span className="font-medium text-gray-700">
                    {patient.name}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close medical records"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =====================================================
            Content
            ===================================================== */}

        <div className="max-h-[calc(92vh-90px)] overflow-y-auto">
          <div className="p-5 sm:p-6">
            {/* =================================================
                Patient Information
                ================================================= */}

            <section className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <UserCircle2 className="h-4 w-4 text-emerald-600" />

                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Patient Information
                </h3>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {/* Profile Image */}
                  <div className="shrink-0">
                    {patient.user.profileImage ? (
                      <img
                        src={patient.user.profileImage}
                        alt={patient.name}
                        referrerPolicy="no-referrer"
                        className="h-14 w-14 rounded-xl object-cover border border-gray-200"
                        onLoad={() => console.log("IMAGE LOADED")}
                        onError={(e) =>
                          console.error("IMAGE FAILED:", e.currentTarget.src)
                        }
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-200">
                        <UserCircle2 className="h-7 w-7 text-emerald-600" />
                      </div>
                    )}
                  </div>

                  {/* Patient Details */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-semibold text-gray-800">
                      {patient.name}
                    </h4>

                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Mail className="h-3.5 w-3.5 shrink-0" />

                        <span className="truncate">{patient.user.email}</span>
                      </div>

                      {patient.phone && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Phone className="h-3.5 w-3.5 shrink-0" />

                          <span>{patient.phone}</span>
                        </div>
                      )}

                      {patient.gender && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <UserCircle2 className="h-3.5 w-3.5 shrink-0" />

                          <span className="capitalize">
                            {patient.gender.toLowerCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                Medical History
                ================================================= */}

            <section className="mb-6">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-emerald-600" />

                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Medical History
                  </h3>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {medicalHistories.length}{" "}
                  {medicalHistories.length === 1 ? "record" : "records"}
                </span>
              </div>

              {medicalHistories.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Stethoscope className="h-5 w-5 text-gray-400" />
                  </div>

                  <h4 className="mt-3 text-sm font-semibold text-gray-800">
                    No medical history shared
                  </h4>

                  <p className="mt-1 max-w-sm text-sm leading-relaxed text-gray-500">
                    This patient has not shared any previous medical history
                    with you for this appointment.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {medicalHistories.map((history) => (
                    <div
                      key={history.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        {/* History Icon */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                          <Stethoscope className="h-4.5 w-4.5 text-emerald-600" />
                        </div>

                        {/* History Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <h4 className="text-sm font-semibold text-gray-800">
                              {history.condition}
                            </h4>

                            <div className="flex shrink-0 items-center gap-1.5 text-xs text-gray-400">
                              <Calendar className="h-3.5 w-3.5" />

                              <span>
                                Diagnosed {formatDate(history.diagnosedAt)}
                              </span>
                            </div>
                          </div>

                          {history.details ? (
                            <p className="mt-2 text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                              {history.details}
                            </p>
                          ) : (
                            <p className="mt-2 text-sm italic text-gray-400">
                              No additional details provided.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* =================================================
                Medical Reports
                ================================================= */}

            <section>
              <div className="mb-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />

                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Medical Reports
                  </h3>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {medicalReports.length}{" "}
                  {medicalReports.length === 1 ? "report" : "reports"}
                </span>
              </div>

              {medicalReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>

                  <h4 className="mt-3 text-sm font-semibold text-gray-800">
                    No medical reports shared
                  </h4>

                  <p className="mt-1 max-w-sm text-sm leading-relaxed text-gray-500">
                    This patient has not shared any previous medical reports
                    with you for this appointment.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {medicalReports.map((report) => {
                    const FileIcon = getFileIcon(report.fileType);

                    return (
                      <div
                        key={report.id}
                        className="group rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-sm"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                          {/* File Icon */}
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
                            <FileIcon className="h-5 w-5" />
                          </div>

                          {/* Report Information */}
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-semibold text-gray-800">
                              {report.title}
                            </h4>

                            {report.description ? (
                              <p className="mt-1 text-sm leading-relaxed text-gray-500 line-clamp-2">
                                {report.description}
                              </p>
                            ) : (
                              <p className="mt-1 text-sm italic text-gray-400">
                                No description provided.
                              </p>
                            )}

                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Calendar className="h-3.5 w-3.5" />

                                <span>{formatDate(report.createdAt)}</span>
                              </div>

                              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                                {formatFileType(report.fileType)}
                              </span>
                            </div>
                          </div>

                          {/* Report Actions */}
                          <div className="flex shrink-0 items-center gap-2 sm:self-start">
                            <a
                              href={report.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />

                              <span>View</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* =================================================
                Footer Information
                ================================================= */}

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
              <div className="flex items-start gap-2.5">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

                <p className="text-xs leading-relaxed text-blue-700">
                  These medical records and reports were previously shared by
                  the patient and are available for your clinical reference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalReportsModal;
