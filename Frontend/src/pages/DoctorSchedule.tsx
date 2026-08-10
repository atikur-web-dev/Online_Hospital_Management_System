// Frontend/src/pages/DoctorSchedule.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock3,
  Save,
  Power,
  Loader2,
} from "lucide-react";

import {
  getMyDoctorSchedule,
  updateMyDoctorSchedule,
  updateDoctorAvailability,
  type DoctorSchedule as DoctorScheduleType,
} from "../api/doctorSchedule.api";

const days = [
  { dayOfWeek: 0, name: "Sunday" },
  { dayOfWeek: 1, name: "Monday" },
  { dayOfWeek: 2, name: "Tuesday" },
  { dayOfWeek: 3, name: "Wednesday" },
  { dayOfWeek: 4, name: "Thursday" },
  { dayOfWeek: 5, name: "Friday" },
  { dayOfWeek: 6, name: "Saturday" },
];

const defaultSchedules: DoctorScheduleType[] =
  days.map((day) => ({
    dayOfWeek: day.dayOfWeek,
    startTime: "09:00",
    endTime: "17:00",
    isActive: false,
  }));

const DoctorSchedule = () => {
  const [schedules, setSchedules] =
    useState<DoctorScheduleType[]>(defaultSchedules);

  const [isAvailable, setIsAvailable] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);

        const response =
          await getMyDoctorSchedule();

        const data = response.data;

        setIsAvailable(data.isAvailable);

        const existingSchedules =
          data.schedules ?? [];

        const mergedSchedules =
          defaultSchedules.map((defaultSchedule) => {
            const existing =
              existingSchedules.find(
                (schedule: DoctorScheduleType) =>
                  schedule.dayOfWeek ===
                  defaultSchedule.dayOfWeek,
              );

            return existing
              ? {
                  ...defaultSchedule,
                  ...existing,
                }
              : defaultSchedule;
          });

        setSchedules(mergedSchedules);
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load your schedule.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const updateScheduleField = (
    dayOfWeek: number,
    field:
      | "startTime"
      | "endTime"
      | "isActive",
    value: string | boolean,
  ) => {
    setSchedules((previous) =>
      previous.map((schedule) =>
        schedule.dayOfWeek === dayOfWeek
          ? {
              ...schedule,
              [field]: value,
            }
          : schedule,
      ),
    );
  };

  const handleSave = async () => {
    for (const schedule of schedules) {
      if (!schedule.isActive) {
        continue;
      }

      if (
        !schedule.startTime ||
        !schedule.endTime
      ) {
        toast.error(
          "Please provide both start and end time.",
        );
        return;
      }

      if (
        schedule.startTime >=
        schedule.endTime
      ) {
        const dayName =
          days.find(
            (day) =>
              day.dayOfWeek ===
              schedule.dayOfWeek,
          )?.name;

        toast.error(
          `${dayName}: start time must be earlier than end time.`,
        );

        return;
      }
    }

    try {
      setSaving(true);

      const response =
        await updateMyDoctorSchedule(
          schedules,
        );

      const updated =
        response.data;

      setIsAvailable(updated.isAvailable);

      toast.success(
        "Schedule updated successfully.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update schedule.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAvailabilityToggle =
    async () => {
      const newValue = !isAvailable;

      try {
        setAvailabilityLoading(true);

        await updateDoctorAvailability(
          newValue,
        );

        setIsAvailable(newValue);

        toast.success(
          newValue
            ? "You are now available."
            : "You are now unavailable.",
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to update availability.",
        );
      } finally {
        setAvailabilityLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-emerald-600">
          <Loader2 className="w-6 h-6 animate-spin" />

          <span className="font-medium">
            Loading schedule...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-emerald-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                My Schedule
              </h1>

              <p className="text-gray-500 mt-1">
                Manage your weekly consultation hours.
              </p>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  isAvailable
                    ? "bg-emerald-100"
                    : "bg-gray-100"
                }`}
              >
                <Power
                  className={`w-5 h-5 ${
                    isAvailable
                      ? "text-emerald-600"
                      : "text-gray-400"
                  }`}
                />
              </div>

              <div>
                <h2 className="font-semibold text-gray-800">
                  Doctor Availability
                </h2>

                <p className="text-sm text-gray-500">
                  {isAvailable
                    ? "Patients can book appointments with you."
                    : "Patients cannot book appointments with you."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                handleAvailabilityToggle
              }
              disabled={
                availabilityLoading
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAvailable
                  ? "bg-emerald-500"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isAvailable
                    ? "translate-x-8"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Clock3 className="w-5 h-5 text-emerald-600" />

              <h2 className="text-lg font-semibold text-gray-800">
                Weekly Schedule
              </h2>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Set the days and hours when you accept appointments.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {days.map((day) => {
              const schedule =
                schedules.find(
                  (item) =>
                    item.dayOfWeek ===
                    day.dayOfWeek,
                )!;

              return (
                <div
                  key={day.dayOfWeek}
                  className="p-5 flex flex-col md:flex-row md:items-center gap-5"
                >
                  {/* Day */}
                  <div className="w-full md:w-40">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={
                          schedule.isActive
                        }
                        onChange={(event) =>
                          updateScheduleField(
                            day.dayOfWeek,
                            "isActive",
                            event.target.checked,
                          )
                        }
                        className="w-4 h-4 accent-emerald-600"
                      />

                      <span
                        className={`font-medium ${
                          schedule.isActive
                            ? "text-gray-800"
                            : "text-gray-400"
                        }`}
                      >
                        {day.name}
                      </span>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
                    <div className="w-full sm:w-auto">
                      <label className="block text-xs text-gray-500 mb-1">
                        Start
                      </label>

                      <input
                        type="time"
                        value={
                          schedule.startTime
                        }
                        disabled={
                          !schedule.isActive
                        }
                        onChange={(event) =>
                          updateScheduleField(
                            day.dayOfWeek,
                            "startTime",
                            event.target.value,
                          )
                        }
                        className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:text-gray-400"
                      />
                    </div>

                    <span className="hidden sm:block mt-5 text-gray-400">
                      →
                    </span>

                    <div className="w-full sm:w-auto">
                      <label className="block text-xs text-gray-500 mb-1">
                        End
                      </label>

                      <input
                        type="time"
                        value={
                          schedule.endTime
                        }
                        disabled={
                          !schedule.isActive
                        }
                        onChange={(event) =>
                          updateScheduleField(
                            day.dayOfWeek,
                            "endTime",
                            event.target.value,
                          )
                        }
                        className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="md:w-28">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        schedule.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {schedule.isActive
                        ? "Available"
                        : "Off"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save */}
          <div className="p-6 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Schedule
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;