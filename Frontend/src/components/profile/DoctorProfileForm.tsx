// Frontend/src/components/profile/DoctorProfileForm.tsx
import { useEffect, useState } from "react";

import type {
  DoctorProfile,
} from "../../types/profile.types";

interface DoctorProfileFormProps {
  profile: DoctorProfile;
  onSubmit: (
    data: Partial<DoctorProfile>
  ) => Promise<unknown>;
}

const DoctorProfileForm = ({
  profile,
  onSubmit,
}: DoctorProfileFormProps) => {
  const [saving, setSaving] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    isAvailable: true,
  });

  useEffect(() => {
    setForm({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      specialization:
        profile.specialization ?? "",
      qualification:
        profile.qualification ?? "",
      experience:
        profile.experience?.toString() ?? "",
      consultationFee:
        profile.consultationFee?.toString() ??
        "",
      isAvailable:
        profile.isAvailable,
    });
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      await onSubmit({
        name: form.name,
        phone: form.phone,
        specialization:
          form.specialization,
        qualification:
          form.qualification,
        experience:
          form.experience === ""
            ? undefined
            : Number(
                form.experience
              ),
        consultationFee:
          form.consultationFee === ""
            ? undefined
            : Number(
                form.consultationFee
              ),
        isAvailable:
          form.isAvailable,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-2xl font-semibold text-slate-900">
        Doctor Information
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 md:grid-cols-2"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Full Name
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            disabled
            value={profile.user.email}
            className="w-full rounded-lg border bg-slate-100 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone
          </label>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Specialization
          </label>

          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Qualification
          </label>

          <input
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Experience (Years)
          </label>

          <input
            type="number"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Consultation Fee
          </label>

          <input
            type="number"
            name="consultationFee"
            value={form.consultationFee}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="isAvailable"
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
            className="h-5 w-5"
          />

          <label
            htmlFor="isAvailable"
            className="text-sm font-medium"
          >
            Available for Appointment
          </label>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>

      </form>

    </section>
  );
};

export default DoctorProfileForm;