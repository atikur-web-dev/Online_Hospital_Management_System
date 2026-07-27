import { User, Stethoscope } from "lucide-react";

interface RoleSelectorProps {
  role: "PATIENT" | "DOCTOR";
  onChange: (role: "PATIENT" | "DOCTOR") => void;
}

const RoleSelector = ({ role, onChange }: RoleSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-emerald-800">
        Register As
      </label>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("PATIENT")}
          className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 transition-all duration-200 ${
            role === "PATIENT"
              ? "border-emerald-600 bg-emerald-600 text-white shadow-lg"
              : "border-emerald-200 bg-white text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50"
          }`}
        >
          <User size={20} />
          <span className="font-semibold">Patient</span>
        </button>

        <button
          type="button"
          onClick={() => onChange("DOCTOR")}
          className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 transition-all duration-200 ${
            role === "DOCTOR"
              ? "border-emerald-600 bg-emerald-600 text-white shadow-lg"
              : "border-emerald-200 bg-white text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50"
          }`}
        >
          <Stethoscope size={20} />
          <span className="font-semibold">Doctor</span>
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;