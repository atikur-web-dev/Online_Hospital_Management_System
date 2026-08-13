// Frontend/src/pages/DoctorPrescriptionView.tsx
import { useEffect, useState } from "react";
import { ArrowLeft, Edit3, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { sendPrescriptionEmail } from "../api/prescription.api";
import PrescriptionDocument from "../components/doctor/prescription/PrescriptionDocument";
import { usePrescription } from "../hooks/usePrescription";

const DoctorPrescriptionView = () => {
  const { prescriptionId } = useParams<{
    prescriptionId: string;
  }>();

  const navigate = useNavigate();

  const { prescription, loading, fetchById } = usePrescription();

  const [sendingEmail, setSendingEmail] = useState(false);

  /**
   * Load Prescription
   */
  useEffect(() => {
    if (!prescriptionId) {
      toast.error("Prescription not found.");
      return;
    }

    fetchById(prescriptionId);
  }, [prescriptionId, fetchById]);

  /**
   * Navigate to Edit Prescription
   */
  const handleEdit = () => {
    if (!prescription) {
      return;
    }

    navigate(`/doctor/prescription/edit/${prescription.id}`);
  };

  /**
   * Send Prescription To Patient
   */
  const handleSendToPatient = async () => {
    if (!prescription) {
      return;
    }

    try {
      setSendingEmail(true);

      const response = await sendPrescriptionEmail(
        prescription.id,
      );

      toast.success(
        response.message ||
          "Prescription sent to patient successfully.",
      );
    } catch (error) {
      console.error(
        "Failed to send prescription email:",
        error,
      );

      toast.error(
        "Failed to send prescription to patient.",
      );
    } finally {
      setSendingEmail(false);
    }
  };

  /**
   * Navigate Back
   */
  const handleBack = () => {
    navigate(-1);
  };

  /**
   * Loading State
   */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-2xl border border-gray-200 bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading prescription...
          </p>
        </div>
      </div>
    );
  }

  /**
   * Not Found State
   */
  if (!prescription) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Prescription Not Found
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            The prescription could not be loaded.
          </p>

          <button
            type="button"
            onClick={() => navigate("/doctor/appointments")}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-emerald-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-emerald-700
              active:scale-95
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Navigation */}

      <div className="mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-semibold
            text-gray-700
            shadow-sm
            transition-all
            hover:border-emerald-200
            hover:bg-emerald-50
            hover:text-emerald-700
            active:scale-95
          "
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Prescription Document */}

      <PrescriptionDocument prescription={prescription} />

      {/* Actions */}

      <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
        {/* Send Prescription */}

        <button
          type="button"
          onClick={handleSendToPatient}
          disabled={sendingEmail}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-emerald-200
            bg-emerald-50
            px-6
            py-3
            text-sm
            font-semibold
            text-emerald-700
            shadow-sm
            transition-all
            hover:bg-emerald-100
            hover:shadow-md
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {sendingEmail ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-700" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send to Patient
            </>
          )}
        </button>

        {/* Edit Prescription */}

        <button
          type="button"
          onClick={handleEdit}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-emerald-600
            px-6
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition-all
            hover:bg-emerald-700
            hover:shadow-md
            active:scale-95
          "
        >
          <Edit3 className="h-4 w-4" />
          Edit Prescription
        </button>
      </div>
    </div>
  );
};

export default DoctorPrescriptionView;