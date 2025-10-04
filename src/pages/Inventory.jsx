import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaSearch, FaEdit, FaSave, FaTimes, FaBoxOpen, FaCalculator } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
export default function Inventory() {
  const { state, setState } = useContext(AuthContext);
  const products = state.products || [];

  const [editingData, setEditingData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFieldChange = (id, field, value) => {
    setEditingData((prev) => ({
      ...prev,
      [id]: { ... (prev[id] || {}), [field]: value }
    }));
  };

  const handleSave = (id) => {
    const edited = editingData[id];
    if (!edited) return;

    // Validate required fields
    if (!edited.name || isNaN(parseFloat(edited.mrp)) || isNaN(parseInt(edited.stock))) {
      alert("Name, MRP, and Stock are required and must be valid.");
      return;
    }

    const updatedProducts = products.map((p) =>
      p.id === id
        ? {
            ...p,
            name: edited.name || p.name,
            originalRate: parseFloat(edited.originalRate) || p.originalRate || 0,
            price: parseFloat(edited.mrp) || p.price || 0,
            stock: parseInt(edited.stock) || p.stock || 0,
          }
        : p
    );

    setState((prev) => ({ ...prev, products: updatedProducts }));

    // Clear edits
    setEditingData((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });

    // Show success message
    const updatedProduct = updatedProducts.find((p) => p.id === id);
    setMessage(`✅ "${updatedProduct?.name}" updated successfully!`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancel = (id) => {
    setEditingData((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const getStockValue = (product, id) => {
    const stock = parseInt(editingData[id]?.stock ?? product.stock) || 0;
    const mrp = parseFloat(editingData[id]?.mrp ?? product.price) || 0;
    return stock * mrp;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
                <p className="text-slate-600 mt-1">Monitor and update your stock levels and pricing in real-time.</p>
              </div>
            <Link
  to="/products"
  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-sm hover:bg-emerald-700 transition-all duration-300 font-medium"
>
  <FaBoxOpen className="w-4 h-4" />
  Manage Products
</Link>
            </div>
          </div>

          {/* Success message */}
          {message && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl shadow-sm flex items-center">
              <FaBoxOpen className="w-5 h-5 mr-2" />
              {message}
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products by name..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Original Rate
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      MRP
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Stock Value
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        <FaBoxOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p className="text-lg">No products found.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const isEditing = !!editingData[product.id];
                      const stockValue = getStockValue(product, product.id);
                      return (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 text-left">
                            #{product.id}
                          </td>
                          <td className="px-6 py-4 text-left">
                            {isEditing ? (
                              <input
                                type="text"
                                className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                value={editingData[product.id]?.name ?? product.name}
                                onChange={(e) => handleFieldChange(product.id, "name", e.target.value)}
                              />
                            ) : (
                              <span className="text-sm text-slate-900">{product.name}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.01"
                                className="w-20 px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                                value={editingData[product.id]?.originalRate ?? (product.originalRate || "")}
                                onChange={(e) => handleFieldChange(product.id, "originalRate", e.target.value)}
                              />
                            ) : (
                              <span className="text-sm text-slate-900">${Number(product.originalRate || 0).toFixed(2)}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.01"
                                className="w-20 px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                                value={editingData[product.id]?.mrp ?? (product.price || "")}
                                onChange={(e) => handleFieldChange(product.id, "mrp", e.target.value)}
                              />
                            ) : (
                              <span className="text-sm font-medium text-slate-900">${Number(product.price || 0).toFixed(2)}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                className="w-20 px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                                value={editingData[product.id]?.stock ?? (product.stock || "")}
                                onChange={(e) => handleFieldChange(product.id, "stock", e.target.value)}
                                min="0"
                              />
                            ) : (
                              <span className="text-sm text-slate-900">{product.stock || 0}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600 text-right">
                            ${stockValue.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSave(product.id)}
                                  className="text-emerald-600 hover:text-emerald-900 p-1 rounded transition-colors"
                                >
                                  <FaSave className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleCancel(product.id)}
                                  className="text-slate-500 hover:text-slate-700 p-1 rounded transition-colors"
                                >
                                  <FaTimes className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setEditingData((prev) => ({ ...prev, [product.id]: {} }))}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {filteredProducts.length > 0 && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                <p className="text-sm text-slate-600 text-left">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}