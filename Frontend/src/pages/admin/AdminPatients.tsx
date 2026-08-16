// Frontend/src/pages/admin/AdminPatients.tsx
import {
  Mail,
  Phone,
  CalendarDays,
  UserRound,
  RefreshCw,
} from "lucide-react";

import useAdminPatients from "../../hooks/useAdminPatients";

const AdminPatients = () => {
  const {
    patients,
    loading,
    error,
    fetchPatients,
  } = useAdminPatients();

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-center gap-3 py-16">
              <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />

              <p className="text-gray-500 font-medium">
                Loading patients...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <UserRound className="w-7 h-7 text-red-500" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                Unable to load patients
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {error}
              </p>

              <button
                onClick={fetchPatients}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Manage Patients
            </h1>

            <p className="mt-1 text-gray-500">
              View and manage registered patients.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
            <UserRound className="w-4 h-4 text-emerald-600" />

            <span className="text-sm font-semibold text-gray-700">
              {patients.length}{" "}
              {patients.length === 1
                ? "Patient"
                : "Patients"}
            </span>
          </div>
        </div>

        {/* ================================================== */}
        {/* PATIENT TABLE */}
        {/* ================================================== */}

        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Table Header */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">
              Registered Patients
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Patient accounts registered in the system.
            </p>
          </div>

          {patients.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <UserRound className="w-7 h-7 text-emerald-600" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No patients found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                There are currently no registered patients.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-225">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-emerald-50/30 transition-colors"
                    >

                      {/* Patient */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">

                          {patient.profileImage ? (
                            <img
                              src={patient.profileImage}
                              alt={patient.name}
                              referrerPolicy="no-referrer"
                              className="w-11 h-11 rounded-full object-cover border border-emerald-100"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center">
                              <UserRound className="w-5 h-5 text-emerald-600" />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-800">
                              {patient.name}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              ID: {patient.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}

                      <td className="px-6 py-4">
                        <div className="space-y-1.5">

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>
                              {patient.email}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>
                              {patient.phone || "Not provided"}
                            </span>
                          </div>

                        </div>
                      </td>

                      {/* Gender */}

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {patient.gender || "Not specified"}
                        </span>
                      </td>

                      {/* Date of Birth */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays className="w-4 h-4 text-gray-400" />

                          <span>
                            {patient.dateOfBirth
                              ? new Date(
                                  patient.dateOfBirth,
                                ).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )
                              : "Not provided"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1.5">

                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              patient.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                patient.isActive
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              }`}
                            />

                            {patient.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>

                          <span
                            className={`text-xs ${
                              patient.isEmailVerified
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {patient.isEmailVerified
                              ? "Email verified"
                              : "Email not verified"}
                          </span>

                        </div>
                      </td>

                      {/* Registered */}

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(
                            patient.createdAt,
                          ).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default AdminPatients;