import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
  FaWarehouse,
  FaDollarSign,
  FaBars,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

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
    <aside className={`bg-slate-900 text-slate-100 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} min-h-screen p-4 flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {isCollapsed ? (
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <FaBars className="w-5 h-5" />
          </button>
        ) : (
          <>
            <h2 className="text-xl font-bold">Market CRM</h2>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <FaBars className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-slate-700 text-white shadow-md"
                      : "hover:bg-slate-800 text-slate-300"
                  } ${isCollapsed ? "justify-center p-3" : ""}`}
                >
                  <span className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? "" : ""}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Optional */}
      <div className="mt-auto pt-6 border-t border-slate-700">
        {!isCollapsed && (
          <div className="text-xs text-slate-400 text-center">
            <p>Version 1.0</p>
          </div>
        )}
      </div>
    </aside>
  );
}