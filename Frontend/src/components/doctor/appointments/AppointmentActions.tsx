// Frontend/src/components/doctor/appointments/AppointmentActions.tsx

import {
  Ban,
  CheckCircle2,
  FileText,
  Loader2,
  Trash2,
  UserCheck,
} from "lucide-react";

interface Props {
  appointmentId: string;

  isPending: boolean;
  isConfirmed: boolean;
  isCompleted: boolean;
  hasPrescription: boolean;

  showActions: boolean;
  showDeletePermanently: boolean;

  isConfirming: boolean;
  isCompleting: boolean;
  isCanceling: boolean;
  isDeleting: boolean;

  onConfirm: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onDeletePermanently: () => void;
  onCreatePrescription: () => void;
}

const AppointmentActions = ({
  isPending,
  isConfirmed,
  isCompleted,
  hasPrescription,
  showActions,
  showDeletePermanently,

  isConfirming,
  isCompleting,
  isCanceling,
  isDeleting,

  onConfirm,
  onComplete,
  onCancel,
  onDeletePermanently,
  onCreatePrescription,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto">
      {/* Active Appointment Actions */}
      {showActions && (
        <>
          {/* Confirm */}
          {isPending && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={
                isConfirming ||
                isCanceling
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
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

          {/* Prescription */}
          {(isConfirmed || isCompleted) && (
            <button
              type="button"
              onClick={onCreatePrescription}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
            >
              <FileText className="w-4 h-4" />

              {hasPrescription
                ? "View Prescription"
                : "Create Prescription"}
            </button>
          )}

          {/* Complete */}
          {isConfirmed && (
            <button
              type="button"
              onClick={onComplete}
              disabled={
                isCompleting ||
                isCanceling ||
                !hasPrescription
              }
              title={
                !hasPrescription
                  ? "Create a prescription before completing the appointment."
                  : undefined
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Complete
                </>
              )}
            </button>
          )}

          {/* Cancel */}
          {(isPending || isConfirmed) && (
            <button
              type="button"
              onClick={onCancel}
              disabled={
                isCanceling ||
                isConfirming ||
                isCompleting
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-red-700 text-sm font-medium rounded-lg border border-red-200 transition-all duration-200 hover:shadow-md active:scale-95"
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
        </>
      )}

      {/* Permanent Delete */}
      {showDeletePermanently && (
        <button
          type="button"
          onClick={onDeletePermanently}
          disabled={isDeleting}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
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
    </div>
  );
};

export default AppointmentActions;