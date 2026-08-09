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
    onChange(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (
    index: number,
    field: keyof Medicine,
    value: string,
  ) => {
    const updated = [...medicines];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };


  const extractNumber = (value: string) => {
    const match = value.trim().match(/^\d+(?:\.\d+)?/);
    return match?.[0] ?? "";
  };


  const extractDosageUnit = (value: string) => {
    const match = value.trim().match(
      /^\d+(?:\.\d+)?\s*(.*)$/i,
    );

    return match?.[1]?.trim().toLowerCase() || "tablet";
  };

  const extractFrequencyUnit = (value: string) => {
    const match = value.trim().match(
      /^\d+(?:\.\d+)?\s*(.*)$/i,
    );

    return (
      match?.[1]?.trim().toLowerCase() ||
      "times daily"
    );
  };

  const extractDurationUnit = (value: string) => {
    const match = value.trim().match(
      /^\d+(?:\.\d+)?\s*(.*)$/i,
    );

    return (
      match?.[1]?.trim().toLowerCase() ||
      "days"
    );
  };

  const dosageUnitOptions = [
    { value: "tablet", label: "Tablet(s)" },
    { value: "capsule", label: "Capsule(s)" },
    { value: "ml", label: "mL" },
    { value: "mg", label: "mg" },
    { value: "g", label: "g" },
    { value: "drop", label: "Drop(s)" },
    { value: "puff", label: "Puff(s)" },
    { value: "teaspoon", label: "Teaspoon(s)" },
    { value: "tablespoon", label: "Tablespoon(s)" },
    { value: "sachet", label: "Sachet(s)" },
  ];

  const frequencyUnitOptions = [
    {
      value: "times daily",
      label: "Times Daily",
    },
    {
      value: "times weekly",
      label: "Times Weekly",
    },
    {
      value: "times monthly",
      label: "Times Monthly",
    },
  ];

  const durationUnitOptions = [
    {
      value: "days",
      label: "Days",
    },
    {
      value: "weeks",
      label: "Weeks",
    },
    {
      value: "months",
      label: "Months",
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}

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

      {/* ================= EMPTY STATE ================= */}

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

      {/* ================= MEDICINE CARDS ================= */}

      <div className="space-y-6 p-6">
        {medicines.map((medicine, index) => {
          const dosageNumber = extractNumber(
            medicine.dosage,
          );

          const dosageUnit = extractDosageUnit(
            medicine.dosage,
          );

          const frequencyNumber = extractNumber(
            medicine.frequency,
          );

          const frequencyUnit =
            extractFrequencyUnit(
              medicine.frequency,
            );

          const durationNumber = extractNumber(
            medicine.duration,
          );

          const durationUnit =
            extractDurationUnit(
              medicine.duration,
            );

          return (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
            >
              {/* Medicine Header */}

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Medicine #{index + 1}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Prescription medication details
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeMedicine(index)
                  }
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

              {/* ================= MEDICINE NAME ================= */}

              <Input
                label="Medicine Name"
                value={medicine.name}
                onChange={(value) =>
                  updateMedicine(
                    index,
                    "name",
                    value,
                  )
                }
                placeholder="e.g. Seclo"
              />

              {/* ================= DOSAGE ================= */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Dosage
                </label>

                <div className="grid gap-3 sm:grid-cols-[1fr_1.5fr]">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={dosageNumber}
                    onChange={(e) => {
                      const value =
                        e.target.value;

                      updateMedicine(
                        index,
                        "dosage",
                        value
                          ? `${value} ${dosageUnit}`
                          : "",
                      );
                    }}
                    placeholder="e.g. 3"
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

                  <select
                    value={dosageUnit}
                    onChange={(e) => {
                      const value =
                        e.target.value;

                      updateMedicine(
                        index,
                        "dosage",
                        dosageNumber
                          ? `${dosageNumber} ${value}`
                          : "",
                      );
                    }}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      text-gray-700
                      outline-none
                      transition
                      focus:border-emerald-500
                      focus:ring-4
                      focus:ring-emerald-100
                    "
                  >
                    {dosageUnitOptions.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Example: 3 tablets
                </p>
              </div>

              {/* ================= FREQUENCY ================= */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Frequency
                </label>

                <div className="grid gap-3 sm:grid-cols-[1fr_1.5fr]">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={frequencyNumber}
                    onChange={(e) => {
                      const value =
                        e.target.value;

                      updateMedicine(
                        index,
                        "frequency",
                        value
                          ? `${value} ${frequencyUnit}`
                          : "",
                      );
                    }}
                    placeholder="e.g. 3"
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

                  <select
                    value={frequencyUnit}
                    onChange={(e) => {
                      const value =
                        e.target.value;

                      updateMedicine(
                        index,
                        "frequency",
                        frequencyNumber
                          ? `${frequencyNumber} ${value}`
                          : "",
                      );
                    }}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      text-gray-700
                      outline-none
                      transition
                      focus:border-emerald-500
                      focus:ring-4
                      focus:ring-emerald-100
                    "
                  >
                    {frequencyUnitOptions.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Example: 3 times daily
                </p>
              </div>

              {/* ================= DURATION ================= */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Duration
                </label>

                <div className="grid gap-3 sm:grid-cols-[1fr_1.5fr]">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={durationNumber}
                    onChange={(e) => {
                      const value =
                        e.target.value;

                      updateMedicine(
                        index,
                        "duration",
                        value
                          ? `${value} ${durationUnit}`
                          : "",
                      );
                    }}
                    placeholder="e.g. 7"
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

                  <select
                    value={durationUnit}
                    onChange={(e) => {
                      const value =
                        e.target.value;

                      updateMedicine(
                        index,
                        "duration",
                        durationNumber
                          ? `${durationNumber} ${value}`
                          : "",
                      );
                    }}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      text-gray-700
                      outline-none
                      transition
                      focus:border-emerald-500
                      focus:ring-4
                      focus:ring-emerald-100
                    "
                  >
                    {durationUnitOptions.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Example: 7 days
                </p>
              </div>

              {/* ================= INSTRUCTIONS ================= */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Instructions
                </label>

                <textarea
                  rows={3}
                  value={
                    medicine.instructions ?? ""
                  }
                  onChange={(e) =>
                    updateMedicine(
                      index,
                      "instructions",
                      e.target.value,
                    )
                  }
                  placeholder="e.g. Take after meals..."
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
          );
        })}
      </div>
    </section>
  );
};

/* ================= REUSABLE INPUT ================= */

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
      onChange={(e) =>
        onChange(e.target.value)
      }
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