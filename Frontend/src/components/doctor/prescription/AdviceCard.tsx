// Frontend/src/components/doctor/prescription/AdviceCard.tsx
import {
  FileText,
  ShieldCheck,
} from "lucide-react";

interface Props {
  advice: string;
  onChange: (value: string) => void;

  followUpDate: string;
  onFollowUpDateChange: (value: string) => void;
}

const AdviceCard = ({
  advice,
  onChange,
  followUpDate,
  onFollowUpDateChange,
}: Props) => {
  return (
    <section className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">

      {/* Header */}

      <div className="px-6 py-5 border-b border-emerald-100">

        <div className="flex items-center gap-3">

          <div className="h-11 w-11 rounded-xl bg-emerald-100 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
          </div>

          <div>

            <h2 className="text-lg font-semibold text-gray-900">
              Advice & Follow-up
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Provide medical advice and schedule the next visit if necessary.
            </p>

          </div>

        </div>

      </div>

      <div className="p-6 space-y-6">

        {/* Advice */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">

            <FileText className="h-4 w-4 text-emerald-600" />

            Medical Advice

          </label>

          <textarea
            rows={6}
            value={advice}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Take medicines after meals. Drink plenty of water. Avoid oily foods. Return immediately if symptoms worsen..."
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              resize-none
              outline-none
              transition
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-100
            "
          />

        </div>

        {/* Follow Up */}

        <div>

          <label className="block mb-2 text-sm font-medium text-gray-700">
            Follow-up Date
          </label>

          <input
            type="date"
            value={followUpDate}
            onChange={(e) =>
              onFollowUpDateChange(e.target.value)
            }
            className="
              w-full
              md:w-80
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              outline-none
              transition
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-100
            "
          />

          <p className="mt-2 text-sm text-gray-500">
            Leave empty if no follow-up appointment is required.
          </p>

        </div>

      </div>

    </section>
  );
};

export default AdviceCard;