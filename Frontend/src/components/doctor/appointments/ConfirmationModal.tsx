// Frontend/src/components/doctor/appointments/ConfirmationModal.tsx
import { Bell, BellRing, Loader2, Trash2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName: string;
  isDeleting: boolean;
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
  isDeleting,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-50 rounded-full mb-4">
            <BellRing className="w-8 h-8 text-red-500" />
          </div>

          <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
            Confirm Cancellation
          </h3>

          <div className="text-gray-600 text-center space-y-2">
            <p>
              You are about to cancel the appointment with{" "}
              <span className="font-semibold text-gray-800">
                {patientName}
              </span>
              .
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3 text-left">
              <div className="flex items-start gap-2">
                <Bell className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800">
                  The patient will be notified via email and SMS. This action
                  cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              The appointment will be removed from your dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
            >
              No, Keep It
            </button>

            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Yes, Cancel
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;