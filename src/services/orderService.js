let orders = [
  { id: 1, customer: "John Doe", total: "$25", status: "Pending" },
  { id: 2, customer: "Jane Smith", total: "$40", status: "Completed" },
];

export const getOrders = () =>
  new Promise((resolve) => setTimeout(() => resolve(orders), 500));

export const addOrder = (order) =>
  new Promise((resolve) => {
    const newOrder = { ...order, id: Date.now() };
    orders.push(newOrder);
    setTimeout(() => resolve(newOrder), 500);
  });

export const updateOrder = (id, updated) =>
  new Promise((resolve) => {
    orders = orders.map((o) => (o.id === id ? { ...o, ...updated } : o));
    setTimeout(() => resolve(updated), 500);
  });

export const deleteOrder = (id) =>
  new Promise((resolve) => {
    orders = orders.filter((o) => o.id !== id);
    setTimeout(() => resolve(id), 500);
  });
