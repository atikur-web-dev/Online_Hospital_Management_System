import { Mail, MapPin, Phone, User } from "lucide-react";

interface PatientFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE" | "OTHER" | "";
    address: string;
  };

  onChange: (
    field: keyof PatientFormProps["formData"],
    value: string
  ) => void;
}

const PatientForm = ({
  formData,
  onChange,
}: PatientFormProps) => {
  return (
    <div className="space-y-4">

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-emerald-800 mb-1.5">
          Full Name
        </label>

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />

          <input
            type="text"
            required
            value={formData.name}
            placeholder="John Doe"
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Email */}

      <div>
        <label className="block text-sm font-medium text-emerald-800 mb-1.5">
          Email Address
        </label>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />

          <input
            type="email"
            required
            value={formData.email}
            placeholder="john@example.com"
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Phone */}

      <div>
        <label className="block text-sm font-medium text-emerald-800 mb-1.5">
          Phone Number
        </label>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />

          <input
            type="tel"
            value={formData.phone}
            placeholder="+8801XXXXXXXXX"
            onChange={(e) => onChange("phone", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Date + Gender */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-emerald-800 mb-1.5">
            Date of Birth
          </label>

          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              onChange("dateOfBirth", e.target.value)
            }
            className="w-full px-4 py-3 rounded-xl border border-emerald-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-800 mb-1.5">
            Gender
          </label>

          <select
            value={formData.gender}
            onChange={(e) =>
              onChange("gender", e.target.value)
            }
            className="w-full px-4 py-3 rounded-xl border border-emerald-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

      </div>

      {/* Address */}

      <div>
        <label className="block text-sm font-medium text-emerald-800 mb-1.5">
          Address
        </label>

        <div className="relative">
          <MapPin className="absolute left-3 top-4 w-5 h-5 text-emerald-400" />

          <textarea
            rows={3}
            value={formData.address}
            placeholder="Enter your address"
            onChange={(e) => onChange("address", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>
      </div>

    </div>
  );
};

export default PatientForm;