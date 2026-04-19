import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function VerifyEmail() {

  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const [error, setError] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setError("Missing verification token");
      setMessage("");
      return;
    }

    const verify = async () => {
      try {

        console.log("inside verify()")
        
        const response = await api.get(`/auth/verify-email?token=${token}`);
        setMessage(response.data.message || "Email verified successfully frontend");
      } catch (err) {
        setError(err.response?.data?.detail || "Verification failed");
        setMessage("");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="w-full px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-8 text-center shadow-xl">
        <h2 className="mb-6 text-3xl font-bold text-gray-100">
          Email Verification
        </h2>

        {message && (
          <p className="mb-6 rounded-lg border border-green-500/30 bg-green-900/20 px-4 py-3 text-green-300">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-6 rounded-lg border border-red-500/40 bg-red-900/30 px-4 py-3 text-red-300">
            {error}
          </p>
        )}

        <Link
          to="/login"
          className="inline-block rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white transition hover:bg-gray-600"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}