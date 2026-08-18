6// Frontend/src/pages/admin/AdminDepartments.tsx
import { useState } from "react";
import {
  Building2,
  Edit3,
  Plus,
  RefreshCw,
  Power,
  Users,
  X,
} from "lucide-react";

import useAdminDepartments from "../../hooks/useAdminDepartments";

const AdminDepartments = () => {
  const {
    departments,
    loading,
    error,
    fetchDepartments,
    addDepartment,
    editDepartment,
    toggleStatus,
  } = useAdminDepartments();

  // ============================================================
  // FORM STATE
  // ============================================================

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingDepartmentId, setEditingDepartmentId] =
    useState<string | null>(null);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);

  const [actionDepartmentId, setActionDepartmentId] =
    useState<string | null>(null);

  const [formError, setFormError] =
    useState<string | null>(null);

  // ============================================================
  // OPEN CREATE FORM
  // ============================================================

  const openCreateForm = () => {
    setEditingDepartmentId(null);
    setName("");
    setDescription("");
    setFormError(null);
    setIsFormOpen(true);
  };

  // ============================================================
  // OPEN EDIT FORM
  // ============================================================

  const openEditForm = (
    departmentId: string,
  ) => {
    const department = departments.find(
      (item) => item.id === departmentId,
    );

    if (!department) {
      return;
    }

    setEditingDepartmentId(department.id);
    setName(department.name);
    setDescription(
      department.description ?? "",
    );
    setFormError(null);
    setIsFormOpen(true);
  };

  // ============================================================
  // CLOSE FORM
  // ============================================================

  const closeForm = () => {
    if (saving) {
      return;
    }

    setIsFormOpen(false);
    setEditingDepartmentId(null);
    setName("");
    setDescription("");
    setFormError(null);
  };

  // ============================================================
  // SUBMIT FORM
  // ============================================================

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription =
      description.trim();

    if (!trimmedName) {
      setFormError(
        "Department name is required.",
      );
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      if (editingDepartmentId) {
        await editDepartment(
          editingDepartmentId,
          {
            name: trimmedName,
            description:
              trimmedDescription || null,
          },
        );
      } else {
        await addDepartment({
          name: trimmedName,
          description:
            trimmedDescription || undefined,
        });
      }

      closeForm();
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ??
          "Failed to save department.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // TOGGLE STATUS
  // ============================================================

  const handleToggleStatus = async (
    departmentId: string,
  ) => {
    try {
      setActionDepartmentId(departmentId);

      await toggleStatus(departmentId);
    } catch (err) {
      console.error(
        "Failed to toggle department status:",
        err,
      );
    } finally {
      setActionDepartmentId(null);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-center gap-3 py-16">
              <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />

              <p className="text-gray-500 font-medium">
                Loading departments...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-red-500" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                Unable to load departments
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {error}
              </p>

              <button
                onClick={fetchDepartments}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Manage Departments
            </h1>

            <p className="mt-1 text-gray-500">
              Create and manage hospital departments.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        </div>

        {/* ================================================== */}
        {/* SUMMARY */}
        {/* ================================================== */}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Total Departments
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-800">
              {departments.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Power className="w-5 h-5 text-blue-600" />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Active Departments
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-800">
              {
                departments.filter(
                  (department) =>
                    department.isActive,
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Total Doctors
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-800">
              {departments.reduce(
                (total, department) =>
                  total +
                  department.doctorCount,
                0,
              )}
            </p>
          </div>
        </div>

        {/* ================================================== */}
        {/* DEPARTMENT TABLE */}
        {/* ================================================== */}

        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">
              Hospital Departments
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage department information and availability.
            </p>
          </div>

          {departments.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-emerald-600" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No departments found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Create your first hospital department.
              </p>

              <button
                onClick={openCreateForm}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4" />
                Add Department
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Description
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Doctors
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {departments.map(
                    (department) => (
                      <tr
                        key={department.id}
                        className="hover:bg-emerald-50/30 transition-colors"
                      >
                        {/* Department */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-emerald-600" />
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800">
                                {department.name}
                              </p>

                              <p className="text-xs text-gray-400 mt-0.5">
                                ID: {department.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Description */}

                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 max-w-sm">
                            {department.description ||
                              "No description"}
                          </p>
                        </td>

                        {/* Doctors */}

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            <Users className="w-4 h-4 text-gray-400" />

                            {department.doctorCount}
                          </span>
                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              department.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                department.isActive
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              }`}
                            />

                            {department.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">

                            <button
                              onClick={() =>
                                openEditForm(
                                  department.id,
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:text-gray-800 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleToggleStatus(
                                  department.id,
                                )
                              }
                              disabled={
                                actionDepartmentId ===
                                department.id
                              }
                              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                                department.isActive
                                  ? "bg-red-50 text-red-700 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              {actionDepartmentId ===
                              department.id ? (
                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Power className="w-4 h-4" />
                              )}

                              {department.isActive
                                ? "Deactivate"
                                : "Activate"}
                            </button>

                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================== */}
      {/* CREATE / EDIT MODAL */}
      {/* ====================================================== */}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {editingDepartmentId
                    ? "Edit Department"
                    : "Create Department"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingDepartmentId
                    ? "Update department information."
                    : "Add a new hospital department."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              {formError && (
                <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Department Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="e.g. Cardiology"
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-100"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value,
                    )
                  }
                  placeholder="Describe the department..."
                  rows={4}
                  disabled={saving}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-100"
                />
              </div>

              {/* Form Actions */}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingDepartmentId
                      ? "Save Changes"
                      : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminDepartments;