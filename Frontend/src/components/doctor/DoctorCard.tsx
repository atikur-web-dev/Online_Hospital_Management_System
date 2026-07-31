// Frontend/src/components/doctor/DoctorCard.tsx
import { Link } from "react-router-dom";
import {
  Stethoscope,
  GraduationCap,
  Briefcase,
  BadgeDollarSign,
  CircleCheck,
  CircleX,
} from "lucide-react";

import type { DoctorProfile } from "../../types/profile.types";

interface DoctorCardProps {
  doctor: DoctorProfile;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Doctor Image */}
      <div className="flex justify-center pt-8">
        <img
          src={
            doctor.user.profileImage ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              doctor.name
            )}&background=10b981&color=fff&size=256`
          }
          alt={doctor.name}
          className="w-28 h-28 rounded-full object-cover border-4 border-emerald-100 group-hover:border-emerald-500 transition-all"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-emerald-900 text-center">
          {doctor.name}
        </h3>

        <p className="text-center text-emerald-600 font-medium mt-1">
          {doctor.specialization ?? "General Physician"}
        </p>

        <div className="mt-6 space-y-3 text-sm">

          <div className="flex items-center gap-2">
            <Stethoscope
              size={18}
              className="text-emerald-600"
            />
            <span>
              {doctor.department?.name ?? "General"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap
              size={18}
              className="text-emerald-600"
            />
            <span>
              {doctor.qualification ?? "Not Provided"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase
              size={18}
              className="text-emerald-600"
            />
            <span>
              {doctor.experience ?? 0} Years Experience
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BadgeDollarSign
              size={18}
              className="text-emerald-600"
            />
            <span>
              ৳{doctor.consultationFee ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {doctor.isAvailable ? (
              <>
                <CircleCheck
                  size={18}
                  className="text-green-600"
                />
                <span className="text-green-600 font-medium">
                  Available
                </span>
              </>
            ) : (
              <>
                <CircleX
                  size={18}
                  className="text-red-500"
                />
                <span className="text-red-500 font-medium">
                  Unavailable
                </span>
              </>
            )}
          </div>
        </div>

        {/* Button */}
        <Link
          to={`/doctors/${doctor.id}`}
          className="mt-6 block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;