// Frontend/src/components/doctor/prescription/PrescriptionActions.tsx
import {
  Save,
  RotateCcw,
  LoaderCircle,
} from "lucide-react";

interface Props {
  loading: boolean;

  onSave: () => void;

  onReset: () => void;
}

const PrescriptionActions = ({
  loading,
  onSave,
  onReset,
}: Props) => {
  return (
    <div className="sticky bottom-0 z-20 border border-emerald-100 bg-white rounded-2xl shadow-sm p-6">

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">

        {/* Reset */}

        <button
          type="button"
          onClick={onReset}
          disabled={loading}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-gray-300
            bg-white
            px-6
            py-3
            text-sm
            font-semibold
            text-gray-700
            transition
            hover:bg-gray-50
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <RotateCcw className="h-4 w-4" />

          Reset
        </button>

        {/* Save */}

        <button
          type="button"
          onClick={onSave}
          disabled={loading}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-emerald-600
            px-7
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-emerald-700
            disabled:cursor-not-allowed
            disabled:opacity-70
          "
        >
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Saving Prescription...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Prescription
            </>
          )}
        </button>

      </div>

    </div>
  );
};

export default PrescriptionActions;