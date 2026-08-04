// Frontend/src/components/doctor/appointments/AppointmentSkeleton.tsx
// Skeleton Component
const AppointmentSkeleton = () => (
  <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 lg:p-6 animate-pulse">
    <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-32 sm:w-40"></div>
            <div className="flex flex-wrap gap-3 mt-1.5">
              <div className="h-4 bg-gray-200 rounded w-40 sm:w-56"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          <div className="h-4 bg-gray-200 rounded w-28"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="mt-3">
          <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
        </div>
      </div>
      <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto">
        <div className="h-7 bg-gray-200 rounded-full w-24"></div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div className="h-10 bg-gray-200 rounded-lg w-full lg:w-28"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-full lg:w-28"></div>
        </div>
      </div>
    </div>
  </div>
);

export default AppointmentSkeleton;