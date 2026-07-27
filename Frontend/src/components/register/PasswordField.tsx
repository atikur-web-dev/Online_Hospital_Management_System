import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordFieldProps {
  label: string;
  value: string;
  placeholder: string;
  showPassword: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}

const PasswordField = ({
  label,
  value,
  placeholder,
  showPassword,
  onToggle,
  onChange,
}: PasswordFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-emerald-800 mb-1.5">
        {label}
      </label>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />

        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          minLength={8}
          required
          className="w-full pl-10 pr-12 py-3 bg-white border border-emerald-200 rounded-xl
          focus:outline-none focus:ring-2 focus:ring-emerald-500
          focus:border-emerald-500 text-emerald-900
          placeholder-emerald-400"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;