// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  LogIn,
  User,
  Shield,
} from "lucide-react";
import { Button } from "../components/common";
import hospitalBg from "../assets/hospital-bg.jpg";
import { loginUser } from "../api/auth.api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"user" | "admin">("user");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // =========================
    // User Login
    // =========================
    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      const { token, refreshToken, user } = response.data;

      localStorage.setItem("token", token);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("profileImage", user.profileImage ?? "");

   if (user.role === "ADMIN") {
  navigate("/admin/dashboard", { replace: true });
} else {
  navigate("/", { replace: true });
}

      toast.success("Login successful! Welcome back.", {
        duration: 3500,
        style: {
          fontSize: "18px",
          fontWeight: "700",
          padding: "20px 24px",
          minWidth: "460px",
        },
      });
    } catch (error) {
      const err = error as AxiosError<{
        message?: string;
      }>;

      console.error("LOGIN ERROR");
      console.error(err.response?.data ?? error);

      toast.error(err.response?.data?.message ?? "Invalid email or password.", {
        duration: 3500,
        style: {
          fontSize: "18px",
          fontWeight: "700",
          padding: "20px 24px",
          minWidth: "460px",
        },
      });
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
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
      <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-sm" />

      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            {loginType === "admin" ? (
              <Shield className="w-8 h-8 text-emerald-600" />
            ) : (
              <LogIn className="w-8 h-8 text-emerald-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-emerald-900">
            {loginType === "admin" ? "Admin Login" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-emerald-700">
            {loginType === "admin"
              ? "Sign in as Administrator"
              : "Sign in to your account"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`py-2.5 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
              loginType === "user"
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-emerald-200 hover:border-emerald-400 text-emerald-600"
            }`}
          >
            <User className="w-4 h-4" />
            User
          </button>
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`py-2.5 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
              loginType === "admin"
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-emerald-200 hover:border-emerald-400 text-emerald-600"
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-white/95 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900 placeholder-emerald-400"
                placeholder={
                  loginType === "admin"
                    ? "admin@example.com"
                    : "you@example.com"
                }
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-emerald-800">
                Password
              </label>
              <a
                href="#"
                className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
              >
                Forgot?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-12 py-3 bg-white/95 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900 placeholder-emerald-400"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/95 text-emerald-600">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="mt-4 w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-emerald-200 rounded-xl hover:bg-emerald-50 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            <span className="font-medium text-emerald-800">
              Sign in with Google
            </span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-emerald-700">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-emerald-600 hover:text-emerald-800"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
