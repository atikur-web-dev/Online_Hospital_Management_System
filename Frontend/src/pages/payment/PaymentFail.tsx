// Frontend/src/pages/payment/PaymentFail.tsx
import {
  ArrowLeft,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentFail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <ShieldCheck size={20} />
            <span className="text-sm font-semibold tracking-wide">
              SECURE PAYMENT
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-4xl border border-red-100 bg-white shadow-[0_25px_70px_rgba(239,68,68,0.10)]">
          <div className="px-6 py-10 text-center sm:px-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60">
              <XCircle
                size={54}
                strokeWidth={1.8}
                className="text-red-500"
              />
            </div>

            <div className="mt-7">
              <span className="inline-flex rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700">
                Payment Unsuccessful
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Payment Failed
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-gray-500">
                We couldn't complete your payment. No appointment
                confirmation has been issued yet.
              </p>
            </div>
          </div>

          {/* Information */}
          <div className="mx-6 mb-6 rounded-2xl border border-red-100 bg-red-50/60 p-5 sm:mx-10">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <CreditCard
                  size={22}
                  className="text-red-500"
                />
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  What can you do?
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  You can return to your appointments and try the payment
                  again. If the problem continues, please contact support.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50/70 px-6 py-6 sm:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => navigate("/appointments")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <ArrowLeft size={18} />
                Back to Appointments
              </button>

              <button
                onClick={() => navigate("/appointments")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-red-700 hover:shadow-md"
              >
                <RefreshCcw size={18} />
                Try Again
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          If your account was charged despite this message, please contact
          support before making another payment.
        </p>
      </div>
    </div>
  );
};

export default PaymentFail;