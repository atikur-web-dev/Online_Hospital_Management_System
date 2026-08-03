// Frontend/src/components/doctor-dashboard/RecentPatients.tsx
import { UserRound } from "lucide-react";

const patients = [
  {
    id: 1,
    name: "John Smith",
    age: 35,
    disease: "Heart Checkup",
  },
  {
    id: 2,
    name: "Emma Watson",
    age: 28,
    disease: "Skin Allergy",
  },
  {
    id: 3,
    name: "Michael Brown",
    age: 44,
    disease: "Diabetes",
  },
  {
    id: 4,
    name: "Sophia Johnson",
    age: 31,
    disease: "Migraine",
  },
];

const RecentPatients = () => {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Recent Patients
      </h2>

      <div className="space-y-4">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 hover:bg-emerald-50 transition"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <UserRound className="w-6 h-6 text-emerald-700" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                {patient.name}
              </h3>

              <p className="text-sm text-gray-500">
                Age {patient.age} • {patient.disease}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPatients;