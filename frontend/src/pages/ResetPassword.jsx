import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setError("");
    setMessage("");
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Missing reset token.");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/auth/reset-password", {
        token,
        new_password: form.newPassword,
      });

      setMessage(response.data?.message || "Password reset successful.");

      localStorage.removeItem("token");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-8 shadow-xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-100">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-gray-100 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-500/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-gray-100 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-500/30"
            />
          </div>

          {message && (
            <p className="rounded-lg border border-green-500/30 bg-green-900/20 px-3 py-2 text-sm text-green-300">
              {message}
            </p>
          )}

          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-900/30 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gray-600 py-3 font-semibold text-white transition hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Back to{" "}
          <Link
            to="/login"
            className="font-medium text-gray-200 transition hover:text-white hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}