// Frontend/src/components/profile
import { useEffect, useState } from "react";

import type {
  Gender,
  PatientProfile,
} from "../../types/profile.types";

interface PatientProfileFormProps {
  profile: PatientProfile;
  onSubmit: (
    data: Partial<PatientProfile>
  ) => Promise<unknown>;
}

const PatientProfileForm = ({
  profile,
  onSubmit,
}: PatientProfileFormProps) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    gender: "" as Gender | "",
    dateOfBirth: "",
  });

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    setForm({
      name: profile.name ?? "",

      phone: profile.phone ?? "",

      address: profile.address ?? "",

      gender: profile.gender ?? "",

      dateOfBirth: profile.dateOfBirth
        ? profile.dateOfBirth.slice(0, 10)
        : "",
    });
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      await onSubmit({
        ...form,
        gender:
          form.gender === ""
            ? undefined
            : form.gender,
        dateOfBirth:
          form.dateOfBirth === ""
            ? undefined
            : form.dateOfBirth,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-2xl font-semibold text-slate-900">
        Personal Information
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 md:grid-cols-2"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            value={profile.user.email}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone Number
          </label>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Gender
          </label>

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          >
            <option value="">
              Select Gender
            </option>

            <option value="MALE">
              Male
            </option>

            <option value="FEMALE">
              Female
            </option>

            <option value="OTHER">
              Other
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Date of Birth
          </label>

          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Role
          </label>

          <input
            disabled
            value={profile.user.role}
            className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Address
          </label>

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
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

export default PatientProfileForm;