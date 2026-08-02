// Frontend/src/components/appointment/DeleteAppointmentModal.tsx
import { TriangleAlert, X } from "lucide-react";

interface DeleteAppointmentModalProps {
  open: boolean;
  loading?: boolean;
  doctorName: string;
  specialization?: string;
  profileImage?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAppointmentModal = ({
  open,
  loading = false,
  doctorName,
  specialization,
  profileImage,
  onClose,
  onConfirm,
}: DeleteAppointmentModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Close */}

        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        <div className="p-8">

          {/* Icon */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <TriangleAlert
              size={40}
              className="text-red-600"
            />
          </div>

          {/* Doctor */}

          <div className="mt-6 flex flex-col items-center">

            <img
              src={
                profileImage ??
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  doctorName
                )}&background=10b981&color=fff&size=256`
              }
              alt={doctorName}
              className="h-20 w-20 rounded-full border-4 border-emerald-100 object-cover"
            />

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Dr. {doctorName}
            </h2>

            <p className="text-emerald-600 font-medium">
              {specialization ?? "General Physician"}
            </p>

          </div>

          {/* Text */}

          <div className="mt-8 text-center">

            <h3 className="text-xl font-bold text-gray-900">
              Delete Appointment?
            </h3>

            <p className="mt-3 leading-7 text-gray-500">
              This cancelled appointment will be removed from
              <span className="font-semibold text-gray-700">
                {" "}
                your dashboard
              </span>
              .
              <br />
              Hospital administrators will still be able to access this
              appointment for medical records and audit purposes.
            </p>

          </div>

          {/* Buttons */}

          <div className="mt-10 grid grid-cols-2 gap-4">

            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-gray-300 py-3 font-semibold transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DeleteAppointmentModal;