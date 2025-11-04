import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  product,
  isLoading
}: any) {
  const [inputValue, setInputValue] = useState("");
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    setInputValue("");
    setIsMatch(false);
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsMatch(value.trim() === product.name.trim());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-6 w-[95%] max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              ¿Eliminar este producto?
            </h2>

            <div className="flex flex-col items-center gap-3 mb-4">
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-md border"
              />
              <p className="text-center text-gray-600">
                Estás a punto de eliminar{" "}
                <span className="font-medium text-gray-800">{product.name}</span>.
                <br />
                Esta acción no se puede deshacer.
              </p>

              <div className="flex gap-2 mt-2">
                <Link
                  to={`/product/${product.id}`}
                  className="text-blue-600 hover:underline text-sm"
                  target="_blank"
                >
                  Ver producto
                </Link>
                <Link
                  to={`/admin/products/edit/${product.id}`}
                  className="text-yellow-600 hover:underline text-sm"
                >
                  Editar producto
                </Link>
              </div>
            </div>

            <div className="mb-5 text-sm text-gray-700">
              <p className="mb-1">
                Para confirmar, escribe el nombre del producto:
              </p>
              <p className="font-semibold text-gray-900 mb-2">
                {product.name}
              </p>
              <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Escribe el nombre exacto..."
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => onConfirm(product.id)}
                disabled={!isMatch || isLoading}
                className={`px-4 py-2 rounded-md text-white flex items-center justify-center gap-2 transition ${isMatch && !isLoading
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-300 cursor-not-allowed"
                  }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
                <motion.div
                  className="flex flex-col items-center text-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <svg
                    className="animate-spin h-8 w-8 mb-2 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <p className="text-sm font-medium">Eliminando producto...</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
