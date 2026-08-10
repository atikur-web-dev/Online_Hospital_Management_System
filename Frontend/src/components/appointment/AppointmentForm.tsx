// Frontend/src/components/appointment/AppointmentForm.tsx

import { useEffect, useState } from "react";
import { Button } from "../common";
import {
  createAppointment,
  getDoctorBookedAppointments,
} from "../../api/appointment.api";
import toast from "react-hot-toast";
import type { DoctorSchedule } from "../../types/profile.types";

interface AppointmentFormProps {
  doctorId: string;
  schedules: DoctorSchedule[];
  onSuccess: () => void;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AppointmentForm = ({
  doctorId,
  schedules,
  onSuccess,
}: AppointmentFormProps) => {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [problem, setProblem] = useState("");

  const [bookedAppointments, setBookedAppointments] = useState<
    { appointmentAt: string }[]
  >([]);

  const [loadingBookedAppointments, setLoadingBookedAppointments] =
    useState(false);

  const [loading, setLoading] = useState(false);

  /**
   * Find schedule for selected day
   */
  const selectedSchedule = appointmentDate
    ? schedules.find(
        (schedule) =>
          schedule.dayOfWeek ===
          new Date(`${appointmentDate}T00:00:00`).getDay(),
      )
    : undefined;

  const selectedDateBookedTimes = bookedAppointments
    .filter((appointment) => {
      const bookedDate = new Date(appointment.appointmentAt);

      const selectedDate = new Date(`${appointmentDate}T00:00:00`);

      return (
        bookedDate.getFullYear() === selectedDate.getFullYear() &&
        bookedDate.getMonth() === selectedDate.getMonth() &&
        bookedDate.getDate() === selectedDate.getDate()
      );
    })
    .map((appointment) => {
      const date = new Date(appointment.appointmentAt);

      return `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes(),
      ).padStart(2, "0")}`;
    });
  /**
   * Load doctor's booked appointments
   */
  useEffect(() => {
    const loadBookedAppointments = async () => {
      try {
        setLoadingBookedAppointments(true);

        const response = await getDoctorBookedAppointments(doctorId);

        setBookedAppointments(response.data ?? []);
      } catch (error) {
        console.error("Failed to load booked appointments:", error);
      } finally {
        setLoadingBookedAppointments(false);
      }
    };

    loadBookedAppointments();
  }, [doctorId]);

  /**
   * Submit appointment
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!appointmentDate || !appointmentTime) {
      toast.error("Please select both appointment date and time.");
      return;
    }

    if (!selectedSchedule) {
      toast.error("The doctor is not available on the selected day.");
      return;
    }

    if (selectedDateBookedTimes.includes(appointmentTime)) {
      toast.error(
        "This time slot is already booked. Please choose another time.",
      );

      return;
    }

    const [hour, minute] = appointmentTime.split(":").map(Number);

    const appointmentMinutes = hour * 60 + minute;

    const [startHour, startMinute] = selectedSchedule.startTime
      .split(":")
      .map(Number);

    const [endHour, endMinute] = selectedSchedule.endTime
      .split(":")
      .map(Number);

    const scheduleStartMinutes = startHour * 60 + startMinute;

    const scheduleEndMinutes = endHour * 60 + endMinute;

    /**
     * Check schedule working hours
     */
    if (
      appointmentMinutes < scheduleStartMinutes ||
      appointmentMinutes >= scheduleEndMinutes
    ) {
      toast.error(
        `Doctor is available from ${selectedSchedule.startTime} to ${selectedSchedule.endTime} on ${DAYS[selectedSchedule.dayOfWeek]}.`,
      );

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
      if (error?.response?.status === 401) {
        toast.error(
          "Login required. Please login first to book an appointment.",
        );

        return;
      }

      toast.error(
        error?.response?.data?.message ?? "Failed to book appointment.",
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
          onChange={(e) => {
            setAppointmentDate(e.target.value);

            setAppointmentTime("");
          }}
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />

        {appointmentDate && !selectedSchedule && (
          <p className="mt-2 text-sm text-red-600">
            Doctor is not available on this day.
          </p>
        )}

        {selectedSchedule && (
          <p className="mt-2 text-sm text-emerald-600">
            Available: {selectedSchedule.startTime} - {selectedSchedule.endTime}
          </p>
        )}
      </div>

      {/* Time */}
      <div>
        <label className="block mb-2 font-medium text-emerald-700">
          Appointment Time
        </label>

        <input
          type="time"
          value={appointmentTime}
          min={selectedSchedule?.startTime}
          max={selectedSchedule?.endTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          disabled={!selectedSchedule}
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        />

        {loadingBookedAppointments && (
          <p className="mt-2 text-sm text-gray-500">
            Checking available slots...
          </p>
        )}
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

      {/* Submit */}
      <Button
        type="submit"
        fullWidth
        isLoading={loading || loadingBookedAppointments}
      >
        Confirm Appointment
      </Button>
    </form>
  );
};

export default AppointmentForm;
