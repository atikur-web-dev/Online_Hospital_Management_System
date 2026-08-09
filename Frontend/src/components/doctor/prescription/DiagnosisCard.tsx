// Frontend/src/components/doctor/prescription/DiagnosisCard.tsx
import { FileSearch, FileText } from "lucide-react";

interface Props {
  diagnosis: string;
  onChange: (value: string) => void;
}

const DiagnosisCard = ({ diagnosis, onChange }: Props) => {
  return (
    <section className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-emerald-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <FileSearch className="h-5 w-5 text-emerald-700" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Diagnosis</h2>

            <p className="mt-1 text-sm text-gray-500">
              Record the patient's primary diagnosis and clinical findings.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
          <FileText className="h-4 w-4 text-emerald-600" />
          Diagnosis Details
        </label>

        <textarea
          value={diagnosis}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          placeholder="Example:
• Acute viral fever
• Upper respiratory tract infection
• Mild dehydration
• Elevated blood pressure..."
          className="
            w-full
            resize-none
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            px-4
            py-3
            text-[15px]
            leading-7
            text-gray-800
            outline-none
            transition-all
            duration-200
            placeholder:text-gray-400
            focus:border-emerald-500
            focus:bg-white
            focus:ring-4
            focus:ring-emerald-100
          "
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Be concise and include only medically relevant information.
          </p>

          <span className="text-xs font-medium text-gray-400">
            {diagnosis.length} characters
          </span>
        </div>
      </div>
    </section>
  );
};

export default DiagnosisCard;
