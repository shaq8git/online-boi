import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingId, setWorkingId] = useState(null);

  const loadCart = async () => {
    try {
      setError("");
      const response = await api.get("/cart/");
      setCartItems(response.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setWorkingId(itemId);

      const response = await api.put(`/cart/${itemId}`, {
        quantity: newQuantity,
      });

      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? response.data : item))
      );
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update quantity");
    } finally {
      setWorkingId(null);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setWorkingId(itemId);
      await api.delete(`/cart/${itemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to remove item");
    } finally {
      setWorkingId(null);
    }
  };

  const grandTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.book?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  if (loading) {
    return <p className="px-6 py-10 text-gray-300">Loading cart...</p>;
  }

  if (error) {
    return <p className="px-6 py-10 text-red-400">{error}</p>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h2 className="mb-8 text-3xl font-bold text-gray-100">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-8 text-center shadow-lg">
          <p className="text-lg text-gray-300">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {cartItems.map((item) => {
              const lineTotal = (item.book?.price || 0) * item.quantity;
              const busy = workingId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg transition duration-200 hover:border-gray-600 hover:shadow-xl"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 gap-5">
                      <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 text-center text-xs font-semibold text-gray-200 shadow-sm">
                        {item.book?.title}
                      </div>

                      <div className="flex-1">
                        <h3 className="mb-2 text-2xl font-bold text-gray-100">
                          {item.book?.title}
                        </h3>

                        <p className="mb-1 text-gray-300">
                          <span className="font-semibold text-gray-100">Author:</span>{" "}
                          {item.book?.author}
                        </p>

                        <p className="mb-1 text-gray-300">
                          <span className="font-semibold text-gray-100">Price:</span> $
                          {item.book?.price}
                        </p>

                        <p className="text-gray-300">
                          <span className="font-semibold text-gray-100">Total:</span> $
                          {lineTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 md:items-end">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-300">
                          Quantity
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={busy || item.quantity <= 1}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-700 text-lg font-bold text-white transition duration-200 hover:bg-gray-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          -
                        </button>

                        <span className="min-w-[32px] text-center text-lg font-semibold text-gray-100">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={busy}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-700 text-lg font-bold text-white transition duration-200 hover:bg-gray-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={busy}
                        className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-red-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold text-gray-200">Grand Total</span>
              <span className="text-2xl font-bold text-gray-100">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}