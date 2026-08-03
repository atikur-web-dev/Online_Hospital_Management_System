// Frontend/src/components/doctor-dashboard/StatsCards.tsx
import {
  Users,
  CalendarCheck,
  DollarSign,
  Star,
} from "lucide-react";

const stats = [
  {
    title: "Today's Appointments",
    value: "12",
    icon: CalendarCheck,
    color: "emerald",
  },
  {
    title: "Total Patients",
    value: "248",
    icon: Users,
    color: "blue",
  },
  {
    title: "This Month Income",
    value: "$4,850",
    icon: DollarSign,
    color: "amber",
  },
  {
    title: "Average Rating",
    value: "4.9",
    icon: Star,
    color: "purple",
  },
];

const colorClasses = {
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
};

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => {
        const Icon = item.icon;
        const colors =
          colorClasses[item.color as keyof typeof colorClasses];

        return (
          <div
            key={item.title}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {item.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${colors.bg}`}
              >
                <Icon className={`w-7 h-7 ${colors.text}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;