import {
  CalendarClock,
  CheckCircle2,
} from "lucide-react";

interface Appointment {
  id: string;
  appointmentAt: string;
  status: string;

  patient: {
    id: string;
    name: string;
  };
}

interface Props {
  appointments: Appointment[];
}

const TodayAppointments = ({
  appointments,
}: Props) => {
  const today = new Date().toDateString();

  const todayAppointments = appointments.filter(
    (item) =>
      new Date(item.appointmentAt).toDateString() === today
  );

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Today's Summary
        </h2>

        <CalendarClock className="w-6 h-6 text-emerald-600" />
      </div>

      {todayAppointments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No appointments today.
        </p>
      ) : (
        <div className="space-y-4">
          {todayAppointments.slice(0, 3).map((appointment) => (
            <div
              key={appointment.id}
              className="flex justify-between items-center border rounded-xl p-4 hover:bg-emerald-50 transition"
            >
              <div>
                <h3 className="font-semibold text-gray-800">
                  {appointment.patient.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(
                    appointment.appointmentAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 size={18} />
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodayAppointments;