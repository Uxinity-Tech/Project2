import React, { useState, useContext, useRef } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function Billing() {
  const { state, setState } = useContext(AuthContext); // assume you can update global state
  const customers = state.customers || [];
  const productsRaw = state.products || [];

  // Ensure price is number
  const products = productsRaw.map(p => ({ ...p, price: Number(p.price) }));

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const billRef = useRef();

  // Add product to cart
  const addToCart = (product, qty) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      setCart(
        cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }
  };

  // Remove from cart
  const removeFromCart = productId => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Filter products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stock > 0
  );

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discount;

  // Complete sale / Save bill
  const completeSale = () => {
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    // Update inventory
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      if (cartItem) return { ...p, stock: p.stock - cartItem.quantity };
      return p;
    });

    setState(prev => ({ ...prev, products: updatedProducts })); // update global state

    // Save order in global state (optional)
    const newOrder = {
      id: Date.now(),
      customer: selectedCustomer.name,
      items: cart,
      subtotal,
      discount,
      total,
      date: new Date().toLocaleString()
    };
    setState(prev => ({
      ...prev,
      orders: [...(prev.orders || []), newOrder]
    }));

    alert("Sale completed!");

    // Reset
    setCart([]);
    setDiscount(0);
    setSelectedCustomer(null);
  };

  // Print bill
  const printBill = () => {
    if (!billRef.current) return;
    const printContent = billRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // reload to restore React state
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Navbar />
        <h2 className="text-2xl font-bold mb-6">Billing</h2>

        {/* Select Customer */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Select Customer:</label>
          <select
            className="border px-3 py-2 rounded w-full max-w-sm"
            value={selectedCustomer?.id || ""}
            onChange={e =>
              setSelectedCustomer(
                customers.find(c => c.id === parseInt(e.target.value))
              )
            }
          >
            <option value="">-- Select Customer --</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Search */}
        <div className="mb-4 max-w-sm">
          <input
            type="text"
            placeholder="Search product..."
            className="border px-3 py-2 rounded w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Products List */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Products:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="border p-3 rounded flex flex-col gap-2 justify-between"
              >
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p>${product.price.toFixed(2)}</p>
                  <p>Stock: {product.stock}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <select
                    className="border px-2 py-1 rounded"
                    defaultValue={1}
                    id={`qty-${product.id}`}
                  >
                    {[...Array(product.stock).keys()].map(n => (
                      <option key={n + 1} value={n + 1}>
                        {n + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      addToCart(
                        product,
                        parseInt(document.getElementById(`qty-${product.id}`).value)
                      )
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart & Bill */}
        <div ref={billRef} className="mb-6">
          <h3 className="font-semibold mb-2">Cart:</h3>
          {cart.length === 0 ? (
            <p>No products added.</p>
          ) : (
            <table className="min-w-full bg-white rounded shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4">Product</th>
                  <th className="py-2 px-4">Price</th>
                  <th className="py-2 px-4">Qty</th>
                  <th className="py-2 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4">${Number(item.price).toFixed(2)}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" className="text-right font-bold py-2 px-4">
                    Subtotal:
                  </td>
                  <td className="py-2 px-4 font-bold">${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-right font-bold py-2 px-4">
                    Discount:
                  </td>
                  <td className="py-2 px-4 font-bold">${discount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-right font-bold py-2 px-4">
                    Total:
                  </td>
                  <td className="py-2 px-4 font-bold">${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Discount */}
        <div className="mb-6 max-w-sm">
          <label className="block mb-2 font-semibold">Discount:</label>
          <input
            type="number"
            className="border px-3 py-2 rounded w-full"
            value={discount}
            onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={completeSale}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Complete Sale
          </button>
          <button
            onClick={printBill}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Print Bill
          </button>
        </div>
      </div>
    </div>
  );
}