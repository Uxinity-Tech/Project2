import React from "react";

export default function Card({ title, value, icon, color = "bg-blue-500" }) {
  return (
    <div className={`flex items-center p-4 rounded-lg shadow ${color} text-white`}>
      {icon && <div className="text-3xl mr-4">{icon}</div>}
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
