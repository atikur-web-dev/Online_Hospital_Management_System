// Frontend/src/pages/Doctors.tsx
import { Stethoscope } from "lucide-react";
import DoctorCard from "../components/doctor/DoctorCard";
import { useDoctors } from "../hooks/useDoctors";

const Doctors = () => {
  const {
    doctors,
    loading,
    error,
  } = useDoctors();

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
          <p className="mt-2 text-gray-600">
            {error}
          </p>
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
          <h1 className="text-5xl font-bold">
            Our Doctors
          </h1>
          <p className="mt-4 text-xl text-emerald-100">
            Meet our experienced medical professionals dedicated to your health.
          </p>
        </div>
      </section>

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
            <h3 className="text-2xl font-semibold">
              No doctors found
            </h3>
            <p className="mt-2 text-gray-500">
              Please check back later.
            </p>
          </div>
        ) : (

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Doctors;