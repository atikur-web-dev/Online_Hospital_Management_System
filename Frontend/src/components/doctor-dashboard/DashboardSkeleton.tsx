// Frontend/src/components/doctor-dashboard/DashboardSkeleton.tsx
const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-8 animate-pulse space-y-8">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded" />

              <div className="h-9 w-64 bg-gray-200 rounded mt-4" />

              <div className="h-4 w-52 bg-gray-200 rounded mt-4" />
            </div>

            <div className="h-12 w-60 bg-gray-200 rounded-xl" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6"
            >
              <div className="flex justify-between">
                <div className="space-y-3">
                  <div className="h-4 w-28 bg-gray-200 rounded" />

                  <div className="h-8 w-16 bg-gray-200 rounded" />
                </div>

                <div className="w-14 h-14 rounded-xl bg-gray-200" />
              </div>
            </div>
          ))}
        </div>

        {/* Appointment Table */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">

          <div className="flex justify-between mb-6">
            <div className="h-7 w-56 bg-gray-200 rounded" />

            <div className="h-5 w-20 bg-gray-200 rounded" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-5 gap-4"
              >
                <div className="h-5 bg-gray-200 rounded" />
                <div className="h-5 bg-gray-200 rounded" />
                <div className="h-5 bg-gray-200 rounded" />
                <div className="h-5 bg-gray-200 rounded" />
                <div className="h-5 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6"
            >
              <div className="h-7 w-48 bg-gray-200 rounded mb-6" />

              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-5 bg-gray-200 rounded"
                  />
                ))}
              </div>
            </div>
          ))}

        </div>

        {/* Today */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">

          <div className="h-7 w-44 bg-gray-200 rounded mb-6" />

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between"
              >
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-gray-200 rounded" />

                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>

                <div className="h-6 w-28 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>

        </div>

        {/* Recent Patients */}

        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">

          <div className="h-7 w-44 bg-gray-200 rounded mb-6" />

          <div className="space-y-4">

            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200" />

                <div className="space-y-2 flex-1">
                  <div className="h-5 w-40 bg-gray-200 rounded" />

                  <div className="h-4 w-28 bg-gray-200 rounded" />
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardSkeleton;