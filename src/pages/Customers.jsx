import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaPlus, FaUsers, FaSearch,FaPhone, FaEdit, FaTrash, FaUserPlus, FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Customers() {
  const { state, setState, addCustomer } = useContext(AuthContext);
  const customers = state.customers || [];

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrEdit = () => {
    if (!newCustomer.name || !newCustomer.email) {
      alert("Name and email are required.");
      return;
    }

    if (editingCustomer) {
      // Edit existing
      setState((prev) => ({
        ...prev,
        customers: prev.customers.map((c) =>
          c.id === editingCustomer.id ? { ...newCustomer, id: c.id } : c
        ),
      }));
      setEditingCustomer(null);
    } else {
      // Add new
      const customer = { ...newCustomer, id: Date.now() };
      addCustomer(customer);
    }

    setShowModal(false);
    setNewCustomer({ name: "", email: "", phone: "" });
  };

  const handleEdit = (customer) => {
    setNewCustomer({ name: customer.name, email: customer.email, phone: customer.phone });
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setState((prev) => ({
        ...prev,
        customers: prev.customers.filter((c) => c.id !== id),
      }));
    }
  };

  const openAddModal = () => {
    setNewCustomer({ name: "", email: "", phone: "" });
    setEditingCustomer(null);
    setShowModal(true);
  };

  const modalTitle = editingCustomer ? "Edit Customer" : "Add Customer";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/20">
                  <FaUsers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Customers Management
                  </h1>
                  <p className="text-slate-600 mt-1">Manage your customer database with ease and efficiency.</p>
                </div>
              </div>
              <button
                onClick={openAddModal}
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium transform hover:-translate-y-0.5"
              >
                <FaUserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                Add Customer
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers by name or email..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/80 backdrop-blur-sm placeholder-slate-400 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
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
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200/50">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        <FaUsers className="w-16 h-16 mx-auto mb-4 text-slate-300 animate-pulse" />
                        <p className="text-lg font-medium">No customers found.</p>
                        <p className="text-sm mt-1">Start by adding your first customer!</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            #{customer.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 max-w-xs truncate">
                          <span className="text-blue-600 font-medium">{customer.email}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            customer.phone ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {customer.phone || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="group relative p-2 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-all duration-200 transform hover:scale-110"
                          >
                            <FaEdit className="w-4 h-4" />
                            <div className="absolute inset-0 bg-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="group relative p-2 rounded-lg text-red-600 hover:text-red-900 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                          >
                            <FaTrash className="w-4 h-4" />
                            <div className="absolute inset-0 bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredCustomers.length > 0 && (
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/50">
                <p className="text-sm text-slate-600 flex items-center justify-between">
                  <span>Showing {filteredCustomers.length} of {customers.length} customers</span>
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
                    <FaUserCircle className="w-5 h-5 text-blue-500" />
                    {modalTitle}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                        <FaUserCircle className="w-4 h-4 text-blue-500" />
                        Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                        <FaUsers className="w-4 h-4 text-emerald-500" />
                        Email *
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                        <FaPhone className="w-4 h-4 text-purple-500" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 p-6 border-t border-slate-200/50 bg-slate-50/50 rounded-b-2xl">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 text-slate-700 border border-slate-300/50 rounded-xl hover:bg-slate-100 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrEdit}
                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {editingCustomer ? "Update" : "Add"}
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