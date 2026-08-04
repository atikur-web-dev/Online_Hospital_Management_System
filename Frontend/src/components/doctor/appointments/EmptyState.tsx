// Frontend/src/components/doctor/appointments/EmptyState.tsx
import { Search, CalendarClock } from "lucide-react";

interface EmptyStateProps {
  type: "appointments" | "search";
  search?: string;
}

const EmptyState = ({ type, search }: EmptyStateProps) => {
  const isSearch = type === "search";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 lg:p-16 text-center">
      <div className="max-w-md mx-auto">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isSearch ? "bg-amber-50" : "bg-emerald-50"
          }`}
        >
          {isSearch ? (
            <Search className="w-10 h-10 text-amber-400" />
          ) : (
            <CalendarClock className="w-10 h-10 text-emerald-400" />
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {isSearch ? "No Patients Found" : "No Appointments Scheduled"}
        </h3>

        <p className="text-gray-500">
          {isSearch
            ? `No appointments match your search for "${search}". Try adjusting your search terms.`
            : "You don't have any appointments at the moment. Check back later for new bookings."}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;