import { ArrowLeft, ClipboardList } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import DiagnosisCard from "../components/doctor/prescription/DiagnosisCard";
import MedicineList from "../components/doctor/prescription/MedicineList";
import TestList from "../components/doctor/prescription/TestList";
import AdviceCard from "../components/doctor/prescription/AdviceCard";
import PrescriptionActions from "../components/doctor/prescription/PrescriptionActions";
import PrescriptionHeader from "../components/doctor/prescription/PrescriptionHeader";
import { usePrescription } from "../hooks/usePrescription";
import { getDoctorAppointmentById } from "../api/doctorAppointment.api";

import type {
  Medicine,
  MedicalTest,
  PrescriptionFormData,
} from "../types/prescription";

interface AppointmentDetails {
  id: string;
  appointmentAt: string;

  patient: {
    id: string;
    name: string;
    phone: string | null;
    gender: string | null;
    dateOfBirth: string | null;

    user: {
      email: string;
      profileImage: string | null;
    };
  };

  prescription: {
    id: string;
    diagnosis: string;
    advice: string | null;
    followUpDate: string | null;
    medicines: Medicine[];
    tests: MedicalTest[];
    createdAt: string;
    updatedAt: string;
  } | null;
}

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

  const { create, loading, prescription, fetchById } = usePrescription();

  const [appointment, setAppointment] = useState<AppointmentDetails | null>(
    null,
  );

  const [appointmentLoading, setAppointmentLoading] = useState(true);

  const [diagnosis, setDiagnosis] = useState("");

  const [medicines, setMedicines] = useState<Medicine[]>([emptyMedicine()]);

  const [tests, setTests] = useState<MedicalTest[]>([]);

  const [advice, setAdvice] = useState("");

  const [followUpDate, setFollowUpDate] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) {
        toast.error("Appointment not found.");
        setAppointmentLoading(false);
        return;
      }

      try {
        setAppointmentLoading(true);

        const appointmentData = await getDoctorAppointmentById(appointmentId);

        // cast to any to accommodate differing AppointmentDetails types from API
        setAppointment(appointmentData as any);

        if (appointmentData.prescription?.id) {
          navigate(
            `/doctor/prescription/view/${appointmentData.prescription.id}`,
            { replace: true },
          );

          return;
        }
      } catch (error) {
        console.error("Failed to fetch appointment:", error);

        toast.error("Failed to load appointment details.");
      } finally {
        setAppointmentLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, navigate]);

  useEffect(() => {
    if (!prescription) return;

    setDiagnosis(prescription.diagnosis);

    setMedicines(
      prescription.medicines.length > 0
        ? prescription.medicines.map((medicine) => ({
            name: medicine.medicineName,
            dosage: medicine.dosage,
            frequency: medicine.frequency,
            duration: medicine.duration,
            instructions: medicine.instructions ?? "",
          }))
        : [emptyMedicine()],
    );

    setTests(
      prescription.tests.map((test) => ({
        name: test.testName,
        instructions: test.instructions ?? "",
      })),
    );

    setAdvice(prescription.advice ?? "");

    setFollowUpDate(
      prescription.followUpDate ? prescription.followUpDate.split("T")[0] : "",
    );
  }, [prescription]);

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
      (test) => test.name.trim() || test.instructions?.trim(),
    );

    const payload: PrescriptionFormData = {
      appointmentId,
      diagnosis: diagnosis.trim(),
      medicines: validMedicines,
      tests: validTests,
      advice: advice.trim(),
      followUpDate: followUpDate
        ? new Date(`${followUpDate}T00:00:00`).toISOString()
        : null,
    };

    const success = await create(payload);

    if (success) {
      navigate(`/doctor/prescription/view/${prescription?.id}`);
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

  if (appointmentLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50/60 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

          <p className="text-sm font-medium text-gray-600">
            Loading appointment...
          </p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50/60 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            Appointment Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            We could not load this appointment.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
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

        <PrescriptionHeader
          patientName={appointment.patient.name}
          appointmentDate={appointment.appointmentAt}
        />

        <div className="mt-6 space-y-6">
          {/* Diagnosis */}

          <DiagnosisCard diagnosis={diagnosis} onChange={setDiagnosis} />

          {/* Medicines */}

          <MedicineList medicines={medicines} onChange={setMedicines} />

          {/* Medical Tests */}

          <TestList tests={tests} onChange={setTests} />

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
