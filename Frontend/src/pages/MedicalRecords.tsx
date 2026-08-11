// Frontend/src/pages/MedicalRecords.tsx
import { MedicalRecordsSection } from "../components/medical-record";

const MedicalRecords = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <MedicalRecordsSection />
      </div>
    </div>
  );
};

export default MedicalRecords;