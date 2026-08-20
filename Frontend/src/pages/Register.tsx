// Frontend/src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import hospitalBg from "../assets/hospital-bg.jpg";

// Components
import RegisterHeader from "../components/register/RegisterHeader";
import RoleSelector from "../components/register/RoleSelector";
import PatientForm from "../components/register/PatientForm";
import DoctorForm from "../components/register/DoctorForm";
import PasswordField from "../components/register/PasswordField";
import GoogleSignup from "../components/register/GoogleSignup";
import RegisterFooter from "../components/register/RegisterFooter";
import toast from "react-hot-toast";
import { Button } from "../components/common";

// Hook
import { useRegister } from "../hooks/useRegister";

// Types
import type { RegisterFormData } from "../types/auth.types";

export default function Register() {
  const navigate = useNavigate();

  const { register, loading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    role: "PATIENT",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Patient fields
    dateOfBirth: "",
    gender: "MALE",
    address: "",

    // Doctor fields
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: "PATIENT" | "DOCTOR") => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleGoogleSignup = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (formData.role === "DOCTOR" && Number(formData.experience) < 0) {
      toast.error("Experience cannot be negative.");
      return;
    }

    if (formData.role === "DOCTOR" && Number(formData.consultationFee) < 0) {
      toast.error("Consultation fee cannot be negative.");
      return;
    }

    let payload;

    if (formData.role === "PATIENT") {
      payload = {
        role: "PATIENT" as const,

        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,

        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender,
        address: formData.address || undefined,
      };
    } else {
      payload = {
        role: "DOCTOR" as const,

        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,

        specialization: formData.specialization || undefined,
        qualification: formData.qualification || undefined,
        experience: Number(formData.experience),
        consultationFee: Number(formData.consultationFee),
      };
    }
    const success = await register(payload);

    if (success) {
      toast.success("Registration successful! Please verify your email.");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{
        backgroundImage: `url(${hospitalBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm border border-white/20">
        <RegisterHeader />

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* Role Selector */}
          <RoleSelector role={formData.role} onChange={handleRoleChange} />

          {/* Dynamic Form */}
          {formData.role === "PATIENT" ? (
            <PatientForm formData={formData} onChange={handleChange} />
          ) : (
            <DoctorForm formData={formData} onChange={handleChange} />
          )}

          {/* Password */}
          <PasswordField
            label="Password"
            name="password"
            value={formData.password}
            placeholder="Minimum 8 characters"
            showPassword={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
            onChange={handleChange}
          />

          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm your password"
            showPassword={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((prev) => !prev)}
            onChange={handleChange}
          />

          {/* Submit */}
          <Button type="submit" fullWidth size="lg" isLoading={loading}>
            Create Account
          </Button>

          {/* Google */}
          <GoogleSignup onClick={handleGoogleSignup} />

          {/* Footer */}
          <RegisterFooter />
        </form>
      </div>
    </div>
  );
}
