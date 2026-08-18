// Frontend/src/pages/admin/AdminPatients.tsx
import { useState } from "react";
import {
  Mail,
  Phone,
  CalendarDays,
  UserRound,
  RefreshCw,
  Search,
  UserX,
} from "lucide-react";

import useAdminPatients from "../../hooks/useAdminPatients";

const AdminPatients = () => {
  const {
    patients,
    loading,
    error,
    fetchPatients,
    deactivatePatient,
  } = useAdminPatients();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [actionPatientId, setActionPatientId] = useState<string | null>(null);

  // Deactivate handler
  const handleDeactivate = async (patientId: string) => {
    if (!window.confirm("Are you sure you want to block/deactivate this patient?")) {
      return;
    }
    try {
      setActionPatientId(patientId);
      await deactivatePatient(patientId);
    } catch (err) {
      console.error("Failed to deactivate patient:", err);
    } finally {
      setActionPatientId(null);
    }
  };

  // Search filtering
  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      (patient.phone && patient.phone.toLowerCase().includes(query))
    );
  });

  // ============================================================
  // LOADING SKELETON
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <div className="h-8 w-56 bg-gray-200 rounded-lg" />
              <div className="mt-3 h-4 w-72 bg-gray-200 rounded-md" />
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded-lg" />
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="h-6 w-48 bg-gray-200 rounded-md mb-4" />
            <div className="space-y-3">
              <div className="h-8 bg-gray-100 rounded-md" />
              <div className="h-12 bg-gray-50 rounded-md" />
              <div className="h-12 bg-gray-50 rounded-md" />
              <div className="h-12 bg-gray-50 rounded-md" />
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

          {/* Table Header with Search */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Registered Patients
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Patient accounts registered in the system.
              </p>
            </div>

            <div className="relative max-w-md w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {filteredPatients.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <UserRound className="w-7 h-7 text-emerald-600" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No patients found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                There are currently no patients matching your search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
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

                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredPatients.map((patient) => (
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

                      {/* Actions */}

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => handleDeactivate(patient.id)}
                            disabled={!patient.isActive || actionPatientId === patient.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionPatientId === patient.id ? (
                              <span className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                            Block
                          </button>
                        </div>
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