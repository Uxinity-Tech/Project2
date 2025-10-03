import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Table from "../components/Table";
import { AuthContext } from "../context/AuthContext";

export default function Inventory() {
  const { state } = useContext(AuthContext); // Get global state
  const products = state.products || [];     // Use products as inventory

  // Map products to table format
  const inventory = products.map((p) => ({
    id: p.id,
    product: p.name,
    stock: p.stock,
  }));

  const columns = ["id", "product", "stock"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Navbar />
        <h2 className="text-2xl font-bold mb-4">Inventory</h2>
        <Table columns={columns} data={inventory} />
      </div>
    </div>
  );
}
