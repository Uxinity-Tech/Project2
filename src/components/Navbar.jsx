import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-gray-800">Supermarket CRM</div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-700">Hello, {user.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <span className="text-gray-700">Not logged in</span>
        )}
      </div>
    </nav>
  );
}
