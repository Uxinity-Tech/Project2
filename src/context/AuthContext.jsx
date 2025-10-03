import React, { createContext, useState, useEffect } from "react";

// Create AuthContext
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);

  // Global CRM state
  const [state, setState] = useState({
    customers: [],
    products: [],
    orders: [],
    inventory: [],
  });

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Login function
  const login = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Add customer
  const addCustomer = (customer) => {
    setState((prev) => ({ ...prev, customers: [...prev.customers, customer] }));
  };

  // Add product
  const addProduct = (product) => {
    setState((prev) => ({ ...prev, products: [...prev.products, product] }));
  };

  // Add order
  const addOrder = (order) => {
    setState((prev) => ({ ...prev, orders: [...prev.orders, order] }));
  };

  // Update inventory
  const updateInventory = (inventoryItem) => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.map((item) =>
        item.id === inventoryItem.id ? inventoryItem : item
      ),
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        state,
        setState,
        addCustomer,
        addProduct,
        addOrder,
        updateInventory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
