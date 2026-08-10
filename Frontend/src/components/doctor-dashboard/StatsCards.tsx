// Frontend/src/components/doctor-dashboard/StatsCards.tsx
import {
  Users,
  CalendarCheck,
  DollarSign,
  Clock3,
} from "lucide-react";

interface Stats {
  todayAppointments: number;
  totalPatients: number;
  pendingAppointments: number;
  earningsToday: number;
}

interface Props {
  stats: Stats;
}

const StatsCards = ({ stats }: Props) => {
  const cards = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: CalendarCheck,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: Clock3,
      bg: "bg-yellow-50",
      color: "text-yellow-600",
    },
    {
      title: "Today's Earnings",
      value: `৳${stats.earningsToday}`,
      icon: DollarSign,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg}`}
              >
                <Icon className={`w-7 h-7 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;