// Frontend/src/pages/GoogleCallback.tsx

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log(searchParams.toString());

  console.log({
    token: searchParams.get("accessToken"),
    role: searchParams.get("role"),
    name: searchParams.get("name"),
    profileImage: searchParams.get("profileImage"),
  });

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const role = searchParams.get("role");
    const name = searchParams.get("name");
    const profileImage = searchParams.get("profileImage");

    if (!accessToken) {
      toast.error("Google login failed!");
      navigate("/login");
      return;
    }

    // Save authentication info
    localStorage.setItem("token", accessToken);
    localStorage.setItem("loginType", "google");

    if (role) {
      localStorage.setItem("role", role);
    }

    if (name) {
      localStorage.setItem("name", name);
    }

    if (profileImage) {
      localStorage.setItem("profileImage", profileImage);
    }

    // Remove token from browser URL
    window.history.replaceState({}, "", "/auth/google/callback");

    toast.success("Google Login Successful!");

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1500);
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="text-center">
        <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>

        <h2 className="text-2xl font-bold text-emerald-800">
          Completing Google Login...
        </h2>

        <p className="mt-3 text-emerald-600">
          Please wait while we securely sign you in.
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
