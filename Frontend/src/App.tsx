// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const isLoggedIn = false;
  const userRole = 'patient';
  
  return (
    <Router>
      <div className="min-h-screen bg-emerald-50">
        <Navbar 
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          userImage="https://ui-avatars.com/api/?name=Rahim+Ahmed&background=10b981&color=fff&size=40"
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
    </Router>
  );
}

export default App;