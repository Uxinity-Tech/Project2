import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import { FaDollarSign, FaChartLine } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Reports() {
  const { state } = useContext(AuthContext);
  const orders = state.orders || [];

  // Total sales
  const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

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
      ? 0
      : (((thisMonthSales - lastMonthSales) / lastMonthSales) * 100).toFixed(2);

  const reportStats = [
    {
      title: "Total Sales",
      value: `$${totalSales.toFixed(2)}`,
      icon: <FaDollarSign />,
      color: "bg-green-500",
    },
    {
      title: "Revenue Growth",
      value: `${revenueGrowth}%`,
      icon: <FaChartLine />,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Navbar />
        <h2 className="text-2xl font-bold mb-6">Reports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reportStats.map(stat => (
            <Card key={stat.title} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}
