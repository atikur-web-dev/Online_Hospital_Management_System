// Frontend/src/pages/EmailVerification.tsx

import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status");
  const success = status === "success";

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!success) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/login?verified=true");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [success, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 p-10 text-center">

        {success ? (
          <>
            <CheckCircle2
              size={90}
              className="mx-auto text-green-500 animate-pulse"
            />

            <h1 className="mt-6 text-3xl font-bold text-slate-800">
              Email Verified Successfully 🎉
            </h1>

            <p className="mt-4 text-slate-600 leading-7">
              Your email address has been verified successfully.
              You can now securely log in to your CarePlus account.
            </p>

            <div className="mt-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
              <p className="text-green-700 font-medium">
                Redirecting to Login in{" "}
                <span className="font-bold text-xl">
                  {countdown}
                </span>{" "}
                second{countdown !== 1 ? "s" : ""}...
              </p>
            </div>

            <Link
              to="/login"
              className="mt-8 inline-flex w-full justify-center rounded-xl bg-green-600 px-6 py-3 text-white font-semibold transition duration-200 hover:bg-green-700"
            >
              Login Now
            </Link>
          </>
        ) : (
          <>
            <XCircle
              size={90}
              className="mx-auto text-red-500 animate-pulse"
            />

            <h1 className="mt-6 text-3xl font-bold text-slate-800">
              Verification Failed
            </h1>

            <p className="mt-4 text-slate-600 leading-7">
              This verification link is invalid, expired,
              or has already been used.
            </p>

            <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-red-700">
                Please register again or request a new verification email.
              </p>
            </div>

            <Link
              to="/register"
              className="mt-8 inline-flex w-full justify-center rounded-xl bg-red-600 px-6 py-3 text-white font-semibold transition duration-200 hover:bg-red-700"
            >
              Register Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}