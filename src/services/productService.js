let products = [
  { id: 1, name: "Milk", price: 2.5, stock: 50 },
  { id: 2, name: "Bread", price: 1.2, stock: 80 },
];

export const getProducts = () =>
  new Promise((resolve) => setTimeout(() => resolve(products), 500));

export const addProduct = (product) =>
  new Promise((resolve) => {
    const newProduct = { ...product, id: Date.now() };
    products.push(newProduct);
    setTimeout(() => resolve(newProduct), 500);
  });

export const updateProduct = (id, updated) =>
  new Promise((resolve) => {
    products = products.map((p) => (p.id === id ? { ...p, ...updated } : p));
    setTimeout(() => resolve(updated), 500);
  });

export const deleteProduct = (id) =>
  new Promise((resolve) => {
    products = products.filter((p) => p.id !== id);
    setTimeout(() => resolve(id), 500);
  });
