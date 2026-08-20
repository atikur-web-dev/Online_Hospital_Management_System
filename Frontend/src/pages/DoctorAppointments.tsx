// Frontend/src/pages/DoctorAppointments.tsx
import { AlertCircle, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  archiveAppointment,
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
  getDoctorAppointmentById,
} from "../api/doctorAppointment.api";

import {
  AppointmentCard,
  AppointmentHeader,
  LoadingScreen,
  AppointmentStats,
  ConfirmationModal,
  EmptyState,
} from "../components/doctor/appointments";

import MedicalReportsModal from "../components/doctor/appointments/MedicalReportsModal";

import { useDoctorAppointment } from "../hooks/useDoctorAppointment";

import type {
  Appointment,
  AppointmentDetails,
} from "../types/appointment";

import {
  getDayLabel,
  getTimeOfDay,
} from "../utils/appointment";

const DoctorAppointments = () => {
  const {
    appointments,
    loading,
    error,
    fetchAppointments,
  } = useDoctorAppointment();


  // Appointment Action States
  const [confirmingId, setConfirmingId] =
    useState<string | null>(null);

  const [completingId, setCompletingId] =
    useState<string | null>(null);

  const [cancelingId, setCancelingId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

 
  // Search
 const [search, setSearch] = useState("");

 
  // Delete Confirmation
  const [modalAppointment, setModalAppointment] =
    useState<Appointment | null>(null);

  
  // Medical Records
  const [medicalRecordsAppointment, setMedicalRecordsAppointment] =
    useState<AppointmentDetails | null>(null);

  const [medicalRecordsLoading, setMedicalRecordsLoading] =
    useState(false);


  // Filter Appointments
  const filteredAppointments = useMemo(() => {
    if (!search.trim()) {
      return appointments;
    }

    const searchLower = search.toLowerCase();

    return appointments.filter(
      (appointment: Appointment) => {
        const patient = appointment.patient;

        return (
          patient.name
            .toLowerCase()
            .includes(searchLower) ||
          patient.user.email
            .toLowerCase()
            .includes(searchLower) ||
          (patient.phone &&
            patient.phone
              .toLowerCase()
              .includes(searchLower))
        );
      },
    );
  }, [appointments, search]);

  
  // Statistics
  const totalAppointments =
    appointments.length;

  const pendingAppointments =
    appointments.filter(
      (appointment: Appointment) =>
        appointment.status === "PENDING",
    ).length;

  const confirmedAppointments =
    appointments.filter(
      (appointment: Appointment) =>
        appointment.status === "CONFIRMED",
    ).length;

  const completedAppointments =
    appointments.filter(
      (appointment: Appointment) =>
        appointment.status === "COMPLETED",
    ).length;

  const cancelledAppointments =
    appointments.filter(
      (appointment: Appointment) =>
        appointment.status === "CANCELLED",
    ).length;


  // Confirm Appointment
  const handleConfirm = async (
    id: string,
  ) => {
    try {
      setConfirmingId(id);

      await confirmAppointment(id);

      toast.success(
        "Appointment confirmed successfully.",
      );

      await fetchAppointments();
    } catch (err) {
      console.error(
        "Confirm appointment error:",
        err,
      );

      toast.error(
        "Failed to confirm appointment.",
      );
    } finally {
      setConfirmingId(null);
    }
  };


  // Complete Appointment
  const handleComplete = async (
    id: string,
  ) => {
    const appointment = appointments.find(
      (item: Appointment) =>
        item.id === id,
    );

    if (!appointment) {
      toast.error(
        "Appointment not found.",
      );
      return;
    }

    if (!appointment.prescription) {
      toast.error(
        "Create a prescription before completing the appointment.",
      );
      return;
    }

    try {
      setCompletingId(id);

      await completeAppointment(id);

      toast.success(
        "Appointment completed successfully.",
      );

      await fetchAppointments();
    } catch (err) {
      console.error(
        "Complete appointment error:",
        err,
      );

      toast.error(
        "Failed to complete appointment.",
      );
    } finally {
      setCompletingId(null);
    }
  };


  // Cancel Appointment
  const handleCancel = async (
    id: string,
  ) => {
    try {
      setCancelingId(id);

      await cancelAppointment(id);

      toast.success(
        "Appointment cancelled successfully.",
      );

      await fetchAppointments();
    } catch (err) {
      console.error(
        "Cancel appointment error:",
        err,
      );

      toast.error(
        "Failed to cancel appointment.",
      );
    } finally {
      setCancelingId(null);
    }
  };


  // Delete / Archive Appointment
  const handleDeletePermanently = (
    id: string,
  ) => {
    const appointment =
      appointments.find(
        (item: Appointment) =>
          item.id === id,
      );

    if (appointment) {
      setModalAppointment(
        appointment,
      );
    }
  };

  const confirmDeletePermanently =
    async () => {
      if (!modalAppointment) {
        return;
      }

      try {
        setDeletingId(
          modalAppointment.id,
        );

        await archiveAppointment(
          modalAppointment.id,
        );

        await fetchAppointments();

        toast.success(
          `Appointment with ${modalAppointment.patient.name} has been removed from your dashboard.`,
        );

        setModalAppointment(null);
      } catch (err) {
        console.error(
          "Archive appointment error:",
          err,
        );

        toast.error(
          "Failed to remove appointment.",
        );
      } finally {
        setDeletingId(null);
      }
    };

 
  const handleViewMedicalReports = async (
    id: string,
  ) => {
    try {
      setMedicalRecordsLoading(true);

      const appointment =
        await getDoctorAppointmentById(id);

      setMedicalRecordsAppointment(
        appointment,
      );
    } catch (err) {
      console.error(
        "Get medical records error:",
        err,
      );

      toast.error(
        "Failed to load patient's medical records.",
      );
    } finally {
      setMedicalRecordsLoading(false);
    }
  };


  // Close Medical Records Modal
  const handleCloseMedicalRecords = () => {
    setMedicalRecordsAppointment(null);
  };

 
  // Loading State

  if (loading) {
    return <LoadingScreen />;
  }


  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-red-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Failed to Load
          </h3>

          <p className="text-sm text-gray-600 mb-6">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              fetchAppointments()
            }
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }


  // Main UI
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

          {/* Header */}
          <AppointmentHeader
            search={search}
            setSearch={setSearch}
          />

          {/* Statistics */}
          <AppointmentStats
            total={totalAppointments}
            pending={pendingAppointments}
            confirmed={confirmedAppointments}
            completed={completedAppointments}
            cancelled={cancelledAppointments}
          />

          {/* Appointment List */}
          {appointments.length === 0 ? (
            <EmptyState
              type="appointments"
            />
          ) : filteredAppointments.length === 0 ? (
            <EmptyState
              type="search"
              search={search}
            />
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {filteredAppointments.map(
                (
                  appointment: Appointment,
                ) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={
                      appointment
                    }

                    onConfirm={
                      handleConfirm
                    }

                    onComplete={
                      handleComplete
                    }

                    onCancel={
                      handleCancel
                    }

                    onDeletePermanently={
                      handleDeletePermanently
                    }

                    onViewMedicalReports={
                      handleViewMedicalReports
                    }

                    isConfirming={
                      confirmingId ===
                      appointment.id
                    }

                    isCompleting={
                      completingId ===
                      appointment.id
                    }

                    isCanceling={
                      cancelingId ===
                      appointment.id
                    }

                    isDeleting={
                      deletingId ===
                      appointment.id
                    }

                    dayLabel={getDayLabel(
                      new Date(
                        appointment.appointmentAt,
                      ),
                    )}

                    timeOfDay={getTimeOfDay(
                      new Date(
                        appointment.appointmentAt,
                      ),
                    )}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/*  Permanent Delete Confirmation */}

      <ConfirmationModal
        isOpen={
          !!modalAppointment
        }
        onClose={() =>
          setModalAppointment(null)
        }
        onConfirm={
          confirmDeletePermanently
        }
        patientName={
          modalAppointment?.patient
            .name || ""
        }
        isDeleting={
          !!deletingId
        }
      />

      {/* Medical Records Modal */}

      {medicalRecordsAppointment && (
    <MedicalReportsModal
  isOpen={!!medicalRecordsAppointment}
  onClose={handleCloseMedicalRecords}
  appointment={medicalRecordsAppointment}
/>
      )}

      {/* Medical records loading overlay */}
      {medicalRecordsLoading && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-xl">
            <RefreshCw className="h-5 w-5 animate-spin text-emerald-600" />

            <span className="text-sm font-medium text-gray-700">
              Loading medical records...
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorAppointments;