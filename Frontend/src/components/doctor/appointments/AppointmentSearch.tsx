// Frontend/src/components/doctor/appointments/AppointmentSearch.tsx
import { Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

// Search Component
const AppointmentSearch = ({
  search,
  setSearch,
}: Props) => (
  <div className="relative w-full lg:w-80 xl:w-96">
    <Search
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      size={18}
    />
    <input
      type="text"
      placeholder="Search by name, phone, or email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      aria-label="Search appointments"
      className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60 transition-all duration-200"
    />
  </div>
);

export default AppointmentSearch;