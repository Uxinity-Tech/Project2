import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import { FaUser, FaSearch, FaChevronDown, FaShoppingCart, FaPlus, FaMinus, FaTrash, FaCalculator, FaPrint, FaCheckCircle, FaTicketAlt, FaExclamationTriangle } from "react-icons/fa";
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
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const currentQty = cart.find(item => item.id === productId)?.quantity || 0;
    const newQty = Math.max(1, currentQty + change);

    if (change > 0 && newQty > product.stock) {
      alert(`Only ${product.stock} available for ${product.name}.`);
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQty }
        : item
    ));
  };

  // Remove from cart
  const removeFromCart = productId => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Filter products based on search (include all products, even with zero stock)
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discount;

  // Generate bill content for printing
  const generateBillContent = (order) => {
    const itemsHtml = order.items.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>${item.name} (${item.quantity}x)</span>
        <span>${Number(item.price * item.quantity).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
      </div>
    `).join('');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; line-height: 1.4;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 24px;">Market CRM Receipt</h2>
          <span style="display: inline-block; margin: 10px 0; padding: 4px 8px; font-size: 14px; font-weight: 600; background-color: #DBEAFE; color: #1E40AF; border-radius: 9999px;">
            Order #${order.id}
          </span>
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
          <p><strong>Subtotal:</strong> ${Number(order.subtotal).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
          <p><strong>Discount:</strong> -${Number(order.discount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
          <hr style="margin: 5px 0;">
          <p><strong>Total:</strong> ${Number(order.total).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
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

    // Generate sequential order ID
    const maxId = state.orders && state.orders.length > 0
      ? Math.max(...state.orders.map(o => Number(o.id)))
      : 0;
    const newId = maxId + 1;

    // Save order in global state
    const newOrder = {
      id: newId,
      customer: selectedCustomer?.name || 'Guest',
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
    const printWindow = window.open('', '_blank', 'width=600,height=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @media print {
              body { margin: 0; font-size: 12pt; }
            }
          </style>
        </head>
        <body onload="window.print();window.close();">${billContent}</body>
      </html>
    `);
    printWindow.document.close();
  };

  // Print current cart bill (manual before completion)
  const printBill = () => {
    if (cart.length === 0) {
      alert("Cart is empty. Nothing to print.");
      return;
    }
    const tempOrder = {
      id: Date.now(), // Temporary ID for manual print
      customer: selectedCustomer?.name || 'Guest',
      items: [...cart],
      subtotal,
      discount,
      total,
      date: new Date().toLocaleString()
    };
    const billContent = generateBillContent(tempOrder);
    const printWindow = window.open('', '_blank', 'width=600,height=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @media print {
              body { margin: 0; font-size: 12pt; }
            }
          </style>
        </head>
        <body onload="window.print();window.close();">${billContent}</body>
      </html>
    `);
    printWindow.document.close();
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setCompletedOrder(null);
    // Ensure search term is cleared
    setSearchTerm("");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/20">
                  <FaTicketAlt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Billing & POS
                  </h1>
                  <p className="text-slate-600 mt-1">Process sales efficiently with real-time inventory tracking.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Selection */}
          <div className="mb-6">
            <div className="relative">
              <button
                onClick={() => setShowCustomerSelect(!showCustomerSelect)}
                disabled={isProcessing}
                className="group flex items-center gap-3 w-full max-w-sm px-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/80 backdrop-blur-sm hover:bg-slate-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaUser className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                <span className="flex-1 text-left truncate">
                  {selectedCustomer ? selectedCustomer.name : "Select Customer (Optional)"}
                </span>
                <FaChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showCustomerSelect ? 'rotate-180' : ''}`} />
              </button>
              {showCustomerSelect && !isProcessing && (
                <div className="absolute z-10 mt-1 w-full max-w-sm bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200/50 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                  <div className="p-2 border-b border-slate-200/50">
                    <input
                      type="text"
                      placeholder="Search customers..."
                      className="w-full px-3 py-2 border border-slate-300/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                      onChange={(e) => { /* Add customer search if needed */ }}
                    />
                  </div>
                  <div className="py-1">
                    {customers.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCustomer(c);
                          setShowCustomerSelect(false);
                        }}
                        className="group flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-slate-50/50 transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{c.name}</p>
                          {c.email && <p className="text-xs text-slate-500 truncate">{c.email}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
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
                    className="w-full pl-10 pr-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/80 backdrop-blur-sm placeholder-slate-400 transition-all duration-200 disabled:opacity-50"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6 mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <FaShoppingCart className="w-5 h-5 text-blue-500" />
                  Available Products
                </h3>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                    <FaShoppingCart className="w-16 h-16 mx-auto mb-4 text-slate-300 animate-bounce" />
                    <p className="text-lg font-medium">No products available.</p>
                    <p className="text-sm mt-1">Add products to start billing!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map(product => {
                      const currentQty = cart.find(item => item.id === product.id)?.quantity || 0;
                      const remaining = product.stock - currentQty;
                      const isOutOfStock = remaining <= 0;
                      const lowStock = remaining > 0 && remaining < 5;
                      const restockMessage = product.restockDate
                        ? `Restock expected: ${new Date(product.restockDate).toLocaleDateString()}`
                        : "Restock date TBD";
                      return (
                        <div
                          key={product.id}
                          className={`group border border-slate-200/50 p-4 rounded-xl hover:shadow-md transition-all duration-300 bg-white/50 backdrop-blur-sm relative overflow-hidden ${
                            isOutOfStock ? 'opacity-60 bg-red-50/50 border-red-300' : lowStock ? 'border-orange-300 bg-orange-50/50' : ''
                          }`}
                        >
                          {isOutOfStock && (
                            <div className="absolute top-2 right-2">
                              <FaExclamationTriangle className="w-4 h-4 text-red-500" />
                            </div>
                          )}
                          {lowStock && !isOutOfStock && (
                            <div className="absolute top-2 right-2">
                              <FaExclamationTriangle className="w-4 h-4 text-orange-500" />
                            </div>
                          )}
                          <h4 className="font-semibold text-slate-900 mb-2 truncate">{product.name}</h4>
                          <p className="text-emerald-600 font-bold text-lg mb-3">{Number(product.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                          <p className="text-sm text-slate-600 mb-4">
                            Available: <span className={`font-medium ${isOutOfStock ? 'text-red-600' : lowStock ? 'text-orange-600' : 'text-slate-900'}`}>{remaining}</span>
                          </p>
                          {isOutOfStock && (
                            <p className="text-sm text-red-600 mb-4 font-medium">{restockMessage}</p>
                          )}
                          <div className="flex gap-2 items-center">
                            <select
                              className={`border border-slate-300/50 px-3 py-2 rounded-xl text-sm flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                                isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              defaultValue={1}
                              id={`qty-${product.id}`}
                              disabled={isOutOfStock || isProcessing}
                            >
                              {[...Array(Math.min(10, remaining > 0 ? remaining : 1)).keys()].map(n => (
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
                              disabled={isOutOfStock || isProcessing}
                              className={`group flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0`}
                            >
                              <FaPlus className="w-3 h-3 group-hover:scale-110 transition-transform" />
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
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6 h-fit sticky top-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <FaShoppingCart className="w-5 h-5 text-indigo-500" />
                  Shopping Cart
                </h3>
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                    <FaShoppingCart className="w-16 h-16 mx-auto mb-4 text-slate-300 animate-pulse" />
                    <p className="text-lg font-medium">Cart is empty</p>
                    <p className="text-sm mt-1">Add products to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="group flex items-center justify-between py-3 border-b border-slate-200/50 last:border-b-0 hover:bg-slate-50/50 transition-all duration-200 rounded-lg p-3">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                          <p className="text-slate-600 text-xs">{Number(item.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={isProcessing}
                            className="group relative p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaMinus className="w-3 h-3" />
                            <div className="absolute inset-0 bg-slate-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-slate-900 bg-slate-100 rounded px-2 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={isProcessing}
                            className="group relative p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaPlus className="w-3 h-3" />
                            <div className="absolute inset-0 bg-slate-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            disabled={isProcessing}
                            className="group relative p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaTrash className="w-4 h-4" />
                            <div className="absolute inset-0 bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-emerald-600 ml-4 whitespace-nowrap">{Number(item.price * item.quantity).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-slate-200/50 space-y-3">
                      <div className="flex justify-between text-sm font-medium text-slate-700">
                        <span>Subtotal:</span>
                        <span>{Number(subtotal).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                      </div>
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Discount:</span>
                        <span>-{Number(discount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent pt-2">
                        <span>Total:</span>
                        <span>{Number(total).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Discount Input */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-4 mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <FaCalculator className="w-4 h-4 text-blue-500" />
                  Discount
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 disabled:opacity-50"
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
                  onClick={printBill}
                  disabled={cart.length === 0 || isProcessing}
                  className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPrint className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Print Bill
                </button>
                <button
                  onClick={completeSale}
                  disabled={cart.length === 0 || isProcessing}
                  className="group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaCheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isProcessing ? "Processing..." : "Complete Sale"}
                </button>
              </div>
            </div>
          </div>

          {/* Success Modal */}
          <Modal 
            show={showSuccessModal} 
            onClose={handleSuccessClose} 
            title="Order Completed Successfully"
            orderId={completedOrder?.id}
          >
            <div className="space-y-6">
              <div className="text-center py-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <FaCheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500 animate-bounce" />
                <p className="text-slate-700 font-medium">Your sale has been processed and inventory updated.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 mb-1">Customer:</p>
                    <p className="font-medium text-slate-900">{completedOrder?.customer}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Subtotal:</p>
                    <p className="font-semibold text-slate-900">{Number(completedOrder?.subtotal || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Discount:</p>
                    <p className="text-red-600 font-semibold">-{Number(completedOrder?.discount || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-600 mb-1">Total:</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      {Number(completedOrder?.total || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/50">
                <button
                  onClick={() => {
                    printCompletedBill();
                    handleSuccessClose();
                  }}
                  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FaPrint className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Print Bill
                </button>
                <button
                  onClick={handleSuccessClose}
                  className="px-6 py-3 text-slate-700 border border-slate-300/50 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
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