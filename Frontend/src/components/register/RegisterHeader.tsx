// Frontend/src/components/register/RegisterHeader.tsx
import { UserPlus } from "lucide-react";

const RegisterHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100">
        <UserPlus className="w-8 h-8 text-emerald-600" />
      </div>

      <h1 className="mt-5 text-3xl font-bold text-emerald-900">
        Create Account
      </h1>

      <p className="mt-2 text-emerald-700">
        Join the CarePlus Healthcare Platform
      </p>
    </div>
  );
};

export default RegisterHeader;