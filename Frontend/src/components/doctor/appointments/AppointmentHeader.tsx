// Frontend/src/components/doctor/appointments/AppointmentHeader.tsx
import AppointmentSearch from "./AppointmentSearch";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

const AppointmentHeader = ({ search, setSearch }: Props) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight">
          Doctor Appointments
        </h1>

        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 flex items-center gap-2">
          <span className="inline-block w-1 h-1 rounded-full bg-emerald-400"></span>
          Manage patient appointments quickly and efficiently
        </p>
      </div>

      <AppointmentSearch
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
};

export default AppointmentHeader;