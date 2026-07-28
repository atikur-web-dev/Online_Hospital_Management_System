// Frontend/src/pages/GoogleCallback.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleCallback = () => {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();


  useEffect(() => {

    const token = searchParams.get("accessToken");


    if (!token) {
      toast.error("Google login failed!");
      navigate("/login");
      return;
    }


    localStorage.setItem(
      "token",
      token
    );


    localStorage.setItem(
      "loginType",
      "google"
    );


    toast.success(
      "Google Login Successful!"
    );


    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);


  }, [navigate, searchParams]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">

      <div className="text-center">

        <h2 className="text-2xl font-bold text-emerald-800">
          Completing Google Login...
        </h2>

        <p className="mt-3 text-emerald-600">
          Please wait
        </p>

      </div>

    </div>
  );
};


export default GoogleCallback;