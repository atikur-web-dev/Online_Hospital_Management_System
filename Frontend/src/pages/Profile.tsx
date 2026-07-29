// Frontend/src/pages/Profile.tsx
import { Loader2 } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import ProfileHeader from "../components/profile/ProfileHeader";
import AvatarUploader from "../components/profile/AvatarUploader";
import PatientProfileForm from "../components/profile/PatientProfileForm";

const Profile = () => {
  const {
    profile,
    loading,
    uploadAvatar,
    updateProfile,
  } = useProfile();

  if (loading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2
          size={42}
          className="animate-spin text-emerald-600"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto mt-20 max-w-xl rounded-xl border bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold">
          Profile not found
        </h2>

        <p className="mt-2 text-gray-500">
          Unable to load your profile.
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl p-6">

      <ProfileHeader profile={profile} />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">

        <AvatarUploader
          profile={profile}
          onUpload={uploadAvatar}
        />

        <div className="lg:col-span-2">

          <PatientProfileForm
            profile={profile}
            onSubmit={updateProfile}
          />

        </div>

      </div>

    </section>
  );
};

export default Profile;