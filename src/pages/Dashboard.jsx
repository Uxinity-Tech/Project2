import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import { FaUsers, FaBoxOpen, FaShoppingCart, FaWarehouse, FaChartLine, FaDollarSign } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
export default function Dashboard() {
  const { state } = useContext(AuthContext);

  const customers = state.customers || [];
  const products = state.products || [];
  const orders = state.orders || [];

  const totalInventoryStock = products.reduce((total, item) => total + (item.stock || 0), 0);
  const totalInventoryValue = products.reduce((total, item) => total + (Number(item.price || 0) * (item.stock || 0)), 0);

  const stats = [
    {
      title: "Total Customers",
      value: customers.length.toLocaleString(),
      icon: <FaUsers className="w-8 h-8" />,
      color: "bg-blue-600",
      textColor: "text-blue-600",
    },
    {
      title: "Products in Stock",
      value: totalInventoryStock.toLocaleString(),
      icon: <FaBoxOpen className="w-8 h-8" />,
      color: "bg-emerald-600",
      textColor: "text-emerald-600",
    },
    {
      title: "Recent Orders",
      value: orders.length.toLocaleString(),
      icon: <FaShoppingCart className="w-8 h-8" />,
      color: "bg-orange-500",
      textColor: "text-orange-500",
    },
    {
      title: "Total Inventory Value",
      value: `$${totalInventoryValue.toLocaleString()}`,
      icon: <FaDollarSign className="w-8 h-8" />,
      color: "bg-purple-600",
      textColor: "text-purple-600",
    },
  ];

  const recentOrders = orders.slice(-5).map(order => ({
    id: order.id,
    customer: order.customer || 'Unknown',
    total: `$${Number(order.total || 0).toFixed(2)}`,
    date: order.date ? new Date(order.date).toLocaleDateString() : new Date().toLocaleDateString(),
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Market CRM Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back. Here's what's happening with your business today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className={`relative overflow-hidden rounded-xl shadow-sm border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${index < 3 ? 'col-span-1' : 'col-span-1'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Recent Orders</h2>
             <Link
  to="/orders"
  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
>
  View All →
</Link>

            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FaShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No recent orders.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{order.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions & Chart */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
    <div className="space-y-3">
      <Link
        to="/customers"
        className="block w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <FaUsers className="w-4 h-4 mr-2" />
        Manage Customers
      </Link>

      <Link
        to="/inventory"
        className="block w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <FaBoxOpen className="w-4 h-4 mr-2" />
        Update Inventory
      </Link>

      <Link
        to="/billing"
        className="block w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <FaShoppingCart className="w-4 h-4 mr-2" />
        New Order
      </Link>
    </div>
  </div>

  {/* Sales Trend - Placeholder */}
  <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales Trend</h3>
    <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
      <FaChartLine className="w-16 h-16" />
      <p className="ml-2">Sales overview chart</p>
    </div>
  </div>
</div>
        </main>
      </div>
    </div>
  );
}