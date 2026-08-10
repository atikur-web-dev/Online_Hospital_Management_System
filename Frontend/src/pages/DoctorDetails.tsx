// Frontend/src/pages/DoctorDetails.tsx
import {
  Stethoscope,
  GraduationCap,
  Briefcase,
  BadgeDollarSign,
  CircleCheck,
  CircleX,
  Mail,
  Phone,
  ArrowLeft,
  CalendarDays,
  Clock,
} from "lucide-react";

import AppointmentForm from "../components/appointment/AppointmentForm";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDoctor } from "../hooks/useDoctor";
import { useState } from "react";
import { Modal } from "../components/common";
import toast from "react-hot-toast";

const DoctorDetails = () => {
  const { id } = useParams();

  const { doctor, loading, error } = useDoctor(id);

  const [openBooking, setOpenBooking] = useState(false);

  const navigate = useNavigate();

  const handleBookingClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to continue booking.");
      navigate("/login");
      return;
    }

    if (!doctor) {
      toast.error("Doctor information is unavailable.");
      return;
    }

    if (!doctor.isAvailable) {
      toast.error("This doctor is currently unavailable.");
      return;
    }

    setOpenBooking(true);
  };

  const getDayName = (dayOfWeek: number) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return days[dayOfWeek] ?? "Unknown";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600 text-lg">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Doctor Not Found
          </h2>

          <p className="text-gray-500 mb-6">
            {error || "Unable to load doctor profile."}
          </p>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
          >
            <ArrowLeft size={18} />
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-8 transition"
        >
          <ArrowLeft size={18} />
          Back to Doctors
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-linear-to-r from-emerald-600 to-emerald-500 h-32" />

          <div className="px-6 md:px-10 pb-10">
            {/* Doctor Image + Basic Info */}
            <div className="-mt-16 flex flex-col md:flex-row md:items-end gap-6">
              {/* Image */}
              <img
                src={
                  doctor.user.profileImage ??
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    doctor.name,
                  )}&background=10b981&color=fff`
                }
                alt={doctor.name}
                className="w-40 h-40 rounded-full border-8 border-white shadow-lg object-cover bg-white"
              />

              {/* Name */}
              <div className="flex-1 pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {doctor.name}
                    </h1>

                    <p className="text-lg text-emerald-600 font-medium mt-1">
                      {doctor.specialization ?? "General Physician"}
                    </p>
                  </div>

                  {/* Availability */}
                  <div>
                    {doctor.isAvailable ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-semibold">
                        <CircleCheck size={18} />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full font-semibold">
                        <CircleX size={18} />
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
              {/* Professional Information */}
              <div className="border border-gray-100 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Stethoscope size={22} className="text-emerald-600" />
                  Professional Information
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <Stethoscope size={20} className="text-emerald-600 mt-1" />

                    <div>
                      <p className="text-sm text-gray-500">Department</p>

                      <p className="font-semibold text-gray-900">
                        {doctor.department?.name ?? "General"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <GraduationCap
                      size={20}
                      className="text-emerald-600 mt-1"
                    />

                    <div>
                      <p className="text-sm text-gray-500">Qualification</p>

                      <p className="font-semibold text-gray-900">
                        {doctor.qualification ?? "Not Provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Briefcase size={20} className="text-emerald-600 mt-1" />

                    <div>
                      <p className="text-sm text-gray-500">Experience</p>

                      <p className="font-semibold text-gray-900">
                        {doctor.experience ?? 0} Years
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <BadgeDollarSign
                      size={20}
                      className="text-emerald-600 mt-1"
                    />

                    <div>
                      <p className="text-sm text-gray-500">Consultation Fee</p>

                      <p className="font-semibold text-gray-900">
                        ৳{doctor.consultationFee ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border border-gray-100 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>

                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <Mail size={20} className="text-emerald-600" />

                    <div>
                      <p className="text-sm text-gray-500">Email</p>

                      <p className="font-semibold text-gray-900 break-all">
                        {doctor.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Phone size={20} className="text-emerald-600" />

                    <div>
                      <p className="text-sm text-gray-500">Phone</p>

                      <p className="font-semibold text-gray-900">
                        {doctor.phone ?? "Not Provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Schedule */}
            <div className="border border-gray-100 rounded-xl p-6 mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CalendarDays size={22} className="text-emerald-600" />
                Consultation Schedule
              </h2>

              {doctor.schedules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDays
                    size={32}
                    className="mx-auto mb-3 text-gray-400"
                  />

                  <p>No consultation schedule available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctor.schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">
                          {getDayName(schedule.dayOfWeek)}
                        </h3>

                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          Available
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={17} className="text-emerald-600" />

                        <span>
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Appointment */}
            <button
              onClick={handleBookingClick}
              disabled={!doctor.isAvailable}
              className="mt-10 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl text-lg font-semibold transition"
            >
              {doctor.isAvailable ? "Book Appointment" : "Doctor Unavailable"}
            </button>

            <Modal
              isOpen={openBooking}
              onClose={() => setOpenBooking(false)}
              title="Book Appointment"
              width="md"
            >
              <AppointmentForm
                doctorId={doctor.id}
                schedules={doctor.schedules}
                onSuccess={() => {
                  setOpenBooking(false);
                }}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
