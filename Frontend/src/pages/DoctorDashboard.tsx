import DashboardHeader from "../components/doctor-dashboard/DashboardHeader";
import StatsCards from "../components/doctor-dashboard/StatsCards";
import QuickActions from "../components/doctor-dashboard/QuickActions";
import AppointmentTable from "../components/doctor-dashboard/AppointmentTable";
import RecentPatients from "../components/doctor-dashboard/RecentPatients";
import ScheduleCard from "../components/doctor-dashboard/ScheduleCard";
const DoctorDashboard = () => {
  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <DashboardHeader />

        <StatsCards />
        <ScheduleCard />
        <QuickActions />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <AppointmentTable />
          </div>

          <RecentPatients />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
