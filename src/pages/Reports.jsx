import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaDollarSign, FaChartLine, FaShoppingCart, FaCalendarAlt, FaFileExport, FaArrowRight } from "react-icons/fa";
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
      color: "from-emerald-500 to-emerald-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: <FaShoppingCart className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Average Order Value",
      value: Number(avgOrderValue).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
      icon: <FaIndianRupeeSign className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      title: "Revenue Growth",
      value: `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}%`,
      icon: <FaChartLine className="w-8 h-8" />,
      color: revenueGrowth >= 0 ? "from-green-500 to-green-600" : "from-red-500 to-red-600",
      textColor: revenueGrowth >= 0 ? "text-green-600" : "text-red-600",
      bgColor: revenueGrowth >= 0 ? "bg-green-50" : "bg-red-50",
      iconBg: revenueGrowth >= 0 ? "bg-gradient-to-br from-green-500 to-green-600" : "bg-gradient-to-br from-red-500 to-red-600",
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
          label: function(context) {
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
  callback: function(value) {
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/20">
                  <FaChartLine className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Sales Reports
                  </h1>
                  <p className="text-slate-600 mt-1">Comprehensive insights into your business performance.</p>
                </div>
              </div>
              <button
                onClick={exportToCSV}
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium transform hover:-translate-y-0.5"
              >
                <FaFileExport className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {reportStats.map((stat, index) => (
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

          {/* Recent Sales Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 mb-8 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <FaShoppingCart className="w-5 h-5 text-blue-500" />
                Recent Sales
              </h2>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <FaCalendarAlt className="w-4 h-4" />
                Last 30 days
              </span>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                <FaShoppingCart className="w-16 h-16 mx-auto mb-4 text-slate-300 animate-bounce" />
                <p className="text-lg font-medium">No recent sales.</p>
                <p className="text-sm mt-1">Your sales data will appear here once orders are placed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200/50">
                <table className="min-w-full divide-y divide-slate-200/50">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200/50">
                    {recentOrders.map((order, index) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            #{order.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium max-w-xs truncate">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600 text-right">
                          {order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {order.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sales Trend Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <FaChartLine className="w-5 h-5 text-indigo-500" />
              Sales Trend Over Time
            </h3>
            <div className="relative h-80">
              {orders.length === 0 ? (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-500">
                  <FaChartLine className="w-16 h-16 mb-4 text-slate-300 animate-pulse" />
                  <p className="text-lg font-medium">No sales data available</p>
                  <p className="text-sm mt-1">Interactive sales chart will appear here with your data.</p>
                </div>
              ) : (
                <Line options={chartOptions} data={chartData} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}