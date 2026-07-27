import type { ChangeEvent } from "react";
import type { RegisterFormData } from "../../types/auth.types";

interface DoctorFormProps {
  formData: RegisterFormData;

  onChange: (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function DoctorForm({
  formData,
  onChange,
}: DoctorFormProps) {
  return (
    <>
      {/* Name */}

      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Full Name
        </label>

        <input
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          className="w-full rounded-xl border border-emerald-200 px-4 py-3"
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
          className="w-full rounded-xl border border-emerald-200 px-4 py-3"
        />
      </div>

      {/* Phone */}

      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Phone
        </label>

        <input
          name="phone"
          value={formData.phone}
          onChange={onChange}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3"
        />
      </div>

      {/* Specialization */}

      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Specialization
        </label>

        <input
          name="specialization"
          value={formData.specialization}
          onChange={onChange}
          placeholder="Cardiology"
          className="w-full rounded-xl border border-emerald-200 px-4 py-3"
        />
      </div>

      {/* Qualification */}

      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Qualification
        </label>

        <input
          name="qualification"
          value={formData.qualification}
          onChange={onChange}
          placeholder="MBBS, FCPS"
          className="w-full rounded-xl border border-emerald-200 px-4 py-3"
        />
      </div>

      {/* Experience */}

      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Experience (Years)
        </label>

        <input
          type="number"
          min="0"
          name="experience"
          value={formData.experience}
          onChange={onChange}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3"
        />
      </div>

      {/* Consultation Fee */}

      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Consultation Fee
        </label>

        <input
          type="number"
          min="0"
          name="consultationFee"
          value={formData.consultationFee}
          onChange={onChange}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3"
        />
      </div>
    </>
  );
}