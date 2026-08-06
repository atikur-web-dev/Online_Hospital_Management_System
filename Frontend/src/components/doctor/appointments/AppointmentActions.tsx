// Frontend/src/components/doctor/appointments/AppointmentActions.tsx

import {
  Ban,
  CheckCircle2,
  FileText,
  Loader2,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  appointmentId: string;

  isPending: boolean;
  isConfirmed: boolean;
  showActions: boolean;
  showDeletePermanently: boolean;

  isConfirming: boolean;
  isCanceling: boolean;
  isDeleting: boolean;

  onConfirm: () => void;
  onCancel: () => void;
  onDeletePermanently: () => void;
}

const AppointmentActions = ({
  appointmentId,

  isPending,
  isConfirmed,
  showActions,
  showDeletePermanently,

  isConfirming,
  isCanceling,
  isDeleting,

  onConfirm,
  onCancel,
  onDeletePermanently,
}: Props) => {
  const navigate = useNavigate();

  return (
    <>
      {showActions && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto">
          {isPending && (
            <button
              onClick={onConfirm}
              disabled={isConfirming}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm
                </>
              )}
            </button>
          )}

          {isConfirmed && (
            <>
              <button
                onClick={() =>
                  navigate(
                    `/doctor/prescription/${appointmentId}`
                  )
                }
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
              >
                <FileText className="w-4 h-4" />
                Create Prescription
              </button>

              <button
                onClick={onConfirm}
                disabled={isConfirming}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Complete
                  </>
                )}
              </button>
            </>
          )}

          {(isPending || isConfirmed) && (
            <button
              onClick={onCancel}
              disabled={isCanceling}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-red-700 text-sm font-medium rounded-lg border border-red-200 transition-all duration-200 hover:shadow-md active:scale-95"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4" />
                  Cancel
                </>
              )}
            </button>
          )}
        </div>
      )}

      {showDeletePermanently && (
        <button
          onClick={onDeletePermanently}
          disabled={isDeleting}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Delete Permanently
            </>
          )}
        </button>
      )}
    </>
  );
};

export default AppointmentActions;