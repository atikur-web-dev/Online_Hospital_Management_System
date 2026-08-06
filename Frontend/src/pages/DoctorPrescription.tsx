// Frontend/src/pages/DoctorPrescription.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import PrescriptionHeader from "../components/doctor/prescription/PrescriptionHeader";
import DiagnosisCard from "../components/doctor/prescription/DiagnosisCard";
import MedicineList from "../components/doctor/prescription/MedicineList";
import TestList from "../components/doctor/prescription/TestList";
import AdviceCard from "../components/doctor/prescription/AdviceCard";
import PrescriptionActions from "../components/doctor/prescription/PrescriptionActions";

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

  const [tests, setTests] =
useState<MedicalTest[]>([]);

  const [advice, setAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  
  //  Reset
  const handleReset = () => {
    setDiagnosis("");
    setMedicines([emptyMedicine()]);
    setTests([]);
    setAdvice("");
    setFollowUpDate("");
  };

  // Submit
  const handleSave = async () => {
    if (!appointmentId) {
      toast.error("Appointment not found.");
      return;
    }

    if (!diagnosis.trim()) {
      toast.error("Diagnosis is required.");
      return;
    }

    const payload: PrescriptionFormData = {
      appointmentId,
      diagnosis,
      medicines,
      tests,
      advice,
      followUpDate,
    };

    const success = await create(payload);

    if (success) {
      toast.success("Prescription created successfully.");

      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <PrescriptionHeader />
        <DiagnosisCard diagnosis={diagnosis} onChange={setDiagnosis} />
        <MedicineList medicines={medicines} onChange={setMedicines} />
        <TestList tests={tests} onChange={setTests} />
        <AdviceCard
          advice={advice}
          onChange={setAdvice}
          followUpDate={followUpDate}
          onFollowUpDateChange={setFollowUpDate}
        />

        <PrescriptionActions
          loading={loading}
          onSave={handleSave}
          onReset={handleReset}
        />
      </div>
    </div>
  );
};

export default DoctorPrescription;
