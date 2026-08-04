// Frontend/src/pages/DoctorAppointments.tsx
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  cancelAppointment,
  confirmAppointment,
} from "../api/doctorAppointment.api";
import {
  AppointmentCard,
  AppointmentHeader,
  AppointmentSkeleton,
  AppointmentStats,
  ConfirmationModal,
  EmptyState,
} from "../components/doctor/appointments";
import { useDoctorAppointment } from "../hooks/useDoctorAppointment";
import type { Appointment } from "../types/appointment";
import { getDayLabel, getTimeOfDay } from "../utils/appointment";

// Main Component
const DoctorAppointments = () => {
  const { appointments, loading, error, fetchAppointments } =
    useDoctorAppointment();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modalAppointment, setModalAppointment] = useState<Appointment | null>(
    null,
  );
  // Initialize hiddenAppointments from localStorage immediately
  const [hiddenAppointments, setHiddenAppointments] = useState<Set<string>>(
    () => {
      const stored = localStorage.getItem("hiddenAppointments");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return new Set(parsed);
          }
        } catch (e) {
          console.error("Failed to parse hidden appointments", e);
        }
      }
      return new Set();
    },
  );

  // Save hidden appointments to localStorage
  useEffect(() => {
    localStorage.setItem(
      "hiddenAppointments",
      JSON.stringify(Array.from(hiddenAppointments)),
    );
  }, [hiddenAppointments]);

  const filteredAppointments = useMemo(() => {
    const visibleAppointments = appointments.filter(
      (appointment: Appointment) => !hiddenAppointments.has(appointment.id),
    );
    if (!search.trim()) return visibleAppointments;
    const searchLower = search.toLowerCase();
    return visibleAppointments.filter((appointment: Appointment) => {
      const patient = appointment.patient;
      return (
        patient.name.toLowerCase().includes(searchLower) ||
        patient.user.email.toLowerCase().includes(searchLower) ||
        (patient.phone && patient.phone.toLowerCase().includes(searchLower))
      );
    });
  }, [appointments, search, hiddenAppointments]);

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (a: Appointment) => a.status === "PENDING",
  ).length;
  const confirmedAppointments = appointments.filter(
    (a: Appointment) => a.status === "CONFIRMED",
  ).length;
  const completedAppointments = appointments.filter(
    (a: Appointment) => a.status === "COMPLETED",
  ).length;
  const cancelledAppointments = appointments.filter(
    (a: Appointment) => a.status === "CANCELLED",
  ).length;

  const handleConfirm = async (id: string) => {
    try {
      setConfirmingId(id);
      await confirmAppointment(id);
      toast.success("Appointment confirmed successfully!");
      await fetchAppointments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to confirm appointment.");
    } finally {
      setConfirmingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      setCancelingId(id);
      await cancelAppointment(id);
      toast.success("Appointment cancelled successfully!");
      await fetchAppointments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel appointment.");
    } finally {
      setCancelingId(null);
    }
  };

  const handleDeletePermanently = (id: string) => {
    const appointment = appointments.find((a: Appointment) => a.id === id);
    if (appointment) {
      setModalAppointment(appointment);
    }
  };

  const confirmDeletePermanently = async () => {
    if (!modalAppointment) return;
    try {
      setDeletingId(modalAppointment.id);

      // Create a new Set with the hidden appointment added
      const newHiddenAppointments = new Set(hiddenAppointments);
      newHiddenAppointments.add(modalAppointment.id);
      setHiddenAppointments(newHiddenAppointments);

      toast.success(
        `Appointment with ${modalAppointment.patient.name} has been removed from your dashboard.`,
      );
      setModalAppointment(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove appointment.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <AppointmentSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-red-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Failed to Load
          </h3>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchAppointments()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <AppointmentHeader search={search} setSearch={setSearch} />

          {/* Statistics Section */}
          <AppointmentStats
            total={totalAppointments}
            pending={pendingAppointments}
            confirmed={confirmedAppointments}
            completed={completedAppointments}
            cancelled={cancelledAppointments}
          />

          {/* Appointments List */}
          {appointments.length === 0 ? (
            <EmptyState type="appointments" />
          ) : filteredAppointments.length === 0 ? (
            <EmptyState type="search" search={search} />
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {filteredAppointments.map((appointment: Appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                  onDeletePermanently={handleDeletePermanently}
                  isConfirming={confirmingId === appointment.id}
                  isCanceling={cancelingId === appointment.id}
                  isDeleting={deletingId === appointment.id}
                  dayLabel={getDayLabel(new Date(appointment.appointmentAt))}
                  timeOfDay={getTimeOfDay(new Date(appointment.appointmentAt))}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!modalAppointment}
        onClose={() => setModalAppointment(null)}
        onConfirm={confirmDeletePermanently}
        patientName={modalAppointment?.patient.name || ""}
        isDeleting={!!deletingId}
      />
    </>
  );
};

export default DoctorAppointments;
