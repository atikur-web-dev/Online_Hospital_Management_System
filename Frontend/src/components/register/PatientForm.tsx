import type { ChangeEvent } from "react";
import type { RegisterFormData } from "../../types/auth.types";

interface PatientFormProps {
  formData: RegisterFormData;
  onChange: (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function PatientForm({
  formData,
  onChange,
}: PatientFormProps) {
  return (
    <>
      {/* Full Name */}

      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Full Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          placeholder="John Doe"
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Email */}

      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
          placeholder="john@gmail.com"
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Phone */}

      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Phone
        </label>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="+8801XXXXXXXXX"
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Date of Birth */}

      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Date of Birth
        </label>

        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={onChange}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Gender */}

      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Gender
        </label>

        <select
          name="gender"
          value={formData.gender}
          onChange={onChange}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Address */}

      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Address
        </label>

        <textarea
          rows={3}
          name="address"
          value={formData.address}
          onChange={onChange}
          placeholder="Your address"
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
        />
      </div>
    </>
  );
}