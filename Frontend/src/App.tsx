import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerificationResult from "./pages/EmailVerification";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function Layout() {
  const location = useLocation();

  // Hide Navbar on these pages
  const hideNavbarRoutes = [
    "/email-verified",
    "/forgot-password",
    "/reset-password",
  ];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  // Temporary (later replace with Auth Context / Redux)
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
        {/* ================= Public Routes ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/email-verified"
          element={<EmailVerificationResult />}
        />

        {/* ================= Protected Routes ================= */}

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