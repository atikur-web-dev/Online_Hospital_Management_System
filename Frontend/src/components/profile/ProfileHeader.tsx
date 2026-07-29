// Frontend/src/components/profile/ProfileHeader.tsx
const ProfileHeader = () => {
  return (
    <header className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          My Profile
        </h1>

        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Manage your personal information, profile picture, and account
          details. Keeping your profile up to date helps ensure a better
          healthcare experience.
        </p>
      </div>
    </header>
  );
};

export default ProfileHeader;