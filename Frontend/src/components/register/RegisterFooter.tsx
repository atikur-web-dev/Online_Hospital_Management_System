// Frontend/src/components/register/RegisterFooter.tsx
import { Link } from "react-router-dom";

const RegisterFooter = () => {
  return (
    <div className="mt-6 text-center text-sm text-emerald-700">
      Already have an account?{" "}
      <Link
        to="/login"
        className="font-semibold text-emerald-600 hover:text-emerald-800"
      >
        Sign In
      </Link>
    </div>
  );
};

export default RegisterFooter;