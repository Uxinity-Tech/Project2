import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaSearch, FaEdit, FaSave, FaTimes, FaBoxOpen, FaCalculator, FaExclamationTriangle } from "react-icons/fa";
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

  const handleCalculateStockValue = (id) => {
    const edited = editingData[id];
    if (edited && !isNaN(parseFloat(edited.mrp)) && !isNaN(parseInt(edited.stock))) {
      const calculated = parseFloat(edited.mrp) * parseInt(edited.stock);
      handleFieldChange(id, "stockValue", calculated.toString());
    }
  };

  const handleSave = (id) => {
    const edited = editingData[id];
    if (!edited) return;

    // Validate required fields
    if (!edited.name || isNaN(parseFloat(edited.mrp)) || isNaN(parseInt(edited.stock))) {
      alert("Name, MRP, and Stock are required and must be valid.");
      return;
    }

    const parsedStockValue = parseFloat(edited.stockValue) || 0;

    if (parsedStockValue < 0) {
      alert("Stock Value must be non-negative.");
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
            stockValue: parsedStockValue
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
    const editedStockValue = editingData[id]?.stockValue;
    if (editedStockValue !== undefined) {
      return parseFloat(editedStockValue) || 0;
    }
    return product.stockValue || (parseInt(product.stock || 0) * parseFloat(product.price || 0));
  };

  const isLowStock = (stock) => parseInt(stock || 0) < 10;

  const renderField = (label, value, isEditing, inputProps, className = "") => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      {isEditing ? (
        <input
          {...inputProps}
          className={`w-full px-3 py-2 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 ${className}`}
        />
      ) : (
        <div className={`p-2 bg-slate-50 rounded-lg ${className}`}>
          <span className="text-sm font-semibold text-slate-900">{value}</span>
        </div>
      )}
    </div>
  );

  const renderMobileProductCard = (product) => {
    const isEditing = !!editingData[product.id];
    const stockValue = getStockValue(product, product.id);
    const currentStock = parseInt((editingData[product.id]?.stock ?? product.stock) || 0);
    const lowStock = isLowStock(currentStock);

    return (
      <div key={product.id} className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-200 ${lowStock ? 'border-l-4 border-orange-400 bg-orange-50/50' : 'bg-white/80'}`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-emerald-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {product.name.charAt(0).toUpperCase()}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 text-sm font-semibold text-slate-900"
                  value={editingData[product.id]?.name ?? product.name}
                  onChange={(e) => handleFieldChange(product.id, "name", e.target.value)}
                />
              ) : (
                <span className="text-base font-semibold text-slate-900">{product.name}</span>
              )}
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex-shrink-0">
              #{product.id}
            </span>
          </div>
          {lowStock && !isEditing && (
            <div className="flex items-center gap-2 mt-2 pl-2">
              <FaExclamationTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-600 font-medium">Low Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderField(
              "Original Rate",
              Number(product.originalRate || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
              isEditing,
              {
                type: "number",
                step: "0.01",
                value: editingData[product.id]?.originalRate ?? (product.originalRate || ""),
                onChange: (e) => handleFieldChange(product.id, "originalRate", e.target.value)
              }
            )}
            {renderField(
              "MRP",
              Number(product.price || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
              isEditing,
              {
                type: "number",
                step: "0.01",
                value: editingData[product.id]?.mrp ?? (product.price || ""),
                onChange: (e) => handleFieldChange(product.id, "mrp", e.target.value)
              },
              "text-right"
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderField(
              "Stock",
              <span className={`text-sm font-semibold ${lowStock ? 'text-orange-600' : 'text-slate-900'}`}>
                {product.stock || 0}
                {lowStock && <FaExclamationTriangle className="inline ml-1 w-3 h-3" />}
              </span>,
              isEditing,
              {
                type: "number",
                value: editingData[product.id]?.stock ?? (product.stock || ""),
                onChange: (e) => handleFieldChange(product.id, "stock", e.target.value),
                min: "0"
              },
              "text-right"
            )}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Stock Value</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    className="flex-1 px-3 py-2 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right bg-white/50 backdrop-blur-sm transition-all duration-200"
                    value={editingData[product.id]?.stockValue ?? stockValue}
                    onChange={(e) => handleFieldChange(product.id, "stockValue", e.target.value)}
                    min="0"
                  />
                  <button
                    onClick={() => handleCalculateStockValue(product.id)}
                    className="p-2 text-emerald-500 hover:text-emerald-700 transition-colors rounded-lg hover:bg-emerald-50 flex-shrink-0"
                    title="Calculate Stock Value"
                  >
                    <FaCalculator className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-2 bg-emerald-50 rounded-lg text-right">
                  <span className="text-sm font-semibold text-emerald-600">{Number(stockValue).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-200/50 flex justify-center sm:justify-end gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => handleSave(product.id)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 font-medium shadow-sm"
              >
                <FaSave className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => handleCancel(product.id)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all duration-200 font-medium"
              >
                <FaTimes className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditingData((prev) => ({ ...prev, [product.id]: {} }))}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm"
            >
              <FaEdit className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/20">
                  <FaBoxOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Inventory Management
                  </h1>
                  <p className="text-slate-600 mt-1">Monitor and update your stock levels and pricing in real-time.</p>
                </div>
              </div>
              <Link
                to="/products"
                className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-medium transform hover:-translate-y-0.5"
              >
                <FaBoxOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                Manage Products
              </Link>
            </div>
          </div>

          {/* Success message */}
          {message && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl shadow-lg flex items-center animate-in slide-in-from-top-2 duration-300">
              <FaBoxOpen className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{message}</span>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-full sm:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products by name..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm bg-white/80 backdrop-blur-sm placeholder-slate-400 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/50">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Original Rate
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      MRP
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Stock Value
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200/50">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        <FaBoxOpen className="w-16 h-16 mx-auto mb-4 text-slate-300 animate-pulse" />
                        <p className="text-lg font-medium">No products found.</p>
                        <p className="text-sm mt-1">Start by adding products in the management section!</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const isEditing = !!editingData[product.id];
                      const stockValue = getStockValue(product, product.id);
                      const currentStock = parseInt((editingData[product.id]?.stock ?? product.stock) || 0);
                      const lowStock = isLowStock(currentStock);
                      return (
                        <tr key={product.id} className={`transition-all duration-200 hover:bg-slate-50/50 ${lowStock ? 'border-l-4 border-orange-400' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                              #{product.id}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-left">
                            {isEditing ? (
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                                value={editingData[product.id]?.name ?? product.name}
                                onChange={(e) => handleFieldChange(product.id, "name", e.target.value)}
                              />
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {product.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-semibold text-slate-900">{product.name}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.01"
                                className="w-24 px-3 py-2 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right bg-white/50 backdrop-blur-sm transition-all duration-200"
                                value={editingData[product.id]?.originalRate ?? (product.originalRate || "")}
                                onChange={(e) => handleFieldChange(product.id, "originalRate", e.target.value)}
                              />
                            ) : (
                              <span className="text-sm text-slate-900">{Number(product.originalRate || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.01"
                                className="w-24 px-3 py-2 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right bg-white/50 backdrop-blur-sm transition-all duration-200"
                                value={editingData[product.id]?.mrp ?? (product.price || "")}
                                onChange={(e) => handleFieldChange(product.id, "mrp", e.target.value)}
                              />
                            ) : (
                              <span className="text-sm font-semibold text-slate-900">{Number(product.price || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                className="w-20 px-3 py-2 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right bg-white/50 backdrop-blur-sm transition-all duration-200"
                                value={editingData[product.id]?.stock ?? (product.stock || "")}
                                onChange={(e) => handleFieldChange(product.id, "stock", e.target.value)}
                                min="0"
                              />
                            ) : (
                              <span className={`text-sm font-semibold ${lowStock ? 'text-orange-600' : 'text-slate-900'}`}>
                                {product.stock || 0}
                                {lowStock && (
                                  <FaExclamationTriangle className="inline ml-1 w-3 h-3" />
                                )}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-24 px-3 py-2 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right bg-white/50 backdrop-blur-sm transition-all duration-200"
                                  value={editingData[product.id]?.stockValue ?? stockValue}
                                  onChange={(e) => handleFieldChange(product.id, "stockValue", e.target.value)}
                                  min="0"
                                />
                                <button
                                  onClick={() => handleCalculateStockValue(product.id)}
                                  className="p-2 text-emerald-500 hover:text-emerald-700 transition-colors rounded-lg hover:bg-emerald-50"
                                  title="Calculate Stock Value"
                                >
                                  <FaCalculator className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-sm font-semibold text-emerald-600">{Number(stockValue).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSave(product.id)}
                                  className="group relative p-2 rounded-lg text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 transition-all duration-200 transform hover:scale-110"
                                >
                                  <FaSave className="w-4 h-4" />
                                  <div className="absolute inset-0 bg-emerald-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                                </button>
                                <button
                                  onClick={() => handleCancel(product.id)}
                                  className="group relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 transform hover:scale-110"
                                >
                                  <FaTimes className="w-4 h-4" />
                                  <div className="absolute inset-0 bg-slate-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setEditingData((prev) => ({ ...prev, [product.id]: {} }))}
                                className="group relative p-2 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-all duration-200 transform hover:scale-110"
                              >
                                <FaEdit className="w-4 h-4" />
                                <div className="absolute inset-0 bg-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
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
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/50">
                <p className="text-sm text-slate-600 flex items-center justify-between">
                  <span>Showing {filteredProducts.length} of {products.length} products</span>
                  <span className="text-xs text-slate-500">Last updated: {new Date().toLocaleDateString('en-IN')}</span>
                </p>
              </div>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FaBoxOpen className="w-16 h-16 mx-auto mb-4 text-slate-300 animate-pulse" />
                <p className="text-lg font-medium">No products found.</p>
                <p className="text-sm mt-1">Start by adding products in the management section!</p>
              </div>
            ) : (
              filteredProducts.map(renderMobileProductCard)
            )}
            {filteredProducts.length > 0 && (
              <div className="pt-4 text-center text-sm text-slate-600 border-t border-slate-200/50">
                <p>Showing {filteredProducts.length} of {products.length} products</p>
                <p className="text-xs text-slate-500 mt-1">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}