// Frontend/src/App.tsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleCallback from "./pages/GoogleCallback";
import EmailVerificationResult from "./pages/EmailVerification";

import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";

import Departments from "./pages/Departments";
import Services from "./pages/Services";
import About from "./pages/About";
import DoctorPrescription from "./pages/DoctorPrescription";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorDashboard from "./pages/DoctorDashboard";

function Layout() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/email-verified",
    "/forgot-password",
    "/reset-password",
  ];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const userRole =
    (localStorage.getItem("role")?.toLowerCase() as
      | "patient"
      | "doctor"
      | "admin"
      | null) ?? null;

  const userImage =
    localStorage.getItem("profileImage") ||
    "https://ui-avatars.com/api/?name=User&background=10b981&color=fff";

  return (
    <div className="min-h-screen bg-emerald-50">
      {!hideNavbar && (
        <Navbar
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          userImage={userImage}
        />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verified" element={<EmailVerificationResult />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />

        <Route path="/departments" element={<Departments />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes */}

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
  path="/doctor/prescription/:appointmentId"
  element={
    <ProtectedRoute>
      <DoctorPrescription />
    </ProtectedRoute>
  }
/>
      </Routes>

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={16}
        toastOptions={{
          duration: 4500,
          style: {
            minWidth: "430px",
            maxWidth: "520px",
            padding: "18px 22px",
            borderRadius: "16px",
            fontSize: "17px",
            lineHeight: "1.6",
            fontWeight: "600",
            background: "#ffffff",
            color: "#064e3b",
            border: "1px solid #d1fae5",
            boxShadow: "0 16px 40px rgba(0,0,0,.15)",
          },
          success: {
            style: {
              fontSize: "17px",
              fontWeight: "600",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            style: {
              fontSize: "17px",
              fontWeight: "600",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}