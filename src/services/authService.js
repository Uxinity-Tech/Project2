export const loginUser = (email, password) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "admin" && password === "123") {
        resolve({ name: "Admin", email });
      } else {
        reject("Invalid credentials");
      }
    }, 500);
  });
