import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { AuthContext } from "../context/AuthContext";

export default function Customers() {
  const { state, addCustomer } = useContext(AuthContext);
  const customers = state.customers || [];

  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });

  const handleAdd = () => {
    const customer = { ...newCustomer, id: Date.now() };
    addCustomer(customer);
    setShowModal(false);
    setNewCustomer({ name: "", email: "", phone: "" });
  };

  const columns = ["id", "name", "email", "phone"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Navbar />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Customers</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add Customer
          </button>
        </div>
        <Table columns={columns} data={customers} />

        <Modal show={showModal} onClose={() => setShowModal(false)} title="Add Customer">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              className="border px-3 py-2 rounded"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border px-3 py-2 rounded"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              className="border px-3 py-2 rounded"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            />
            <button
              onClick={handleAdd}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Save
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
