import { ArrowLeft, ClipboardList } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import DiagnosisCard from "../components/doctor/prescription/DiagnosisCard";
import MedicineList from "../components/doctor/prescription/MedicineList";
import TestList from "../components/doctor/prescription/TestList";
import AdviceCard from "../components/doctor/prescription/AdviceCard";
import PrescriptionActions from "../components/doctor/prescription/PrescriptionActions";
import PrescriptionHeader from "../components/doctor/prescription/PrescriptionHeader";

import { usePrescription } from "../hooks/usePrescription";

import type {
  Medicine,
  MedicalTest,
  PrescriptionFormData,
} from "../types/prescription";

const emptyMedicine = (): Medicine => ({
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
});

const emptyTest = (): MedicalTest => ({
  name: "",
  instructions: "",
});

const DoctorPrescription = () => {
  const navigate = useNavigate();

  const { appointmentId } = useParams<{
    appointmentId: string;
  }>();

  const { create, loading } = usePrescription();

  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([
    emptyMedicine(),
  ]);
  const [tests, setTests] = useState<MedicalTest[]>([]);
  const [advice, setAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const handleSave = async () => {
    if (!appointmentId) {
      toast.error("Appointment not found.");
      return;
    }

    if (!diagnosis.trim()) {
      toast.error("Diagnosis is required.");
      return;
    }

    const validMedicines = medicines.filter(
      (medicine) =>
        medicine.name.trim() ||
        medicine.dosage.trim() ||
        medicine.frequency.trim() ||
        medicine.duration.trim() ||
        medicine.instructions?.trim(),
    );

    const validTests = tests.filter(
      (test) =>
        test.name.trim() ||
        test.instructions?.trim(),
    );

    const payload: PrescriptionFormData = {
      appointmentId,
      diagnosis: diagnosis.trim(),
      medicines: validMedicines,
      tests: validTests,
      advice: advice.trim(),
      followUpDate,
    };

    const success = await create(payload);

    if (success) {
      navigate(-1);
    }
  };

  const handleReset = () => {
    setDiagnosis("");
    setMedicines([emptyMedicine()]);
    setTests([]);
    setAdvice("");
    setFollowUpDate("");

    toast.success("Prescription form has been reset.");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* Top Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Appointments
          </button>

          <div className="hidden items-center gap-2 text-sm font-medium text-gray-500 sm:flex">
            <ClipboardList className="h-4 w-4 text-emerald-600" />
            Medical Prescription
          </div>
        </div>

        {/* Header */}
        <PrescriptionHeader />

        {/* Form */}
        <div className="mt-6 space-y-6">

          {/* Diagnosis */}
          <DiagnosisCard
            diagnosis={diagnosis}
            onChange={setDiagnosis}
          />

          {/* Medicines */}
          <MedicineList
            medicines={medicines}
            onChange={setMedicines}
          />

          {/* Medical Tests */}
          <TestList
            tests={tests}
            onChange={setTests}
          />

          {/* Advice + Follow-up */}
          <AdviceCard
            advice={advice}
            onChange={setAdvice}
            followUpDate={followUpDate}
            onFollowUpDateChange={setFollowUpDate}
          />

          {/* Actions */}
          <PrescriptionActions
            loading={loading}
            onSave={handleSave}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescription;