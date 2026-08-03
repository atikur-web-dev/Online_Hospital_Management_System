// Frontend/src/components/doctor-dashboard/QuickActions.tsx
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  UserRound,
  Settings,
} from "lucide-react";

const actions = [
  {
    title: "Appointments",
    description: "View today's appointments",
    icon: CalendarDays,
    link: "/doctor/appointments",
  },
{
  title: "Availability",
  description: "Manage Schedule",
  icon: Clock3,
  link: "/doctor/schedule",
},
  {
    title: "My Profile",
    description: "Update profile",
    icon: UserRound,
    link: "/profile",
  },
  {
    title: "Settings",
    description: "Account settings",
    icon: Settings,
    link: "/profile",
  },
];

const QuickActions = () => {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.link}
              className="group border border-emerald-100 rounded-xl p-5 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition">
                <Icon className="w-6 h-6 text-emerald-700" />
              </div>

              <h3 className="font-semibold text-gray-800">
                {action.title}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;