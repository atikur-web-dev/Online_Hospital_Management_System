// Frontend/src/components/doctor/prescription/MedicineList.tsx

import {
  Pill,
  Plus,
  Trash2,
  ClipboardList,
} from "lucide-react";

import type { Medicine } from "../../../types/prescription";

interface Props {
  medicines: Medicine[];
  onChange: (medicines: Medicine[]) => void;
}

const emptyMedicine = (): Medicine => ({
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
});

const MedicineList = ({
  medicines,
  onChange,
}: Props) => {
  const addMedicine = () => {
    onChange([...medicines, emptyMedicine()]);
  };

  const removeMedicine = (index: number) => {
    onChange(
      medicines.filter((_, i) => i !== index)
    );
  };

  const updateMedicine = (
    index: number,
    field: keyof Medicine,
    value: string
  ) => {
    const updated = [...medicines];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-emerald-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <Pill className="h-5 w-5 text-emerald-700" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Medicines
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add prescribed medicines with dosage,
              frequency and duration.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={addMedicine}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-emerald-600
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-emerald-700
          "
        >
          <Plus className="h-4 w-4" />
          Add Medicine
        </button>
      </div>

      {/* Empty State */}

      {medicines.length === 0 && (
        <div className="py-14 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <ClipboardList className="h-8 w-8 text-emerald-600" />
          </div>

          <h3 className="text-lg font-semibold text-gray-800">
            No Medicines Added
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Click the button above to start adding
            prescribed medicines.
          </p>
        </div>
      )}

      {/* Medicine Cards */}

      <div className="space-y-6 p-6">
        {medicines.map((medicine, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                Medicine #{index + 1}
              </h3>

              <button
                type="button"
                onClick={() => removeMedicine(index)}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-red-200
                  px-3
                  py-2
                  text-red-600
                  transition
                  hover:bg-red-50
                "
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>

            {/* Medicine Information */}

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Medicine Name"
                value={medicine.name}
                onChange={(value) =>
                  updateMedicine(
                    index,
                    "name",
                    value
                  )
                }
                placeholder="Paracetamol 500mg"
              />

              <Input
                label="Dosage"
                value={medicine.dosage}
                onChange={(value) =>
                  updateMedicine(
                    index,
                    "dosage",
                    value
                  )
                }
                placeholder="1 Tablet"
              />

              <Input
                label="Frequency"
                value={medicine.frequency}
                onChange={(value) =>
                  updateMedicine(
                    index,
                    "frequency",
                    value
                  )
                }
                placeholder="3 Times Daily"
              />

              <Input
                label="Duration"
                value={medicine.duration}
                onChange={(value) =>
                  updateMedicine(
                    index,
                    "duration",
                    value
                  )
                }
                placeholder="7 Days"
              />
            </div>

            {/* Medicine Instructions */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Instructions
              </label>

              <textarea
                rows={3}
                value={medicine.instructions ?? ""}
                onChange={(e) =>
                  updateMedicine(
                    index,
                    "instructions",
                    e.target.value
                  )
                }
                placeholder="After meals..."
                className="
                  w-full
                  resize-none
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

interface InputProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const Input = ({
  label,
  value,
  placeholder,
  onChange,
}: InputProps) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>

    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full
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
  </div>
);

export default MedicineList;