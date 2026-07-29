// Frontend/src/components/profile/AdminProfileForm.tsx
import { useEffect, useState } from "react";

import type {
  AdminProfile,
} from "../../types/profile.types";

interface AdminProfileFormProps {
  profile: AdminProfile;
  onSubmit: (
    data: Partial<AdminProfile>
  ) => Promise<unknown>;
}

const AdminProfileForm = ({
  profile,
  onSubmit,
}: AdminProfileFormProps) => {
  const [saving, setSaving] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    setForm({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
    });
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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
        name: form.name,
        phone: form.phone,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-2xl font-semibold text-slate-900">
        Administrator Information
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
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            disabled
            value={profile.user.email}
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
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Permissions
          </label>

          <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            {profile.permissions.map(
              (permission) => (
                <span
                  key={permission}
                  className="rounded-md bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700"
                >
                  {permission}
                </span>
              )
            )}
          </div>
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

export default AdminProfileForm;