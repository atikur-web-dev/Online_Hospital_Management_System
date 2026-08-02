import { useState } from "react";
import { Button } from "../common";
import { createAppointment } from "../../api/appointment.api";
import toast from "react-hot-toast";
interface AppointmentFormProps {
  doctorId: string;
  onSuccess: () => void;
}

const AppointmentForm = ({ doctorId, onSuccess }: AppointmentFormProps) => {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [problem, setProblem] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!appointmentDate || !appointmentTime) {
      toast.error("Please select both appointment date and time.");
      return;
    }

    try {
      setLoading(true);

      const appointmentAt = new Date(
        `${appointmentDate}T${appointmentTime}`,
      ).toISOString();

      await createAppointment({
        doctorId,
        appointmentAt,
        problem,
      });

      toast.success("Your appointment has been booked successfully.");

      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Date */}
      <div>
        <label className="block mb-2 font-medium text-emerald-700">
          Appointment Date
        </label>

        <input
          type="date"
          value={appointmentDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
      </div>

      {/* Time */}
      <div>
        <label className="block mb-2 font-medium text-emerald-700">
          Appointment Time
        </label>

        <input
          type="time"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
      </div>

      {/* Problem */}
      <div>
        <label className="block mb-2 font-medium text-emerald-700">
          Describe Your Problem
        </label>

        <textarea
          rows={4}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Write your problem..."
          className="w-full border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <Button type="submit" fullWidth isLoading={loading}>
        Confirm Appointment
      </Button>
    </form>
  );
};

export default AppointmentForm;
