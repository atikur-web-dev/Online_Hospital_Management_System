// Frontend/src/components/doctor/appointments/AppointmentCard.tsx
import {
  Ban,
  Calendar,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  Phone,
  Stethoscope,
  Trash2,
  UserCheck,
  UserCircle2,
} from "lucide-react";

import type { Appointment } from "../../../types/appointment";

import AppointmentStatusBadge from "./AppointmentStatusBadge";

import {
  getInitials,
  formatAppointmentDate,
  formatAppointmentTime,
} from "../../../utils/appointment";

interface AppointmentCardProps {
  appointment: Appointment;

  onConfirm: (id: string) => void;

  onCancel: (id: string) => void;

  onDeletePermanently: (id: string) => void;

  isConfirming: boolean;

  isCanceling: boolean;

  isDeleting: boolean;

  dayLabel: string;

  timeOfDay: {
    label: string;
    color: string;
    icon: React.ElementType;
  };
}

const AppointmentCard = ({
  appointment,
  onConfirm,
  onCancel,
  onDeletePermanently,
  isConfirming,
  isCanceling,
  isDeleting,
  dayLabel,
  timeOfDay,
}: AppointmentCardProps) => {
  const initials = getInitials(appointment.patient.name);

  const profileImage = appointment.patient.user.profileImage;

  const TimeIcon = timeOfDay.icon;

  const isPending = appointment.status === "PENDING";

  const isConfirmed = appointment.status === "CONFIRMED";

  const isCompleted = appointment.status === "COMPLETED";

  const isCancelled = appointment.status === "CANCELLED";

  const showActions = !isCompleted && !isCancelled;

  const showDeletePermanently = isCancelled;

  const handleConfirm = () => onConfirm(appointment.id);

  const handleCancel = () => onCancel(appointment.id);

  const handleDeletePermanently = () =>
    onDeletePermanently(appointment.id);

  return ( 
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">

          {/* Left */}
          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-3 sm:gap-4">

              <div className="flex-shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={appointment.patient.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-emerald-100 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center ring-2 ring-emerald-200 shadow-sm">
                    <span className="text-white font-semibold">
                      {initials}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">

                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {appointment.patient.name}
                </h3>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>{appointment.patient.user.email}</span>
                  </div>

                  {appointment.patient.phone && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Phone className="w-4 h-4" />
                      <span>{appointment.patient.phone}</span>
                    </div>
                  )}

                </div>

              </div>

            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4">

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-emerald-500" />

                <span className="font-medium">
                  {dayLabel}
                </span>

                {(dayLabel === "Today" ||
                  dayLabel === "Tomorrow" ||
                  dayLabel === "Yesterday") && (
                  <span className="text-gray-400">
                    ({formatAppointmentDate(appointment.appointmentAt)})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock3 className="w-4 h-4 text-emerald-500" />

                <span>
                  {formatAppointmentTime(appointment.appointmentAt)}
                </span>

                <span
                  className={`flex items-center gap-1 text-xs ${timeOfDay.color}`}
                >
                  <TimeIcon className="w-3 h-3" />
                  <span>{timeOfDay.label}</span>
                </span>

              </div>

              {appointment.patient.gender && (
                <div className="flex items-center gap-2 text-sm text-gray-600">

                  <UserCircle2 className="w-4 h-4 text-emerald-500" />

                  <span className="capitalize">
                    {appointment.patient.gender.toLowerCase()}
                  </span>

                </div>
              )}

            </div>

            {appointment.problem && (

              <div className="mt-4">

                <div className="inline-flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">

                  <Stethoscope className="w-4 h-4 text-gray-500 mt-0.5" />

                  <span className="text-sm text-gray-700">
                    {appointment.problem}
                  </span>

                </div>

              </div>

            )}

          </div>           {/* Right */}
          <div className="flex flex-col items-start lg:items-end gap-3 lg:gap-4 w-full lg:w-auto">

            <AppointmentStatusBadge status={appointment.status} />

            {showActions && (
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">

                {isPending && (
                  <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm
                      </>
                    )}
                  </button>
                )}

                {isConfirmed && (
                  <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Complete
                      </>
                    )}
                  </button>
                )}

                {(isPending || isConfirmed) && (
                  <button
                    onClick={handleCancel}
                    disabled={isCanceling}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-700 border border-red-200 rounded-lg transition"
                  >
                    {isCanceling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <Ban className="w-4 h-4" />
                        Cancel
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
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition w-full lg:w-auto"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Permanently
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

export default AppointmentCard;