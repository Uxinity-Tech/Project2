import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import { FaSearch, FaShoppingCart, FaFilter, FaEye, FaDownload, FaUser, FaCalendar, FaTag } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
  const { state } = useContext(AuthContext);
  const orders = state.orders || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Map orders to match table keys
  const tableData = orders.map(order => ({
    id: order.id,
    customer: order.customer,
    total: Number(order.total || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
    status: order.status || "Completed",
    date: order.date ? new Date(order.date).toLocaleDateString() : new Date().toLocaleDateString(),
  }));

  const filteredOrdersRaw = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toString().includes(searchTerm);
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const orderDate = new Date(order.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    const matchesDate = !from || !to || (orderDate >= from && orderDate <= to);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const filteredOrders = filteredOrdersRaw.map(order => ({
    id: order.id,
    customer: order.customer,
    total: Number(order.total || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
    status: order.status || "Completed",
    date: order.date ? new Date(order.date).toLocaleDateString() : new Date().toLocaleDateString(),
  }));

  const statusOptions = ["All", ...new Set(orders.map(order => order.status || "Completed"))];

  const exportToCSV = () => {
    const headers = ["ID", "Customer", "Total", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map(order => [
        order.id,
        order.customer,
        order.total.replace(/[^\d.,]/g, ''), // Remove currency symbol for CSV
        order.status,
        order.date,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const viewOrder = (order) => {
    setSelectedOrder(orders.find(o => o.id === order.id) || null);
    setShowOrderModal(true);
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
                <h1 className="text-3xl font-bold text-slate-900">Orders Management</h1>
                <p className="text-slate-600 mt-1">Track and manage your sales orders efficiently.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-all duration-300 font-medium"
                >
                  <FaDownload className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by customer or order ID..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative flex-1 max-w-sm lg:flex-none lg:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none bg-white"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
            <div className="flex gap-2 flex-1 lg:flex-none">
              <div className="relative flex-1">
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        <FaShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p className="text-lg">No orders found.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 text-left">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-left">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 text-right">
                          {order.total}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "Completed" ? "bg-green-100 text-green-800" :
                            order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-left">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                          <button 
                            onClick={() => viewOrder(order)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors inline-block align-middle hover:bg-blue-50"
                            title="View Order Details"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredOrders.length > 0 && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                <p className="text-sm text-slate-600 text-left">
                  Showing {filteredOrders.length} of {orders.length} orders
                </p>
              </div>
            )}
          </div>

          {/* Order Details Modal */}
          <Modal 
            show={showOrderModal} 
            onClose={() => setShowOrderModal(false)} 
            title={`Order #${selectedOrder?.id || ''} Details`}
          >
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <p className="text-sm text-slate-700">{selectedOrder.customer}</p>
                </div>

                {/* Order Summary */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <FaCalendar className="w-4 h-4" />
                    Order Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Date:</p>
                      <p className="font-medium">{new Date(selectedOrder.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Status:</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedOrder.status === "Completed" ? "bg-green-100 text-green-800" :
                        selectedOrder.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-600">Subtotal:</p>
                      <p className="font-medium">{Number(selectedOrder.subtotal || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Discount:</p>
                      <p className="font-medium text-red-600">-{Number(selectedOrder.discount || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-600">Total:</p>
                      <p className="text-2xl font-bold text-emerald-600">{Number(selectedOrder.total || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <FaTag className="w-4 h-4" />
                    Order Items ({selectedOrder.items?.length || 0})
                  </h3>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Product</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Price</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Qty</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedOrder.items?.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-900">{item.name}</td>
                            <td className="px-4 py-3 text-sm text-slate-900 text-right">{Number(item.price || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                            <td className="px-4 py-3 text-sm text-slate-900 text-right">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">{Number((item.price || 0) * (item.quantity || 0)).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No items in this order.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-500">Loading order details...</p>
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
}