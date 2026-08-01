// Frontend/src/pages/Doctors.tsx
import { Stethoscope } from "lucide-react";
import DoctorCard from "../components/doctor/DoctorCard";
import { useDoctors } from "../hooks/useDoctors";

const Doctors = () => {
  const {
    doctors,
    pagination,
    loading,
    error,
    fetchDoctors,
    search,
    setSearch,
    department,
    setDepartment,
  } = useDoctors();

  const handlePageChange = (page: number) => {
    fetchDoctors(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDepartment = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDepartment(value);
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-emerald-700 font-medium">
            Loading doctors...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Failed to load doctors
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-600 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <div className="flex justify-center mb-4">
            <Stethoscope size={54} />
          </div>
          <h1 className="text-5xl font-bold">Our Doctors</h1>
          <p className="mt-4 text-xl text-emerald-100">
            Meet our experienced medical professionals dedicated to your health.
          </p>
        </div>
      </section>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Search doctor or specialization..."
            value={search}
            onChange={handleSearch}
            className="w-full rounded-xl border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={department}
            onChange={handleDepartment}
            className="w-full rounded-xl border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Gynecology">Gynecology</option>
            <option value="ENT">ENT</option>
            <option value="Ophthalmology">Ophthalmology</option>
          </select>
        </div>
      </div>
      {/* Doctor Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-emerald-900">
            Available Specialists
          </h2>
          <p className="text-emerald-700 mt-2">
            {doctors.length} doctors available
          </p>
        </div>
        {doctors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <h3 className="text-2xl font-semibold">No doctors found</h3>
            <p className="mt-2 text-gray-500">Please check back later.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from(
                  { length: pagination.totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`
                      px-4 py-2 rounded-lg font-semibold
                      ${
                        pagination.page === page
                          ? "bg-emerald-700 text-white"
                          : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Doctors;
