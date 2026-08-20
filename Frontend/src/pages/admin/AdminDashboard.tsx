// Frontend/src/pages/admin/AdminDashboard.tsx

import {
  Users,
  CalendarDays,
  Stethoscope,
  Clock3,
  DollarSign,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import useAdminDashboard from "../../hooks/useAdminDashboard";

const AdminDashboard = () => {
  const { dashboard, loading, error, fetchDashboard } = useAdminDashboard();

 
  // LOADING
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-56 bg-gray-200 rounded-lg" />

            <div className="mt-3 h-4 w-72 bg-gray-200 rounded-md" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gray-200" />
                </div>

                <div className="mt-5 h-4 w-28 bg-gray-200 rounded-md" />

                <div className="mt-2 h-8 w-20 bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Appointment Trend */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <div className="h-6 w-48 bg-gray-200 rounded-md" />

              <div className="mt-2 h-4 w-64 bg-gray-200 rounded-md" />

              <div className="mt-6 h-80 bg-gray-100 rounded-xl" />
            </div>

            {/* Monthly Statistics */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <div className="h-6 w-48 bg-gray-200 rounded-md" />

              <div className="mt-2 h-4 w-64 bg-gray-200 rounded-md" />

              <div className="mt-6 h-80 bg-gray-100 rounded-xl" />
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-5 h-5 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />

            <p className="text-sm font-medium text-gray-500">
              Preparing your dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  
  // ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 font-medium">{error}</p>

        <button
          onClick={fetchDashboard}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }


  // NO DATA
  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No dashboard data available.</p>
      </div>
    );
  }

  const { stats } = dashboard;
  const appointmentTrend = dashboard.appointmentTrend ?? [];


  // STAT CARDS
  const statCards = [
    {
      title: "Today's Patients",
      value: stats.todayPatients,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: CalendarDays,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Active Doctors",
      value: stats.activeDoctors,
      icon: Stethoscope,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: Clock3,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Today's Revenue",
      value: `৳${stats.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];


  // RENDER
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-gray-500">Welcome back, Admin.</p>
        </div>

    
        {/* STAT CARDS */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}
                  >
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                </div>

                {/* Title */}
                <p className="mt-5 text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                {/* Value */}
                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

       
        {/* APPOINTMENT TREND */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          {/* Chart Header */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              Appointment Trend
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Appointments over the last 7 days
            </p>
          </div>

          {/* Chart */}
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dashboard.appointmentTrend}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(date: string) =>
                    new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  labelFormatter={(date) =>
                    new Date(String(date)).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  }
                />

                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

       
        {/* MONTHLY STATISTICS */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              Monthly Statistics
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Monthly revenue and patient registrations
            </p>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboard.monthlyStats}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="month"
                  tickFormatter={(month: string) => {
                    const [year, monthNumber] = month.split("-");

                    return new Date(
                      Number(year),
                      Number(monthNumber) - 1,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                    });
                  }}
                />

                <YAxis
                  yAxisId="revenue"
                  orientation="left"
                  tickFormatter={(value: number) => `৳${value}`}
                />

                <YAxis
                  yAxisId="patients"
                  orientation="right"
                  allowDecimals={false}
                />

                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Revenue") {
                      return [`৳${Number(value ?? 0).toLocaleString()}`, name];
                    }

                    return [Number(value ?? 0), name];
                  }}
                />

                <Legend />

                <Bar
                  yAxisId="revenue"
                  dataKey="revenue"
                  name="Revenue"
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                />

                <Line
                  yAxisId="patients"
                  type="monotone"
                  dataKey="patients"
                  name="Patients"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
