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
  FaTimes,
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
    <aside
      className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 transition-all duration-500 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      } min-h-screen p-4 flex flex-col shadow-2xl shadow-slate-900/50 relative overflow-hidden`}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        {isCollapsed ? (
          <button
            onClick={() => setIsCollapsed(false)}
            className="group p-2.5 rounded-xl hover:bg-slate-700/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-slate-500/20"
            title="Expand Sidebar"
          >
            <FaBars className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg ring-1 ring-white/20">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Market CRM
              </h2>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="group p-2.5 rounded-xl hover:bg-slate-700/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-slate-500/20"
              title="Collapse Sidebar"
            >
              <FaTimes className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
            </button>
          </>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 relative z-10">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`group relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ease-out ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/20 to-blue-600/20 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform scale-105"
                      : "hover:bg-slate-700/50 text-slate-300 hover:text-slate-100"
                  } ${isCollapsed ? "justify-center p-3" : ""}`}
                  title={isCollapsed ? item.name : ""}
                >
                  <span
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                      isActive ? "group-hover:rotate-12" : "group-hover:scale-110"
                    }`}
                  >
                    <div
                      className={`${
                        isActive
                          ? "bg-white/20 rounded-full p-1"
                          : "group-hover:bg-white/10 rounded-full p-1"
                      } transition-all duration-300`}
                    >
                      {React.cloneElement(item.icon, {
                        className: `${item.icon.props.className} transition-all duration-300 ${
                          isActive ? "text-white drop-shadow-lg" : "group-hover:text-emerald-400"
                        }`,
                      })}
                    </div>
                  </span>
                  {!isCollapsed && (
                    <span className="font-medium relative overflow-hidden">
                      <span className="transition-all duration-300">{item.name}</span>
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                      )}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-lg animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-slate-700/50 relative z-10">
        <div
          className={`transition-all duration-500 ${
            isCollapsed ? "opacity-0 scale-0" : "opacity-100 scale-100"
          }`}
        >
          <div className="text-xs text-slate-400 text-center space-y-1">
            <p className="font-medium">Version 1.0</p>
            <p className="text-slate-500">© 2025 Market CRM</p>
          </div>
        </div>
      </div>
    </aside>
  );
}