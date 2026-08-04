// Frontend/src/utils/appointment.ts
import type { Appointment } from "../types/appointment";
import { Moon, Sun, Sunset } from "lucide-react";
export const getStatusConfig = (
  status: Appointment["status"],
) => {
  switch (status) {
    case "PENDING":
      return {
        label: "Pending",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-l-amber-400",
        dotColor: "bg-amber-400",
      };

    case "CONFIRMED":
      return {
        label: "Confirmed",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        borderColor: "border-l-emerald-400",
        dotColor: "bg-emerald-400",
      };

    case "COMPLETED":
      return {
        label: "Completed",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-l-blue-400",
        dotColor: "bg-blue-400",
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-l-red-400",
        dotColor: "bg-red-400",
      };

    default:
      return {
        label: status,
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
        borderColor: "border-l-gray-300",
        dotColor: "bg-gray-400",
      };
  }
};

export const getInitials = (name: string) => {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const formatAppointmentDate = (
  date: string,
) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatAppointmentTime = (
  date: string,
) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getDayLabel = (date: Date) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (target.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";

  if (diffDays === 1) return "Tomorrow";

  if (diffDays === -1) return "Yesterday";

  return formatAppointmentDate(date.toISOString());
};

export const getTimeOfDay = (date: Date) => {
  const hour = date.getHours();

  if (hour < 12)
    return {
      label: "Morning",
      icon: Sun,
      color: "text-amber-500",
    };

  if (hour < 17)
    return {
      label: "Afternoon",
      icon: Sun,
      color: "text-orange-500",
    };

  if (hour < 20)
    return {
      label: "Evening",
      icon: Sunset,
      color: "text-purple-500",
    };

  return {
    label: "Night",
    icon: Moon,
    color: "text-indigo-500",
  };
};