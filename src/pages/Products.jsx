import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { AuthContext } from "../context/AuthContext";
import { FaPlus } from "react-icons/fa";

export default function Products() {
  const { state, addProduct } = useContext(AuthContext);
  const products = state.products || [];

  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, stock: 0 });

  const handleAdd = () => {
    const product = { ...newProduct, id: Date.now() };
    addProduct(product);  // Use context method
    setShowModal(false);
    setNewProduct({ name: "", price: 0, stock: 0 });
  };

  const columns = ["id", "name", "price", "stock"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Navbar />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Products</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2 transition"
          >
            <FaPlus /> Add Product
          </button>
        </div>
        <Table columns={columns} data={products} />

        <Modal show={showModal} onClose={() => setShowModal(false)} title="Add Product">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              className="border px-3 py-2 rounded"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              className="border px-3 py-2 rounded"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Stock"
              className="border px-3 py-2 rounded"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
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
