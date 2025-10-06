import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import { FaSearch, FaShoppingCart, FaFilter, FaEye, FaDownload, FaUser, FaCalendar, FaTag, FaTimes } from "react-icons/fa";
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

  const parseOrderDate = (dateStr) => {
    if (!dateStr) return null;
    let date;
    if (dateStr.includes('-')) {
      date = new Date(dateStr);
    } else if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        date = new Date(year, month, day);
      } else {
        date = new Date(dateStr);
      }
    } else {
      date = new Date(dateStr);
    }
    return isNaN(date.getTime()) ? null : date;
  };

  const getDateOnly = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  // Map orders to match table keys
  const tableData = orders.map(order => ({
    id: order.id,
    customer: order.customer,
    total: Number(order.total || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
    status: order.status || "Completed",
    date: parseOrderDate(order.date) ? parseOrderDate(order.date).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'),
  }));

  const filteredOrdersRaw = orders.filter(order => {
    const matchesSearch = searchTerm === "" || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toString().includes(searchTerm);
    const matchesStatus = filterStatus.toLowerCase() === "all" || (order.status || "completed").toLowerCase() === filterStatus.toLowerCase();
    const orderDate = parseOrderDate(order.date);
    const isValidDate = orderDate !== null;
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    const hasDateFilter = fromDate || toDate;
    const orderDateOnly = getDateOnly(orderDate);
    const fromOnly = fromDate ? getDateOnly(from) : null;
    const toOnly = toDate ? getDateOnly(to) : null;
    const matchesDate = !hasDateFilter || (isValidDate && ((!fromOnly || orderDateOnly >= fromOnly) && (!toOnly || orderDateOnly <= toOnly)));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const filteredOrders = filteredOrdersRaw.map(order => ({
    id: order.id,
    customer: order.customer,
    total: Number(order.total || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
    status: order.status || "Completed",
    date: parseOrderDate(order.date) ? parseOrderDate(order.date).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'),
  }));

  const statusOptions = ["All", ...Array.from(new Set(orders.map(order => order.status || "Completed")))];

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

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/20">
                  <FaShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Orders Management
                  </h1>
                  <p className="text-slate-600 mt-1">Track and manage your sales orders with precision.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={exportToCSV}
                  className="group flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium transform hover:-translate-y-0.5"
                >
                  <FaDownload className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by customer or order ID..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm bg-white/50 backdrop-blur-sm placeholder-slate-400 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative flex-1 max-w-sm lg:flex-none lg:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm appearance-none bg-white/50 backdrop-blur-sm transition-all duration-200"
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
                    className="w-full pl-10 pr-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm bg-white/50 backdrop-blur-sm transition-all duration-200"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="relative flex-1">
                  <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm bg-white/50 backdrop-blur-sm transition-all duration-200"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={clearFilters}
                className="group flex items-center gap-1 px-4 py-3 text-slate-600 hover:text-red-600 font-medium transition-all duration-200 hover:scale-105"
              >
                Clear
                <FaTimes className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/50">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200/50">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        <FaShoppingCart className="w-16 h-16 mx-auto mb-4 text-slate-300 animate-pulse" />
                        <p className="text-lg font-medium">No orders found.</p>
                        <p className="text-sm mt-1">Try adjusting your filters or add a new order!</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const getStatusColor = (status) => {
                        const normalizedStatus = (status || "Completed").toLowerCase();
                        switch (normalizedStatus) {
                          case "completed": return { bg: "bg-green-100", text: "text-green-800" };
                          case "pending": return { bg: "bg-yellow-100", text: "text-yellow-800" };
                          case "cancelled": return { bg: "bg-red-100", text: "text-red-800" };
                          default: return { bg: "bg-gray-100", text: "text-gray-800" };
                        }
                      };
                      const statusStyle = getStatusColor(order.status);
                      return (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                              #{order.id}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {order.customer.charAt(0).toUpperCase()}
                            </div>
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600 text-right">
                            {order.total}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-left">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                            <button 
                              onClick={() => viewOrder(order)}
                              className="group relative p-2 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-all duration-200 transform hover:scale-110"
                              title="View Order Details"
                            >
                              <FaEye className="w-4 h-4" />
                              <div className="absolute inset-0 bg-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {filteredOrders.length > 0 && (
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/50">
                <p className="text-sm text-slate-600 flex items-center justify-between">
                  <span>Showing {filteredOrders.length} of {orders.length} orders</span>
                  <span className="text-xs text-slate-500">Last updated: {new Date().toLocaleDateString('en-IN')}</span>
                </p>
              </div>
            )}
          </div>

          {/* Order Details Modal */}
          <Modal 
            show={showOrderModal} 
            onClose={() => setShowOrderModal(false)} 
            title="Order Details"
            orderId={selectedOrder?.id}
          >
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200/50">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <FaUser className="w-5 h-5 text-orange-500" />
                    Customer Information
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {selectedOrder.customer.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{selectedOrder.customer}</p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <FaCalendar className="w-5 h-5 text-blue-500" />
                    Order Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-slate-600 mb-1">Date:</p>
                      <p className="font-medium text-slate-900">{parseOrderDate(selectedOrder.date)?.toLocaleString('en-IN') || new Date().toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">Status:</p>
                      <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
                        (selectedOrder.status || "Completed").toLowerCase() === "completed" ? "bg-green-100 text-green-800" :
                        (selectedOrder.status || "Completed").toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {selectedOrder.status || "Completed"}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">Subtotal:</p>
                      <p className="font-medium text-slate-900">{Number(selectedOrder.subtotal || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">Discount:</p>
                      <p className="font-medium text-red-600">-{Number(selectedOrder.discount || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <p className="text-slate-600 mb-2">Total:</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {Number(selectedOrder.total || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <FaTag className="w-5 h-5 text-purple-500" />
                    Order Items ({selectedOrder.items?.length || 0})
                  </h3>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200/50">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Qty</th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/50">
                        {selectedOrder.items?.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors duration-200">
                            <td className="px-4 py-4 text-sm font-medium text-slate-900">{item.name}</td>
                            <td className="px-4 py-4 text-sm text-slate-900 text-right">{Number(item.price || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                            <td className="px-4 py-4 text-sm font-medium text-orange-600 text-right">{item.quantity}</td>
                            <td className="px-4 py-4 text-sm font-semibold text-emerald-600 text-right">{Number((item.price || 0) * (item.quantity || 0)).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
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
              <div className="text-center py-12 text-slate-500">
                <FaShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-300 animate-spin" />
                <p className="text-lg font-medium">Loading order details...</p>
              </div>
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
}