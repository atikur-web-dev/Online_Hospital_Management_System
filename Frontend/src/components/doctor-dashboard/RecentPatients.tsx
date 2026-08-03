// Frontend/src/components/doctor-dashboard/RecentPatients.tsx
import { UserRound } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  phone?: string | null;
}

interface Props {
  patients: Patient[];
}

const RecentPatients = ({ patients }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Recent Patients
      </h2>

      {patients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No recent patients.
        </div>
      ) : (
        <div className="space-y-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between border rounded-xl p-4 hover:bg-emerald-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <UserRound className="text-emerald-600" size={22} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {patient.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {patient.phone || "No phone"}
                  </p>
                </div>
              </div>

              <button className="text-sm font-semibold text-emerald-600 hover:underline">
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPatients;