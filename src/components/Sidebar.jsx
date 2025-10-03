import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
  FaWarehouse,
  FaDollarSign,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaChartLine />, path: "/" },
    { name: "Customers", icon: <FaUsers />, path: "/customers" },
    { name: "Products", icon: <FaBoxOpen />, path: "/products" },
    { name: "Orders", icon: <FaShoppingCart />, path: "/orders" },
    { name: "Inventory", icon: <FaWarehouse />, path: "/inventory" },
    { name: "Reports", icon: <FaChartLine />, path: "/reports" },
    { name: "Billing", icon: <FaDollarSign />, path: "/billing" },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">CRM Menu</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.name} className="mb-4">
            <Link
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded transition ${
                location.pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              {item.icon} <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
