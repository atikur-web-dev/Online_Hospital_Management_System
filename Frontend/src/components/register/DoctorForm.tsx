import {
  Mail,
  Phone,
  User,
  BriefcaseMedical,
  GraduationCap,
  BadgeDollarSign,
} from "lucide-react";

interface DoctorFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    specialization: string;
    qualification: string;
    experience: string;
    consultationFee: string;
  };

  onChange: (
    field: keyof DoctorFormProps["formData"],
    value: string
  ) => void;
}

const DoctorForm = ({
  formData,
  onChange,
}: DoctorFormProps) => {
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
            placeholder="Dr. John Doe"
            value={formData.name}
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
            placeholder="doctor@example.com"
            value={formData.email}
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
            placeholder="+8801XXXXXXXXX"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Specialization */}

      <div>
        <label className="block text-sm font-medium text-emerald-800 mb-1.5">
          Specialization
        </label>

        <div className="relative">
          <BriefcaseMedical className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />

          <input
            type="text"
            placeholder="Cardiology"
            value={formData.specialization}
            onChange={(e) =>
              onChange("specialization", e.target.value)
            }
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Qualification */}

      <div>
        <label className="block text-sm font-medium text-emerald-800 mb-1.5">
          Qualification
        </label>

        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />

          <input
            type="text"
            placeholder="MBBS, FCPS"
            value={formData.qualification}
            onChange={(e) =>
              onChange("qualification", e.target.value)
            }
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Experience + Fee */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-emerald-800 mb-1.5">
            Experience (Years)
          </label>

          <input
            type="number"
            min={0}
            placeholder="5"
            value={formData.experience}
            onChange={(e) =>
              onChange("experience", e.target.value)
            }
            className="w-full px-4 py-3 rounded-xl border border-emerald-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-800 mb-1.5">
            Consultation Fee (৳)
          </label>

          <div className="relative">
            <BadgeDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />

            <input
              type="number"
              min={0}
              placeholder="800"
              value={formData.consultationFee}
              onChange={(e) =>
                onChange("consultationFee", e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-200
              focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default DoctorForm;