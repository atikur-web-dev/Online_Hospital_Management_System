// Frontend/src/pages/payment/PaymentCancel.tsx
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center px-4 py-10">
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
        <div className="overflow-hidden rounded-4xl border border-amber-100 bg-white shadow-[0_25px_70px_rgba(245,158,11,0.10)]">
          <div className="px-6 py-10 text-center sm:px-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 ring-8 ring-amber-50/60">
              <XCircle
                size={54}
                strokeWidth={1.8}
                className="text-amber-500"
              />
            </div>

            <div className="mt-7">
              <span className="inline-flex rounded-full bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700">
                Payment Cancelled
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Payment Cancelled
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-gray-500">
                You left the payment process before completing the
                transaction. Your appointment has not been confirmed.
              </p>
            </div>
          </div>

          {/* Information */}
          <div className="mx-6 mb-6 rounded-2xl border border-amber-100 bg-amber-50/60 p-5 sm:mx-10">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <CreditCard
                  size={22}
                  className="text-amber-500"
                />
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  No confirmation yet
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Your appointment will only become confirmed after a
                  successful payment.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50/70 px-6 py-6 sm:px-10">
            <div className="flex justify-end">
              <button
                onClick={() => navigate("/appointments")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-amber-600 hover:shadow-md sm:w-auto"
              >
                <ArrowLeft size={18} />
                Back to Appointments
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          You can return to your appointments and complete the payment
          whenever you're ready.
        </p>
      </div>
    </div>
  );
};

export default PaymentCancel;