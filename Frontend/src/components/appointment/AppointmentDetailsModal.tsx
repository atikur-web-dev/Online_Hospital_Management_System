// Frontend/src/components/appointment/AppointmentDetailsModal.tsx
import {
  X,
  CalendarDays,
  Clock3,
  Building2,
  CircleAlert,
  BadgeDollarSign,
  GraduationCap,
  Briefcase,
} from "lucide-react";

interface Props {
  appointment: any;
  onClose: () => void;
}

const statusStyle = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";

    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const AppointmentDetailsModal = ({
  appointment,
  onClose,
}: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Close */}

        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 hover:bg-gray-100 transition"
        >
          <X size={22} />
        </button>

        <div className="p-8">

          {/* Header */}

          <div className="flex flex-col md:flex-row gap-6">

            <img
              src={
                appointment.doctor.user.profileImage ??
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  appointment.doctor.name
                )}&background=10b981&color=fff&size=256`
              }
              alt={appointment.doctor.name}
              className="w-32 h-32 rounded-full border-4 border-emerald-100 object-cover"
            />

            <div className="flex-1">

              <h2 className="text-3xl font-bold text-emerald-900">
                Dr. {appointment.doctor.name}
              </h2>

              <p className="mt-1 text-lg text-emerald-600 font-semibold">
                {appointment.doctor.specialization ??
                  "General Physician"}
              </p>

              <span
                className={`inline-flex mt-4 px-4 py-2 rounded-full font-semibold text-sm ${statusStyle(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>

            </div>

          </div>

          {/* Information */}

          <div className="grid md:grid-cols-2 gap-5 mt-10">

            <div className="rounded-2xl border p-5">

              <div className="flex items-center gap-3">
                <Building2
                  className="text-emerald-600"
                  size={20}
                />
                <div>
                  <p className="text-sm text-gray-500">
                    Department
                  </p>
                  <p className="font-semibold">
                    {appointment.doctor.department?.name ??
                      "General"}
                  </p>
                </div>
              </div>

            </div>

            <div className="rounded-2xl border p-5">

              <div className="flex items-center gap-3">
                <CalendarDays
                  className="text-emerald-600"
                  size={20}
                />
                <div>
                  <p className="text-sm text-gray-500">
                    Appointment Date
                  </p>
                  <p className="font-semibold">
                    {new Date(
                      appointment.appointmentAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

            </div>

            <div className="rounded-2xl border p-5">

              <div className="flex items-center gap-3">
                <Clock3
                  className="text-emerald-600"
                  size={20}
                />
                <div>
                  <p className="text-sm text-gray-500">
                    Appointment Time
                  </p>
                  <p className="font-semibold">
                    {new Date(
                      appointment.appointmentAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

            </div>

            <div className="rounded-2xl border p-5">

              <div className="flex items-center gap-3">
                <BadgeDollarSign
                  className="text-emerald-600"
                  size={20}
                />
                <div>
                  <p className="text-sm text-gray-500">
                    Consultation Fee
                  </p>
                  <p className="font-semibold">
                    ৳
                    {appointment.doctor.consultationFee ??
                      "N/A"}
                  </p>
                </div>
              </div>

            </div>

            <div className="rounded-2xl border p-5">

              <div className="flex items-center gap-3">
                <Briefcase
                  className="text-emerald-600"
                  size={20}
                />
                <div>
                  <p className="text-sm text-gray-500">
                    Experience
                  </p>
                  <p className="font-semibold">
                    {appointment.doctor.experience ??
                      "N/A"}{" "}
                    Years
                  </p>
                </div>
              </div>

            </div>

            <div className="rounded-2xl border p-5">

              <div className="flex items-center gap-3">
                <GraduationCap
                  className="text-emerald-600"
                  size={20}
                />
                <div>
                  <p className="text-sm text-gray-500">
                    Qualification
                  </p>
                  <p className="font-semibold">
                    {appointment.doctor.qualification ??
                      "N/A"}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Problem */}

          {appointment.problem && (

            <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">

              <div className="flex items-center gap-2 text-amber-700 font-semibold">

                <CircleAlert size={20} />

                Patient Problem

              </div>

              <p className="mt-3 text-gray-700 leading-7">
                {appointment.problem}
              </p>

            </div>

          )}

          {/* Footer */}

          <div className="mt-8 flex justify-end">

            <button
              onClick={onClose}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-8 py-3 text-white font-semibold transition"
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
export default AppointmentDetailsModal;