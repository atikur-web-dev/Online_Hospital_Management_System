// Frontend/src/pages/DoctorAppointments.tsx

import {
  AlertCircle,
  Ban,
  Bell,
  BellRing,
  Calendar,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Hourglass,
  Loader2,
  Mail,
  Moon,
  Phone,
  RefreshCw,
  Search,
  Stethoscope,
  Sun,
  Sunset,
  Trash2,
  TrendingUp,
  UserCheck,
  UserCircle2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  cancelAppointment,
  confirmAppointment,
} from "../api/doctorAppointment.api";
import ConfirmationModal from "../components/doctor/appointments/ConfirmationModal";
import LoadingScreen from "../components/doctor/appointments/LoadingScreen";
import { useDoctorAppointment } from "../hooks/useDoctorAppointment";
import type { Appointment } from "../types/appointment";
import AppointmentCard from "../components/doctor/appointments/AppointmentCard";
import {
  getInitials,
  formatAppointmentDate,
  formatAppointmentTime,
  getDayLabel,
  getTimeOfDay,
} from "../utils/appointment";
import AppointmentStatusBadge from "../components/doctor/appointments/AppointmentStatusBadge";


const colorMap: Record<
  string,
  { bg: string; text: string; border: string; hover: string }
> = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    hover: "hover:border-blue-300",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    hover: "hover:border-emerald-300",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    hover: "hover:border-amber-300",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    hover: "hover:border-red-300",
  },
};

// Skeleton Component
const AppointmentSkeleton = () => (
  <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 lg:p-6 animate-pulse">
    <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-32 sm:w-40"></div>
            <div className="flex flex-wrap gap-3 mt-1.5">
              <div className="h-4 bg-gray-200 rounded w-40 sm:w-56"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          <div className="h-4 bg-gray-200 rounded w-28"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="mt-3">
          <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
        </div>
      </div>
      <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto">
        <div className="h-7 bg-gray-200 rounded-full w-24"></div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div className="h-10 bg-gray-200 rounded-lg w-full lg:w-28"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-full lg:w-28"></div>
        </div>
      </div>
    </div>
  </div>
);

// Search Component
const AppointmentSearch = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) => (
  <div className="relative w-full lg:w-80 xl:w-96">
    <Search
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      size={18}
    />
    <input
      type="text"
      placeholder="Search by name, phone, or email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      aria-label="Search appointments"
      className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60 transition-all duration-200"
    />
  </div>
);

// Stats Card Component
const StatsCard = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: keyof typeof colorMap;
}) => {
  const colors = colorMap[color];
  return (
    <div
      className={`group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-lg border border-gray-100/80 ${colors.hover} transition-all duration-300 hover:-translate-y-1 overflow-hidden relative`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg}`}></div>
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${colors.bg} flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text}`} />
      </div>
      <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-center justify-between mt-0.5">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          {value}
        </h2>
        {value > 0 && (
          <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>Active</span>
          </div>
        )}
      </div>
    </div>
  );
};

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

  // Load hidden appointments from localStorage
  // Save hidden appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "hiddenAppointments",
      JSON.stringify(Array.from(hiddenAppointments)),
    );
  }, [hiddenAppointments]);

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
    return <LoadingScreen />;
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
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight">
                Doctor Appointments
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 flex items-center gap-2">
                <span className="inline-block w-1 h-1 rounded-full bg-emerald-400"></span>
                Manage patient appointments quickly and efficiently
              </p>
            </div>
            <AppointmentSearch search={search} setSearch={setSearch} />
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8">
            <StatsCard
              label="Total"
              value={totalAppointments}
              icon={ClipboardList}
              color="blue"
            />
            <StatsCard
              label="Pending"
              value={pendingAppointments}
              icon={Hourglass}
              color="amber"
            />
            <StatsCard
              label="Confirmed"
              value={confirmedAppointments}
              icon={CheckCircle2}
              color="emerald"
            />
            <StatsCard
              label="Completed"
              value={completedAppointments}
              icon={Check}
              color="blue"
            />
            <StatsCard
              label="Cancelled"
              value={cancelledAppointments}
              icon={XCircle}
              color="red"
            />
          </div>

          {/* Appointments List */}
          {appointments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 lg:p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarClock className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Appointments Scheduled
                </h3>
                <p className="text-gray-500">
                  You don't have any appointments at the moment. Check back
                  later for new bookings.
                </p>
              </div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 lg:p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Patients Found
                </h3>
                <p className="text-gray-500">
                  No appointments match your search for "{search}". Try
                  adjusting your search terms.
                </p>
              </div>
            </div>
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
