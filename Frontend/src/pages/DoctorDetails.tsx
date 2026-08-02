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
} from "lucide-react";
import AppointmentForm from "../components/appointment/AppointmentForm";
import { Link, useParams, useNavigate } from "react-router-dom";
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

    setOpenBooking(true);
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-emerald-700 font-medium">
            Loading doctor profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600">Doctor Not Found</h2>
          <p className="mt-3 text-gray-600">{error}</p>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 mt-6 bg-emerald-600 text-white px-6 py-3 rounded-xl"
          >
            <ArrowLeft size={20} />
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 text-emerald-700 font-semibold mb-8 hover:text-emerald-900"
        >
          <ArrowLeft size={20} />
          Back to Doctors
        </Link>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
          {/* Header */}
          <div className="bg-linear-to-r from-emerald-700 to-emerald-500 h-40" />
          <div className="px-8 pb-10">
            {/* Image */}
            <div className="-mt-20 flex justify-center">
              <img
                src={
                  doctor.user.profileImage ??
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    doctor.name,
                  )}&background=10b981&color=fff`
                }
                alt={doctor.name}
                className="w-40 h-40 rounded-full border-8 border-white shadow-lg object-cover"
              />
            </div>
            {/* Name */}
            <div className="text-center mt-6">
              <h1 className="text-4xl font-bold text-emerald-900">
                {doctor.name}
              </h1>
              <p className="mt-2 text-xl text-emerald-600 font-semibold">
                {doctor.specialization ?? "General Physician"}
              </p>
              <div className="mt-4 flex justify-center">
                {doctor.isAvailable ? (
                  <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
                    <CircleCheck size={18} />
                    Available
                  </span>
                ) : (
                  <span className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium">
                    <CircleX size={18} />
                    Unavailable
                  </span>
                )}
              </div>
            </div>
            {/* Details */}
            <div className="grid md:grid-cols-2 gap-6 mt-10">
              <div className="bg-emerald-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-emerald-900 mb-5">
                  Professional Information
                </h3>
                <div className="space-y-4 text-emerald-800">
                  <p className="flex gap-3 items-center">
                    <Stethoscope size={20} />
                    {doctor.department?.name ?? "General"}
                  </p>
                  <p className="flex gap-3 items-center">
                    <GraduationCap size={20} />
                    {doctor.qualification ?? "Not Provided"}
                  </p>
                  <p className="flex gap-3 items-center">
                    <Briefcase size={20} />
                    {doctor.experience ?? 0} Years Experience
                  </p>
                  <p className="flex gap-3 items-center">
                    <BadgeDollarSign size={20} />
                    Consultation Fee: ৳{doctor.consultationFee ?? 0}
                  </p>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-emerald-900 mb-5">
                  Contact Information
                </h3>
                <div className="space-y-4 text-emerald-800">
                  <p className="flex gap-3 items-center">
                    <Mail size={20} />
                    {doctor.user.email}
                  </p>
                  <p className="flex gap-3 items-center">
                    <Phone size={20} />
                    {doctor.phone ?? "Not Provided"}
                  </p>
                </div>
              </div>
            </div>
            {/* Appointment */}

            <button
              onClick={handleBookingClick}
              className="mt-10 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl text-lg font-semibold transition"
            >
              Book Appointment
            </button>
            <Modal
              isOpen={openBooking}
              onClose={() => setOpenBooking(false)}
              title="Book Appointment"
              width="md"
            >
              <AppointmentForm
                doctorId={doctor.id}
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
