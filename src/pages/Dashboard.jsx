import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import { FaUsers, FaBoxOpen, FaShoppingCart, FaWarehouse } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { state } = useContext(AuthContext); // Assuming context has state with customers, products, orders, inventory

  const stats = [
    {
      title: "Customers",
      value: state.customers?.length || 0,
      icon: <FaUsers />,
      color: "bg-blue-500",
    },
    {
      title: "Products",
      value: state.products?.length || 0,
      icon: <FaBoxOpen />,
      color: "bg-green-500",
    },
    {
      title: "Orders",
      value: state.orders?.length || 0,
      icon: <FaShoppingCart />,
      color: "bg-yellow-500",
    },
    {
      title: "Inventory",
      value: state.inventory?.reduce((total, item) => total + (item.stock || 0), 0) || 0,
      icon: <FaWarehouse />,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}
