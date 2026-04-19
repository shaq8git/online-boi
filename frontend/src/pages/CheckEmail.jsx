import { Link } from "react-router-dom";

import { useLocation } from "react-router-dom";



export default function CheckEmail() {

const location = useLocation();
const email = location.state?.email;

  return (
    <div className="w-full px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-8 text-center shadow-xl">
        
        <h2 className="mb-4 text-3xl font-bold text-gray-100">
          Check your email
        </h2>

        <p className="mb-6 text-gray-300">
          We’ve sent you a verification link. Please check your inbox and click the link to activate your account.
        </p>

        {email && (
        <p className="mb-4 text-sm text-gray-400">
            Sent to: <span className="text-gray-200">{email}</span>
        </p>
        )}

        <p className="mb-6 text-sm text-gray-400">
          Didn’t receive the email? Check your spam folder.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-600"
          >
            Go to Login
          </Link>

          {/* Optional later */}
          {/* <button className="text-sm text-blue-400 hover:underline">
            Resend verification email
          </button> */}
        </div>
      </div>
    </div>
  );
}