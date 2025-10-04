import React from "react";

export default function Card({ title, value, icon, color = "bg-blue-600", textColor = "text-blue-600", change }) {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-sm border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
          {change && (
            <p className={`text-xs font-medium mt-1 ${
              change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}