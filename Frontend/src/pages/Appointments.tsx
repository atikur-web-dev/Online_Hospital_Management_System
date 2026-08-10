// Frontend/src/pages/Appointments.tsx
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Building2,
  CircleAlert,
  Eye,
  XCircle,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { initiatePayment } from "../api/payment.api";
import DeleteAppointmentModal from "../components/appointment/DeleteAppointmentModal";
import { useAppointment } from "../hooks/useAppointment";
import AppointmentDetailsModal from "../components/appointment/AppointmentDetailsModal";

const statusStyle = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";

    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const Appointments = () => {
  const {
    loading,
    fetchMyAppointments,
    cancelMyAppointment,
    deleteMyAppointment,
  } = useAppointment();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [deleteAppointment, setDeleteAppointment] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const loadAppointments = async () => {
    try {
      const data = await fetchMyAppointments();
      setAppointments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayment = async (appointmentId: string) => {
    try {
      setPaymentLoading(appointmentId);

      const response = await initiatePayment(appointmentId);

      const gatewayPageURL =
        response?.data?.gatewayPageURL ?? response?.data?.GatewayPageURL;

      if (!gatewayPageURL) {
        throw new Error("Payment gateway URL was not returned.");
      }

      // Redirect patient to SSLCommerz
      window.location.href = gatewayPageURL;
    } catch (error: any) {
      console.error("Payment initiation error:", error);

      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Failed to initiate payment.",
      );
    } finally {
      setPaymentLoading(null);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    const toastId = toast.loading("Cancelling appointment...");

    try {
      await cancelMyAppointment(appointmentId);

      toast.success("Appointment cancelled successfully.", {
        id: toastId,
      });

      await loadAppointments();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to cancel appointment.",
        {
          id: toastId,
        },
      );
    }
  };

  const handleDelete = async (appointmentId: string) => {
    const toastId = toast.loading("Deleting appointment...");

    try {
      await deleteMyAppointment(appointmentId);

      toast.success("Appointment removed from your dashboard.", {
        id: toastId,
      });

      await loadAppointments();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to delete appointment.",
        {
          id: toastId,
        },
      );
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      {/* Header */}

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-emerald-900">My Appointments</h1>

        <p className="mt-2 text-gray-500 text-lg">
          Manage your upcoming and previous appointments.
        </p>
      </div>

      {loading && (
        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-3xl bg-white border border-emerald-100 p-8 h-56"
            />
          ))}
        </div>
      )}

      {!loading && appointments.length === 0 && (
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm py-24 text-center">
          <CalendarDays size={70} className="mx-auto text-emerald-500" />

          <h2 className="mt-6 text-3xl font-bold text-emerald-900">
            No Appointments Yet
          </h2>

          <p className="mt-3 text-gray-500 text-lg">
            Book your first appointment with one of our experienced doctors.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                {/* Left */}

                <div className="flex gap-6">
                  <img
                    src={
                      appointment.doctor.user.profileImage ??
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        appointment.doctor.name,
                      )}&background=10b981&color=fff&size=256`
                    }
                    alt={appointment.doctor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
                  />

                  <div>
                    <h2 className="text-2xl font-bold text-emerald-900">
                      Dr. {appointment.doctor.name}
                    </h2>

                    <p className="text-emerald-600 font-semibold mt-1">
                      {appointment.doctor.specialization ?? "General Physician"}
                    </p>

                    <div className="mt-5 space-y-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building2 size={18} className="text-emerald-600" />
                        {appointment.doctor.department?.name ??
                          "General Department"}
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays size={18} className="text-emerald-600" />
                        {new Date(
                          appointment.appointmentAt,
                        ).toLocaleDateString()}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock3 size={18} className="text-emerald-600" />
                        {new Date(appointment.appointmentAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right */}

                <div className="flex flex-col items-start lg:items-end justify-between">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${statusStyle(
                      appointment.status,
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>

              {/* Problem */}

              {appointment.problem && (
                <div className="mt-8 rounded-2xl bg-gray-50 border border-gray-200 p-5">
                  <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <CircleAlert size={18} className="text-amber-500" />
                    Problem
                  </div>

                  <p className="mt-3 text-gray-600 leading-7">
                    {appointment.problem}
                  </p>
                </div>
              )}

              {/* Buttons */}

              <div className="mt-8 flex flex-wrap gap-4">
                {/* View Details */}

                <button
                  onClick={() => setSelectedAppointment(appointment)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition px-6 py-3 text-white font-semibold"
                >
                  <Eye size={18} />
                  View Details
                </button>

                {/* Payment */}

                {appointment.payment?.status === "PAID" ? (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-3 font-semibold text-emerald-700">
                    <CheckCircle2 size={18} />
                    Paid
                  </div>
                ) : appointment.status === "PENDING" ? (
                  <button
                    type="button"
                    onClick={() => handlePayment(appointment.id)}
                    disabled={paymentLoading === appointment.id}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CreditCard size={18} />

                    {paymentLoading === appointment.id
                      ? "Redirecting..."
                      : `Pay ৳${appointment.doctor.consultationFee ?? "N/A"}`}
                  </button>
                ) : null}

                {/* Cancel / Delete */}

                {appointment.status === "CANCELLED" ? (
                  <button
                    onClick={() => setDeleteAppointment(appointment)}
                    className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 transition px-6 py-3 text-white font-semibold"
                  >
                    <XCircle size={18} />
                    Delete Permanently
                  </button>
                ) : (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    disabled={appointment.status === "COMPLETED"}
                    className="flex items-center gap-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition px-6 py-3 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <XCircle size={18} />
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
      <DeleteAppointmentModal
        open={!!deleteAppointment}
        doctorName={deleteAppointment?.doctor?.name ?? ""}
        specialization={deleteAppointment?.doctor?.specialization}
        profileImage={deleteAppointment?.doctor?.user?.profileImage}
        onClose={() => setDeleteAppointment(null)}
        onConfirm={async () => {
          if (!deleteAppointment) return;

          await handleDelete(deleteAppointment.id);
          setDeleteAppointment(null);
        }}
      />
    </div>
  );
};

export default Appointments;
