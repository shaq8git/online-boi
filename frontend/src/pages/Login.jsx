import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const handleChange = (e) => {
    setError("");
    setMessage("");

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     console.log("🟡 Submitting login form:", form);

    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const data = await login(form.email, form.password);

       console.log("🟢 Login success response:", data);

       navigate("/");
    } catch (err) {

       console.log("🔴 Login error:", err.response?.data);
       
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {

    console.log("inside forgotPassword");


    setError("");
    setMessage("");

    if (!form.email || !form.email.trim()) {
      setError("Please enter your email first.");
      return;
    }

    try {
      setSendingReset(true);

      const response = await api.post("/auth/forgot-password", {

        
        email: form.email,
      });

      console.log("just after await api.post(auth/forgot-password", form.email)

      setMessage(
        response.data?.message ||
          "Password reset instructions have been sent to your email."
      );
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to send password reset email frontend"
      );
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className="w-full px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-8 shadow-xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-100">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-gray-100 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-500/30"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={sendingReset}
                className="text-sm font-medium text-gray-300 transition hover:text-white hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sendingReset ? "Sending..." : "Forgot password?"}
              </button>
            </div>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
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
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          New here?{" "}
          <Link
            to="/register"
            className="font-medium text-gray-200 transition hover:text-white hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
