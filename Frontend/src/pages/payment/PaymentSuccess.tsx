// Frontend/src/pages/payment/PaymentSuccess.tsx
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 text-emerald-700">
            <ShieldCheck size={20} />
            <span className="text-sm font-semibold tracking-wide">
              SECURE PAYMENT
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-4xl border border-emerald-100 bg-white shadow-[0_25px_70px_rgba(16,185,129,0.12)]">
          {/* Top section */}
          <div className="px-6 py-10 text-center sm:px-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
              <CheckCircle2
                size={54}
                strokeWidth={1.8}
                className="text-emerald-500"
              />
            </div>

            <div className="mt-7">
              <span className="inline-flex rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                Payment Completed
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Payment Successful
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-gray-500">
                Your consultation payment has been received successfully.
                Your appointment is now confirmed.
              </p>
            </div>
          </div>

          {/* Confirmation panel */}
          <div className="mx-6 mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:mx-10">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <CalendarCheck2
                  size={22}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Appointment Confirmed
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  You can now view your appointment details from your
                  appointments dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50/70 px-6 py-6 sm:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => navigate("/appointments")}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
              >
                View My Appointments
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Your payment was processed securely through SSLCommerz.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;