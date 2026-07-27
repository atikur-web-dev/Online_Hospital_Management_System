interface RoleSelectorProps {
  role: "PATIENT" | "DOCTOR";
  onChange: (role: "PATIENT" | "DOCTOR") => void;
}

export default function RoleSelector({
  role,
  onChange,
}: RoleSelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-emerald-800">
        Register As
      </label>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("PATIENT")}
          className={`rounded-xl border-2 py-3 font-semibold transition-all duration-200 ${
            role === "PATIENT"
              ? "border-emerald-600 bg-emerald-50 text-emerald-700"
              : "border-emerald-200 bg-white hover:border-emerald-400"
          }`}
        >
          Patient
        </button>

        <button
          type="button"
          onClick={() => onChange("DOCTOR")}
          className={`rounded-xl border-2 py-3 font-semibold transition-all duration-200 ${
            role === "DOCTOR"
              ? "border-emerald-600 bg-emerald-50 text-emerald-700"
              : "border-emerald-200 bg-white hover:border-emerald-400"
          }`}
        >
          Doctor
        </button>
      </div>
    </div>
  );
}