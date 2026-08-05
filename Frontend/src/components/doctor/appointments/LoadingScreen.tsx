// Frontend/src/components/doctor/appointments/LoadingScreen.tsx
const Shimmer = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-md bg-gray-200 ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />
  </div>
);

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
          <div>
            <Shimmer className="h-10 w-72 rounded-xl" />
            <Shimmer className="h-4 w-80 mt-3" />
          </div>

          <Shimmer className="h-12 w-full lg:w-96 rounded-xl" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <Shimmer className="w-11 h-11 rounded-xl mb-4" />

              <Shimmer className="h-3 w-20" />

              <Shimmer className="h-8 w-14 mt-4" />
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between gap-6">

                <div className="flex gap-4 flex-1">

                  <Shimmer className="w-14 h-14 rounded-full shrink-0" />

                  <div className="flex-1">

                    <Shimmer className="h-5 w-44" />

                    <Shimmer className="h-4 w-72 mt-3" />

                    <Shimmer className="h-4 w-56 mt-2" />

                    <div className="flex gap-3 mt-4">
                      <Shimmer className="h-4 w-28" />
                      <Shimmer className="h-4 w-24" />
                      <Shimmer className="h-4 w-20" />
                    </div>

                    <Shimmer className="h-11 w-72 rounded-xl mt-5" />

                  </div>

                </div>

                <div className="flex flex-col items-start lg:items-end gap-4">

                  <Shimmer className="h-9 w-28 rounded-full" />

                  <div className="flex gap-3">
                    <Shimmer className="h-10 w-28 rounded-lg" />
                    <Shimmer className="h-10 w-28 rounded-lg" />
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;