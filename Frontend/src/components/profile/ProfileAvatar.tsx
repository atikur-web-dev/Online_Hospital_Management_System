// Frontend/src/components/profile/ProfileAvatar.tsx
import { useRef, useState } from "react";

interface ProfileAvatarProps {
  image: string | null;
  onUpload: (file: File) => Promise<unknown>;
}

const ProfileAvatar = ({
  image,
  onUpload,
}: ProfileAvatarProps) => {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      await onUpload(file);
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center gap-6 md:flex-row">

        <img
          src={
            image ??
            "https://ui-avatars.com/api/?name=User&background=e2e8f0&color=334155&size=256"
          }
          alt="Profile"
          className="h-36 w-36 rounded-full border-4 border-slate-200 object-cover"
        />

        <div className="space-y-3">

          <h2 className="text-xl font-semibold text-slate-900">
            Profile Photo
          </h2>

          <p className="max-w-md text-sm leading-6 text-slate-500">
            Upload a professional profile picture. Supported formats are
            JPG, PNG and WEBP.
          </p>

          <button
            type="button"
            onClick={handleChooseImage}
            disabled={uploading}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading
              ? "Uploading..."
              : "Change Photo"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={handleFileChange}
          />

        </div>

      </div>
    </section>
  );
};

export default ProfileAvatar;