// Frontend/src/pages/DoctorAppointments.tsx

import { useDoctorAppointment } from "../hooks/useDoctorAppointment";

const DoctorAppointments = () => {
  const { appointments, loading, error } = useDoctorAppointment();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Doctor Appointments
      </h1>

      <pre>{JSON.stringify(appointments, null, 2)}</pre>
    </div>
  );
};

export default DoctorAppointments;