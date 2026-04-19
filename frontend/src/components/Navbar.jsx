import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Navbar() {
  
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCartCount = async () => {
      if (!isAuthenticated) {
        setCartCount(0);
        return;
      }

      try {
        const response = await api.get("/cart/");
        const items = response.data || [];
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalCount);
      } catch {
        setCartCount(0);
      }
    };

    loadCartCount();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-gray-700 bg-gray-900">
      <div className="mx-auto flex h-[73px] max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-lg font-semibold text-gray-100 transition duration-200 hover:text-white"
          >
            PoddaBoti Bookstore
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/books"
                className="text-gray-400 transition duration-200 hover:text-white"
              >
                Books
              </Link>

              <Link
                to="/cart"
                className="relative text-gray-400 transition duration-200 hover:text-white"
              >
                Cart
                {cartCount > 0 && (
                  <span className="ml-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-gray-200 px-1.5 text-xs font-bold text-gray-900">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-400">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white transition duration-200 hover:bg-gray-600 hover:shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 transition duration-200 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white transition duration-200 hover:bg-gray-600 hover:shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

