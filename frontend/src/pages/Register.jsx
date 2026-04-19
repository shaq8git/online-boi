import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.post("/users", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // await login(form.email, form.password);
     navigate("/check-email", {
          state: { email: form.email },
     });
     
    
    } catch (err) {
      setError(err.response?.data?.detail  || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-8 shadow-xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-100">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-gray-100 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-500/30"
            />
          </div>

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
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-gray-100 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-500/30"
            />
          </div>

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
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
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