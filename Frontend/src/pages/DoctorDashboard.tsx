// Frontend/src/pages/DoctorDashboard.tsx

import { useEffect, useState } from "react";
import { getDoctorDashboard } from "../api/doctor";

import DashboardHeader from "../components/doctor-dashboard/DashboardHeader";
import StatsCards from "../components/doctor-dashboard/StatsCards";
import AppointmentTable from "../components/doctor-dashboard/AppointmentTable";
import ScheduleCard from "../components/doctor-dashboard/ScheduleCard";
import QuickActions from "../components/doctor-dashboard/QuickActions";
import RecentPatients from "../components/doctor-dashboard/RecentPatients";
import TodayAppointments from "../components/doctor-dashboard/TodayAppointments";

const DoctorDashboard = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getDoctorDashboard();
        console.log(response.data);
        setDashboard(response.data);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-600 text-xl font-semibold">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <DashboardHeader />

        <StatsCards stats={dashboard.stats} />

        <AppointmentTable appointments={dashboard.appointments} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScheduleCard schedule={dashboard.schedule} />
          <QuickActions />
        </div>

        <TodayAppointments appointments={dashboard.appointments} />

        <RecentPatients patients={dashboard.recentPatients} />
      </div>
    </div>
  );
};

export default DoctorDashboard;
