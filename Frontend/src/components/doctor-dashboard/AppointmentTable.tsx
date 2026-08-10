import {
  Eye,
  CheckCircle2,
  Clock3,
} from "lucide-react";

interface Appointment {
  id: string;
  appointmentAt: string;
  status: string;

  patient: {
    id: string;
    name: string;
    phone?: string | null;
  };
}

interface Props {
  appointments: Appointment[];
}

const AppointmentTable = ({ appointments }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Upcoming Appointments
        </h2>

      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3">Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-500"
                >
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b last:border-0 hover:bg-emerald-50"
                >
                  <td className="py-4 font-medium">
                    {appointment.patient.name}
                  </td>

                  <td>
                    {new Date(
                      appointment.appointmentAt
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {new Date(
                      appointment.appointmentAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td>
                    {appointment.status === "CONFIRMED" && (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 size={16} />
                        Confirmed
                      </span>
                    )}

                    {appointment.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1 text-yellow-600">
                        <Clock3 size={16} />
                        Pending
                      </span>
                    )}

                    {appointment.status === "COMPLETED" && (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;