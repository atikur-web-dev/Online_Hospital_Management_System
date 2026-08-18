// Frontend/src/pages/admin/AdminPayments.tsx
import {
  CreditCard,
  RefreshCw,
  UserRound,
  Stethoscope,
  CalendarDays,
  CircleDollarSign,
} from "lucide-react";

import useAdminPayments from "../../hooks/useAdminPayments";

const AdminPayments = () => {
  const { payments, loading, error, fetchPayments } = useAdminPayments();

  // ============================================================
  // LOADING
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
                <CreditCard className="w-7 h-7 text-red-500" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                Unable to load payments
              </h2>

              <p className="mt-1 text-sm text-gray-500">{error}</p>

              <button
                onClick={fetchPayments}
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
              Manage Payments
            </h1>

            <p className="mt-1 text-gray-500">
              View and monitor all payment transactions.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
            <CreditCard className="w-4 h-4 text-emerald-600" />

            <span className="text-sm font-semibold text-gray-700">
              {payments.length} {payments.length === 1 ? "Payment" : "Payments"}
            </span>
          </div>
        </div>

        {/* ================================================== */}
        {/* PAYMENT TABLE */}
        {/* ================================================== */}

        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Header */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">
              Payment Transactions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              All payment transactions recorded in the system.
            </p>
          </div>

          {/* Empty State */}

          {payments.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-emerald-600" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No payments found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                There are currently no payment transactions.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-275">
                {/* ================================================== */}
                {/* TABLE HEAD */}
                {/* ================================================== */}

                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Appointment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Paid At
                    </th>
                  </tr>
                </thead>

                {/* ================================================== */}
                {/* TABLE BODY */}
                {/* ================================================== */}

                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-emerald-50/30 transition-colors"
                    >
                      {/* Transaction */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-emerald-600" />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {payment.transactionId || "Pending"}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              ID: {payment.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Patient */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <UserRound className="w-4 h-4 text-gray-400" />

                          <div>
                            <p className="text-sm font-semibold text-gray-700">
                              {payment.patientName || "Unknown Patient"}
                            </p>

                            {payment.patientEmail && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {payment.patientEmail}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Doctor */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-gray-400" />

                          <div>
                            <p className="text-sm font-semibold text-gray-700">
                              {payment.doctorName || "Unknown Doctor"}
                            </p>

                            {payment.specialization && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {payment.specialization}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Appointment */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays className="w-4 h-4 text-gray-400" />

                          <span>
                            {payment.appointmentAt
                              ? new Date(payment.appointmentAt).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                  },
                                )
                              : "Not available"}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <CircleDollarSign className="w-4 h-4 text-emerald-600" />

                          <span className="text-sm font-bold text-gray-800">
                            {payment.currency === "BDT"
                              ? "৳"
                              : payment.currency}{" "}
                            {Number(payment.amount).toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            payment.status === "PAID"
                              ? "bg-emerald-50 text-emerald-700"
                              : payment.status === "PENDING"
                                ? "bg-amber-50 text-amber-700"
                                : payment.status === "FAILED"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              payment.status === "PAID"
                                ? "bg-emerald-500"
                                : payment.status === "PENDING"
                                  ? "bg-amber-500"
                                  : payment.status === "FAILED"
                                    ? "bg-red-500"
                                    : "bg-gray-400"
                            }`}
                          />

                          {payment.status}
                        </span>
                      </td>

                      {/* Paid At */}

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {payment.paidAt
                            ? new Date(payment.paidAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "Not paid"}
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

export default AdminPayments;
