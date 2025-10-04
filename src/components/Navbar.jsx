import React, { useContext, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Market CRM</h1>
          <p className="text-xs text-slate-500">Supermarket Management</p>
        </div>
      </div>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 bg-slate-50 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200 font-medium text-sm shadow-sm"
        >
          <FaUserCircle className="w-6 h-6" />
          <span className="hidden sm:inline">Hello, {user?.name || 'User'}</span>
          <FaChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-slate-200">
              <p className="text-sm font-medium text-slate-900">Hello, {user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
            </div>
            <button
              onClick={() => {
                logout();
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm text-slate-700"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}