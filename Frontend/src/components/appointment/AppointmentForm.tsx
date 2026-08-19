// Frontend/src/components/appointment/AppointmentForm.tsx

import { useEffect, useState } from "react";
import { Button } from "../common";

import {
  createAppointment,
  getDoctorBookedAppointments,
} from "../../api/appointment.api";

import { getMyMedicalRecords } from "../../api/medicalRecord.api";

import type {
  MedicalHistory,
  MedicalReport,
} from "../../types/medicalRecord.types";

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

const getLocalDateInputValue = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getNextMinuteTime = () => {
  const now = new Date();

  now.setMinutes(now.getMinutes() + 1);

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

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

  const [loadingMedicalRecords, setLoadingMedicalRecords] = useState(false);

  const [medicalHistories, setMedicalHistories] = useState<MedicalHistory[]>(
    [],
  );

  const [medicalReports, setMedicalReports] = useState<MedicalReport[]>([]);

  const [selectedMedicalHistoryIds, setSelectedMedicalHistoryIds] = useState<
    string[]
  >([]);

  const [selectedMedicalReportIds, setSelectedMedicalReportIds] = useState<
    string[]
  >([]);

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

  const today = getLocalDateInputValue();

  const minimumAppointmentTime =
    appointmentDate === today
      ? getNextMinuteTime()
      : selectedSchedule?.startTime;

  /**
   * Get booked times for selected date
   */
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
   * Load patient's medical records
   */
  useEffect(() => {
    const loadMedicalRecords = async () => {
      try {
        setLoadingMedicalRecords(true);

        const records = await getMyMedicalRecords();

        setMedicalHistories(records.medicalHistories ?? []);
        setMedicalReports(records.medicalReports ?? []);
      } catch (error) {
        console.error("Failed to load medical records:", error);

        toast.error("Failed to load your medical records.");
      } finally {
        setLoadingMedicalRecords(false);
      }
    };

    loadMedicalRecords();
  }, []);

  /**
   * Toggle medical history
   */
  const toggleMedicalHistory = (historyId: string) => {
    setSelectedMedicalHistoryIds((current) =>
      current.includes(historyId)
        ? current.filter((id) => id !== historyId)
        : [...current, historyId],
    );
  };

  /**
   * Toggle medical report
   */
  const toggleMedicalReport = (reportId: string) => {
    setSelectedMedicalReportIds((current) =>
      current.includes(reportId)
        ? current.filter((id) => id !== reportId)
        : [...current, reportId],
    );
  };

  /**
   * Submit appointment
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const appointmentAt = new Date(`${appointmentDate}T${appointmentTime}`);

    if (appointmentAt <= new Date()) {
      toast.error(
        "Appointment time must be in the future. Please choose a later time.",
      );

      return;
    }

    try {
      setLoading(true);

      const appointmentAtIso = appointmentAt.toISOString();

      await createAppointment({
        doctorId,
        appointmentAt: appointmentAtIso,
        problem: problem.trim() || undefined,
        medicalHistoryIds: selectedMedicalHistoryIds,
        medicalReportIds: selectedMedicalReportIds,
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
    /*
     * IMPORTANT:
     *
     * The ENTIRE form is scrollable.
     * Confirm Appointment is intentionally inside
     * the scroll area.
     */
    <form
      onSubmit={handleSubmit}
      className="w-full max-h-[70vh] overflow-y-auto pr-2 space-y-5"
    >
      {/* Date */}
      <div>
        <label className="block mb-2 font-medium text-emerald-700">
          Appointment Date
        </label>

        <input
          type="date"
          value={appointmentDate}
          min={today}
          onChange={(e) => {
            setAppointmentDate(e.target.value);
            setAppointmentTime("");
          }}
          disabled={loading}
          required
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
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
          min={minimumAppointmentTime}
          max={selectedSchedule?.endTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          disabled={!selectedSchedule || loading}
          required
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
          disabled={loading}
          className="w-full border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
        />
      </div>

      {/* Medical Records */}
      <div className="border border-emerald-100 rounded-2xl p-4 space-y-5 bg-emerald-50/30">
        <div>
          <h3 className="text-lg font-semibold text-emerald-800">
            Share Medical Records
          </h3>

          <p className="text-sm text-gray-600 mt-1">
            Select the medical history and reports you want to share with the
            doctor for this appointment.
          </p>
        </div>

        {loadingMedicalRecords ? (
          <p className="text-sm text-gray-500">
            Loading your medical records...
          </p>
        ) : (
          <>
            {/* Medical History */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">
                Medical History
              </h4>

              {medicalHistories.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No medical history found.
                </p>
              ) : (
                <div className="space-y-3">
                  {medicalHistories.map((history) => (
                    <label
                      key={history.id}
                      className="flex items-start gap-3 p-3 bg-white border rounded-xl cursor-pointer hover:border-emerald-400 transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMedicalHistoryIds.includes(history.id)}
                        onChange={() => toggleMedicalHistory(history.id)}
                        disabled={loading}
                        className="mt-1 h-4 w-4 accent-emerald-600"
                      />

                      <div className="min-w-0">
                        <p className="font-medium text-gray-800">
                          {history.condition}
                        </p>

                        {history.details && (
                          <p className="text-sm text-gray-600 mt-1 wrap-break-words">
                            {history.details}
                          </p>
                        )}

                        {history.diagnosedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Diagnosed:{" "}
                            {new Date(history.diagnosedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Medical Reports */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">
                Medical Reports
              </h4>

              {medicalReports.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No medical reports found.
                </p>
              ) : (
                <div className="space-y-3">
                  {medicalReports.map((report) => (
                    <label
                      key={report.id}
                      className="flex items-start gap-3 p-3 bg-white border rounded-xl cursor-pointer hover:border-emerald-400 transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMedicalReportIds.includes(report.id)}
                        onChange={() => toggleMedicalReport(report.id)}
                        disabled={loading}
                        className="mt-1 h-4 w-4 accent-emerald-600"
                      />

                      <div className="min-w-0">
                        <p className="font-medium text-gray-800">
                          {report.title}
                        </p>

                        {report.description && (
                          <p className="text-sm text-gray-600 mt-1 wrap-break-word">
                            {report.description}
                          </p>
                        )}

                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded:{" "}
                          {report.createdAt
                            ? new Date(report.createdAt).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Selection Summary */}
            {(selectedMedicalHistoryIds.length > 0 ||
              selectedMedicalReportIds.length > 0) && (
              <div className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800">
                <span className="font-medium">
                  Selected for this appointment:
                </span>{" "}
                {selectedMedicalHistoryIds.length} medical history record
                {selectedMedicalHistoryIds.length !== 1 ? "s" : ""} and{" "}
                {selectedMedicalReportIds.length} medical report
                {selectedMedicalReportIds.length !== 1 ? "s" : ""}.
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirm Appointment */}
      <div className="pt-2 pb-4">
        <Button
          type="submit"
          fullWidth
          isLoading={
            loading || loadingBookedAppointments || loadingMedicalRecords
          }
        >
          Confirm Appointment
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
