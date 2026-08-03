// Frontend/src/pages/DoctorAppointments.tsx

import {
  Calendar,
  Clock3,
  Phone,
  User,
  CheckCircle2,
  Search,
  ClipboardList,
  XCircle,
  Hourglass,
  Loader2,
  UserCircle2,
  Mail,
  Stethoscope,
  Check,
  Ban,
  UserCheck,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  CalendarClock,
  Sun,
  Moon,
  Sunset,
  Trash2,
  Bell,
  BellRing,
} from "lucide-react";
import { useDoctorAppointment } from "../hooks/useDoctorAppointment";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import {
  confirmAppointment,
  cancelAppointment,
} from "../api/doctorAppointment.api";

// Types
interface Patient {
  id: string;
  name: string;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  user: {
    email: string;
    profileImage: string | null;
  };
}

interface Appointment {
  id: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  problem: string | null;
  appointmentAt: string;
  patient: Patient;
}

// Helper functions
const getStatusConfig = (status: Appointment["status"]) => {
  const configs = {
    PENDING: {
      label: "Pending",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-l-amber-400",
      dotColor: "bg-amber-400",
      icon: Clock3,
      shadowColor: "shadow-amber-100",
    },
    CONFIRMED: {
      label: "Confirmed",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-l-emerald-400",
      dotColor: "bg-emerald-400",
      icon: CheckCircle2,
      shadowColor: "shadow-emerald-100",
    },
    COMPLETED: {
      label: "Completed",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-l-blue-400",
      dotColor: "bg-blue-400",
      icon: Check,
      shadowColor: "shadow-blue-100",
    },
    CANCELLED: {
      label: "Cancelled",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-l-red-400",
      dotColor: "bg-red-400",
      icon: XCircle,
      shadowColor: "shadow-red-100",
    },
  };
  return configs[status];
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getDayLabel = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return targetDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getTimeOfDay = (date: Date) => {
  const hours = date.getHours();
  if (hours < 12)
    return { label: "Morning", icon: Sun, color: "text-amber-500" };
  if (hours < 17)
    return { label: "Afternoon", icon: Sun, color: "text-orange-500" };
  if (hours < 20)
    return { label: "Evening", icon: Sunset, color: "text-purple-500" };
  return { label: "Night", icon: Moon, color: "text-indigo-500" };
};

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

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName: string;
  isDeleting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-50 rounded-full mb-4">
            <BellRing className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
            Confirm Cancellation
          </h3>
          <div className="text-gray-600 text-center space-y-2">
            <p>
              You are about to cancel the appointment with{" "}
              <span className="font-semibold text-gray-800">{patientName}</span>
              .
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3 text-left">
              <div className="flex items-start gap-2">
                <Bell className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  The patient will be notified about this cancellation via email
                  and SMS. This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              The appointment will be removed from your dashboard.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200"
            >
              No, Keep It
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Cancel Appointment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: Appointment["status"] }) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full ${config.bgColor} ${config.textColor} shadow-sm ${config.shadowColor}`}
    >
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span className="text-xs sm:text-sm font-semibold">{config.label}</span>
      <span
        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${config.dotColor}`}
      ></span>
    </div>
  );
};

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

// Appointment Card Component
const AppointmentCard = ({
  appointment,
  onConfirm,
  onCancel,
  onDeletePermanently,
  isConfirming,
  isCanceling,
  isDeleting,
}: {
  appointment: Appointment;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onDeletePermanently: (id: string) => void;
  isConfirming: boolean;
  isCanceling: boolean;
  isDeleting: boolean;
}) => {
  const statusConfig = getStatusConfig(appointment.status);
  const initials = getInitials(appointment.patient.name);
  const profileImage = appointment.patient.user.profileImage;
  const appointmentDate = new Date(appointment.appointmentAt);
  const dayLabel = getDayLabel(appointmentDate);
  const timeOfDay = getTimeOfDay(appointmentDate);
  const TimeIcon = timeOfDay.icon;

  const isPending = appointment.status === "PENDING";
  const isConfirmed = appointment.status === "CONFIRMED";
  const isCompleted = appointment.status === "COMPLETED";
  const isCancelled = appointment.status === "CANCELLED";
  const showActions = !isCompleted && !isCancelled;
  const showDeletePermanently = isCancelled;

  const handleConfirm = () => onConfirm(appointment.id);
  const handleCancel = () => onCancel(appointment.id);
  const handleDeletePermanently = () => onDeletePermanently(appointment.id);

  return (
    <div
      className={`bg-white rounded-xl sm:rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-l-4 ${statusConfig.borderColor}`}
    >
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
          {/* Left - Patient Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={`${appointment.patient.name}'s profile`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-emerald-100 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center ring-2 ring-emerald-200 shadow-sm">
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                  {appointment.patient.name}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="truncate">
                      {appointment.patient.user.email}
                    </span>
                  </div>
                  {appointment.patient.phone && (
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{appointment.patient.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 sm:mt-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">{dayLabel}</span>
                {dayLabel === "Today" ||
                dayLabel === "Tomorrow" ||
                dayLabel === "Yesterday" ? (
                  <span className="text-gray-400">
                    (
                    {appointmentDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    )
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Clock3 className="w-4 h-4 text-emerald-500" />
                <span>
                  {appointmentDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className={`text-xs ${timeOfDay.color} flex items-center gap-1`}
                >
                  <TimeIcon className="w-3 h-3" />
                  <span>{timeOfDay.label}</span>
                </span>
              </div>
              {appointment.patient.gender && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <UserCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="capitalize">
                    {appointment.patient.gender.toLowerCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Problem Section */}
            {appointment.problem && (
              <div className="mt-3 sm:mt-4">
                <div className="inline-flex items-start gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 rounded-lg border border-gray-100 max-w-full">
                  <Stethoscope className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 break-words">
                    {appointment.problem}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right - Status & Actions */}
          <div className="flex flex-col items-start lg:items-end gap-3 lg:gap-4 w-full lg:w-auto">
            <StatusBadge status={appointment.status} />

            {showActions && (
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                {isPending && (
                  <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    aria-label="Confirm appointment"
                    className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95 w-full lg:w-auto"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm</span>
                      </>
                    )}
                  </button>
                )}
                {isConfirmed && (
                  <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    aria-label="Complete appointment"
                    className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95 w-full lg:w-auto"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Complete</span>
                      </>
                    )}
                  </button>
                )}
                {(isPending || isConfirmed) && (
                  <button
                    onClick={handleCancel}
                    disabled={isCanceling}
                    aria-label="Cancel appointment"
                    className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-red-700 text-sm font-medium rounded-lg border border-red-200 transition-all duration-200 hover:shadow-md active:scale-95 w-full lg:w-auto"
                  >
                    {isCanceling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Cancelling...</span>
                      </>
                    ) : (
                      <>
                        <Ban className="w-4 h-4" />
                        <span>Cancel</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {showDeletePermanently && (
              <button
                onClick={handleDeletePermanently}
                disabled={isDeleting}
                aria-label="Delete permanently"
                className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95 w-full lg:w-auto"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-48 sm:w-64"></div>
              <div className="h-4 bg-gray-200 rounded mt-2 w-64 sm:w-80"></div>
            </div>
            <div className="h-11 sm:h-12 bg-gray-200 rounded-xl w-full lg:w-80 xl:w-96"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg sm:rounded-xl mb-2 sm:mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-6 bg-gray-200 rounded w-10"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4 sm:space-y-5">
            {[...Array(3)].map((_, i) => (
              <AppointmentSkeleton key={i} />
            ))}
          </div>
        </div>
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
