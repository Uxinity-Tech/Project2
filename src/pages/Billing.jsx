import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import { FaUser, FaSearch, FaShoppingCart, FaPlus, FaMinus, FaTrash, FaCalculator, FaPrint, FaCheckCircle, FaTicketAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Billing() {
  const { state, setState } = useContext(AuthContext);
  const customers = state.customers || [];
  const productsRaw = state.products || [];

  // Ensure price is number
  const products = productsRaw.map(p => ({ ...p, price: Number(p.price) }));

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Add product to cart
  const addToCart = (product, qty) => {
    const currentQty = cart.find(item => item.id === product.id)?.quantity || 0;
    const remaining = product.stock - currentQty;
    if (qty > remaining) {
      alert(`Only ${remaining} available.`);
      return;
    }

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

  // Update quantity in cart
  const updateQuantity = (productId, change) => {
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  // Remove from cart
  const removeFromCart = productId => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Filter products based on search and remaining stock
  const filteredProducts = products.filter(p => {
    const currentQty = cart.find(item => item.id === p.id)?.quantity || 0;
    const remaining = p.stock - currentQty;
    return p.name.toLowerCase().includes(searchTerm.toLowerCase()) && remaining > 0;
  });

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discount;

  // Generate bill content for printing
  const generateBillContent = (order) => {
    const itemsHtml = order.items.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>${item.name} (${item.quantity}x)</span>
        <span>$${ (item.price * item.quantity).toFixed(2) }</span>
      </div>
    `).join('');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; line-height: 1.4;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 24px;">Market CRM Receipt</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Order ID: #${order.id}</p>
        </div>
        <div style="margin-bottom: 10px;">
          <p><strong>Customer:</strong> ${order.customer}</p>
          <p><strong>Date:</strong> ${order.date}</p>
        </div>
        <div style="margin-bottom: 15px;">
          <h3 style="margin: 10px 0 5px 0; font-size: 16px;">Items:</h3>
          ${itemsHtml}
        </div>
        <div style="margin-bottom: 10px; text-align: right;">
          <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
          <p><strong>Discount:</strong> -$${order.discount.toFixed(2)}</p>
          <hr style="margin: 5px 0;">
          <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        </div>
        <div style="text-align: center; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px; font-size: 12px;">
          <p>Thank you for your purchase!</p>
          <p>Market CRM - Supermarket Management</p>
        </div>
      </div>
    `;
  };

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

    setIsProcessing(true);

    // Update inventory
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      if (cartItem) return { ...p, stock: p.stock - cartItem.quantity };
      return p;
    });

    setState(prev => ({ ...prev, products: updatedProducts }));

    // Save order in global state
    const newOrder = {
      id: Date.now(),
      customer: selectedCustomer.name,
      items: [...cart], // Copy cart before reset
      subtotal,
      discount,
      total,
      date: new Date().toLocaleString()
    };
    setState(prev => ({
      ...prev,
      orders: [...(prev.orders || []), newOrder]
    }));

    // Show success modal with order
    setCompletedOrder(newOrder);
    setShowSuccessModal(true);

    // Reset form
    setCart([]);
    setDiscount(0);
    setSelectedCustomer(null);
    setIsProcessing(false);
  };

  // Print bill from completed order
  const printCompletedBill = () => {
    if (!completedOrder) return;
    const billContent = generateBillContent(completedOrder);
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = billContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  // Print current cart bill (manual before completion)
  const printBill = () => {
    if (cart.length === 0) {
      alert("Cart is empty. Nothing to print.");
      return;
    }
    const tempOrder = {
      id: Date.now(),
      customer: selectedCustomer?.name || 'Guest',
      items: [...cart],
      subtotal,
      discount,
      total,
      date: new Date().toLocaleString()
    };
    const billContent = generateBillContent(tempOrder);
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = billContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Billing & POS</h1>
            <p className="text-slate-600 mt-1">Process sales efficiently with real-time inventory tracking.</p>
          </div>

          {/* Customer Selection */}
          <div className="mb-6">
            <div className="relative">
              <button
                onClick={() => setShowCustomerSelect(!showCustomerSelect)}
                disabled={isProcessing}
                className="flex items-center gap-2 w-full max-w-sm px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaUser className="w-4 h-4 text-slate-400" />
                {selectedCustomer ? selectedCustomer.name : "Select Customer"}
              </button>
              {showCustomerSelect && !isProcessing && (
                <div className="absolute z-10 mt-1 w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 max-h-60 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Search customers..."
                    className="w-full px-4 py-2 border-b border-slate-200 rounded-t-xl focus:outline-none"
                    onChange={(e) => { /* Add customer search if needed */ }}
                  />
                  {customers.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setShowCustomerSelect(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors"
                    >
                      {c.name} {c.email ? `(${c.email})` : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Section */}
            <div className="lg:col-span-2">
              {/* Product Search */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm disabled:opacity-50"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FaShoppingCart className="w-5 h-5" />
                  Available Products
                </h3>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <FaShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No products available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map(product => {
                      const currentQty = cart.find(item => item.id === product.id)?.quantity || 0;
                      const remaining = product.stock - currentQty;
                      return (
                        <div
                          key={product.id}
                          className="border border-slate-200 p-4 rounded-xl hover:shadow-md transition-all bg-slate-50"
                        >
                          <h4 className="font-medium text-slate-900 mb-1">{product.name}</h4>
                          <p className="text-emerald-600 font-semibold mb-2">${product.price.toFixed(2)}</p>
                          <p className="text-sm text-slate-600 mb-3">Available: {remaining}</p>
                          <div className="flex gap-2 items-center">
                            <select
                              className="border border-slate-300 px-2 py-1 rounded text-sm flex-1"
                              defaultValue={1}
                              id={`qty-${product.id}`}
                              disabled={isProcessing}
                            >
                              {[...Array(Math.min(10, remaining)).keys()].map(n => (
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
                              disabled={isProcessing}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaPlus className="w-3 h-3 inline mr-1" />
                              Add
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Cart Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit sticky top-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FaShoppingCart className="w-5 h-5" />
                  Shopping Cart
                </h3>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <FaShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                          <p className="text-slate-600 text-xs">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={isProcessing}
                            className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center hover:bg-slate-300 transition-colors disabled:opacity-50"
                          >
                            <FaMinus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={isProcessing}
                            className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center hover:bg-slate-300 transition-colors disabled:opacity-50"
                          >
                            <FaPlus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            disabled={isProcessing}
                            className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-slate-200 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Discount:</span>
                        <span className="text-red-600">-${discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-emerald-600 pt-2">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Discount Input */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <FaCalculator className="w-4 h-4" />
                  Discount
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  value={discount}
                  onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  placeholder="Enter discount amount"
                  disabled={isProcessing}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={completeSale}
                  disabled={!selectedCustomer || cart.length === 0 || isProcessing}
                  className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed font-medium"
                >
                  <FaCheckCircle className="w-5 h-5" />
                  {isProcessing ? "Processing..." : "Complete Sale"}
                </button>
                <button
                  onClick={printBill}
                  disabled={cart.length === 0 || isProcessing}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed font-medium"
                >
                  <FaPrint className="w-5 h-5" />
                  Print Bill
                </button>
              </div>
            </div>
          </div>

          {/* Success Modal */}
          <Modal 
            show={showSuccessModal} 
            onClose={() => {
              setShowSuccessModal(false);
              setCompletedOrder(null);
            }} 
            title="Order Completed Successfully!"
          >
            <div className="space-y-4">
              <p className="text-slate-700">Your sale has been processed and inventory updated.</p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="font-medium text-slate-900">Order ID: #{completedOrder?.id}</p>
                <p className="text-emerald-600 font-semibold">Total: ${completedOrder?.total?.toFixed(2)}</p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    printCompletedBill();
                    setShowSuccessModal(false);
                    setCompletedOrder(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <FaPrint className="w-4 h-4" />
                  Print Bill
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setCompletedOrder(null);
                  }}
                  className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
}