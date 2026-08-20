// Frontend/src/pages/Doctors.tsx
import {
  Stethoscope,
  Search,
  X,
  AlertCircle,
  RefreshCw,
  Filter,
  User,
  Users,
  Clock,
  Heart,
  ChevronDown,
  Star
} from "lucide-react";
import { useState } from "react";
import DoctorCard from "../components/doctor/DoctorCard";
import { useDoctors } from "../hooks/useDoctors";
import Footer from "../components/layout/Footer";


const Doctors = () => {
  const {
    doctors,
    loading,
    searching,
    error,
    pagination,
    fetchDoctors,
    search,
    setSearch,
    department,
    setDepartment,
  } = useDoctors();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handlePageChange = (page: number) => {
    fetchDoctors(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleClearFilters = () => {
    setSearch("");
    setDepartment("");
  };

  // Show full page loader only on initial load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-emerald-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-emerald-700 font-medium">Loading our medical team...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-emerald-50 to-white">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="flex justify-center mb-4">
            <AlertCircle size={56} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Doctors</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(5, 60, 50, 0.85), rgba(5, 60, 50, 0.75)),
              url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            backgroundPosition: "center 30%",
          }}
        />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center text-white">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Stethoscope size={40} className="text-emerald-200" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Our Medical Specialists
            </h1>
            
            <p className="text-emerald-100 max-w-2xl mx-auto text-sm md:text-base">
              Connect with experienced doctors across multiple specialties
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <Heart size={14} className="text-emerald-200" />
                <span className="text-xs text-emerald-100">Trusted Care</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <Clock size={14} className="text-emerald-200" />
                <span className="text-xs text-emerald-100">24/7 Support</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <Star size={14} className="text-emerald-200" />
                <span className="text-xs text-emerald-100">Top Rated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTER SECTION  */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
          <div className="grid gap-3 md:grid-cols-2">
            {/* Search Input */}
            <div className="relative">
              <div className="relative">
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    isSearchFocused || search ? "text-emerald-600" : "text-gray-400"
                  }`}
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search doctors or specialties..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full rounded-lg border border-gray-200 pl-11 pr-11 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-gray-50 hover:bg-white"
                />
                {search && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
                {searching && search && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Department Filter */}
            <div className="relative">
              <div className="relative">
                <Filter
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 pl-11 pr-10 py-2.5 text-sm appearance-none focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-gray-50 hover:bg-white cursor-pointer"
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
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOCTOR GRID SECTION  */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Available Specialists
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {searching ? (
                "Searching..."
              ) : (
                <>
                  <span className="font-semibold text-emerald-600">{doctors.length}</span> 
                  {" "}doctor{doctors.length !== 1 ? "s" : ""} available
                </>
              )}
            </p>
          </div>
          
          {search && !searching && (
            <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
              <Search size={12} />
              "{search}"
            </span>
          )}
        </div>

        {/* No Results */}
        {doctors.length === 0 && !searching && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="inline-flex p-4 bg-emerald-50 rounded-full mb-4">
              <User size={48} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Specialists Found</h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              {search || department
                ? "No doctors match your criteria. Try adjusting your filters."
                : "No doctors are currently available. Please check back later."}
            </p>
            {(search || department) && (
              <button
                onClick={handleClearFilters}
                className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Doctor Cards Grid */}
        {doctors.length > 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Previous
                </button>

                <div className="flex gap-1 flex-wrap justify-center">
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 7) },
                    (_, index) => {
                      let pageNumber: number;
                      const currentPage = pagination.page;
                      const totalPages = pagination.totalPages;

                      if (totalPages <= 7) {
                        pageNumber = index + 1;
                      } else if (currentPage <= 4) {
                        pageNumber = index + 1;
                        if (index === 6) pageNumber = totalPages;
                      } else if (currentPage >= totalPages - 3) {
                        pageNumber = totalPages - 6 + index;
                      } else {
                        pageNumber = currentPage - 3 + index;
                      }

                      if (
                        index === 2 &&
                        currentPage > 4 &&
                        totalPages > 7 &&
                        currentPage < totalPages - 2
                      ) {
                        return (
                          <span key="ellipsis1" className="px-2 py-2 text-gray-400 text-sm">
                            ...
                          </span>
                        );
                      }

                      if (
                        index === 4 &&
                        currentPage < totalPages - 3 &&
                        totalPages > 7 &&
                        currentPage > 3
                      ) {
                        return (
                          <span key="ellipsis2" className="px-2 py-2 text-gray-400 text-sm">
                            ...
                          </span>
                        );
                      }

                      if (pageNumber > totalPages || pageNumber < 1) return null;

                      const isActive = pagination.page === pageNumber;

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`
                            min-w-9 h-9 rounded-lg font-semibold transition-all text-sm
                            ${
                              isActive
                                ? "bg-emerald-600 text-white shadow-md"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                            }
                          `}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
      <Footer/>
    </div>
  );
};

export default Doctors;