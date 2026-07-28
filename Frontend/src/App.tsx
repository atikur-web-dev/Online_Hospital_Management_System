// Frontend/src/App.tsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerificationResult from "./pages/EmailVerification";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function Layout() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/email-verified",
    "/forgot-password",
    "/reset-password",
  ];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  // Temporary
  const isLoggedIn = false;
  const userRole = "patient";

  return (
    <div className="min-h-screen bg-emerald-50">
      {!hideNavbar && (
        <Navbar
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          userImage="https://ui-avatars.com/api/?name=Rahim+Ahmed&background=10b981&color=fff&size=40"
        />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/email-verified" element={<EmailVerificationResult />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <div>Doctors List</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <div>Appointments</div>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Toast MUST stay outside Routes */}
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
