// Frontend/src/pages/admin/AdminDoctors.tsx
import { useState, useEffect } from "react";
import {
  Stethoscope,
  Plus,
  RefreshCw,
  Power,
  Users,
  X,
  Mail,
  Phone,
  Search,
  Building2,
  GraduationCap,
  Calendar,
  DollarSign,
  UserCheck,
  UserX,
  Lock,
} from "lucide-react";

import useAdminDoctors from "../../hooks/useAdminDoctors";
import { getAllDepartments, type AdminDepartment } from "../../api/admin.api";

const AdminDoctors = () => {
  const {
    doctors,
    loading,
    error,
    fetchDoctors,
    addDoctor,
    editDoctor,
    toggleStatus,
    removeDoctor,
  } = useAdminDoctors();

  // ============================================================
  // DEPARTMENTS LIST FOR DROPDOWNS
  // ============================================================
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await getAllDepartments();
        setDepartments(res.data.filter((d) => d.isActive));
      } catch (err) {
        console.error("Failed to load departments for doctor assignment:", err);
      }
    };
    loadDepartments();
  }, []);

  // ============================================================
  // FORM & MODAL STATES
  // ============================================================
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState<number | "">("");
  const [consultationFee, setConsultationFee] = useState<number | "">("");
  const [isAvailable, setIsAvailable] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  const [saving, setSaving] = useState(false);
  const [actionDoctorId, setActionDoctorId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // ============================================================
  // MODAL ACTIONS
  // ============================================================
  const openCreateModal = () => {
    setEditingDoctorId(null);
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setDepartmentId("");
    setSpecialization("");
    setQualification("");
    setExperience("");
    setConsultationFee("");
    setIsAvailable(true);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEditModal = (doctorId: string) => {
    const doc = doctors.find((item) => item.id === doctorId);
    if (!doc) return;

    setEditingDoctorId(doc.id);
    setEmail(doc.email);
    setPassword(""); // Leave password blank on edit
    setName(doc.name);
    setPhone(doc.phone ?? "");
    setDepartmentId(doc.departmentId ?? "");
    setSpecialization(doc.specialization ?? "");
    setQualification(doc.qualification ?? "");
    setExperience(doc.experience ?? "");
    setConsultationFee(doc.consultationFee ?? "");
    setIsAvailable(doc.isAvailable);
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsFormOpen(false);
    setEditingDoctorId(null);
    setFormError(null);
  };

  // ============================================================
  // SUBMIT FORM
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedSpecialization = specialization.trim();
    const trimmedQualification = qualification.trim();

    if (!trimmedName) {
      setFormError("Name is required.");
      return;
    }

    if (!editingDoctorId) {
      if (!trimmedEmail) {
        setFormError("Email is required.");
        return;
      }
      if (!password) {
        setFormError("Password is required.");
        return;
      }
    }

    if (!departmentId) {
      setFormError("Department is required.");
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      const feeNum = consultationFee === "" ? undefined : Number(consultationFee);
      const expNum = experience === "" ? undefined : Number(experience);

      if (editingDoctorId) {
        await editDoctor(editingDoctorId, {
          name: trimmedName,
          phone: trimmedPhone || null,
          departmentId: departmentId || null,
          specialization: trimmedSpecialization || null,
          qualification: trimmedQualification || null,
          experience: expNum !== undefined ? expNum : null,
          consultationFee: feeNum !== undefined ? feeNum : null,
          isAvailable,
        });
      } else {
        await addDoctor({
          email: trimmedEmail,
          password,
          name: trimmedName,
          phone: trimmedPhone || undefined,
          departmentId,
          specialization: trimmedSpecialization || undefined,
          qualification: trimmedQualification || undefined,
          experience: expNum,
          consultationFee: feeNum,
        });
      }

      closeModal();
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? "Failed to save doctor details.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // TOGGLE STATUS & DEACTIVATE
  // ============================================================
  const handleToggleStatus = async (doctorId: string) => {
    try {
      setActionDoctorId(doctorId);
      await toggleStatus(doctorId);
    } catch (err) {
      console.error("Failed to toggle status:", err);
    } finally {
      setActionDoctorId(null);
    }
  };

  const handleDeactivate = async (doctorId: string) => {
    if (!window.confirm("Are you sure you want to suspend/deactivate this doctor profile?")) {
      return;
    }
    try {
      setActionDoctorId(doctorId);
      await removeDoctor(doctorId);
    } catch (err) {
      console.error("Failed to deactivate doctor:", err);
    } finally {
      setActionDoctorId(null);
    }
  };

  // ============================================================
  // SEARCH FILTERING
  // ============================================================
  const filteredDoctors = doctors.filter((doc) => {
    const query = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(query) ||
      doc.email.toLowerCase().includes(query) ||
      (doc.specialization && doc.specialization.toLowerCase().includes(query)) ||
      (doc.departmentName && doc.departmentName.toLowerCase().includes(query))
    );
  });

  // ============================================================
  // SKELETON LOADING
  // ============================================================
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-56 bg-gray-200 rounded-lg" />
            <div className="mt-3 h-4 w-72 bg-gray-200 rounded-md" />
          </div>

          {/* Stats Skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
                <div className="mt-5 h-4 w-28 bg-gray-200 rounded-md" />
                <div className="mt-2 h-8 w-20 bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="h-6 w-48 bg-gray-200 rounded-md mb-4" />
            <div className="h-10 w-full bg-gray-200 rounded-md mb-4" />
            <div className="space-y-3">
              <div className="h-8 bg-gray-100 rounded-md" />
              <div className="h-12 bg-gray-50 rounded-md" />
              <div className="h-12 bg-gray-50 rounded-md" />
              <div className="h-12 bg-gray-50 rounded-md" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-800">Unable to load doctors</h2>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <button
                onClick={fetchDoctors}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
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
  // COMPONENT RENDER
  // ============================================================
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Doctors</h1>
            <p className="mt-1 text-gray-500">Register new doctors and manage existing doctor credentials and availability.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Doctor
          </button>
        </div>

        {/* ================================================== */}
        {/* SUMMARY CARDS */}
        {/* ================================================== */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="mt-4 text-sm text-gray-500">Total Doctors</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">{doctors.length}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <p className="mt-4 text-sm text-gray-500">Active Accounts</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">
              {doctors.filter((d) => d.isActive).length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <p className="mt-4 text-sm text-gray-500">Available Today</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">
              {doctors.filter((d) => d.isAvailable).length}
            </p>
          </div>
        </div>

        {/* ================================================== */}
        {/* SEARCH AND TABLE */}
        {/* ================================================== */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Search Header */}
          <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Doctors Registry</h2>
              <p className="mt-0.5 text-sm text-gray-500">List of verified hospital doctors.</p>
            </div>
            <div className="relative max-w-md w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">No doctors found</h3>
              <p className="mt-1 text-sm text-gray-500">There are no doctors matching your query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Doctor Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Department & Specialty
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Consultation Fee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Account Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-emerald-50/20 transition-colors">
                      {/* Doctor Profile */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {doc.profileImage ? (
                            <img
                              src={doc.profileImage}
                              alt={doc.name}
                              className="w-11 h-11 rounded-full object-cover border border-emerald-100"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center">
                              <Stethoscope className="w-5 h-5 text-emerald-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">{doc.name}</p>
                            <div className="flex flex-col gap-0.5 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" />
                                {doc.email}
                              </span>
                              {doc.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5" />
                                  {doc.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department and Specialty */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            {doc.departmentName || "General / Unassigned"}
                          </span>
                          {doc.specialization && (
                            <p className="text-xs text-gray-500 pl-5">Specialty: {doc.specialization}</p>
                          )}
                          {doc.qualification && (
                            <p className="text-xs text-gray-400 pl-5 flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5" />
                              {doc.qualification} ({doc.experience ?? 0} yrs)
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Consultation Fee */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-800">
                          ৳{doc.consultationFee ? doc.consultationFee.toLocaleString() : "0"}
                        </span>
                      </td>

                      {/* Availability */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            doc.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              doc.isAvailable ? "bg-emerald-500" : "bg-gray-400"
                            }`}
                          />
                          {doc.isAvailable ? "Available Today" : "Unavailable"}
                        </span>
                      </td>

                      {/* Account Status */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              doc.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                doc.isActive ? "bg-emerald-500" : "bg-red-500"
                              }`}
                            />
                            {doc.isActive ? "Active" : "Suspended"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(doc.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(doc.id)}
                            disabled={actionDoctorId === doc.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
                              doc.isActive
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {actionDoctorId === doc.id ? (
                              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : doc.isActive ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                            {doc.isActive ? "Block" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDeactivate(doc.id)}
                            disabled={actionDoctorId === doc.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                          >
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================== */}
      {/* ADD / EDIT DOCTOR MODAL */}
      {/* ====================================================== */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {editingDoctorId ? "Edit Doctor Profile" : "Register Doctor Account"}
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  {editingDoctorId
                    ? "Modify doctor attributes and availability."
                    : "Create a new doctor credential and database profile."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Atikur Rahman"
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="atikur@careplus.com"
                    disabled={saving || !!editingDoctorId}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                {/* Password (only for new accounts) */}
                {!editingDoctorId && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={saving}
                        className="w-full pl-9 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1700-000000"
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Department Assignment */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Department</label>
                  <select
                    required
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specialization */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Specialization</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Pediatric Cardiology"
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Qualification */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Qualification</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. MBBS, FCPS"
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Experience in Years */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 8"
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Consultation Fee */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Consultation Fee (BDT)</label>
                  <input
                    type="number"
                    min="0"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 500"
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Available Today (Toggle) */}
                <div className="flex items-center mt-8">
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-gray-700 select-none">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      disabled={saving}
                      className="w-4.5 h-4.5 accent-emerald-600 rounded border-gray-300 transition"
                    />
                    Available Today
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="mt-6 border-t border-gray-100 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
                >
                  {saving && (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  {saving ? "Saving..." : editingDoctorId ? "Save Changes" : "Register Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminDoctors;
