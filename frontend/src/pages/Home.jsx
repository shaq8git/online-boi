import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="rounded-2xl border border-gray-700 bg-gray-800 p-10 shadow-xl">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-400">
          You Made it!
        </p>

        <h1 className="mb-4 text-4xl font-bold text-gray-100">
          PoddaBoti Online Bookstore
        </h1>

        <p className="mb-8 text-lg text-gray-300">
          Welcome, <span className="font-semibold text-gray-100">{user?.name}</span>.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link to="/books">
            <button className="rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-gray-600 hover:shadow-md">
              Browse Books
            </button>
          </Link>

          <Link to="/cart">
            <button className="rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-gray-500 hover:shadow-md">
              View Cart
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

