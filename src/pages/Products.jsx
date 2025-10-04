import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaBoxOpen } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Products() {
  const { state, setState } = useContext(AuthContext);
  const products = state.products || [];

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", originalRate: "", mrp: "", stock: "" });

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
            ? { ...newProduct, id: p.id, price: parsedMRP, stock: parsedStock, originalRate: parsedOriginalRate }
            : p
        ),
      }));
      setEditingProduct(null);
    } else {
      // Add new
      const product = { 
        ...newProduct, 
        id: Date.now(),
        price: parsedMRP,
        stock: parsedStock,
        originalRate: parsedOriginalRate
      };
      setState((prev) => ({
        ...prev,
        products: [...prev.products, product]
      }));
    }

    setShowModal(false);
    setNewProduct({ name: "", originalRate: "", mrp: "", stock: "" });
  };

  const handleEdit = (product) => {
    setNewProduct({ 
      name: product.name, 
      originalRate: product.originalRate || "", 
      mrp: product.price || "", 
      stock: product.stock || "" 
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
    setNewProduct({ name: "", originalRate: "", mrp: "", stock: "" });
    setEditingProduct(null);
    setShowModal(true);
  };

  const modalTitle = editingProduct ? "Edit Product" : "Add Product";

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
                <h1 className="text-3xl font-bold text-slate-900">Products Management</h1>
                <p className="text-slate-600 mt-1">Manage your inventory and pricing details efficiently.</p>
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-sm hover:bg-emerald-700 transition-all duration-300 font-medium"
              >
                <FaBoxOpen className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>

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

          {/* Products Table */}
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
                      const stockValue = (product.stock || 0) * (product.price || 0);
                      return (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 text-left">
                            #{product.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-left">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right">
                            ${Number(product.originalRate || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 text-right">
                            ${Number(product.price || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right">
                            {product.stock || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600 text-right">
                            ${stockValue.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-emerald-600 hover:text-emerald-900 p-1 rounded transition-colors inline-block align-middle"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded transition-colors inline-block align-middle"
                            >
                              <FaTrash className="w-4 h-4" />
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
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                <p className="text-sm text-slate-600 text-left">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
            )}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">{modalTitle}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Original Rate</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={newProduct.originalRate}
                        onChange={(e) => setNewProduct({ ...newProduct, originalRate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">MRP *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={newProduct.mrp}
                        onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Stock *</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrEdit}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    {editingProduct ? "Update" : "Add"}
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