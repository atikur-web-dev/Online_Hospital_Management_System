// Frontend/src/pages/admin/AdminPatients.tsx
const AdminPatients = () => {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Manage Patients
          </h1>

          <p className="mt-1 text-gray-500">
            View and manage registered patients.
          </p>
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-gray-500">
            Patient management will be available here.
          </p>
        </div>
      </div>
    </main>
  );
};

export default AdminPatients;