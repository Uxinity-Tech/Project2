import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaDollarSign, FaChartLine, FaShoppingCart, FaCalendarAlt, FaFileExport } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
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
import { FaIndianRupeeSign } from "react-icons/fa6";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {
  const { state } = useContext(AuthContext);
  const orders = state.orders || [];

  // Total sales
  const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  // Total orders
  const totalOrders = orders.length;

  // Average order value
  const avgOrderValue = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

  // Revenue growth: compare this month vs last month
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const thisMonthSales = orders
    .filter(order => {
      const date = new Date(order.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const lastMonthDate = new Date(thisYear, thisMonth - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const lastMonthSales = orders
    .filter(order => {
      const date = new Date(order.date);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    })
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const revenueGrowth =
    lastMonthSales === 0
      ? thisMonthSales > 0 ? 100 : 0
      : (((thisMonthSales - lastMonthSales) / lastMonthSales) * 100).toFixed(2);

  const reportStats = [
    {
      title: "Total Sales",
      value: totalSales.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
      icon: <FaIndianRupeeSign className="w-8 h-8" />,
      color: "bg-emerald-600",
      textColor: "text-emerald-600",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: <FaShoppingCart className="w-8 h-8" />,
      color: "bg-blue-600",
      textColor: "text-blue-600",
    },
    {
      title: "Average Order Value",
      value: Number(avgOrderValue).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
      icon: <FaIndianRupeeSign className="w-8 h-8" />,
      color: "bg-purple-600",
      textColor: "text-purple-600",
    },
    {
      title: "Revenue Growth",
      value: `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}%`,
      icon: <FaChartLine className="w-8 h-8" />,
      color: revenueGrowth >= 0 ? "bg-green-600" : "bg-red-600",
      textColor: revenueGrowth >= 0 ? "text-green-600" : "text-red-600",
    },
  ];

  const recentOrders = orders.slice(-5).map(order => ({
    id: order.id,
    customer: order.customer,
    total: Number(order.total || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
    date: order.date ? new Date(order.date).toLocaleDateString() : new Date().toLocaleDateString(),
  }));

  const exportToCSV = () => {
    const headers = ["ID", "Customer", "Total", "Date"];
    const csvContent = [
      headers.join(","),
      ...recentOrders.map(order => [
        order.id,
        order.customer,
        order.total.replace(/[^\d.,]/g, ''), // Remove currency symbol for CSV
        order.date,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getMonthlySalesData = () => {
    const now = new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(date);
    }
    const labels = months.map(m => m.toLocaleString('default', { month: 'short', year: 'numeric' }));
    const data = months.map(month => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      const sales = orders
        .filter(order => {
          const orderDate = new Date(order.date);
          return orderDate >= monthStart && orderDate <= monthEnd;
        })
        .reduce((sum, order) => sum + Number(order.total || 0), 0);
      return sales;
    });
    return { labels, data };
  };

  const { labels, data } = getMonthlySalesData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Sales (INR)',
        data,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Trend Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      }
    }
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
                <h1 className="text-3xl font-bold text-slate-900">Sales Reports</h1>
                <p className="text-slate-600 mt-1">Comprehensive insights into your business performance.</p>
              </div>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-sm hover:bg-blue-700 transition-all duration-300 font-medium"
              >
                <FaFileExport className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {reportStats.map((stat, index) => (
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

          {/* Recent Sales Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Recent Sales</h2>
              <span className="text-sm text-slate-500">
                <FaCalendarAlt className="w-4 h-4 inline mr-1" />
                Last 30 days
              </span>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FaShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No recent sales.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 text-right">{order.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sales Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales Trend Over Time</h3>
            {orders.length === 0 ? (
              <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
                <FaChartLine className="w-16 h-16 mr-2" />
                <p>Interactive sales chart (Monthly breakdown)</p>
              </div>
            ) : (
              <Line options={chartOptions} data={chartData} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}