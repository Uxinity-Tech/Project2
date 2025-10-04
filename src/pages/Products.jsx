import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaBoxOpen, FaTag, FaRupeeSign, FaBox } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Products() {
  const { state, setState } = useContext(AuthContext);
  const products = state.products || [];

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", originalRate: "", mrp: "", stock: "", stockValue: "" });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrEdit = () => {
    if (!newProduct.name || !newProduct.mrp || !newProduct.stock) {
      alert("Name, MRP, and Stock are required.");
      return;
    }

    const parsedMRP = parseFloat(newProduct.mrp);
    const parsedStock = parseInt(newProduct.stock);
    const parsedOriginalRate = parseFloat(newProduct.originalRate) || 0;
    const parsedStockValue = parseFloat(newProduct.stockValue) || 0;

    if (isNaN(parsedMRP) || isNaN(parsedStock) || parsedStock < 0) {
      alert("MRP and Stock must be valid positive numbers.");
      return;
    }

    if (editingProduct) {
      // Edit existing
      setState((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === editingProduct.id 
            ? { ...newProduct, id: p.id, price: parsedMRP, stock: parsedStock, originalRate: parsedOriginalRate, stockValue: parsedStockValue }
            : p
        ),
      }));
      setEditingProduct(null);
    } else {
      // Add new
      const nextId = products.length === 0 ? 1 : Math.max(...products.map(p => p.id)) + 1;
      const product = { 
        ...newProduct, 
        id: nextId,
        price: parsedMRP,
        stock: parsedStock,
        originalRate: parsedOriginalRate,
        stockValue: parsedStockValue
      };
      setState((prev) => ({
        ...prev,
        products: [...prev.products, product]
      }));
    }

    setShowModal(false);
    setNewProduct({ name: "", originalRate: "", mrp: "", stock: "", stockValue: "" });
  };

  const handleEdit = (product) => {
    setNewProduct({ 
      name: product.name, 
      originalRate: product.originalRate || "", 
      mrp: product.price || "", 
      stock: product.stock || "",
      stockValue: product.stockValue || ""
    });
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setState((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== id),
      }));
    }
  };

  const openAddModal = () => {
    setNewProduct({ name: "", originalRate: "", mrp: "", stock: "", stockValue: "" });
    setEditingProduct(null);
    setShowModal(true);
  };

  const modalTitle = editingProduct ? "Edit Product" : "Add Product";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/20">
                  <FaBoxOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Products Management
                  </h1>
                  <p className="text-slate-600 mt-1">Manage your inventory and pricing details with precision.</p>
                </div>
              </div>
              <button
                onClick={openAddModal}
                className="w-full lg:w-auto group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-medium transform hover:-translate-y-0.5"
              >
                <FaBoxOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                Add Product
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-full max-w-md">
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

          {/* Products Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/50">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                      Stock
                    </th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                      Original Rate
                    </th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                      Stock Value
                    </th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                      MRP
                    </th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                        <p className="text-sm mt-1">Start by adding your first product!</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const stockValue = Number(product.stockValue || 0);
                      const isLowStock = (product.stock || 0) < 10;
                      return (
                        <tr key={product.id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                          <td className="px-2 sm:px-4 lg:px-6 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                              #{product.id}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 lg:px-6 py-3 text-sm font-semibold text-slate-900">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {product.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="truncate">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 lg:px-6 py-3 whitespace-nowrap text-sm text-slate-900 text-right hidden sm:table-cell">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {product.stock || 0}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 lg:px-6 py-3 whitespace-nowrap text-sm text-slate-600 text-right hidden md:table-cell">
                            <FaRupeeSign className="inline w-3 h-3 text-slate-400 mr-1" />
                            {Number(product.originalRate || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="px-2 sm:px-4 lg:px-6 py-3 whitespace-nowrap text-sm font-semibold text-emerald-600 text-right hidden lg:table-cell">
                            <FaRupeeSign className="inline w-3 h-3 text-emerald-400 mr-1" />
                            {stockValue.toLocaleString('en-IN')}
                          </td>
                          <td className="px-2 sm:px-4 lg:px-6 py-3 whitespace-nowrap text-sm font-semibold text-slate-900 text-right hidden sm:table-cell">
                            <FaTag className="inline w-3 h-3 text-slate-400 mr-1" />
                            {Number(product.price || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="px-2 sm:px-4 lg:px-6 py-3 whitespace-nowrap text-sm font-medium text-center space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="group relative p-2 rounded-lg text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 transition-all duration-200 transform hover:scale-110"
                            >
                              <FaEdit className="w-4 h-4" />
                              <div className="absolute inset-0 bg-emerald-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="group relative p-2 rounded-lg text-red-600 hover:text-red-900 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                            >
                              <FaTrash className="w-4 h-4" />
                              <div className="absolute inset-0 bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {filteredProducts.length > 0 && (
              <div className="px-4 sm:px-6 py-4 bg-slate-50/50 border-t border-slate-200/50">
                <p className="text-sm text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span>Showing {filteredProducts.length} of {products.length} products</span>
                  <span className="text-xs text-slate-500">Last updated: {new Date().toLocaleDateString('en-IN')}</span>
                </p>
              </div>
            )}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-200/50 animate-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 border-b border-slate-200/50 bg-gradient-to-b from-white/50 to-transparent">
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <FaBox className="w-5 h-5 text-emerald-500" />
                    {modalTitle}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                        <FaTag className="w-4 h-4 text-emerald-500" />
                        Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                        <FaRupeeSign className="w-4 h-4 text-slate-500" />
                        Original Rate
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                        value={newProduct.originalRate}
                        onChange={(e) => setNewProduct({ ...newProduct, originalRate: e.target.value })}
                        placeholder="Enter in INR"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                        <FaRupeeSign className="w-4 h-4 text-blue-500" />
                        MRP *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                        value={newProduct.mrp}
                        onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                        required
                        placeholder="Enter in INR"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                        <FaBox className="w-4 h-4 text-orange-500" />
                        Stock *
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                        <FaRupeeSign className="w-4 h-4 text-emerald-500" />
                        Stock Value
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                        value={newProduct.stockValue}
                        onChange={(e) => setNewProduct({ ...newProduct, stockValue: e.target.value })}
                        placeholder="Enter in INR"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-slate-200/50 bg-slate-50/50 rounded-b-2xl">
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full sm:w-auto px-6 py-3 text-slate-700 border border-slate-300/50 rounded-xl hover:bg-slate-100 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrEdit}
                    className="w-full sm:w-auto group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {editingProduct ? "Update" : "Add"}
                    <FaPlus className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}