// Frontend/src/components/doctor/appointments/LoadingScreen.tsx

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
          <div>
            <div className="h-10 w-72 rounded-lg bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-96 mt-3 rounded bg-gray-200 animate-pulse"></div>
          </div>

          <div className="h-12 w-full lg:w-96 rounded-xl bg-gray-200 animate-pulse"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse mb-4"></div>

              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>

              <div className="h-8 w-12 bg-gray-200 rounded mt-4 animate-pulse"></div>
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
              <div className="flex justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div>

                  <div className="flex-1">
                    <div className="h-5 w-52 bg-gray-200 rounded animate-pulse"></div>

                    <div className="h-4 w-72 bg-gray-200 rounded mt-3 animate-pulse"></div>

                    <div className="h-4 w-56 bg-gray-200 rounded mt-2 animate-pulse"></div>

                    <div className="h-4 w-40 bg-gray-200 rounded mt-2 animate-pulse"></div>

                    <div className="h-10 w-64 bg-gray-200 rounded-lg mt-5 animate-pulse"></div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="h-9 w-28 rounded-full bg-gray-200 animate-pulse"></div>

                  <div className="flex gap-3 mt-6">
                    <div className="h-10 w-28 rounded-lg bg-gray-200 animate-pulse"></div>

                    <div className="h-10 w-28 rounded-lg bg-gray-200 animate-pulse"></div>
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
