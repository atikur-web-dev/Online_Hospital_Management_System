// Frontend/src/components/doctor-dashboard/TodayAppointments.tsx
import { CalendarClock } from "lucide-react";

const appointments = [
  {
    id: 1,
    patient: "John Smith",
    time: "09:00 AM",
    type: "Consultation",
    status: "Confirmed",
  },
  {
    id: 2,
    patient: "Emma Watson",
    time: "10:30 AM",
    type: "Follow-up",
    status: "Confirmed",
  },
  {
    id: 3,
    patient: "Michael Brown",
    time: "01:00 PM",
    type: "Consultation",
    status: "Pending",
  },
];

const TodayAppointments = () => {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Today's Appointments
        </h2>

        <CalendarClock className="w-6 h-6 text-emerald-600" />
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:bg-emerald-50 transition"
          >
            <div>
              <h3 className="font-semibold text-gray-800">
                {appointment.patient}
              </h3>

              <p className="text-sm text-gray-500">
                {appointment.type}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-emerald-700">
                {appointment.time}
              </p>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  appointment.status === "Confirmed"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {appointment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayAppointments;