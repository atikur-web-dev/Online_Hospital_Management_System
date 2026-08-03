// Frontend/src/components/doctor-dashboard/AppointmentTable.tsx
import {
  Eye,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const appointments = [
  {
    id: 1,
    patient: "John Smith",
    date: "Today",
    time: "09:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    patient: "Emma Watson",
    date: "Today",
    time: "10:30 AM",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Michael Brown",
    date: "Today",
    time: "02:00 PM",
    status: "Completed",
  },
];

const AppointmentTable = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Today's Appointments
        </h2>

        <button className="text-emerald-600 font-semibold hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3">Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="border-b last:border-0 hover:bg-emerald-50"
              >
                <td className="py-4 font-medium">
                  {appointment.patient}
                </td>

                <td>{appointment.date}</td>

                <td>{appointment.time}</td>

                <td>
                  {appointment.status === "Confirmed" && (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 size={16} />
                      Confirmed
                    </span>
                  )}

                  {appointment.status === "Pending" && (
                    <span className="inline-flex items-center gap-1 text-yellow-600">
                      <Clock3 size={16} />
                      Pending
                    </span>
                  )}

                  {appointment.status === "Completed" && (
                    <span className="inline-flex items-center gap-1 text-blue-600">
                      <CheckCircle2 size={16} />
                      Completed
                    </span>
                  )}
                </td>

                <td>
                  <button className="text-emerald-600 hover:text-emerald-800">
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;