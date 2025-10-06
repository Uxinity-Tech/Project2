import React from "react";
import { FaTimes } from "react-icons/fa";
import ReactDOM from "react-dom";

export default function Modal({ show, onClose, title, orderId, children }) {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-all duration-300 transform scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 rounded-t-2xl p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          {orderId && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              Order #{orderId}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}