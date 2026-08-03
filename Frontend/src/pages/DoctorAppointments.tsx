// Frontend/src/pages/DoctorAppointments.tsx

import { Calendar, Clock3, Phone, User, CheckCircle2 } from "lucide-react";
import { useDoctorAppointment } from "../hooks/useDoctorAppointment";

const DoctorAppointments = () => {
  const { appointments, loading, error } = useDoctorAppointment();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-lg font-semibold">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Doctor Appointments
        </h1>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-10 text-center">
            <p className="text-gray-500">
              No appointments found.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {appointments.map((appointment: any) => (

              <div
                key={appointment.id}
                className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6"
              >

                <div className="flex justify-between items-start">

                  <div className="space-y-3">

                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-lg">
                        {appointment.patient.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {appointment.patient.phone || "No phone"}
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(
                        appointment.appointmentAt
                      ).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock3 className="w-4 h-4" />
                      {new Date(
                        appointment.appointmentAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    <div>
                      <span className="font-semibold">
                        Problem:
                      </span>{" "}
                      {appointment.problem || "Not provided"}
                    </div>

                  </div>

                  <div className="text-right">

                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold
                      ${
                        appointment.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : appointment.status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-700"
                          : appointment.status === "COMPLETED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {appointment.status}
                    </span>

                    <div className="mt-5 flex gap-2 justify-end">

                      <button
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
                      >
                        <CheckCircle2 className="inline w-4 h-4 mr-1" />
                        Confirm
                      </button>

                      <button
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorAppointments;