// Frontend/src/components/doctor/appointments/AppointmentCard.tsx

import {
  Calendar,
  Clock3,
  Mail,
  Phone,
  Stethoscope,
  UserCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { Appointment } from "../../../types/appointment";

import AppointmentActions from "./AppointmentActions";
import AppointmentStatusBadge from "./AppointmentStatusBadge";

import {
  getInitials,
  formatAppointmentDate,
  formatAppointmentTime,
} from "../../../utils/appointment";

interface AppointmentCardProps {
  appointment: Appointment;

  onConfirm: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onDeletePermanently: (id: string) => void;

  isConfirming: boolean;
  isCompleting: boolean;
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
  onComplete,
  onCancel,
  onDeletePermanently,

  isConfirming,
  isCompleting,
  isCanceling,
  isDeleting,

  dayLabel,
  timeOfDay,
}: AppointmentCardProps) => {
  const navigate = useNavigate();

  const initials = getInitials(appointment.patient.name);

  const profileImage =
    appointment.patient.user.profileImage;

  const TimeIcon = timeOfDay.icon;

  const isPending =
    appointment.status === "PENDING";

  const isConfirmed =
    appointment.status === "CONFIRMED";

  const isCompleted =
    appointment.status === "COMPLETED";

  const isCancelled =
    appointment.status === "CANCELLED";

  const showActions =
    !isCompleted && !isCancelled;

  const showDeletePermanently =
    isCancelled;

  const handleConfirm = () => {
    onConfirm(appointment.id);
  };

  const handleComplete = () => {
    onComplete(appointment.id);
  };

  const handleCancel = () => {
    onCancel(appointment.id);
  };

  const handleDeletePermanently = () => {
    onDeletePermanently(appointment.id);
  };

  const handlePrescription = () => {
    navigate(
      `/doctor/prescription/${appointment.id}`,
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Patient Header */}
            <div className="flex items-start gap-4">
              {/* Profile Image */}
              <div className="shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={appointment.patient.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-200">
                    <span className="text-lg font-bold text-emerald-700">
                      {initials}
                    </span>
                  </div>
                )}
              </div>

              {/* Patient Information */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {appointment.patient.name}
                </h3>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Mail className="w-4 h-4 shrink-0" />

                    <span className="truncate">
                      {appointment.patient.user.email}
                    </span>
                  </div>

                  {appointment.patient.phone && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Phone className="w-4 h-4 shrink-0" />

                      <span>
                        {appointment.patient.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Appointment Meta */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-5">
              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-emerald-500" />

                <span className="font-medium">
                  {dayLabel}
                </span>

                {(
                  dayLabel === "Today" ||
                  dayLabel === "Tomorrow" ||
                  dayLabel === "Yesterday"
                ) && (
                  <span className="text-gray-400">
                    (
                    {formatAppointmentDate(
                      appointment.appointmentAt,
                    )}
                    )
                  </span>
                )}
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock3 className="w-4 h-4 text-emerald-500" />

                <span>
                  {formatAppointmentTime(
                    appointment.appointmentAt,
                  )}
                </span>

                <span
                  className={`flex items-center gap-1 text-xs ${timeOfDay.color}`}
                >
                  <TimeIcon className="w-3 h-3" />

                  <span>
                    {timeOfDay.label}
                  </span>
                </span>
              </div>

              {/* Gender */}
              {appointment.patient.gender && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserCircle2 className="w-4 h-4 text-emerald-500" />

                  <span className="capitalize">
                    {appointment.patient.gender.toLowerCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Problem */}
            {appointment.problem && (
              <div className="mt-5">
                <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <Stethoscope className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />

                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                      Patient Concern
                    </p>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      {appointment.problem}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Prescription Info */}
            {appointment.prescription && (
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    Prescription
                  </p>

                  <p className="text-sm font-medium text-gray-700 truncate mt-0.5">
                    {appointment.prescription.diagnosis}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/doctor/prescription/${appointment.prescription?.id}`,
                    )
                  }
                  className="shrink-0 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  View
                </button>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex flex-col items-start lg:items-end gap-3 lg:gap-4 w-full lg:w-auto">
            <AppointmentStatusBadge
              status={appointment.status}
            />

            <AppointmentActions
              appointmentId={appointment.id}
              isPending={isPending}
              isConfirmed={isConfirmed}
              isCompleted={isCompleted}
              hasPrescription={
                !!appointment.prescription
              }
              showActions={showActions}
              showDeletePermanently={
                showDeletePermanently
              }
              isConfirming={isConfirming}
              isCompleting={isCompleting}
              isCanceling={isCanceling}
              isDeleting={isDeleting}
              onConfirm={handleConfirm}
              onComplete={handleComplete}
              onCancel={handleCancel}
              onDeletePermanently={
                handleDeletePermanently
              }
              onCreatePrescription={
                handlePrescription
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;