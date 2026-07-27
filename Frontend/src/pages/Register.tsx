// Frontend/src/pages/Register.tsx

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

import { Button } from "../components/common";

// Hook
import { useRegister } from "../hooks/useRegister";

// Types
import type { RegisterFormData } from "../types/auth.types";


export default function Register() {

  const navigate = useNavigate();

  const {
    register,
    loading,
  } = useRegister();


  const [formData, setFormData] =
    useState<RegisterFormData>({
      
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



  return (
    <div>
      
    </div>
  );
}