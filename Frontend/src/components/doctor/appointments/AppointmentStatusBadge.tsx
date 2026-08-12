// Frontend/src/components/doctor/appointments/AppointmentStatusBadge.tsx

import type { AppointmentStatus } from "../../../types/appointment";

interface Props {
  status: AppointmentStatus;
}

const statusConfig: Record<
  AppointmentStatus,
  {
    label: string;
    bg: string;
    text: string;
    dot: string;
  }
> = {
  PENDING: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },

  CONFIRMED: {
    label: "Confirmed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },

  COMPLETED: {
    label: "Completed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },

  CANCELLED: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },

  NO_SHOW: {
    label: "No Show",
    bg: "bg-gray-100",
    text: "text-gray-700",
    dot: "bg-gray-500",
  },
};

const AppointmentStatusBadge = ({ status }: Props) => {
  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${config.bg}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${config.dot}`}
      />

      <span
        className={`text-sm font-semibold ${config.text}`}
      >
        {config.label}
      </span>
    </div>
  );
};

export default AppointmentStatusBadge;