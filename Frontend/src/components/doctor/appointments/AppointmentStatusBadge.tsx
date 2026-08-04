// Frontend/src/components/doctor/appointments/AppointmentStatusBadge.tsx
import { AppointmentStatus } from "../../../types/appointment";

interface Props {
  status: AppointmentStatus;
}

const statusConfig = {
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
} as const;

const AppointmentStatusBadge = ({ status }: Props) => {
  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${config.bg}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${config.dot}`}
      ></span>

      <span
        className={`text-sm font-semibold ${config.text}`}
      >
        {config.label}
      </span>
    </div>
  );
};

export default AppointmentStatusBadge;