// src/components/doctor-dashboard/DashboardHeader.tsx

import { CalendarDays } from "lucide-react";

const DashboardHeader = () => {
  const doctorName = localStorage.getItem("name") || "Doctor";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-emerald-600 font-medium">
            Welcome back,
          </p>

          <h1 className="text-3xl font-bold text-gray-800 mt-1">
            Dr. {doctorName}
          </h1>

          <p className="text-gray-500 mt-2">
            Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-5 py-3 rounded-xl">
          <CalendarDays className="w-5 h-5 text-emerald-600" />

          <span className="text-emerald-700 font-medium">
            {today}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;