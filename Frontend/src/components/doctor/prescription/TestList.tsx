// Frontend/src/components/doctor/prescription/TestList.tsx
import {
  FlaskConical,
  Plus,
  Trash2,
  ClipboardCheck,
} from "lucide-react";
import type { MedicalTest } from "../../../types/prescription";

interface Props {
  tests: MedicalTest[];
  onChange: (tests: MedicalTest[]) => void;
}

const emptyTest = (): MedicalTest => ({
  name: "",
  instructions: "",
});

const TestList = ({
  tests,
  onChange,
}: Props) => {
  const addTest = () => {
    onChange([...tests, emptyTest()]);
  };

  const removeTest = (index: number) => {
    onChange(
      tests.filter((_, i) => i !== index)
    );
  };

  const updateTest = (
    index: number,
    field: keyof MedicalTest,
    value: string
  ) => {
    const updated = [...tests];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  return (
    <section className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">

      {/* Header */}

      <div className="px-6 py-5 border-b border-emerald-100 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="h-11 w-11 rounded-xl bg-emerald-100 flex items-center justify-center">
            <FlaskConical className="h-5 w-5 text-emerald-700" />
          </div>

          <div>

            <h2 className="text-lg font-semibold text-gray-900">
              Diagnostic Tests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add laboratory or imaging investigations.
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={addTest}
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
          Add Test
        </button>

      </div>

      {/* Empty */}

      {tests.length === 0 && (

        <div className="py-14 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">

            <ClipboardCheck className="h-8 w-8 text-emerald-600" />

          </div>

          <h3 className="text-lg font-semibold text-gray-800">
            No Diagnostic Tests
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Add laboratory, radiology or imaging investigations if required.
          </p>

        </div>

      )}

      {/* Test Cards */}

      <div className="space-y-5 p-6">

        {tests.map((test, index) => (

          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
          >

            <div className="mb-5 flex items-center justify-between">

              <h3 className="font-semibold text-gray-800">
                Test #{index + 1}
              </h3>

              <button
                type="button"
                onClick={() => removeTest(index)}
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

            <div className="space-y-5">

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Test Name
                </label>

                <input
                  value={test.name}
                  onChange={(e) =>
                    updateTest(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Complete Blood Count (CBC)"
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

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Instructions
                </label>

                <textarea
                  rows={3}
                  value={test.instructions}
                  onChange={(e) =>
                    updateTest(
                      index,
                      "instructions",
                      e.target.value
                    )
                  }
                  placeholder="Fasting required for 8 hours before sample collection..."
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

          </div>

        ))}

      </div>

    </section>
  );
};

export default TestList;