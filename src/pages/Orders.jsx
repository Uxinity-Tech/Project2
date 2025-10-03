import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Table from "../components/Table";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
  const { state } = useContext(AuthContext);
  const orders = state.orders || [];

  // Map orders to match table keys
  const tableData = orders.map(order => ({
    id: order.id,
    customer: order.customer,
    total: `$${order.total.toFixed(2)}`,
    status: order.status || "Completed"
  }));

  const columns = ["id", "customer", "total", "status"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Navbar />
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        <Table columns={columns} data={tableData} />
      </div>
    </div>
  );
}
