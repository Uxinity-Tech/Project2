import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function Inventory() {
  const { state, setState } = useContext(AuthContext);
  const products = state.products || [];

  const [editedStock, setEditedStock] = useState({});
  const [editedIds, setEditedIds] = useState({});
  const [message, setMessage] = useState("");

  // Update stock inline
  const handleStockChange = (id, value) => {
    setEditedStock({ ...editedStock, [id]: value });
  };

  // Update inventory ID inline
  const handleIdChange = (id, value) => {
    setEditedIds({ ...editedIds, [id]: value });
  };

  // Save updates
  const handleSave = (id) => {
    const updatedProducts = products.map((p) =>
      p.id === id
        ? {
            ...p,
            id: editedIds[id] ? parseInt(editedIds[id]) : p.id,
            stock: editedStock[id] ? parseInt(editedStock[id]) : p.stock,
          }
        : p
    );

    setState((prev) => ({ ...prev, products: updatedProducts }));

    // Clear edits
    setEditedStock((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setEditedIds((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });

    // Show success message
    const updatedProduct = products.find((p) => p.id === id);
    setMessage(`✅ "${updatedProduct?.name}" updated successfully!`);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Navbar />
        <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>

        {/* Success message */}
        {message && (
          <div className="mb-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow">
            {message}
          </div>
        )}

        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4">Inventory ID</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Stock</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={editedIds[product.id] ?? product.id}
                      onChange={(e) =>
                        handleIdChange(product.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded w-24"
                    />
                  </td>
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={editedStock[product.id] ?? product.stock}
                      onChange={(e) =>
                        handleStockChange(product.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded w-24"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleSave(product.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
