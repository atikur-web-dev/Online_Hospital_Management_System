// Frontend/src/components/doctor/prescription/PrescriptionHeader.tsx
import { FileText, CalendarDays, UserRound } from "lucide-react";

interface Props {
  patientName?: string;
  appointmentDate?: string;
}

const PrescriptionHeader = ({
  patientName,
  appointmentDate,
}: Props) => {
  const doctorName =
    localStorage.getItem("name") || "Doctor";

  return (
    <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left */}
        <div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FileText className="w-7 h-7 text-emerald-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Prescription
              </h1>

              <p className="text-gray-500 mt-1">
                Create a prescription for today's consultation.
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <UserRound className="w-5 h-5 text-emerald-600" />

            <div>
              <p className="text-xs text-gray-500">
                Doctor
              </p>

              <p className="font-semibold text-gray-800">
                Dr. {doctorName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserRound className="w-5 h-5 text-blue-600" />

            <div>
              <p className="text-xs text-gray-500">
                Patient
              </p>

              <p className="font-semibold text-gray-800">
                {patientName || "Select Patient"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-purple-600" />

            <div>
              <p className="text-xs text-gray-500">
                Appointment
              </p>

              <p className="font-semibold text-gray-800">
                {appointmentDate || "--"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionHeader;