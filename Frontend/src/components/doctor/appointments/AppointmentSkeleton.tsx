// Frontend/src/components/doctor/appointments/AppointmentSkeleton.tsx
const AppointmentSkeleton = () => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden animate-pulse">
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">

          {/* Left */}
          <div className="flex-1 min-w-0">

            {/* Avatar + Name */}
            <div className="flex items-center gap-3 sm:gap-4">

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 shrink-0"></div>

              <div className="flex-1">

                <div className="h-5 w-44 rounded bg-gray-200"></div>

                <div className="mt-3 flex flex-wrap gap-3">

                  <div className="h-4 w-52 rounded bg-gray-200"></div>

                  <div className="h-4 w-28 rounded bg-gray-200"></div>

                </div>

              </div>

            </div>

            {/* Date / Time / Gender */}
            <div className="flex flex-wrap gap-4 mt-5">

              <div className="h-4 w-36 rounded bg-gray-200"></div>

              <div className="h-4 w-40 rounded bg-gray-200"></div>

              <div className="h-4 w-20 rounded bg-gray-200"></div>

            </div>

            {/* Problem Box */}
            <div className="mt-5 rounded-lg border border-gray-100 bg-gray-50 p-4">

              <div className="h-4 w-56 rounded bg-gray-200 mb-2"></div>

              <div className="h-4 w-72 rounded bg-gray-200"></div>

            </div>

          </div>

          {/* Right */}
          <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto">

            {/* Status */}
            <div className="h-9 w-28 rounded-full bg-gray-200"></div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">

              <div className="h-10 w-full sm:w-28 rounded-lg bg-gray-200"></div>

              <div className="h-10 w-full sm:w-28 rounded-lg bg-gray-200"></div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AppointmentSkeleton;