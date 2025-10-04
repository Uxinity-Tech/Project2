export const loginUser = (email, password) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "admin@123" && password === "123") {
        resolve({ name: "Admin", email });
      } else {
        reject("Invalid credentials");
      }
    }, 500);
  });
