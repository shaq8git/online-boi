import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadBooks = async () => {
    try {
      setError("");
      const response = await api.get("/books/");
      setBooks(response.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleAddToCart = async (bookId) => {
    try {
      setMessage("");
      setAddingId(bookId);

      await api.post("/cart/", {
        book_id: bookId,
        quantity: 1,
      });

      setMessage("Book added to cart");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return <p className="px-6 py-10 text-gray-300">Loading books...</p>;
  }

  if (error) {
    return <p className="px-6 py-10 text-red-400">{error}</p>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-100">Books</h1>

      {message && (
        <p className="mb-6 rounded-lg border border-green-500/30 bg-green-900/20 px-4 py-3 text-green-300">
          {message}
        </p>
      )}

      {books.length === 0 ? (
        <p className="text-gray-400">No books found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="group flex min-h-[460px] flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-gray-600 hover:shadow-2xl"
            >
              <div className="flex h-56 items-center justify-center border-b border-gray-700 bg-gradient-to-br from-gray-700 to-gray-800">
                <div className="flex h-40 w-28 items-center justify-center rounded-md border border-gray-500 bg-gray-600 shadow-md transition duration-300 group-hover:scale-105 group-hover:shadow-xl">
                  <span className="px-3 text-center text-sm font-semibold tracking-wide text-gray-200">
                    {book.title}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-3 line-clamp-2 text-2xl font-bold text-gray-100">
                  {book.title}
                </h3>

                <p className="mb-2 text-gray-300">
                  <span className="font-semibold text-gray-100">Author:</span>{" "}
                  {book.author}
                </p>

                {book.description && (
                  <p className="mb-5 min-h-[72px] text-sm leading-6 text-gray-400">
                    {book.description}
                  </p>
                )}

                <div className="mb-5 space-y-2 text-gray-300">
                  <p>
                    <span className="font-semibold text-gray-100">Price:</span> $
                    {book.price}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-100">Stock:</span>{" "}
                    {book.stock}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(book.id)}
                  disabled={addingId === book.id || book.stock < 1}
                  className={`mt-auto rounded-lg px-4 py-3 text-sm font-semibold text-white transition duration-200 ${
                    book.stock < 1
                      ? "cursor-not-allowed bg-gray-600 opacity-70"
                      : addingId === book.id
                      ? "bg-gray-600"
                      : "bg-gray-700 hover:bg-gray-600 hover:shadow-md"
                  }`}
                >
                  {addingId === book.id
                    ? "Adding..."
                    : book.stock < 1
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}