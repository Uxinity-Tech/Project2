let customers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321" },
];

export const getCustomers = () =>
  new Promise((resolve) => setTimeout(() => resolve(customers), 500));

export const addCustomer = (customer) =>
  new Promise((resolve) => {
    const newCustomer = { ...customer, id: Date.now() };
    customers.push(newCustomer);
    setTimeout(() => resolve(newCustomer), 500);
  });

export const updateCustomer = (id, updated) =>
  new Promise((resolve) => {
    customers = customers.map((c) => (c.id === id ? { ...c, ...updated } : c));
    setTimeout(() => resolve(updated), 500);
  });

export const deleteCustomer = (id) =>
  new Promise((resolve) => {
    customers = customers.filter((c) => c.id !== id);
    setTimeout(() => resolve(id), 500);
  });
