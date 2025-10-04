import React, { useContext, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaChevronDown, FaBars } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-white/90 backdrop-blur-xl shadow-xl border-b border-slate-200/50 px-4 sm:px-6 lg:px-8 py-3 lg:py-4 flex justify-between items-center sticky top-0 z-50 transition-all duration-300">
      {/* Logo and Title */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="relative">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/20 transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-lg lg:text-xl drop-shadow-sm">M</span>
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-emerald-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        {/* Desktop Title */}
        <div className="hidden sm:block">
          <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Market CRM</h1>
          <p className="text-xs lg:text-sm text-slate-500 font-medium">Supermarket Management</p>
        </div>
        {/* Mobile Title */}
        <div className="sm:hidden">
          <h1 className="text-lg font-bold text-slate-900">Market CRM</h1>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors duration-200"
      >
        <FaBars className="w-6 h-6" />
      </button>

      {/* Desktop User Menu */}
      <div className="hidden lg:block relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="group flex items-center gap-3 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 px-4 py-2.5 rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg border border-slate-200/50 hover:border-slate-300"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md ring-1 ring-white/30 transform group-hover:scale-110 transition-transform duration-200">
            <FaUserCircle className="w-5 h-5 text-white" />
          </div>
          <span className="hidden md:inline">Hello, {user?.name || 'User'}</span>
          <FaChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
            {/* User Info */}
            <div className="px-5 py-4 border-b border-slate-200/50 bg-gradient-to-b from-white/50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <FaUserCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[150px]">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
            </div>
            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 flex items-center gap-3 text-sm text-slate-700 hover:text-indigo-700 font-medium group"
              >
                <FaSignOutAlt className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors duration-200" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile User Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-2xl border border-slate-200/50 mt-1 z-40 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 border-b border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <FaUserCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
          <div className="py-2">
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors duration-200 flex items-center gap-3 text-sm text-slate-700"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}