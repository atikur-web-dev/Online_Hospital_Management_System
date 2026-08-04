// Frontend/src/components/doctor/appointments/AppointmentStats.tsx
import { ClipboardList, Hourglass, CheckCircle2, Check, TrendingUp, XCircle } from "lucide-react";

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    hover: "hover:border-blue-300",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    hover: "hover:border-emerald-300",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    hover: "hover:border-amber-300",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-600",
    hover: "hover:border-red-300",
  },
} as const;

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: keyof typeof colorMap;
}

const StatsCard = ({
  label,
  value,
  icon: Icon,
  color,
}: StatsCardProps) => {
  const colors = colorMap[color];

  return (
    <div
      className={`group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-lg border border-gray-100/80 ${colors.hover} transition-all duration-300 hover:-translate-y-1 overflow-hidden relative`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg}`}></div>

      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${colors.bg} flex items-center justify-center mb-2 sm:mb-3`}
      >
        <Icon className={`w-5 h-5 ${colors.text}`} />
      </div>

      <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider">
        {label}
      </p>

      <div className="flex items-center justify-between mt-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
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

interface Props {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

const AppointmentStats = ({
  total,
  pending,
  confirmed,
  completed,
  cancelled,
}: Props) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8">
      <StatsCard
        label="Total"
        value={total}
        icon={ClipboardList}
        color="blue"
      />

      <StatsCard
        label="Pending"
        value={pending}
        icon={Hourglass}
        color="amber"
      />

      <StatsCard
        label="Confirmed"
        value={confirmed}
        icon={CheckCircle2}
        color="emerald"
      />

      <StatsCard
        label="Completed"
        value={completed}
        icon={Check}
        color="blue"
      />

      <StatsCard
        label="Cancelled"
        value={cancelled}
        icon={XCircle}
        color="red"
      />
    </div>
  );
};

export default AppointmentStats;