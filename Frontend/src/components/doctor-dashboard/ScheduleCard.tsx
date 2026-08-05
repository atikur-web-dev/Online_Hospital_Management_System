// Frontend/src/components/doctor-dashboard/ScheduleCard.tsx
import {
  CalendarDays,
  Clock3,
  UserRound,
} from "lucide-react";

interface Appointment {
  id: string;
  appointmentAt: string;

  patient: {
    id: string;
    name: string;
  };
}

interface Props {
  appointments: Appointment[];
}

const ScheduleCard = ({ appointments }: Props) => {
  const getDayLabel = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    if (target.getTime() === today.getTime()) return "Today";

    if (target.getTime() === tomorrow.getTime())
      return "Tomorrow";

    return target.toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          This Week's Appointments
        </h2>

        <CalendarDays className="w-6 h-6 text-emerald-600" />
      </div>

      {appointments.length === 0 ? (
        <div className="py-10 text-center">
          <Clock3 className="mx-auto w-10 h-10 text-gray-300 mb-3" />

          <p className="text-gray-500">
            No appointments scheduled this week.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:bg-emerald-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center">
                  <UserRound className="w-5 h-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {appointment.patient.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {getDayLabel(
                      new Date(appointment.appointmentAt),
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-emerald-700">
                  {new Date(
                    appointment.appointmentAt,
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(
                    appointment.appointmentAt,
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;