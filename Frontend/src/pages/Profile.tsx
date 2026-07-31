// Frontend/src/pages/Profile.tsx
import { Navigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileAvatar from "../components/profile/ProfileAvatar";
import AdminProfileForm from "../components/profile/AdminProfileForm";
import DoctorProfileForm from "../components/profile/DoctorProfileForm";
import PatientProfileForm from "../components/profile/PatientProfileForm";
import type {
  Profile,
  PatientProfile,
  DoctorProfile,
  AdminProfile,
} from "../types/profile.types";

function isPatientProfile(profile: Profile): profile is PatientProfile {
  return profile.user.role === "PATIENT";
}

function isDoctorProfile(profile: Profile): profile is DoctorProfile {
  return profile.user.role === "DOCTOR";
}

function isAdminProfile(profile: Profile): profile is AdminProfile {
  return profile.user.role === "ADMIN";
}

export default function Profile() {
  const { profile, loading, updateMyProfile, uploadAvatar } = useProfile();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-slate-600">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-5xl space-y-8 px-6">
        <ProfileHeader />

        <ProfileAvatar
          image={profile.user?.profileImage ?? ""}
          onUpload={uploadAvatar}
        />

        {isPatientProfile(profile) && (
          <PatientProfileForm profile={profile} onSubmit={updateMyProfile} />
        )}

        {isDoctorProfile(profile) && (
          <DoctorProfileForm profile={profile} onSubmit={updateMyProfile} />
        )}

        {isAdminProfile(profile) && (
          <AdminProfileForm profile={profile} onSubmit={updateMyProfile} />
        )}
      </div>
    </main>
  );
}
