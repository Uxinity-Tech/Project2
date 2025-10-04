import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaUsers, FaBoxOpen, FaShoppingCart, FaWarehouse, FaChartLine, FaArrowRight, FaPlus, FaUserPlus, FaBox } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Products in Stock",
      value: totalInventoryStock.toLocaleString(),
      icon: <FaBoxOpen className="w-8 h-8" />,
      color: "from-emerald-500 to-emerald-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    },
    {
      title: "Recent Orders",
      value: orders.length.toLocaleString(),
      icon: <FaShoppingCart className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      iconBg: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
    {
      title: "Total Inventory Value",
      value: totalInventoryValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
      icon: <FaIndianRupeeSign className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
  ];

  const recentOrders = orders.slice(-5).map(order => ({
    id: order.id,
    customer: order.customer || 'Unknown',
    total: Number(order.total || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
    date: order.date ? new Date(order.date).toLocaleDateString() : new Date().toLocaleDateString(),
  }));

  const getMonthlySales = () => {
    const monthlySales = {};
    orders.forEach(order => {
      const date = new Date(order.date);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlySales[month]) monthlySales[month] = 0;
      monthlySales[month] += Number(order.total || 0);
    });
    return Object.entries(monthlySales).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  };

  const monthlyData = getMonthlySales();
  const labels = monthlyData.map(([month]) => month);
  const dataValues = monthlyData.map(([, sales]) => sales);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Sales (INR)',
        data: dataValues,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 14,
          family: 'Inter, sans-serif',
        },
      },
    },
    title: {
      display: true,
      text: 'Sales Trend Over Time',
      font: {
        size: 18,
        weight: 'bold',
      },
      padding: {
        top: 10,
        bottom: 30,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      cornerRadius: 12,
      displayColors: false,
      callbacks: {
        label: function (context) {
          return '₹' + context.parsed.y.toLocaleString('en-IN');
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        callback: function (value) {
          return '₹' + value.toLocaleString('en-IN');
        },
        font: {
          size: 12,
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  elements: {
    point: {
      hoverBorderWidth: 3,
    },
  },
};


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Market CRM Dashboard
                </h1>
                <p className="text-slate-600 mt-2">Welcome back! Here's a quick overview of your business performance today.</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FaChartLine className="w-4 h-4" />
                <span>Updated {new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className={`relative overflow-hidden rounded-2xl shadow-lg border border-slate-200/50 bg-white/80 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group ${index < 3 ? 'col-span-1' : 'col-span-1'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className={`text-2xl sm:text-3xl font-bold ${stat.textColor} group-hover:scale-105 transition-transform duration-300`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg ring-1 ring-white/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} w-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700`} />
              </div>
            ))}
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 mb-8 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <FaShoppingCart className="w-5 h-5 text-orange-500" />
                Recent Orders
              </h2>
              <Link
                to="/orders"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 group"
              >
                View All
                <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                <FaShoppingCart className="w-16 h-16 mx-auto mb-4 text-slate-300 animate-bounce" />
                <p className="text-lg font-medium">No recent orders yet.</p>
                <p className="text-sm mt-1">Get started by adding your first order!</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200/50">
                <table className="min-w-full divide-y divide-slate-200/50">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200/50">
                    {recentOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-50/50 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            #{order.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium max-w-xs truncate">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600 text-right">
                          {order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">
                          {order.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions & Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <FaPlus className="w-5 h-5 text-emerald-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/customers"
                  className="group flex items-center justify-start px-4 py-3 border border-slate-300/50 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50/50 hover:border-slate-400 transition-all duration-300 hover:shadow-md"
                >
                  <FaUserPlus className="w-4 h-4 mr-3 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                  Manage Customers
                </Link>
                <Link
                  to="/products"
                  className="group flex items-center justify-start px-4 py-3 border border-slate-300/50 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50/50 hover:border-slate-400 transition-all duration-300 hover:shadow-md"
                >
                  <FaBox className="w-4 h-4 mr-3 text-emerald-500 group-hover:scale-110 transition-transform duration-200" />
                  Update Inventory
                </Link>
                <Link
                  to="/orders"
                  className="group flex items-center justify-start px-4 py-3 border border-slate-300/50 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50/50 hover:border-slate-400 transition-all duration-300 hover:shadow-md"
                >
                  <FaShoppingCart className="w-4 h-4 mr-3 text-orange-500 group-hover:scale-110 transition-transform duration-200" />
                  New Order
                </Link>
              </div>
            </div>

            {/* Sales Trend */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <FaChartLine className="w-5 h-5 text-indigo-500" />
                Sales Trend
              </h3>
              <div className="relative h-80">
                {orders.length === 0 ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-500">
                    <FaChartLine className="w-16 h-16 mb-4 text-slate-300 animate-pulse" />
                    <p className="text-lg font-medium">No sales data available</p>
                    <p className="text-sm mt-1">Start tracking your sales to see trends here.</p>
                  </div>
                ) : (
                  <Line options={chartOptions} data={chartData} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}