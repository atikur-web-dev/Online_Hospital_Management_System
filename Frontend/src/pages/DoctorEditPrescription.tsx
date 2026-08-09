// Frontend/src/pages/DoctorEditPrescription.tsx
import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardEdit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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
} from "../types/prescription";

const DoctorEditPrescription = () => {
  const navigate = useNavigate();

  const { prescriptionId } = useParams<{
    prescriptionId: string;
  }>();

  const {
    prescription,
    loading,
    fetchById,
    update,
  } = usePrescription();

  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState<
    Medicine[]
  >([]);
  const [tests, setTests] = useState<
    MedicalTest[]
  >([]);
  const [advice, setAdvice] = useState("");
  const [followUpDate, setFollowUpDate] =
    useState("");

  const [initialized, setInitialized] =
    useState(false);

  /**
   * Load Prescription
   */
  useEffect(() => {
    if (!prescriptionId) {
      toast.error("Prescription not found.");
      navigate(-1);
      return;
    }

    fetchById(prescriptionId);
  }, [prescriptionId]);

  /**
   * Populate Form
   */
  useEffect(() => {
    if (!prescription || initialized) {
      return;
    }

    setDiagnosis(prescription.diagnosis);

    setMedicines(
      prescription.medicines.map((medicine) => ({
        name: medicine.medicineName,
        dosage: medicine.dosage,
        frequency: medicine.frequency,
        duration: medicine.duration,
        instructions:
          medicine.instructions ?? "",
      })),
    );

    setTests(
      prescription.tests.map((test) => ({
        name: test.testName,
        instructions: test.instructions ?? "",
      })),
    );

    setAdvice(prescription.advice ?? "");

    setFollowUpDate(
      prescription.followUpDate
        ? prescription.followUpDate.split("T")[0]
        : "",
    );

    setInitialized(true);
  }, [prescription, initialized]);

  /**
   * Save Changes
   */
  const handleSave = async () => {
    if (!prescriptionId) {
      toast.error("Prescription not found.");
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

    const success = await update(
      prescriptionId,
      {
        diagnosis: diagnosis.trim(),
        medicines: validMedicines,
        tests: validTests,
        advice: advice.trim(),
        followUpDate: followUpDate
          ? new Date(
              `${followUpDate}T00:00:00`,
            ).toISOString()
          : null,
      },
    );

    if (success) {
      navigate(
        `/doctor/prescription/${prescriptionId}`,
      );
    }
  };

  /**
   * Reset Form
   */
  const handleReset = () => {
    if (!prescription) {
      return;
    }

    setDiagnosis(prescription.diagnosis);

    setMedicines(
      prescription.medicines.map((medicine) => ({
        name: medicine.medicineName,
        dosage: medicine.dosage,
        frequency: medicine.frequency,
        duration: medicine.duration,
        instructions:
          medicine.instructions ?? "",
      })),
    );

    setTests(
      prescription.tests.map((test) => ({
        name: test.testName,
        instructions: "",
      })),
    );

    setAdvice(prescription.advice ?? "");

    setFollowUpDate(
      prescription.followUpDate
        ? prescription.followUpDate.split("T")[0]
        : "",
    );

    toast.success(
      "Prescription changes have been reset.",
    );
  };

  if (loading && !prescription) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          Loading prescription...
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center text-center">
        <ClipboardEdit className="mb-4 h-10 w-10 text-gray-400" />

        <h2 className="text-lg font-semibold text-gray-800">
          Prescription Not Found
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          The prescription could not be loaded.
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Prescription
        </button>

        <div className="hidden items-center gap-2 text-sm font-medium text-gray-500 sm:flex">
          <ClipboardEdit className="h-4 w-4 text-emerald-600" />
          Edit Prescription
        </div>
      </div>

      {/* Header */}
      <PrescriptionHeader
        patientName={
          prescription.appointment?.patient.name
        }
        appointmentDate={
          prescription.appointment?.appointmentAt
        }
      />

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

        {/* Tests */}
        <TestList
          tests={tests}
          onChange={setTests}
        />

        {/* Advice */}
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
  );
};

export default DoctorEditPrescription;